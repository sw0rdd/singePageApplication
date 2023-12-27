'use strict'

import * as Fetch from './modules/Fetch.js'
import { User } from './modules/user.js'
import * as Timer from './modules/timer.js'
import * as WebStorage from './modules/webstorage.js'

// get dom elements

// user form
const submitNameButton = document.getElementById('submit_name')
const userNameField = document.getElementById('user_name')
const userInfoBox = document.getElementById('user_info')

const startQuizButton = document.getElementById('start_button')

// quiz container contains the question box and answer box
const quizContainer = document.getElementById('quiz')
const questionBox = document.getElementById('question_box')
const answerInput = document.getElementById('answer_input')
const answerField = document.getElementById('answer')
const alternativesInput = document.getElementById('alternatives_input')
const submitAnswerButton = document.getElementById('submit')
const feedbackBox = document.getElementById('feedback')

// restart options is a section that has two buttons
const restartOptions = document.getElementById('restart_options')
const restartButton = document.getElementById('restart_button')
const showHighscoreButton = document.getElementById('highscore_button')

// highscore container has a score list
const highscoresContainer = document.getElementById('highscores_container')
const highScoreList = document.getElementById('highscore_list')

// two different boxes, one is shown in case of victory or loss
const victoryBox = document.getElementById('victory_box')
const lossBox = document.getElementById('loss_box')

// the event listerns
startQuizButton.addEventListener('click', startQuiz)

document.addEventListener('keydown', function (event) {
  if (event.key === 'Enter' && !startQuizButton.classList.contains('hidden')) {
    startQuiz()
  }
})

submitAnswerButton.addEventListener('click', submitAnswer)

// make submitting answers input by pressing Enter
answerField.addEventListener('keydown', function (event) {
  if (event.key === 'Enter' && answerField.value.trim() !== '') {
    event.preventDefault()
    submitAnswer(event)
  }
})

submitNameButton.addEventListener('click', function (event) {
  getUserName(event)
})

showHighscoreButton.addEventListener('click', showHighScores)
restartButton.addEventListener('click', restartQuiz)

// global variabels
let getURL = 'https://courselab.lnu.se/quiz/question/1'
let postURL = ''
let currentUser

// this is to focus the cursor in the answer field of first question
userNameField.focus()

/**
 * this is a callback function that is called when startQuizButton is pressed
 * it sets the enviroment for the quiz and shows the first question
 * it also Start user quiz timer
 * @see {@link startQuizButton}
 * @see {@link showQuestion}
 * @see {@link User#startUserQuizTimer}
 */
async function startQuiz () {
  // show the restart button and show score button
  restartOptions.classList.remove('hidden')

  startQuizButton.classList.add('hidden')
  quizContainer.classList.remove('hidden')
  currentUser.startUserQuizTimer()

  try {
    const response = await Fetch.get(getURL)
    showQuestion(response)
  } catch (error) {
    console.error(`Couldn't start quiz: ${error}`)
  }
}

/**
 * handles the submission of user name
 * this function is triggered when use submits their name
 * @param {Event} event - event object associated with user name submission
 */
function getUserName (event) {
  event.preventDefault()

  const nickName = userNameField.value
  if (nickName) {
    currentUser = new User(nickName)
    userInfoBox.classList.add('hidden')
    startQuizButton.classList.remove('hidden')
  }
}

/**
 * Display the current quiz question and answer inputs if it the question has these
 * Clear prev question content
 * it either displays radio buttons or a text input
 * init count down timer for the quesiton
 * @param {object} questionData containing details of quiz question, response from get request
 * @see {@link Timer#startTimer}
 */
function showQuestion (questionData) {
  // clear question
  questionBox.innerHTML = ''
  alternativesInput.innerHTML = ''
  answerField.value = ''

  const newPara = document.createElement('p')
  newPara.textContent = questionData.question
  questionBox.appendChild(newPara)

  answerField.focus()

  //  handling answer alternatives
  if (questionData.alternatives) {
    alternativesInput.innerHTML = ''
    for (const [key, value] of Object.entries(questionData.alternatives)) {
      const container = document.createElement('div')
      container.classList.add('radio_container')

      const radioInput = document.createElement('input')
      radioInput.type = 'radio'
      radioInput.id = key
      radioInput.name = 'user_answer'
      radioInput.value = key

      radioInput.addEventListener('keydown', function (event) {
        if (event.key === 'Enter') {
          submitAnswer(event)
        }
      })

      const label = document.createElement('label')
      label.htmlFor = key
      label.textContent = value

      container.appendChild(radioInput)
      container.appendChild(label)
      alternativesInput.appendChild(container)
      alternativesInput.classList.remove('hidden')
      answerInput.classList.add('hidden')
    }
  } else {
    answerInput.classList.remove('hidden')
    alternativesInput.classList.add('hidden')
  }

  submitAnswerButton.classList.remove('hidden')

  // get nextURL
  postURL = questionData.nextURL

  // start timer
  Timer.startTimer(10, () => endQuiz(false, true))
}

