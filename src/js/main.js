'use strict'


import { makeDraggable } from './modules/drag.js'; // You'll create this file next
import * as chat from './modules/chat.js';

document.querySelector('.start_memory').addEventListener('click', () => createWindow('Memory Game'));
// document.querySelector('.start_chat').addEventListener('click', () => createChatWindow('Chat'));
document.querySelector('.start_chat').addEventListener('click', () => chat.initChat());
document.querySelector('.start_quiz').addEventListener('click', () => createWindow('Quiz'));






