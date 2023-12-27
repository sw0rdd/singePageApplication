/**
 * module to handle the timer for each question
 */

let countDownTime
const timerDisplay = document.getElementById('time')

/**
 * starts the timer and updates the timerDisplay in the Dom
 * @param {number} duration time available for each question
 * @param {Function} onTimeout callback function when time is over
 */
export function startTimer (duration, onTimeout) {
  let timeLeft = duration

  timerDisplay.textContent = timeLeft

  countDownTime = setInterval(() => {
    timeLeft--
    timerDisplay.textContent = timeLeft + ' seconds'

    if (timeLeft <= 0) {
      clearInterval(countDownTime)
      onTimeout()
    }
  }, 1000)
}

/**
 * stops the timer
 */
export function stopTimer () {
  clearInterval(countDownTime)
  timerDisplay.textContent = ''
}
