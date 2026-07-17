const API_KEY = '28ce7311124475dcf846cc9f88d52d64';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';

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