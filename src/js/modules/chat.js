import * as windowManager from './window.js'
import * as webStorage from './webstorage.js'

const serverAddress = 'wss://courselab.lnu.se/message-app/socket'
const apiKey = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd'

let userName = ''
let webSocket
let messagesArray = []

// used to not show name window if no name is registered
let submissionWindowShown = false

/**
 * initialize the websocket connection
 * handle incoming messages and add them to the chat window
 * ignore heartbeat messages
 */
function initWebSocket () {
  if (!webSocket) {
    webSocket = new WebSocket(serverAddress)
    webSocket.onopen = function () {
      console.log('WebSocket connection established')
    }

    webSocket.onerror = function (error) {
      console.error('WebSocket error:', error)
    }

    webSocket.onclose = function (event) {
      console.log('WebSocket connection closed:', event)
    }

    webSocket.onmessage = function (event) {
      const data = JSON.parse(event.data)
      const { type, data: messageData, username } = data

      if (type === 'message' && username !== userName) {
        messagesArray.push({ username, messageData })
        webStorage.saveMessages(messagesArray)

        document.querySelectorAll('.chat_body').forEach((chatBody) => {
          const messageBox = document.createElement('div')
          messageBox.classList.add('message_box')

          const chatMessage = document.createElement('div')
          chatMessage.classList.add('message')
          chatMessage.textContent = messageData

          const receiverNameElement = document.createElement('span')
          receiverNameElement.classList.add('server_name')
          receiverNameElement.textContent = data.username

          const receiverNameContainter = document.createElement('div')
          receiverNameContainter.classList.add('name_container')
          receiverNameContainter.appendChild(receiverNameElement)

          messageBox.appendChild(receiverNameContainter.cloneNode(true))
          messageBox.appendChild(chatMessage)

          chatBody.appendChild(messageBox.cloneNode(true))
          chatBody.scrollTop = chatBody.scrollHeight
        })
      }
    }
  }
}

/**
 * initialize the chat window
 * if the user has not entered a name, show the name submission window
 * otherwise, show the chat window
 * @see NameSubmissionWindow
 * @see createChatWindow
 */
export function initChat () {
  userName = webStorage.loadUserName()
  if (userName === '') {
    NameSubmissionWindow('Name Submission')
  } else {
    createChatWindow('Chat')
  }
}

/**
 * create the name submission window
 * user enters a name and submits it
 * the name is saved in the userName variable
 * if the user has already entered a name, show an alert
 * @see createChatWindow
 * @param {string} title the title of the window
 */
function NameSubmissionWindow (title) {
  if (submissionWindowShown) {
    alert('You already have a submission window open!')
    return
  }

  const windowElement = document.createElement('div')
  windowElement.classList.add('window')
  windowElement.id = 'user_info'

  const titleBar = windowManager.makeTitleBar(title, 'img/chat.png')

  const closeButton = document.createElement('button')
  closeButton.classList.add('close_button')
  closeButton.innerHTML = '<img src="img/close2.png" alt="close icon">'

  closeButton.addEventListener('click', () => {
    windowElement.remove()
    submissionWindowShown = false
  })

  titleBar.appendChild(closeButton)
  windowElement.appendChild(titleBar)

  const userBox = document.createElement('div')
  userBox.id = 'user_info'
  userBox.classList.add('user_box')

  const userForm = document.createElement('form')
  const userLabel = document.createElement('label')
  userLabel.htmlFor = 'user_name'
  userLabel.textContent = 'Enter a nickname: '
  const userInput = document.createElement('input')
  userInput.type = 'text'
  userInput.id = 'user_name'
  userInput.name = 'user_name'
  const userButton = document.createElement('button')
  userButton.type = 'submit'
  userButton.id = 'submit_name'
  userButton.classList.add('button')
  userButton.textContent = 'Submit!'
  userForm.appendChild(userLabel)
  userForm.appendChild(userInput)
  userForm.appendChild(userButton)
  userBox.appendChild(userForm)

  windowElement.appendChild(userBox)

  document.querySelector('main').appendChild(windowElement)
  windowManager.makeDraggable(windowElement)

  document.querySelector('#submit_name').addEventListener('click', () => {
    userName = document.querySelector('#user_name').value

    if (userName === '') {
      alert('Please enter a valid name!')
    } else {
      webStorage.saveUserName(userName)
      document.querySelector('#user_info').remove()
      createChatWindow('Chat')
    }
  })

  document.querySelector('#user_name').focus()
  submissionWindowShown = true
  windowManager.positionWindow(windowElement)
}

