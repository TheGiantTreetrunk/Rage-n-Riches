class ChiptuneAudioEngine {
    constructor() {
        this.audioCtx = null;
        this.sounds = {};
        this.currentTrackKey = null;
        this.isLooping = false;
        this.isPlaying = false;
        this.masterVolume = 0.7;
        this.stepTimer = null;
        this.currentStep = 0;
        this.nextNoteTime = 0;
        this.activeOscillators = [];

        this.freqs = {
            C2: 65.41,  D2: 73.42,  Eb2: 77.78, E2: 82.41,  F2: 87.31,  Fs2: 92.50, G2: 98.00,  A2: 110.00, Bb2: 116.54, B2: 123.47,
            C3: 130.81, Db3: 138.59, D3: 146.83, Eb3: 155.56, E3: 164.81, F3: 174.61, Fs3: 185.00, G3: 196.00, A3: 220.00, Bb3: 233.08, B3: 246.94,
            C4: 261.63, Db4: 277.18, D4: 293.66, Eb4: 311.13, E4: 329.63, F4: 349.23, Fs4: 369.99, G4: 392.00, A4: 440.00, Bb4: 466.16, B4: 493.88,
            C5: 523.25, Db5: 554.37, D5: 587.33, Eb5: 622.25, E5: 659.25, F5: 698.46, Fs5: 739.99, G5: 783.99, A5: 880.00, Bb5: 932.33, B5: 987.77, C6: 1046.50
        };
    }

    init() {
        if (!this.audioCtx) {
            this.audioCtx = new (window.AudioContext || window.webkitAudioContext)();
        }
        if (this.audioCtx.state === 'suspended') {
            this.audioCtx.resume();
        }
    }

    registerSounds(soundObject) {
        this.sounds = Object.assign(this.sounds, soundObject);
    }

    setVolume(val) {
        this.masterVolume = Math.max(0, Math.min(1, val));
    }

    playNoteStep(noteName, waveType, startTime, duration, baseVolume) {
        if (!noteName || noteName === "0" || noteName === 0 || !this.freqs[noteName]) return;

        const osc = this.audioCtx.createOscillator();
        const gain = this.audioCtx.createGain();
        const calculatedVol = baseVolume * this.masterVolume;

        osc.type = waveType;
        osc.frequency.setValueAtTime(this.freqs[noteName], startTime);

        gain.gain.setValueAtTime(calculatedVol, startTime);
        gain.gain.exponentialRampToValueAtTime(0.001, startTime + duration - 0.02);

        osc.connect(gain);
        gain.connect(this.audioCtx.destination);

        osc.start(startTime);
        osc.stop(startTime + duration);

        this.activeOscillators.push(osc);
        osc.onended = () => {
            const idx = this.activeOscillators.indexOf(osc);
            if (idx !== -1) this.activeOscillators.splice(idx, 1);
        };
    }

    scheduler() {
        while (this.nextNoteTime < this.audioCtx.currentTime + 0.1) {
            const track = this.sounds[this.currentTrackKey];
            if (!track) return;

            const beatDuration = 60 / track.tempo;
            const maxSteps = Math.max(
                track.voice1.notes.length,
                track.voice2.notes.length,
                track.voice3.notes.length
            );

            if (this.currentStep >= maxSteps) {
                if (this.isLooping) {
                    this.currentStep = 0;
                } else {
                    this.stop();
                    return;
                }
            }

            this.playNoteStep(track.voice1.notes[this.currentStep], track.voice1.wave, this.nextNoteTime, beatDuration, 0.25);
            this.playNoteStep(track.voice2.notes[this.currentStep], track.voice2.wave, this.nextNoteTime, beatDuration, 0.12);
            this.playNoteStep(track.voice3.notes[this.currentStep], track.voice3.wave, this.nextNoteTime, beatDuration, 0.20);

            this.nextNoteTime += beatDuration;
            this.currentStep++;
        }

        this.stepTimer = setTimeout(() => this.scheduler(), 25);
    }

    play(trackKey, loop = false) {
        this.init();

        if (!this.sounds[trackKey]) {
            console.warn(`[ChiptuneEngine] Sound track "${trackKey}" not found.`);
            return;
        }

        this.stop();

        this.currentTrackKey = trackKey;
        this.isLooping = loop;
        this.isPlaying = true;
        this.currentStep = 0;
        this.nextNoteTime = this.audioCtx.currentTime + 0.05;

        this.scheduler();
    }

    loop(trackKey) {
        this.play(trackKey, true);
    }

    stop() {
        if (this.stepTimer) {
            clearTimeout(this.stepTimer);
            this.stepTimer = null;
        }

        this.activeOscillators.forEach(osc => {
            try { osc.stop(); osc.disconnect(); } catch (e) {}
        });
        this.activeOscillators = [];

        this.isPlaying = false;
        this.currentStep = 0;
    }
}

