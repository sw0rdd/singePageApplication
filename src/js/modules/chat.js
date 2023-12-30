import * as window from './window.js';


const serverAddress = 'wss://courselab.lnu.se/message-app/socket';

const apiKey = 'eDBE76deU7L0H9mEBgxUKVR0VCnq0XBd';
let userName = ''
let webSocket


function initWebSocket() {
    if (!webSocket) {
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

        webSocket.onmessage = function(event) {
            const data = JSON.parse(event.data);
            const { type, data: messageData, username } = data;
        
            if (type === 'message') {
                // Process the received message
                console.log(`Received message from ${username}: ${messageData}`);
        

        
                document.querySelectorAll('.chat_body').forEach((chatBody) => {

                    const messageBox = document.createElement('div');
                    messageBox.classList.add('message_box');


                    const chatMessage = document.createElement('span');
                    chatMessage.classList.add('message');
                    chatMessage.textContent = messageData;

                    const userNameElement = document.createElement('span');
                    userNameElement.classList.add('server_name');
                    userNameElement.textContent = 'Server';

                    messageBox.appendChild(userNameElement);
                    messageBox.appendChild(chatMessage);


                    chatBody.appendChild(messageBox.cloneNode(true));
                })
        
        
            } else if (type === 'heartbeat') {
                // Ignore heartbeat messages
                return;
            }
        };
    }
}



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

    const titleBar = window.makeTitleBar(title, windowElement);
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
    window.makeDraggable(windowElement);

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
    console.log('The name is ' + userName)

    const windowElement = document.createElement('div');
    windowElement.classList.add('window');
    windowElement.classList.add('chat_window');

    const titleBar = window.makeTitleBar(title, windowElement);


        windowElement.appendChild(titleBar);

        const chatContainer = document.createElement('div');
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
        chatInput.classList.add('chat_input');
        const chatButton = document.createElement('button');
        chatButton.textContent = 'SEND';
        chatButton.classList.add('send_message_button');
        chatForm.appendChild(chatInput);
        chatForm.appendChild(chatButton);
        chatFooter.appendChild(chatForm);

        chatContainer.appendChild(chatHeader);
        chatContainer.appendChild(chatBody);
        chatContainer.appendChild(chatFooter);

        windowElement.appendChild(chatContainer);

        document.querySelector('main').appendChild(windowElement);
        window.makeDraggable(windowElement);
        
        initWebSocket();

        const newChatButton = windowElement.querySelector('.send_message_button')
        newChatButton.addEventListener('click', (event) => {
            event.preventDefault();
            const message = event.target.closest('.chat_window').querySelector('.chat_input').value;
            sendMessage(message);

            const messageBox = document.createElement('div');
            messageBox.classList.add('message_box');
            messageBox.classList.add('user_message_box');

    
            const userMessage = document.createElement('span');
            userMessage.classList.add('message');
            userMessage.classList.add('user_message');
            userMessage.textContent = message;

            const userNameElement = document.createElement('span');
            userNameElement.classList.add('user_name');
            userNameElement.textContent = userName;

            messageBox.appendChild(userMessage);
            messageBox.appendChild(userNameElement);

            // clear message input
            event.target.closest('.chat_window').querySelector('.chat_input').value = '';


            event.target.closest('.chat_window').querySelector('.chat_body').appendChild(messageBox);
        })
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
}