/**
 * create the chat window
 * handle user input and send messages to the server
 * calls initWebSocket to initialize the websocket connection
 * @see initWebSocket
 * @param {string} title the title of the window
 */
function createChatWindow (title) {
  const windowElement = document.createElement('div')
  windowElement.classList.add('window')
  windowElement.classList.add('chat_window')

  const titleBar = windowManager.makeTitleBar(title, 'img/chat.png')

  const closeButton = document.createElement('button')
  closeButton.classList.add('close_button')
  closeButton.innerHTML = '<img src="img/close2.png" alt="close icon">'

  closeButton.addEventListener('click', () => {
    windowElement.remove()
  })

  titleBar.appendChild(closeButton)
  windowElement.appendChild(titleBar)

  const chatContainer = document.createElement('div')
  chatContainer.classList.add('chat_container')

  const chatHeader = document.createElement('div')
  chatHeader.classList.add('chat_header')

  const changeNameButton = document.createElement('button')
  changeNameButton.classList.add('change_name_button')
  changeNameButton.textContent = 'Change name'
  changeNameButton.addEventListener('click', handleChangeName)

  const clearChatButton = document.createElement('button')
  clearChatButton.classList.add('clear_chat_button')
  clearChatButton.textContent = 'Clear chat'
  clearChatButton.addEventListener('click', () => {
    webStorage.saveMessages([])
    document.querySelectorAll('.chat_body').forEach((chatBody) => {
      chatBody.innerHTML = ''
    })
  })

  chatHeader.appendChild(changeNameButton)
  chatHeader.appendChild(clearChatButton)

  const chatBody = document.createElement('div')
  chatBody.classList.add('chat_body')

  messagesArray = webStorage.loadMessages()
  loadMessages(chatBody)

  const chatFooter = document.createElement('div')
  chatFooter.classList.add('chat_footer')

  const chatForm = document.createElement('form')
  const chatInput = document.createElement('input')
  chatInput.type = 'text'
  chatInput.name = ''
  chatInput.classList.add('chat_input')

  const chatButton = document.createElement('button')
  chatButton.textContent = 'SEND'
  chatButton.classList.add('send_message_button')

  chatForm.appendChild(chatInput)
  chatForm.appendChild(chatButton)
  chatFooter.appendChild(chatForm)

  chatContainer.appendChild(chatHeader)
  chatContainer.appendChild(chatBody)
  chatContainer.appendChild(chatFooter)

  windowElement.appendChild(chatContainer)

  document.querySelector('main').appendChild(windowElement)

  windowElement.querySelector('.chat_input').focus()

  windowManager.makeDraggable(windowElement)
  windowManager.positionWindow(windowElement)

  initWebSocket()

  const sendButton = windowElement.querySelector('.send_message_button')
  sendButton.addEventListener('click', (event) => {
    event.preventDefault()
    const message = event.target.closest('.chat_window').querySelector('.chat_input').value
    sendMessage(message)

    const messageBox = document.createElement('div')
    messageBox.classList.add('message_box')
    messageBox.classList.add('user_message_box')

    const userMessage = document.createElement('div')
    userMessage.classList.add('message')
    userMessage.classList.add('user_message')
    userMessage.textContent = message

    const userNameElement = document.createElement('span')
    userNameElement.classList.add('user_name')
    userNameElement.textContent = userName

    const senderNameContainter = document.createElement('div')
    senderNameContainter.classList.add('name_container')
    senderNameContainter.appendChild(userNameElement)

    messageBox.appendChild(userMessage)
    messageBox.appendChild(senderNameContainter.cloneNode(true))

    event.target.closest('.chat_window').querySelector('.chat_input').value = ''

    document.querySelectorAll('.chat_body').forEach((chatBody) => {
      chatBody.appendChild(messageBox.cloneNode(true))
    })
  })

  chatBody.scrollTop = chatBody.scrollHeight
}

