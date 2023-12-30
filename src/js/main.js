'use strict'


import { makeDraggable } from './modules/drag.js'; // You'll create this file next
import * as chat from './modules/chat.js';
import * as weatherApp from './modules/weather.js';

document.querySelector('.start_memory').addEventListener('click', () => createWindow('Memory Game'));
document.querySelector('.start_chat').addEventListener('click', () => chat.initChat());
document.querySelector('.start_weather').addEventListener('click', () => weatherApp.createWeatherWindow('Weather App'));


// const apiKey = "c663b54cc99b1b7eb1fc579db6049404"
// const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=Berlin"

// async function getWeather() {
//     const response = await fetch(`${apiURL}&appid=${apiKey}`);
//     const data = await response.json();
//     console.log(data);
// }



