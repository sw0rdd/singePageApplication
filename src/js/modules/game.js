import * as window from './window.js';



let playerLives = 6 
let size = '';


export function createGridInputWindow(title) {

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
        size = document.querySelector('#game_grid').value.trim();

        let validSizes = ['2x2', '2x4', '4x4']
        if(!validSizes.includes(size)) {
            alert('Please enter a valid game grid!');
            return;
        } else {
            document.querySelector('#input_box').remove();
            // card generator
            CreateGame(size);

        }
    })

    document.querySelector('#game_grid').focus();
}


export function getData(size) {
    console.log(size)
    const baseData = [
        { imgSrc: './img/memory_game/0.png', name: '0' },
        { imgSrc: './img/memory_game/1.png', name: '1' },
        { imgSrc: './img/memory_game/2.png', name: '2' },
        { imgSrc: './img/memory_game/3.png', name: '3' },
        { imgSrc: './img/memory_game/4.png', name: '4' },
        { imgSrc: './img/memory_game/5.png', name: '5' },
        { imgSrc: './img/memory_game/6.png', name: '6' },
        { imgSrc: './img/memory_game/7.png', name: '7' },
        { imgSrc: './img/memory_game/0.png', name: '0' },
        { imgSrc: './img/memory_game/1.png', name: '1' },
        { imgSrc: './img/memory_game/2.png', name: '2' },
        { imgSrc: './img/memory_game/3.png', name: '3' },
        { imgSrc: './img/memory_game/4.png', name: '4' },
        { imgSrc: './img/memory_game/5.png', name: '5' },
        { imgSrc: './img/memory_game/6.png', name: '6' },
        { imgSrc: './img/memory_game/7.png', name: '7' },
    ]

    let numOfPairs
    switch (size) {
        case '4x4':
            numOfPairs = 8
            break;
        case '2x2':
            numOfPairs = 2
            break;
        case '2x4':
            numOfPairs = 4
            break;
    
        default:
            throw new Error('invalid size')
    }

    const selectedImages = baseData.slice(0, numOfPairs)
    const cardData = selectedImages.concat(selectedImages)

    return cardData;

}


function randomize(size) {
    const cardData = getData(size);
    cardData.sort(() => Math.random() - 0.5);
    console.log(cardData)
    return cardData;
}






export function CreateGame(size) {

    const windowElement = document.createElement('div');
    windowElement.classList.add('window');

    const titleBar = window.makeTitleBar('Memory Game', windowElement);

    const closeButton = document.createElement('button');
    closeButton.classList.add('close_button');
    closeButton.innerHTML = '<img src="img/close2.png" alt="close icon">';

    closeButton.addEventListener('click', () => {
        windowElement.remove();
    });

    titleBar.appendChild(closeButton);
    windowElement.appendChild(titleBar);


    const memory_game = document.createElement('div');
    memory_game.classList.add('memory_game');

    // this hedaer has lives and reset button
    const game_header = document.createElement('div');
    game_header.classList.add('game_header');


    const playerLivesCount = document.createElement('h1');
    playerLivesCount.classList.add('player_lives_count');
    game_header.appendChild(playerLivesCount);

    const section = document.createElement('section');


    const cardData = randomize(size);

    cardData.forEach((item) => {
        const memory_card = document.createElement('div');
        const face = document.createElement('img');
        const back = document.createElement('img');
        memory_card.classList = 'memory_card';
        face.classList = 'face';
        back.classList = 'back';

        // attach the info to the cards
        face.src = item.imgSrc;
        memory_card.setAttribute('name', item.name);

        back.src = './img/memory_game/question_mark.png';
        back.setAttribute('name', 'question_mark');

        // attach the card to the section
        section.appendChild(memory_card)
        memory_card.appendChild(face);
        memory_card.appendChild(back);

        memory_card.addEventListener('click', (e) => {
            memory_card.classList.toggle('togglCard');
            console.log('card clicked')
            checkCards(e);
        })

    })

    memory_game.appendChild(game_header);
    memory_game.appendChild(section);
    windowElement.appendChild(memory_game);
    document.querySelector('main').appendChild(windowElement);
    window.makeDraggable(windowElement);

    playerLivesCount.textContent = playerLives;

}

// check cards function
function checkCards(e) {
    const clickedCard = e.target;
    clickedCard.classList.add('flipped');

    const flippedCards = document.querySelectorAll('.flipped');
    const togglCards = document.querySelectorAll('.togglCard');

    // logic 
    if (flippedCards.length === 2) {
        if (flippedCards[0].getAttribute('name') === flippedCards[1].getAttribute('name')) {
            flippedCards.forEach((card) => {
                card.classList.remove('flipped')
                card.style.pointerEvents = 'none'
            })
        } else {
            console.log("wrong")
            flippedCards.forEach((card) => {
                card.classList.remove('flipped');
                setTimeout(() => card.classList.remove('togglCard'), 1000)
            })
            playerLives--;
            document.querySelector('.player_lives_count').textContent = playerLives;
            if (playerLives === 0) {
                reset('Try again!');
            }
        }
    }

    // check if won
    if (togglCards.length === 16) {
        reset('You won!')
    }
    
    
}

function reset(message) {
    const cardData = randomize();
    let faces = document.querySelectorAll('.face');
    let cards = document.querySelectorAll('.memory_card');

    section.style.pointerEvents = 'none';

    cardData.forEach((item, index) => {
        cards[index].classList.remove('togglCard');
        setTimeout(() => {
            cards[index].style.pointerEvents = 'all';
            faces[index].src = item.imgSrc;
            cards[index].setAttribute('name', item.name);
            section.style.pointerEvents = 'all'
        }, 1000)
    })

    playerLives = 6;
    document.querySelector('.player_lives_count').textContent = playerLives;
    setTimeout(() => window.alert(message), 100)
}