/**
 * load messages from storage and add them to the chat window
 * @param {HTMLElement} chatBody the chat body element
 */
function loadMessages (chatBody) {
  messagesArray.forEach(message => {
    const messageBox = document.createElement('div')
    messageBox.classList.add('message_box')

    const messageContent = document.createElement('div')
    messageContent.classList.add('message')
    messageContent.textContent = message.messageData

    const nameElement = document.createElement('span')
    const nameContainer = document.createElement('div')
    nameContainer.classList.add('name_container')

    if (message.username === userName) {
      messageBox.classList.add('user_message_box')
      messageContent.classList.add('user_message')
      nameElement.classList.add('user_name')

      messageBox.appendChild(messageContent)
      messageBox.appendChild(nameContainer)
    } else {
      nameElement.classList.add('server_name')
      messageBox.appendChild(nameContainer)
      messageBox.appendChild(messageContent)
    }

    nameElement.textContent = message.username
    nameContainer.appendChild(nameElement)

    chatBody.appendChild(messageBox)
  })
}

/**
 * handle the change name button
 * create and show a form for the user to change their name
 * @param {event} event click event
 */
function handleChangeName (event) {
  event.preventDefault()

  const parentChatWindow = event.target.closest('.chat_window')
  const clearChatButton = parentChatWindow.querySelector('.clear_chat_button')
  clearChatButton.style.display = 'none'

  const changeNameButton = event.target
  changeNameButton.style.display = 'none'

  // Create input for new name
  const userInput = document.createElement('input')
  userInput.type = 'text'
  userInput.id = 'new_user_name'
  userInput.placeholder = 'New name'

  // Create button for submitting new name
  const userButton = document.createElement('button')
  userButton.textContent = 'Submit'

  userButton.addEventListener('click', () => {
    const newName = userInput.value

    if (newName === '') {
      alert('Please enter a valid name!')
    } else {
      updateUserName(newName)
      userInput.remove()
      userButton.remove()
      changeNameButton.style.display = 'block'
    }
  })

  // Handle enter key
  userInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const newName = userInput.value

      if (newName === '') {
        alert('Please enter a valid name!')
      } else {
        updateUserName(newName)
        userInput.remove()
        userButton.remove()
        changeNameButton.style.display = 'block'
        clearChatButton.style.display = 'block'
      }
    }
  })

  // Append input and button to the chat header
  const chatHeader = this.closest('.chat_header')
  chatHeader.appendChild(userInput)
  chatHeader.appendChild(userButton)

  userInput.focus()
}

/**
 * update the username in all chat windows
 * update the username in the messages array and save it to storage
 * @see webStorage
 * @param {string} newName the new username
 */
function updateUserName (newName) {
  const oldName = userName
  userName = newName
  webStorage.saveUserName(userName)

  // update the username in the messages array and save it again to storage
  messagesArray = messagesArray.map(message => {
    if (message.username === oldName) {
      return { ...message, username: newName }
    }
    return message
  })

  document.querySelectorAll('.user_name').forEach((nameElement) => {
    nameElement.textContent = newName
  })

  webStorage.saveMessages(messagesArray)
}

/**
 * send a message to the server
 * push the message to the messages array and save it to storage
 * @see webStorage
 * @param {string} message the message to send
 */
function sendMessage (message) {
  const data = {
    type: 'message',
    data: message,
    username: userName,
    channel: 'my, not so secret, channel',
    key: apiKey
  }
  messagesArray.push({ username: userName, messageData: message })
  webStorage.saveMessages(messagesArray)
  webSocket.send(JSON.stringify(data))

  // scroll to the bottom of the chat window
  setTimeout(() => {
    document.querySelectorAll('.chat_body').forEach((chatBody) => {
      chatBody.scrollTop = chatBody.scrollHeight
    })
  }, 0)
}
