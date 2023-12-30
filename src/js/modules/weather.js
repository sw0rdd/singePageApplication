import { makeDraggable } from './drag.js';


const apiKey = "c663b54cc99b1b7eb1fc579db6049404"
const apiURL = "https://api.openweathermap.org/data/2.5/weather?units=metric&q="


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

        const card = document.createElement('div');
        card.classList.add('card');
        const search = document.createElement('div');
        search.classList.add('search');
        const input = document.createElement('input');
        input.type = 'text';
        input.placeholder = 'Enter city name...';
        input.spellcheck = false;
        const button = document.createElement('button');
        const img = document.createElement('img');
        img.src = 'img/search.png';
        img.alt = 'search icon';
        button.appendChild(img);
        search.appendChild(input);
        search.appendChild(button);
        card.appendChild(search);

        const error = document.createElement('div');
        error.classList.add('error');
        const errorMsg = document.createElement('p');
        errorMsg.textContent = 'Invalid city name!';
        error.appendChild(errorMsg);
        card.appendChild(error);


        const weather = document.createElement('div');
        weather.classList.add('weather');
        const weatherIcon = document.createElement('img');
        weatherIcon.src = 'img/rain.png';
        weatherIcon.classList.add('weather_icon');
        weatherIcon.alt = 'weather icon';
        const temp = document.createElement('h1');
        temp.classList.add('temp');
        temp.textContent = '22°C';
        const city = document.createElement('h2');
        city.classList.add('city');
        city.textContent = 'Haifa';
        const details = document.createElement('div');
        details.classList.add('details');

        const col1 = document.createElement('div');
        col1.classList.add('col');
        const humidityIcon = document.createElement('img');
        humidityIcon.src = 'img/humidity.png';
        humidityIcon.alt = 'humidity icon';
        const humidity = document.createElement('div');
        const humidityP = document.createElement('p');
        humidityP.classList.add('humidity');
        humidityP.textContent = '50%';
        const humidityText = document.createElement('p');
        humidityText.textContent = 'Humidity';
        humidity.appendChild(humidityP);
        humidity.appendChild(humidityText);
        col1.appendChild(humidityIcon);
        col1.appendChild(humidity);

        const col2 = document.createElement('div');
        col2.classList.add('col');
        const windIcon = document.createElement('img');
        windIcon.src = 'img/wind.png';
        windIcon.alt = 'wind icon';
        const wind = document.createElement('div');
        const windP = document.createElement('p');
        windP.classList.add('wind');
        windP.textContent = '15 km/h';
        const windText = document.createElement('p');
        windText.textContent = 'Wind speed';
        wind.appendChild(windP);
        wind.appendChild(windText);
        col2.appendChild(windIcon);
        col2.appendChild(wind);

        details.appendChild(col1);
        details.appendChild(col2);

        weather.appendChild(weatherIcon);
        weather.appendChild(temp);
        weather.appendChild(city);
        weather.appendChild(details);

        card.appendChild(weather);
        windowElement.appendChild(card);
        
        makeDraggable(windowElement);
        document.querySelector('main').appendChild(windowElement); 

        button.addEventListener('click', () => {
            const city = input.value;
            getWeather(city, windowElement);
        })

        
}


async function getWeather(city, windowElement) {
    const response = await fetch(`${apiURL}${city}&appid=${apiKey}`);

    if (!response.ok) {
        windowElement.querySelector('.error').style.display = 'block';
        windowElement.querySelector('.weather').style.display = 'none';
        return;
    } else {
        const data = await response.json();
        console.log(data);
    
        windowElement.querySelector('.city').textContent = data.name;
        windowElement.querySelector('.temp').textContent = Math.round(data.main.temp) + '°C';
        windowElement.querySelector('.humidity').textContent = data.main.humidity + '%';
        windowElement.querySelector('.wind').textContent = data.wind.speed + 'km/h';
        windowElement.querySelector('.weather_icon').src = `img/${data.weather[0].main}.png`;
    
        windowElement.querySelector('.weather').style.display = 'block';
        windowElement.querySelector('.error').style.display = 'none';
    }

}




/* <div class="card">
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
</div> */