'use strict'


import { makeDraggable } from './modules/drag.js'; // You'll create this file next

document.querySelector('.start_memory').addEventListener('click', () => createWindow('Memory Game'));
document.querySelector('.start_chat').addEventListener('click', () => createWindow('Chat'));
document.querySelector('.start_quiz').addEventListener('click', () => createWindow('Quiz'));

function createWindow(title) {
    const windowElement = document.createElement('div');
    windowElement.classList.add('window');

    windowElement.innerHTML = `
        <div class="title-bar">
            ${title}
            <span class="close">X</span>
        </div>
        <div class="content">
            // Content of the application goes here
        </div>
    `;

    document.querySelector('main').appendChild(windowElement);
    makeDraggable(windowElement);

    windowElement.querySelector('.close').addEventListener('click', () => {
        windowElement.remove();
    });
    
}

console.log("Hello from main.js!")