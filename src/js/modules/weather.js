import { makeDraggable } from './drag.js';




export function createWeatherWindow(title) {
    const windowElement = document.createElement('div');
    windowElement.classList.add('window');
    windowElement.classList.add('chat_window');

        const titleBar = document.createElement('div');
        titleBar.classList.add('title-bar');
        titleBar.textContent = title;

        const closeButton = document.createElement('span');
        closeButton.classList.add('close');
        closeButton.textContent = 'X';
        closeButton.addEventListener('click', () => {
            windowElement.remove();
        });

        titleBar.appendChild(closeButton);
        windowElement.appendChild(titleBar);

        


        
        // makeDraggable(windowElement);
        // document.querySelector('main').appendChild(windowElement); 
        
}




{/* <div class="card">
<div class="search">
    <input type="text" placeholder="Enter city name..." spellcheck="false">
    <button><img src="img/search.png" alt="search icon"></button>
</div>
<div class="weather">
    <img src="img/rain.png" class="weather_icon" alt="weather icon">
    <h1 class="temp">22°C </h1>
    <h2 class="city">Haifa</h2>

    <div class="details">
        <div class="col">
            <img src="img/humidity.png" alt="humidity icon">
            <div>
                <p class="humidity">50%</p>
                <p>Humidity</p>
            </div>
        </div>
        <div class="col">
            <img src="img/wind.png" alt="humidity icon">
            <div>
                <p class="wind">15 km/h</p>
                <p>Wind speed</p>
            </div>
        </div>
    </div>
</div>
</div> */}