async function getWeather(city = 'São Paulo') {
    try {
        const cityName = cityNameStandardized(city)
        const response = await fetch(`https://api.openweathermap.org/data/2.5/forecast?lat=51.5085&lon=-0.1257&appid=62b615746ea458643b8d1bc9bc6b1d91&units=metric`, { 'mode': 'cors' })
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

async function displayWeather(city) {
    const mainTemp = document.createElement('div')
    const generalTemp = await getWeather(city) 
    let info
    (generalTemp === 'Error: 404 - City not found.') ? info = generalTemp : info = generalTemp.city.name
    mainTemp.innerText = info
    document.body.append(mainTemp)
}

function cityNameStandardized(name) {
    return name.replace(' ', '+')
}

// displayWeather('Foz do Iguaçu')