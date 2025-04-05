const apiKey = "c6ea37cba33abf6dd2c42f880839fe07";
const searchInput = document.querySelector(".city");
const getWeatherButton = document.querySelector(".bt");
const weatherIcon = document.querySelector(".weather-icon");
const temperature = document.querySelector(".temperature");
const description = document.querySelector(".description");
const feelsLike = document.querySelector(".feels-like");
const humidity = document.querySelector(".humidity");
const wind = document.querySelector(".wind");

// Set default weather icon
let currentWeatherIcon = "fa-cloud-sun";

// Add event listener for button click
getWeatherButton.addEventListener("click", fetchWeatherData);

// Add event listener for Enter key
searchInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter") {
        fetchWeatherData();
    }
});

async function fetchWeatherData() {
    const city = searchInput.value.trim();
    
    if (city === "") {
        showError("Please enter a city name!");
        return;
    }

    try {
        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?q=${city}&appid=${apiKey}&units=metric`
        );
        
        const data = await response.json();
        
        if (data.cod === "404") {
            showError("City not found! Try again.");
            return;
        }
        
        updateWeatherUI(data);
    } catch (error) {
        showError("Error fetching data. Try again later.");
        console.error(error);
    }
}

function updateWeatherUI(data) {
    // Update main weather info
    temperature.textContent = `${Math.round(data.main.temp)}°C`;
    description.textContent = data.weather[0].description;
    
    // Update weather icon based on conditions
    updateWeatherIcon(data.weather[0].main);
    
    // Update additional details
    feelsLike.textContent = `Feels like: ${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `Humidity: ${data.main.humidity}%`;
    wind.textContent = `Wind: ${Math.round(data.wind.speed * 3.6)} km/h`;
}

function updateWeatherIcon(weatherCondition) {
    weatherIcon.innerHTML = "";
    const icon = document.createElement("i");
    icon.classList.add("fas");
    
    switch (weatherCondition.toLowerCase()) {
        case "clear":
            icon.classList.add("fa-sun");
            currentWeatherIcon = "fa-sun";
            break;
        case "clouds":
            icon.classList.add("fa-cloud");
            currentWeatherIcon = "fa-cloud";
            break;
        case "rain":
            icon.classList.add("fa-cloud-rain");
            currentWeatherIcon = "fa-cloud-rain";
            break;
        case "snow":
            icon.classList.add("fa-snowflake");
            currentWeatherIcon = "fa-snowflake";
            break;
        case "thunderstorm":
            icon.classList.add("fa-bolt");
            currentWeatherIcon = "fa-bolt";
            break;
        case "drizzle":
            icon.classList.add("fa-cloud-rain");
            currentWeatherIcon = "fa-cloud-rain";
            break;
        case "mist":
        case "smoke":
        case "haze":
        case "fog":
            icon.classList.add("fa-smog");
            currentWeatherIcon = "fa-smog";
            break;
        default:
            icon.classList.add(currentWeatherIcon);
    }
    
    weatherIcon.appendChild(icon);
}

function showError(message) {
    description.textContent = message;
    temperature.textContent = "--°C";
    feelsLike.textContent = "Feels like: --°C";
    humidity.textContent = "Humidity: --%";
    wind.textContent = "Wind: -- km/h";
    
    const icon = document.createElement("i");
    icon.classList.add("fas", "fa-exclamation-triangle");
    weatherIcon.innerHTML = "";
    weatherIcon.appendChild(icon);
}