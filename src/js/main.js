'use strict'


import * as window from './modules/window.js'; // You'll create this file next
import * as chat from './modules/chat.js';
import * as weatherApp from './modules/weather.js';

document.querySelector('.start_memory').addEventListener('click', () => createWindow('Memory Game'));
document.querySelector('.start_chat').addEventListener('click', () => chat.initChat());
document.querySelector('.start_weather').addEventListener('click', () => weatherApp.createWeatherWindow('Weather App'));






