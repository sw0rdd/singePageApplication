import * as windowManager from './window.js';
import * as memoryGame from './memoryGame.js';

let size

export function createGridInputWindow(title) {

    const windowElement = document.createElement('div');
    windowElement.classList.add('window');
    windowElement.id = 'input_box';

    const titleBar = windowManager.makeTitleBar(title, windowElement);

    const closeButton = document.createElement('button');
    closeButton.classList.add('close_button');
    closeButton.innerHTML = '<img src="img/close2.png" alt="close icon">';

    closeButton.addEventListener('click', () => {
        windowElement.remove();
    });

    titleBar.appendChild(closeButton);
    windowElement.appendChild(titleBar);

    const gameInputBox = document.createElement('div');
    gameInputBox.id = 'input_box';
    gameInputBox.classList.add('user_box');

    const userForm = document.createElement('form');
    userForm.addEventListener('submit', handleSubmit);

    const userLabel = document.createElement('label');
    userLabel.textContent = 'Enter the game grid: ';


    const userInput = document.createElement('input');
    userInput.type = 'text';
    userInput.placeholder = 'choose: 2x2, 2x4, 4x4';

    const userButton = document.createElement('button');
    userButton.type = 'submit';
    userButton.classList.add('button');
    userButton.textContent = 'Submit!';

    userForm.appendChild(userLabel);
    userForm.appendChild(userInput);
    userForm.appendChild(userButton);
    gameInputBox.appendChild(userForm);

    windowElement.appendChild(gameInputBox);

    document.querySelector('main').appendChild(windowElement);
    userInput.focus();
    windowManager.makeDraggable(windowElement);
    windowManager.positionWindow(windowElement);

    function handleSubmit(event) {
        event.preventDefault();
        const size = userInput.value.trim();
        let validSizes = ['2x2', '2x4', '4x4'];
        
        if (!validSizes.includes(size)) {
            alert('Please enter a valid game grid!');
            return;
        }

        windowElement.remove();
        let game = new memoryGame.MemoryGame(size);
        game.CreateGame();
    }


}










