    const totalSeconds = 15 * 60; // 15 minutes
    let timeLeft = totalSeconds;
    let timerId = null;
    var end_game_is = false;

    function formatTime(seconds) {
      const mins = Math.floor(seconds / 60);
      const secs = seconds % 60;
      return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function endGame() {
      alert("end game");
      end_game_is = 1;
    }

    function startTimer() {
      if (timerId !== null) return;
      timerId = setInterval(() => {
        if (timeLeft > 0) {
          timeLeft--;
        } else {
          clearInterval(timerId);
          timerId = null;
          endGame();
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
    }