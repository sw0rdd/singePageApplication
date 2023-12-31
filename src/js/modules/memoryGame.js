'use strict'

import * as window from './window.js';

let submissionWindowShown = false;
let gameGrid = '';


function createGridInputWindow(title) {

    if (submissionWindowShown) {
        alert('You already have a submission window open!');
        return
    }

    const windowElement = document.createElement('div');
    windowElement.classList.add('window');
    windowElement.id = 'input_box';

    const titleBar = window.makeTitleBar(title, windowElement);

    const closeButton = document.createElement('button');
    closeButton.classList.add('close_button');
    closeButton.innerHTML = '<img src="img/close2.png" alt="close icon">';

    closeButton.addEventListener('click', () => {
        windowElement.remove();
        submissionWindowShown = false;
    });

    titleBar.appendChild(closeButton);
    windowElement.appendChild(titleBar);

    const gameInputBox = document.createElement('div');
    gameInputBox.id = 'input_box';
    gameInputBox.classList.add('user_box');

    const userForm = document.createElement('form');
    const userLabel = document.createElement('label');
    userLabel.htmlFor = 'game_grid';
    userLabel.textContent = 'Enter the game grid: ';
    const userInput = document.createElement('input');
    userInput.type = 'text';
    userInput.id = 'game_grid';
    userInput.name = 'game_grid';
    const userButton = document.createElement('button');
    userButton.type = 'submit';
    userButton.id = 'submit_grid';
    userButton.classList.add('button');
    userButton.textContent = 'Submit!';
    userForm.appendChild(userLabel);
    userForm.appendChild(userInput);
    userForm.appendChild(userButton);
    gameInputBox.appendChild(userForm);

    windowElement.appendChild(gameInputBox);

    document.querySelector('main').appendChild(windowElement);
    window.makeDraggable(windowElement);

    document.querySelector('#submit_grid').addEventListener('click', (event) => {
        event.preventDefault();
        gameGrid = document.querySelector('#game_grid').value;

        if (gameGrid === '') {
            alert('Please enter a valid game grid!');
            return;
        } else {
            document.querySelector('#input_box').remove();
            // create game window
        }
    })

    document.querySelector('#game_grid').focus();
    submissionWindowShown = true;
}


