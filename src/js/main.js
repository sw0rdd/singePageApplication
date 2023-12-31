'use strict'

import * as game from './modules/memoryGame.js';
import * as chat from './modules/chat.js';
import * as weatherApp from './modules/weather.js';

document.querySelector('.start_memory').addEventListener('click', () => game.createGridInputWindow('Memory Game'));
document.querySelector('.start_chat').addEventListener('click', () => chat.initChat());
document.querySelector('.start_weather').addEventListener('click', () => weatherApp.createWeatherWindow('Weather App'));