/**
 * stops the question timer
 * fetch post the user answer either from text input or radio button
 * shows next question if current one was answered correctly
 * calls endQuiz if user answers wrong, time is out or quiz finished
 * @param {Event} event event object associated with answer submission
 * @see {@link Fetch#post}
 * @see {@link endQuiz}
 * @see {@link showQuestion}
 */
async function submitAnswer (event) {
  event.preventDefault()

  // stopping the timer
  Timer.stopTimer()

  let userAnswer

  const radioButtons = document.querySelectorAll('#alternatives_input input[type="radio"]')

  if (radioButtons.length > 0) {
    const userSelectedRadio = Array.from(radioButtons).find(radio => radio.checked)
    if (userSelectedRadio) {
      userAnswer = userSelectedRadio.value
    } else {
      userAnswer = null
    }
  } else {
    userAnswer = answerField.value
  }

  if (userAnswer) {
    const answerBody = {
      answer: userAnswer
    }

    try {
      const response = await Fetch.post(postURL, answerBody)

      // check if feedpack paragraph exists for first question,
      // update feedback paragraph
      let feedBackPara = feedbackBox.querySelector('p')

      if (feedBackPara) {
        feedBackPara.textContent = response.message
      } else {
        feedBackPara = document.createElement('p')
        feedBackPara.textContent = response.message
        feedbackBox.appendChild(feedBackPara)
      }

      feedbackBox.classList.remove('hidden')

      // bad request (wrong answer 400)
      if (!response.ok) {
        setTimeout(() => endQuiz(false, false), 1000)
        // last question
      } else if (!response.nextURL) {
        setTimeout(() => endQuiz(true, false), 1000)

        // correct answer, not last q
      } else {
        setTimeout(async () => {
          feedbackBox.classList.add('hidden')
          getURL = response.nextURL
          const nextQuestion = await Fetch.get(getURL)
          showQuestion(nextQuestion)
          answerField.focus()
        }, 1500)
      }
    } catch (error) {
      console.error(`Error submitting: ${error}`)
    }
  } else {
    alert('please select or enter an answer!')
  }
}

/**
 * in case of winning: save score to web local storage and show victory message and show high score list
 * in case of losing: show loss message and high score list
 * @param {boolean} hasWon - indicates if user won the quiz or failed
 * @param {boolean} isTimerOver - indicates if user lost because of time
 * @see {@link WebStorage#saveScores}
 * @see {@link showHighScores}
 */
function endQuiz (hasWon, isTimerOver) {
  quizContainer.classList.add('hidden')
  restartOptions.classList.remove('hidden')

  if (hasWon && !isTimerOver) {
    const totalTime = currentUser.endUserQuizTimer()
    const date = new Date().toLocaleString()
    const userScore = {
      nickName: currentUser.getNickName(),
      score: totalTime,
      date
    }

    WebStorage.saveScores(userScore)

    victoryBox.querySelector('h1').textContent = `YOU WON! OUTSTANDING WORK ${currentUser.getNickName()}!`
    victoryBox.querySelector('h2').textContent = `You finised in ${totalTime} seconds!`
    victoryBox.classList.remove('hidden')

    showHighScores()
  } else if (!isTimerOver) {
    lossBox.querySelector('h1').textContent = `SORRY! WRONG ANSWER | GAME OVER ${currentUser.getNickName()}!`
    lossBox.classList.remove('hidden')
    showHighScores()
  } else {
    lossBox.querySelector('h1').textContent = `SORRY! TIME IS UP! | TRY AGAIN ${currentUser.getNickName()}!`
    lossBox.classList.remove('hidden')
    showHighScores()
  }
}

/**
 * restart the quiz
 * hides elements that are hidding during the test
 * clear content of feedbackBox, questionBox and answerField
 * reset getURL and postURL
 * calls startQuiz
 */
function restartQuiz () {
  Timer.stopTimer()

  getURL = 'https://courselab.lnu.se/quiz/question/1'
  postURL = ''

  feedbackBox.textContent = ''
  questionBox.innerHTML = ''
  answerField.value = ''

  alternativesInput.classList.add('hidden')
  lossBox.classList.add('hidden')
  victoryBox.classList.add('hidden')
  highscoresContainer.classList.add('hidden')
  feedbackBox.classList.add('hidden')

  answerInput.classList.remove('hidden')
  quizContainer.classList.remove('hidden')

  startQuiz()
}

/**
 * loads high scores from web local storage
 */
function showHighScores () {
  Timer.stopTimer()
  quizContainer.classList.add('hidden')
  highscoresContainer.classList.remove('hidden')
  highScoreList.innerHTML = ''

  const highScores = WebStorage.loadScores()
  const highScoreIndicator = document.querySelector('#highscores_container h1')
  if (highScores.length === 0) {
    highScoreIndicator.textContent = 'No scores yet!'
  } else {
    highScoreIndicator.textContent = 'Top Five Scores'
    let counter = 1
    highScores.forEach(score => {
      const liItem = document.createElement('li')
      liItem.textContent = `${counter}. ${score.nickName}:
                        [${score.score.toFixed(2)}s] | ${score.date}`
      highScoreList.appendChild(liItem)
      counter++
    })
  }
}
