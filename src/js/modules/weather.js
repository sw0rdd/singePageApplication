import * as windowManager from './window.js'

const apiKey = 'c663b54cc99b1b7eb1fc579db6049404'
const apiURL = 'https://api.openweathermap.org/data/2.5/weather?units=metric&q='

/**
 * Creates a new weather window with all the necessary elements
 * updates the weather data when the user clicks the search button
 * @see getWeather
 * @param {string} title - the title of the window
 */
export function createWeatherWindow (title) {
  const windowElement = document.createElement('div')
  windowElement.classList.add('window')

  const titleBar = windowManager.makeTitleBar(title)

  const closeButton = document.createElement('button')
  closeButton.classList.add('close_button')
  closeButton.innerHTML = '<img src="img/close2.png" alt="close icon">'

  closeButton.addEventListener('click', () => {
    windowElement.remove()
  })

  titleBar.appendChild(closeButton)
  windowElement.appendChild(titleBar)

  const card = document.createElement('div')
  card.classList.add('card')
  const search = document.createElement('div')
  search.classList.add('search')
  const input = document.createElement('input')
  input.type = 'text'
  input.placeholder = 'Enter city name...'
  input.spellcheck = false
  const button = document.createElement('button')
  const img = document.createElement('img')
  img.src = 'img/weather/search.png'
  img.alt = 'search icon'
  button.appendChild(img)
  search.appendChild(input)
  search.appendChild(button)
  card.appendChild(search)

  const error = document.createElement('div')
  error.classList.add('error')
  const errorMsg = document.createElement('p')
  errorMsg.textContent = 'Invalid city name!'
  error.appendChild(errorMsg)
  card.appendChild(error)

  const weather = document.createElement('div')
  weather.classList.add('weather')
  const weatherIcon = document.createElement('img')
  weatherIcon.src = 'img/weather/Rain.png'
  weatherIcon.classList.add('weather_icon')
  weatherIcon.alt = 'weather icon'
  const temp = document.createElement('h1')
  temp.classList.add('temp')
  temp.textContent = '22°C'
  const city = document.createElement('h2')
  city.classList.add('city')
  city.textContent = 'Haifa'
  const weatherStatus = document.createElement('h2')
  weatherStatus.classList.add('weather_status')
  weatherStatus.textContent = 'Rainy'
  const details = document.createElement('div')
  details.classList.add('details')

  const col1 = document.createElement('div')
  col1.classList.add('col')
  const humidityIcon = document.createElement('img')
  humidityIcon.src = 'img/weather/humidity.png'
  humidityIcon.alt = 'humidity icon'
  const humidity = document.createElement('div')
  const humidityP = document.createElement('p')
  humidityP.classList.add('humidity')
  humidityP.textContent = '50%'
  const humidityText = document.createElement('p')
  humidityText.textContent = 'Humidity'
  humidity.appendChild(humidityP)
  humidity.appendChild(humidityText)
  col1.appendChild(humidityIcon)
  col1.appendChild(humidity)

  const col2 = document.createElement('div')
  col2.classList.add('col')
  const windIcon = document.createElement('img')
  windIcon.src = 'img/weather/wind.png'
  windIcon.alt = 'wind icon'
  const wind = document.createElement('div')
  const windP = document.createElement('p')
  windP.classList.add('wind')
  windP.textContent = '15 km/h'
  const windText = document.createElement('p')
  windText.textContent = 'Wind speed'
  wind.appendChild(windP)
  wind.appendChild(windText)
  col2.appendChild(windIcon)
  col2.appendChild(wind)

  details.appendChild(col1)
  details.appendChild(col2)

  weather.appendChild(weatherIcon)
  weather.appendChild(temp)
  weather.appendChild(city)
  weather.appendChild(weatherStatus)
  weather.appendChild(details)

  card.appendChild(weather)
  windowElement.appendChild(card)

  windowManager.makeDraggable(windowElement)
  document.querySelector('main').appendChild(windowElement)

  button.addEventListener('click', () => {
    const city = input.value
    getWeather(city, windowElement)
  })

  input.addEventListener('keydown', (event) => {
    if (event.key === 'Enter') {
      const city = input.value
      getWeather(city, windowElement)
    }
  })

  windowManager.positionWindow(windowElement)

  input.focus()
}

/**
 * Gets the weather data for the given city from the openweathermap API
 * @param {string} city the city to get the weather for
 * @param {*} windowElement the window element to update
 */
async function getWeather (city, windowElement) {
  const response = await fetch(`${apiURL}${city}&appid=${apiKey}`)

  if (!response.ok) {
    windowElement.querySelector('.error').style.display = 'block'
    windowElement.querySelector('.weather').style.display = 'none'
  } else {
    const data = await response.json()
    console.log(data)

    windowElement.querySelector('.city').textContent = data.name
    windowElement.querySelector('.temp').textContent = Math.round(data.main.temp) + '°C'
    windowElement.querySelector('.weather_status').textContent = data.weather[0].main
    windowElement.querySelector('.humidity').textContent = data.main.humidity + '%'
    windowElement.querySelector('.wind').textContent = data.wind.speed + 'km/h'
    windowElement.querySelector('.weather_icon').src = `img/weather/${data.weather[0].main}.png`

    windowElement.querySelector('.weather').style.display = 'block'
    windowElement.querySelector('.error').style.display = 'none'
  }
}
