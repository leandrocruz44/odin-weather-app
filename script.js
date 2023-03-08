function cityNameStandardized(name) {
    return name.replace(' ', '+')
}

async function fetchData(city = 'São Paulo') {
    try {
        const cityName = cityNameStandardized(city)
        const response = await fetch(`https://api.openweathermap.org/data/2.5/weather?q=${cityName}&APPID=62b615746ea458643b8d1bc9bc6b1d91&units=metric`, { 'mode': 'cors' })
        if (response.status === 200) {
            const data = await response.json()
            console.log(data)
            return data
        }
        throw new Error(response.status + ' - City not found.')
    } catch(error) {
        return error
    }
}

function getElementByIdFunc(data) {
    const get = document.getElementById(data)
    return get
}

function tempStandard(data) {
    const temp = data
    let tempFinal
    if (temp.charAt[0] == '-') {
        tempFinal = temp.slice(0, 3)
    } else if (temp.length === 4) {
        tempFinal = temp.slice(0, 3)
    } else if (temp.length === 5) {
        tempFinal = temp.slice(0, 2)
    } else if (temp.length === 6) {
        tempFinal = temp.slice(0, 3)
    }

    return tempFinal
}

function dateStandard(dt, timezone) {
    // Tranforming the unix number the API gives us to display the date from the city searched
    // https://stackoverflow.com/questions/62376115/how-to-obtain-open-weather-api-date-time-from-city-being-fetched
    const unix = dt
    const date = new Date(unix * 1000)
    const localTime = date.getTime()
    const localOffset = date.getTimezoneOffset() * 60000
    const utc = localTime + localOffset
    const cityDateUnix = utc + (1000 * timezone)
    const cityDate = "0" + new Date(cityDateUnix)
    const cityDateFinal = cityDate.slice(1, 22)
    return cityDateFinal
}

function displayCityName(data) {
    getElementByIdFunc('cityName').innerText = `${data.name}, ${data.sys.country}`
}

function displayDate(data) {
    const localTime = dateStandard(data.dt, data.timezone)
    getElementByIdFunc('date').innerText = localTime
}

function displayTemperature(data) {
    const temp = tempStandard('' + data.main.temp)
    getElementByIdFunc('temp').innerText = `${temp}ºC`
}

function displayWeatherIcon(data) {
    getElementByIdFunc('img').src = `https://openweathermap.org/img/wn/${data.weather[0].icon}@2x.png`
}

function displayWeatherConditions(data) {
    getElementByIdFunc('sky').innerText = data.weather[0].main

    // Code to capitalize every word
    const description = data.weather[0].description
    const words = description.split(' ')
    const skyCondition = words.map((word) => { return word[0].toUpperCase() +word.substring(1)}).join(" ")
    getElementByIdFunc('skyCond').innerText = skyCondition
}

function displayFeelsLike(data) {
    const feelsLike = tempStandard('' + data.main.feels_like)
    getElementByIdFunc('feelsLikeInfo').innerText = `${feelsLike}ºC`
}

function displayHumidity(data) {
    getElementByIdFunc('humidityInfo').innerText = `${data.main.humidity}%`
}

function displayCloudness(data) {
    getElementByIdFunc('cloudnessInfo').innerText = `${data.clouds.all}%`
}

function displaySunriseAndSunset(data) {
    const sunrise = dateStandard(data.sys.sunrise, data.timezone).slice(-5)
    const sunset = dateStandard(data.sys.sunset, data.timezone).slice(-5)
    getElementByIdFunc('sunriseInfo').innerText = sunrise
    getElementByIdFunc('sunsetInfo').innerText = sunset
}

async function displayAllInfo(city) {
    const data = await fetchData(city) 
    displayCityName(data)
    displayDate(data)
    displayTemperature(data)
    displayWeatherIcon(data)
    displayWeatherConditions(data)
    displayFeelsLike(data)
    displayHumidity(data)
    displayCloudness(data)
    displaySunriseAndSunset(data)
}

displayAllInfo()

const search = getElementByIdFunc('searchCity')
const btn = getElementByIdFunc('searchBtn')

search.addEventListener('keydown', (e) => {
    if (e.key === 'Enter' && search.value !== '') {
        const value = search.value
        displayAllInfo(value)
        search.value = ''
    }
})

btn.addEventListener('click', () => {
    const value = search.value
    displayAllInfo(value)
    search.value = ''
})


