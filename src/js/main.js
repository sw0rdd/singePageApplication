'use strict'

import * as game from './modules/memoryGame.js';
import * as chat from './modules/chat.js';
import * as weatherApp from './modules/weather.js';

document.querySelector('.start_memory').addEventListener('click', () => game.createGridInputWindow('Memory Game'));
document.querySelector('.start_chat').addEventListener('click', () => chat.initChat());
document.querySelector('.start_weather').addEventListener('click', () => weatherApp.createWeatherWindow('Weather App'));




const section = document.querySelector('section');
const playerLivesCount = document.querySelector('span');
let playerLives = 6 

playerLivesCount.textContent = playerLives;


const getData = () => [
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

const randomize = () => {
    const cardData = getData();
    cardData.sort(() => Math.random() - 0.5);
    cardData.sort(() => Math.random() - 0.5);
    return cardData;
}

// card generator function

const cardGenerator = () => {
    const cardData = randomize();

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

}

// check cards function
const checkCards = (e) => {
    const clickedCard = e.target;
    clickedCard.classList.add('flipped');

    const flippedCards = document.querySelectorAll('.flipped');

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
            playerLivesCount.textContent = playerLives;
            if (playerLives === 0) {
                reset();
            }
        }
    }
    
    
}

const reset = () => {
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
    playerLivesCount.textContent = playerLives;
}


cardGenerator()
