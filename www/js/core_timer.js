const totalSeconds = 1 * 60; // 15 minutes
    let timeLeft = totalSeconds;
    let timerId = null;
    var end_game_is = false;

    //const display = document.getElementById('display');
    //const startBtn = document.getElementById('startBtn');
    //const stopBtn = document.getElementById('stopBtn');
    //const resetBtn = document.getElementById('resetBtn');

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function updateDisplay() {
      //display.textContent = formatTime(timeLeft);
    }

    function endGame() {
      // Put your game over logic here
      console.log("Time's up! Game over.");
      alert("end game");
      end_game_is = 1;
    }

    function startTimer() {
      if (timerId !== null) return; // Prevent creating multiple overlapping intervals
      timerId = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
          updateDisplay();
        } else {
          clearInterval(timerId);
          timerId = null;
          endGame(); // Triggered when time runs out
        }
      }, 1000);
    }

    function stopTimer() {
      clearInterval(timerId);
      timerId = null;
    }

    function resetTimer() {
      stopTimer();
      timeLeft = totalSeconds;
      updateDisplay();
    }

    startBtn.addEventListener('click', startTimer);
    stopBtn.addEventListener('click', stopTimer);
    resetBtn.addEventListener('click', resetTimer);

    // Run initial display state
    //updateDisplay();