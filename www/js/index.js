// Wait for Cordova to finish loading native components
document.addEventListener('deviceready', onDeviceReady, false);

// Global instances for our dungeon and ad managers
let dungeonManager;
let adManager;

function onDeviceReady() {
    console.log('Cordova is ready!');

    // Initialize AdMob ads safely first[cite: 1]
    adManager = new AdManager();
    adManager.initAdMob();

    // Initialize your game/app logic here[cite: 1]
    initApp();
}

function initApp() {
    console.log('Initializing dungeon run...');
    
    // Instantiate our 15-minute dungeon manager
    dungeonManager = new DungeonRunManager(adManager);
    
    // Hook up a test start button or auto-start for testing
    // document.getElementById('start-btn').addEventListener('click', () => {
    //     dungeonManager.startRun();
    // });
}

// ==========================================
// AD MOB MANAGER (Rewarded Ads & Interstitials)
// ==========================================
class AdManager {
    constructor() {
        this.rewardedAdReady = false;
    }

    initAdMob() {
        if (window.admob) {
            // Initialize AdMob engine[cite: 1]
            admob.start();

            // Prepare a banner ad at the bottom[cite: 1]
            const banner = new admob.BannerAd({
                adUnitId: 'ca-app-pub-3940256099942544/6300978111', // Test ID
            });
            banner.show();

            // Load a rewarded ad for the revive mechanic
            this.loadRewardedAd();
        }
    }

    loadRewardedAd() {
        if (window.admob && admob.rewardvideo) {
            admob.rewardvideo.prepare({
                adId: 'ca-app-pub-3940256099942544/5224354917', // Test Rewarded ID
                autoShow: false
            }).then(() => {
                this.rewardedAdReady = true;
            }).catch(e => console.log('Rewarded ad failed to load', e));
        }
    }

    showRewardedAd(onSuccess, onFailure) {
        if (this.rewardedAdReady && window.admob && admob.rewardvideo) {
            admob.rewardvideo.show().then(() => {
                this.rewardedAdReady = false;
                this.loadRewardedAd(); // Preload next one
                onSuccess();
            }).catch(err => {
                console.log('User skipped or ad failed', err);
                onFailure();
            });
        } else {
            console.log('Rewarded ad not ready. Bypassing or failing.');
            onFailure(); // Fallback if ad network is offline
        }
    }
}

// ==========================================
// 15-MINUTE DUNGEON & TIMER MANAGER
// ==========================================
class DungeonRunManager {
    constructor(adManager) {
        this.adManager = adManager;
        this.totalTimeLimit = 15 * 60; // 15 minutes in seconds
        this.timeRemaining = this.totalTimeLimit;
        this.timerInterval = null;
        this.isPaused = false;
        this.reviveCount = 0;
    }

    startRun() {
        this.timeRemaining = this.totalTimeLimit;
        this.reviveCount = 0;
        this.isPaused = false;
        this.runTimer();
        
        // [PAUSE ZONE] Start your HTML5 game loop / rendering engine here
        // e.g., startGameLoop();
    }

    runTimer() {
        if (this.timerInterval) clearInterval(this.timerInterval);

        this.timerInterval = setInterval(() => {
            if (!this.isPaused) {
                this.timeRemaining--;

                // Update UI clock elements if you have them
                this.updateClockUI();

                // Check if 15-minute timer has expired (trigger Super Boss)
                if (this.timeRemaining <= 0) {
                    this.triggerSuperBossEvent();
                }
            }
        }, 1000);
    }

    updateClockUI() {
        const minutes = Math.floor(this.timeRemaining / 60);
        const seconds = this.timeRemaining % 60;
        const formatted = `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
        
        // If you have a timer element in your DOM:
        const timerElement = document.getElementById('dungeon-timer');
        if (timerElement) {
            timerElement.innerText = formatted;
        }
    }

    handlePlayerDeath() {
        // Pause the timer immediately upon death
        this.isPaused = true;

        // [PAUSE ZONE] Stop physics, enemy AI, and input handlers here
        // e.g., cancelAnimationFrame(gameAnimId);

        const timeElapsed = this.totalTimeLimit - this.timeRemaining;

        // Condition: Only offer revive if they survived at least 3 minutes 
        // and haven't abused more than 2 revives this run.
        if (timeElapsed >= 180 && this.reviveCount < 2) {
            this.offerTimedRevive();
        } else {
            this.triggerGameOver(false);
        }
    }

    offerTimedRevive() {
        console.log("Offering ad-revive to player...");

        this.adManager.showRewardedAd(
            // SUCCESS: Watched the ad
            () => {
                this.reviveCount++;
                
                // Give back 30 seconds of buffer time as a secret reward
                this.timeRemaining += 30; 
                this.isPaused = false;

                // [PAUSE ZONE] Resume your game loop and entity updates here
                // e.g., requestAnimationFrame(gameLoop);
                
                console.log("Player revived successfully! Timer extended.");
            },
            // FAILURE / SKIPPED: Ad didn't play or user closed it
            () => {
                this.triggerGameOver(false);
            }
        );
    }

    triggerSuperBossEvent() {
        console.log("15-minute timer expired! Super Boss Spawned.");
        // Lock out regular mobs, spawn the 15-minute apex boss
    }

    triggerGameOver(victory) {
        clearInterval(this.timerInterval);
        this.isPaused = true;

        if (victory) {
            console.log("Victory! Super Boss defeated.");
        } else {
            console.log("Defeat. Returning to hub.");
            // Optional: Show an interstitial ad here when returning to menu
        }
    }
}