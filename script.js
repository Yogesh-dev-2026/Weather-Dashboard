const API_KEY = '28ce7311124475dcf846cc9f88d52d64';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = "https://api.openweather.org/data/2.5/forecast";

// grab all the elements I need
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const searchInput = document.getElementById('city-search');
const searchBtn = document.getElementById('search-btn');
const geoBtn = document.getElementById('geo-btn');

const weatherContent = document.getElementById('weather-content');
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const errorMessage = document.getElementById('error-message');

const locationName = document.getElementById('location-name');
const currentDate = document.getElementById('current-date');
const mainTemp = document.getElementById('main-temperature');
const weatherDesc = document.getElementById('weather-description');
const weatherIcon = document.getElementById('weather-hero-icon');

const feelsLike = document.getElementById('feels-like-val');
const humidity = document.getElementById('humidity-val');
const wind = document.getElementById('wind-val');
const pressure = document.getElementById('pressure-val');
const forecastCards = document.getElementById("forecast-cards");
 
// theme setup - check if user had a preference saved before
function initTheme() {
    const saved = localStorage.getItem('weather-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    document.documentElement.setAttribute('data-theme', theme);
    updateThemeIcon(theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    document.documentElement.setAttribute('data-theme', next);
    localStorage.setItem('weather-theme', next);
    updateThemeIcon(next);
}

function updateThemeIcon(theme) {
    // sun icon for dark mode, moon for light mode
    themeIcon.setAttribute('name', theme === 'dark' ? 'sunny-outline' : 'moon-outline');
}

// start the app
initTheme();

// fetch weather data from OpenWeather API
async function getWeather(query) {
    showLoading();

    try {
        const res = await fetch(`${BASE_URL}?${query}&units=metric&appid=${API_KEY}`);

        if (!res.ok) {
            if (res.status === 404) throw new Error("City not found. Try a different name.");
            if (res.status === 401) throw new Error("Invalid API key. Check your key and try again.");
            throw new Error("Something went wrong. Please try again.");
        }

        const data = await res.json();
        showWeather(data);

    } catch (err) {
        showError(err.message);
    }
}

function showLoading() {
    loadingState.classList.remove('hidden');
    errorState.classList.add('hidden');
    weatherContent.classList.add('hidden');
}

function showError(msg) {
    loadingState.classList.add('hidden');
    weatherContent.classList.add('hidden');
    errorState.classList.remove('hidden');
    errorMessage.textContent = msg;
}


function showWeather(data) {
    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');
    weatherContent.classList.remove('hidden');

    locationName.textContent = `${data.name}, ${data.sys.country}`;
    currentDate.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long', month: 'short', day: 'numeric'
    });

    mainTemp.textContent = Math.round(data.main.temp);
    weatherDesc.textContent = data.weather[0].description;

    // fixed icon URL - was missing $ and had wrong base URL before
    const iconCode = data.weather[0].icon;
    weatherIcon.src = `https://openweathermap.org/img/wn/${iconCode}@4x.png`;

    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    // API gives wind in m/s - converting to km/h
    wind.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
    pressure.textContent = `${data.main.pressure} hPa`;
}
function searchCity() {
    const city = searchInput.value.trim();
    if (!city) return;
    getWeather(`q=${encodeURIComponent(city)}`);
}

function searchCity() {
    const city = searchInput.value.trim();
    if (!city) return;
    getWeather(`q=${encodeURIComponent(city)}`);
}

function useMyLocation() {
    if (!navigator.geolocation) {
        showError("Your browser doesn't support geolocation.");
        return;
    }

    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const { latitude: lat, longitude: lon } = pos.coords;
            getWeather(`lat=${lat}&lon=${lon}`);
        },
        () => {
            showError("Couldn't get your location. Please allow location access.");
        }
    );
}

// event listeners
themeToggleBtn.addEventListener('click', toggleTheme);
searchBtn.addEventListener('click', searchCity);
geoBtn.addEventListener('click', useMyLocation);

// press Enter to search
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchCity();
});

// load London weather on startup
getWeather('q=London');