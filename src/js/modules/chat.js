import { makeDraggable } from './drag.js'; // You'll create this file next


const serverAddress = 'wss://courselab.lnu.se/message-app/socket';

const apiKey = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd';
let userName = ''
let webSocket




export function initChat() {
    if (userName === '') {
        NameSubmissionWindow('NameSubmissionWindow');
    } else {
        createChatWindow('Chat');
    }
}


export function NameSubmissionWindow (title) {

    const windowElement = document.createElement('div');
    windowElement.classList.add('window');
    windowElement.id = 'user_info';

    const titleBar = document.createElement('div');
    titleBar.classList.add('title-bar');
    titleBar.textContent = title;

    const closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.textContent = 'X';
    closeButton.addEventListener('click', () => {
        windowElement.remove();
    });

    titleBar.appendChild(closeButton);
    windowElement.appendChild(titleBar);

    const userBox = document.createElement('div');
    userBox.id = 'user_info';
    userBox.classList.add('user_box');
    
    const userForm = document.createElement('form');
    const userLabel = document.createElement('label');
    userLabel.htmlFor = 'user_name'; 
    userLabel.textContent = 'Enter a nickname: ';
    const userInput = document.createElement('input');
    userInput.type = 'text';
    userInput.id = 'user_name';
    userInput.name = 'user_name';
    const userButton = document.createElement('button');
    userButton.type = 'submit';
    userButton.id = 'submit_name';
    userButton.classList.add('button');
    userButton.textContent = 'Submit!';
    userForm.appendChild(userLabel);
    userForm.appendChild(userInput);
    userForm.appendChild(userButton);
    userBox.appendChild(userForm);

    windowElement.appendChild(userBox);

    document.querySelector('main').appendChild(windowElement);
    makeDraggable(windowElement);

    document.querySelector('#submit_name').addEventListener('click', () => {
        userName = document.querySelector('#user_name').value;

        if (userName === '') {
            alert('Please enter a valid name!');
            return;
        } else {
            document.querySelector('#user_info').remove();
            createChatWindow('Chat');
        }
    })

    document.querySelector('#user_name').focus();

}






export function createChatWindow(title) {
    // <!-- <div class="chat_container">
    // <div class="chat_header">
    //     <h1>WebChat</h1>
    // </div>

    // <div class="chat_body">
    //     <p class="message">Hello</p>
    //     <p class="message user_message">Hi</p>
    // </div>

    // <div class="chat_footer">
    //     <form action="">
    //         <input id="chat_input" type="text" name="">
    //         <button id="send_message_button">SEND</button>
    //     </form>
    // </div>
    // </div> -->
    console.log('The name is ' + userName)

    const windowElement = document.createElement('div');
    windowElement.classList.add('window');

    const titleBar = document.createElement('div');
    titleBar.classList.add('title-bar');
    titleBar.textContent = title;

    const closeButton = document.createElement('span');
    closeButton.classList.add('close');
    closeButton.textContent = 'X';
    closeButton.addEventListener('click', () => {
        windowElement.remove();
    });

    titleBar.appendChild(closeButton);
    windowElement.appendChild(titleBar);

    const chatContainer = document.createElement('div');
    chatContainer.id = 'chat_box';
    chatContainer.classList.add('chat_container');

    const chatHeader = document.createElement('div');
    chatHeader.classList.add('chat_header');
    const chatHeaderTitle = document.createElement('h1');
    chatHeaderTitle.textContent = 'WebChat';
    chatHeader.appendChild(chatHeaderTitle);

    const chatBody = document.createElement('div');
    chatBody.classList.add('chat_body');

    const chatFooter = document.createElement('div');
    chatFooter.classList.add('chat_footer');
    const chatForm = document.createElement('form');
    const chatInput = document.createElement('input');
    chatInput.type = 'text';
    chatInput.name = '';
    chatInput.id = 'chat_input';
    const chatButton = document.createElement('button');
    chatButton.textContent = 'SEND';
    chatButton.id = 'send_message_button';
    chatForm.appendChild(chatInput);
    chatForm.appendChild(chatButton);
    chatFooter.appendChild(chatForm);

    chatContainer.appendChild(chatHeader);
    chatContainer.appendChild(chatBody);
    chatContainer.appendChild(chatFooter);

    windowElement.appendChild(chatContainer);

    document.querySelector('main').appendChild(windowElement);
    makeDraggable(windowElement);
    startChat();
}

function startChat() {
    webSocket = new WebSocket(serverAddress);
    webSocket.onopen = function() {
        console.log('WebSocket connection established');
    };

    webSocket.onerror = function(error) {
        console.error('WebSocket error:', error);
    };

    webSocket.onclose = function(event) {
        console.log('WebSocket connection closed:', event);
    };

    document.querySelector('#send_message_button').addEventListener('click', () => {
        console.log('Send message button clicked')
        const message = document.querySelector('#chat_input').value;
        sendMessage(message);
    });

    document.querySelector('#chat_input').addEventListener('keypress', (event) => {
        if (event.key === 'Enter') {
            const message = document.querySelector('#chat_input').value;
            sendMessage(message);
        }
    });

    webSocket.onmessage = function(event) {
        const data = JSON.parse(event.data);
        const { type, data: messageData, username } = data;

        if (type === 'message') {
            // Process the received message
            console.log(`Received message from ${username}: ${messageData}`);

            const chatMessage = document.createElement('p');
            chatMessage.classList.add('message');
            chatMessage.textContent = messageData;
            document.querySelector('.chat_body').appendChild(chatMessage);

        } else if (type === 'heartbeat') {
            // Process the heartbeat message
            console.log('Heartbeat signal received');

            const heartbeatMessage = document.createElement('p');
            heartbeatMessage.classList.add('message');
            heartbeatMessage.textContent = 'Heartbeat signal received';
            document.querySelector('.chat_body').appendChild(heartbeatMessage);
        }
    };




}



// Send a message to the server
function sendMessage(message) {
    const data = {
        type: 'message',
        data: message,
        username: userName,
        channel: 'my, not so secret, channel',
        key: apiKey
    };
    webSocket.send(JSON.stringify(data));
    console.log(`Sent message: ${message}`)
}


