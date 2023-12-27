'use strict'


import { makeDraggable } from './modules/drag.js'; // You'll create this file next
import { initQuiz } from './quiz.js';
import * as Fetch from './modules/quiz/Fetch.js'
import { User } from './modules/quiz/user.js'
import * as Timer from './modules/quiz/timer.js'
import * as WebStorage from './modules/quiz/webstorage.js'


document.querySelector('.start_memory').addEventListener('click', () => createWindow('Memory Game'));
document.querySelector('.start_chat').addEventListener('click', () => createWindow('Chat'));
document.querySelector('.start_quiz').addEventListener('click', () => createQuizWindow('Quiz'));

function createQuizWindow(title) {
    const windowElement = document.createElement('div');
    windowElement.classList.add('window');

    windowElement.innerHTML = `
        <div class="title-bar">
            ${title}
            <span class="close">X</span>
        </div>
        <div id="restart_options" class="hidden">
        <button id="restart_button" class="button">Restart quiz!</button>
        <button id="highscore_button" class="button">Show high scores!</button>
    </div>

    <div id="user_info" class="user_box">
        <form action="">
            <label for="user_name">Enter a nickname: </label>
            <input type="text" id="user_name" name="user_name">
            <button type="submit" id="submit_name" class="button">Submit name!</button>
        </form>
    </div>
    
    <button id="start_button" class="hidden button">Start quiz</button>


    <div id="quiz" class="hidden">

        <div id="timer" class="box">
            <p>
                Time left: <span id="time">10 seconds</span>
            </p>
        </div>

        <div id="question_box" class="box">
            <!-- <p>The actual question</p> --> 
        </div>

        <div id="answer_input" class="box">
            <label for="answer">Enter your Answer: </label>
            <input type="text" id="answer" name="user_answer">
            <button type="submit" id="submit" class="hidden button">Submit answer!</button>
        </div>


        <form id="alternatives_input" class="alt_form hidden">

        </form>



        <div id="feedback" class="box hidden">
            <!-- feedback message will be here -->
        </div>
    </div>

    <div id="victory_box" class="victory_box hidden">
        <h1>YOU WON! OUTSTANDING WORK</h1>
        <h2>You finised in </h2>
    </div>

    <div id="loss_box" class="loss_box hidden">
        <h1>SORRY! GAME OVER</h1>
        <!-- <h1></h1> -->
    </div>

    <div id="highscores_container" class="hidden highscore_box">
        <!-- high score list will be here -->
        <h1><span></span></h1>

        <ul id="highscore_list">
        </ul>
    </div>
    `;

    document.querySelector('main').appendChild(windowElement);
    makeDraggable(windowElement);

    windowElement.querySelector('.close').addEventListener('click', () => {
        windowElement.remove();
    });
    
    initQuiz();
}

console.log("Hello from main.js!")