const audioEngine = new ChiptuneAudioEngine();

audioEngine.registerSounds({
    dungeonTheme: {
        tempo: 75,
        voice1: { wave: "square", notes: ["C4", 0, "D4", 0, "Eb4", 0, "D4", 0, "C4", 0, "G3", 0, "C4", 0, 0, 0] },
        voice2: { wave: "sine", notes: ["G4", 0, "Fs4", 0, "F4", 0, "E4", 0, "Eb4", 0, "D4", 0, "Db4", 0, "C4", 0] },
        voice3: { wave: "sawtooth", notes: ["C2", "C2", "C2", "C2", "C2", "C2", "C2", "C2", "C2", "C2", "C2", "C2", "C2", "C2", "C2", "C2"] }
    },
    treasureRoom: {
        tempo: 130,
        voice1: { wave: "square", notes: ["C5", "E5", "G5", "B5", "C6", "B5", "G5", "E5"] },
        voice2: { wave: "sine", notes: ["E4", "G4", "B4", "D5", "E5", "D5", "B4", "G4"] },
        voice3: { wave: "triangle", notes: ["C3", 0, "G3", 0, "C3", 0, "G3", 0] }
    },
    bossEncounter: {
        tempo: 160,
        voice1: { wave: "square", notes: ["C4", "C4", "Eb4", "C4", "F4", "C4", "Fs4", "G4"] },
        voice2: { wave: "sawtooth", notes: ["C5", 0, "Eb5", 0, "F5", 0, "Fs5", "G5"] },
        voice3: { wave: "sawtooth", notes: ["C2", "C2", "C2", "C2", "C2", "C2", "C2", "C2"] }
    },
    dungeonExplorer: {
        tempo: 110,
        voice1: { wave: "triangle", notes: ["A3", 0, "C4", "D4", "E4", 0, "G4", "E4", "A4", 0, "G4", "E4", "D4", 0, "C4", 0] },
        voice2: { wave: "sine", notes: [0, "E5", 0, 0, 0, "G5", 0, 0, 0, "A5", 0, 0, "E5", 0, 0, 0] },
        voice3: { wave: "triangle", notes: ["A2", "A2", "C3", "A2", "D3", "A2", "E3", "D3", "A2", "A2", "G2", "A2", "D3", "D3", "C3", "G2"] }
    },
    wackyDungeon: {
        tempo: 145,
        voice1: { wave: "square", notes: ["C4", "Eb4", "Fs4", "G4", "C5", 0, "Fs4", "G4", "Eb4", "C4", "A4", "Ab4", "G4", "Fs4", "F4", "E4"] },
        voice2: { wave: "sine", notes: ["C6", 0, "Fs5", 0, "C6", "Eb6", 0, "Fs5", 0, "C6", 0, "Fs5", "C6", 0, "B5", 0] },
        voice3: { wave: "sawtooth", notes: ["C3", 0, "C3", "C3", "Eb3", 0, "C3", 0, "Fs3", 0, "F3", 0, "E3", "E3", "Eb3", "D3"] }
    },
    dramaticDungeon: {
        tempo: 145,
        voice1: { wave: "sawtooth", notes: ["C4", "C4", "Eb4", "C4", "Fs4", "G4", "C5", 0, "B4", "Ab4", "G4", "Fs4", "G4", "Eb4", "D4", "B3"] },
        voice2: { wave: "square", notes: ["C5", 0, "C5", 0, "Eb5", 0, "Fs5", "G5", "Ab5", 0, "G5", 0, "Fs5", 0, "D5", 0] },
        voice3: { wave: "sawtooth", notes: ["C2", "C2", "C3", "C2", "C2", "C2", "Eb3", "D3", "C2", "C2", "C3", "C2", "Ab2", "G2", "Fs2", "F2"] }
    },
    regularBattle: {
        tempo: 160,
        voice1: { wave: "square", notes: ["E4", "G4", "B4", "E5", "D5", "B4", "G4", "E4", "F4", "A4", "C5", "F5", "E5", "C5", "A4", "F4"] },
        voice2: { wave: "sawtooth", notes: ["E5", 0, "E5", "G5", 0, "B5", 0, "G5", "F5", 0, "F5", "A5", 0, "C6", 0, "A5"] },
        voice3: { wave: "sawtooth", notes: ["E2", "E2", "E3", "E2", "E2", "E2", "G2", "B2", "F2", "F2", "F3", "F2", "F2", "F2", "A2", "C3"] }
    },
    redOctober: {
        tempo: 80,
        voice1: { wave: "square", notes: ["D4", "D4", "A4", "A4", "F4", "G4", "A4", 0, "D4", "D4", "Bb4", "A4", "G4", "E4", "F4", "D4"] },
        voice2: { wave: "sawtooth", notes: ["D3", "F3", "A3", "F3", "D3", "E3", "F3", 0, "D3", "F3", "G3", "F3", "E3", "C3", "D3", "A2"] },
        voice3: { wave: "sawtooth", notes: ["D2", "D2", "D2", "D2", "D2", "C2", "F2", "A2", "Bb2", "Bb2", "G2", "D2", "A2", "A2", "D2", "D2"] }
    },
    ussrAnthem: {
        tempo: 88,
        voice1: { wave: "square", notes: ["G4", "C5", 0, "G5", "E5", 0, "A5", "G5", "F5", "G5", "C5", 0, "C5", "D5", "D5", "E5"] },
        voice2: { wave: "triangle", notes: ["E4", "E4", "G4", "C5", "C5", "C5", "F5", "E5", "D5", "E5", "G4", "G4", "A4", "B4", "B4", "C5"] },
        voice3: { wave: "sawtooth", notes: ["C2", "C3", "C2", "E3", "A2", "A2", "F2", "C3", "D2", "E2", "E2", "C3", "F2", "F2", "G2", "G2"] }
    },
    sacredWar: {
        tempo: 105,
        voice1: { wave: "sawtooth", notes: ["A4", "A4", "C5", "A4", "E4", "F4", "A4", "G4", "F4", "E4", 0, "A4", "D5", "D5", "F5", "D5"] },
        voice2: { wave: "square", notes: ["E4", "E4", "A4", "E4", "C4", "D4", "F4", "E4", "D4", "C4", 0, "E4", "F4", "F4", "A4", "F4"] },
        voice3: { wave: "sawtooth", notes: ["A2", "A2", "A2", "A2", "A2", "D3", "D3", "E3", "E3", "A2", "A2", "A2", "D2", "D2", "D2", "D2"] }
    },
    auferstanden: {
        tempo: 92,
        voice1: { wave: "square", notes: ["D4", "F4", "A4", "A4", "B4", "A4", "G4", "F4", "E4", "F4", "G4", "A4", "F4", "D4", "E4", 0] },
        voice2: { wave: "sine", notes: ["A3", "D4", "F4", "F4", "G4", "F4", "E4", "D4", "C4", "D4", "E4", "F4", "D4", "A3", "C4", 0] },
        voice3: { wave: "triangle", notes: ["D2", "D2", "D3", "F2", "G2", "D2", "A2", "D2", "A2", "A2", "A2", "D2", "D2", "F2", "A2", "D2"] }
    },
    challengeVictory: {
        tempo: 150,
        voice1: { wave: "square", notes: ["C4", "E4", "G4", "C5", 0, "G4", "C5", "E5", "G5", 0, "E5", "G5", "C6", 0, "C6", 0] },
        voice2: { wave: "square", notes: ["G3", "C4", "E4", "G4", 0, "E4", "G4", "C5", "E5", 0, "C5", "E5", "G5", 0, "G5", 0] },
        voice3: { wave: "sawtooth", notes: ["C3", 0, "C3", 0, "C3", "C3", 0, "C3", "C3", 0, "C3", 0, "C3", "C3", "C3", 0] }
    },
    youDied: {
        tempo: 60,
        voice1: { wave: "sawtooth", notes: ["Eb4", "D4", "Db4", "C4", 0, "B3", 0, 0, "C4", 0, 0, 0, 0, 0, 0, 0] },
        voice2: { wave: "square", notes: ["C4", "B3", "Bb3", "A3", 0, "Ab3", 0, 0, "G3", 0, 0, 0, 0, 0, 0, 0] },
        voice3: { wave: "sawtooth", notes: ["C2", 0, "C2", 0, "C2", 0, "G1", 0, "C2", 0, 0, 0, 0, 0, 0, 0] }
    },
    morningSunrise: {
        tempo: 90,
        voice1: {
            wave: "sine",
            notes: [
                "E5", "Fs5", "Gs5", "B5", "Cs6", "B5", "Gs5", "Fs5", "E5", "Fs5", "Gs5", "Fs5",
                "E5", "Fs5", "Gs5", "B5", "Cs6", "B5", "Gs5", "Fs5", "E5", "Fs5", "E5", 0,
                "E5", "Gs5", "B5", "E6", "Eb6", "Cs6", "B5", "Gs5", "E5", "Fs5", "Gs5", "Fs5",
                "E5", "Fs5", "Gs5", "B5", "Cs6", "B5", "Gs5", "Fs5", "E5", 0, "E5", 0
            ]
        },
        voice2: {
            wave: "triangle",
            notes: [
                "E4", 0, "Gs4", 0, "B4", 0, "Gs4", 0, "E4", 0, "Gs4", 0,
                "E4", 0, "Gs4", 0, "B4", 0, "Gs4", 0, "E4", 0, "Gs4", 0,
                "E4", 0, "A4", 0, "Cs5", 0, "A4", 0, "E4", 0, "A4", 0,
                "E4", 0, "Gs4", 0, "B4", 0, "Gs4", 0, "E4", 0, "E4", 0,
                "E4", 0, "Gs4", 0, "B4", 0, "Gs4", 0, "E4", 0, "Gs4", 0,
                "E4", 0, "Gs4", 0, "B4", 0, "Gs4", 0, "E4", 0, "Gs4", 0,
                "E4", 0, "A4", 0, "Cs5", 0, "A4", 0, "E4", 0, "A4", 0,
                "E4", 0, "Gs4", 0, "B4", 0, "Gs4", 0, "E4", 0, "E4", 0
            ]
        },
        voice3: {
            wave: "sine",
            notes: [
                "E2", 0, 0, 0, "E2", 0, 0, 0, "E2", 0, 0, 0,
                "E2", 0, 0, 0, "E2", 0, 0, 0, "E2", 0, 0, 0,
                "A2", 0, 0, 0, "A2", 0, 0, 0, "A2", 0, 0, 0,
                "E2", 0, 0, 0, "E2", 0, 0, 0, "E2", 0, 0, 0,
                "E2", 0, 0, 0, "E2", 0, 0, 0, "E2", 0, 0, 0,
                "E2", 0, 0, 0, "E2", 0, 0, 0, "E2", 0, 0, 0,
                "A2", 0, 0, 0, "A2", 0, 0, 0, "A2", 0, 0, 0,
                "E2", 0, 0, 0, "E2", 0, 0, 0, "E2", 0, 0, 0
            ]
        }
    }
});