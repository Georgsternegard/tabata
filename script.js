document.addEventListener('DOMContentLoaded', () => {
    const timerDisplay = document.getElementById('timer');
    const statusDisplay = document.getElementById('status');
    const setsDisplay = document.getElementById('sets');
    const startStopButton = document.getElementById('startStop');
    const resetButton = document.getElementById('reset');
    const container = document.querySelector('.container');

    let workTime = 20;
    let restTime = 10;
    let sets = 8;
    let currentSet = 1;
    let timeLeft = workTime;
    let isWork = true;
    let isRunning = false;
    let timerInterval;

    function updateDisplay() {
        timerDisplay.textContent = timeLeft;
        setsDisplay.textContent = `Set: ${currentSet} / ${sets}`;
        statusDisplay.textContent = isWork ? 'Work' : 'Rest';

        if (isRunning) {
            if (isWork) {
                container.classList.remove('rest');
                container.classList.add('work');
            } else {
                container.classList.remove('work');
                container.classList.add('rest');
            }
        } else {
            container.classList.remove('work');
            container.classList.remove('rest');
        }
    }

    startStopButton.addEventListener('click', () => {
        if (isRunning) {
            pauseTimer();
        } else {
            startTimer();
        }
    });

    resetButton.addEventListener('click', () => {
        resetTimer();
    });

    updateDisplay();

    const audioContext = new (window.AudioContext || window.webkitAudioContext)();

    function beep(duration, frequency, volume) {
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();

        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);

        oscillator.frequency.value = frequency;
        gainNode.gain.value = volume;

        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + duration / 1000);
    }

    function playCountdownSound() {
        if (timeLeft === 0) {
            beep(500, 880, 0.1); // Long beep (500ms, 880Hz, volume 0.1)
        } else {
            beep(200, 440, 0.1); // Short beep (200ms, 440Hz, volume 0.1)
        }
    }

    const newRoundSound = new Audio('https://interactive-examples.mdn.mozilla.net/media/cc0-audio/door-knock.mp3');

    function playNewRoundSound() {
        newRoundSound.play();
    }

    function startTimer() {
        if (!isRunning) {
            isRunning = true;
            startStopButton.textContent = 'Pause';
            updateDisplay();

            timerInterval = setInterval(() => {
                timeLeft--;

                if (timeLeft <= 3 && timeLeft >= 0) {
                    try {
                        playCountdownSound();
                    } catch (e) {
                        console.error("Error playing countdown sound:", e);
                    }
                }

                if (timeLeft < 0) {
                    if (isWork) {
                        isWork = false;
                        timeLeft = restTime;
                    } else {
                        isWork = true;
                        timeLeft = workTime;
                        playNewRoundSound();
                        currentSet++;
                        if (currentSet > sets) {
                            clearInterval(timerInterval);
                            isRunning = false;
                            startStopButton.textContent = 'Start';
                            timerDisplay.textContent = 'Done!';
                            statusDisplay.textContent = '';
                            return;
                        }
                    }
                    updateDisplay();
                } else {
                    updateDisplay();
                }
            }, 1000);
        }
    }

    function pauseTimer() {
        if (isRunning) {
            isRunning = false;
            startStopButton.textContent = 'Resume';
            clearInterval(timerInterval);
        }
    }

    function resetTimer() {
        clearInterval(timerInterval);
        isRunning = false;
        startStopButton.textContent = 'Start';
        currentSet = 1;
        timeLeft = workTime;
        isWork = true;
        updateDisplay();
    }
});
