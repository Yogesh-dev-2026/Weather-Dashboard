const API_KEY = 'e742eb3a20f40cc697d08847d3736916';
const BASE_URL = 'https://api.openweathermap.org/data/2.5/weather';
const FORECAST_URL = 'https://api.openweathermap.org/data/2.5/forecast';

// grab all elements - IDs match index.html exactly
const themeToggleBtn = document.getElementById('theme-toggle');
const themeIcon = document.getElementById('theme-icon');
const searchInput = document.getElementById('city-search');
const searchBtn = document.getElementById('search-btn');
const geoBtn = document.getElementById('geo-btn');

const weatherContent = document.getElementById('weather-content');
const loadingState = document.getElementById('loading-state');
const errorState = document.getElementById('error-state');
const errorMessage = document.getElementById('error-message');

// these IDs must match index.html exactly
const cityName = document.getElementById('city-name');
const currentDate = document.getElementById('current-date');
const mainTemp = document.getElementById('temperature');
const weatherDesc = document.getElementById('description');
const weatherIcon = document.getElementById('weather-icon');

const feelsLike = document.getElementById('feels-like-val');
const humidity = document.getElementById('humidity-val');
const wind = document.getElementById('wind-val');
const pressure = document.getElementById('pressure-val');
const forecastCards = document.getElementById('forecast-cards');

// ─── THEME ───────────────────────────────────────────────

function initTheme() {
    const saved = localStorage.getItem('weather-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const theme = saved || (prefersDark ? 'dark' : 'light');
    applyTheme(theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next);
    localStorage.setItem('weather-theme', next);
}

function applyTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    // spin animation on icon when toggling
    themeIcon.style.transition = 'transform 0.3s ease';
    themeIcon.style.transform = 'rotate(180deg)';
    setTimeout(() => {
        // sun in dark mode, moon in light mode
        themeIcon.setAttribute('name', theme === 'dark' ? 'sunny-outline' : 'moon-outline');
        themeIcon.style.transform = 'rotate(0deg)';
    }, 150);
}

// ─── WEATHER ICONS ───────────────────────────────────────

function getWeatherIcon(iconCode) {
    const code = iconCode.slice(0, 2);
    const isDay = iconCode.endsWith('d');
    const icons = {
        '01': isDay ? 'sunny-outline' : 'moon-outline',
        '02': isDay ? 'partly-sunny-outline' : 'cloudy-night-outline',
        '03': 'cloud-outline',
        '04': 'cloudy-outline',
        '09': 'rainy-outline',
        '10': 'rainy-outline',
        '11': 'thunderstorm-outline',
        '13': 'snow-outline',
        '50': 'water-outline'
    };
    return icons[code] || 'partly-sunny-outline';
}

function getWeatherBackground(iconCode) {
    const code = iconCode.slice(0, 2);
    const isDay = iconCode.endsWith('d');
    const isDarkMode = document.documentElement.getAttribute('data-theme') === 'dark';
    if (!isDarkMode) return null;
    const backgrounds = {
        '01': isDay
            ? 'linear-gradient(135deg, #1a1a2e 0%, #16213e 100%)'
            : 'linear-gradient(135deg, #0d0d1a 0%, #1a1a3e 100%)',
        '02': 'linear-gradient(135deg, #1e1b4b 0%, #312e81 100%)',
        '03': 'linear-gradient(135deg, #1e293b 0%, #334155 100%)',
        '04': 'linear-gradient(135deg, #1e293b 0%, #475569 100%)',
        '09': 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
        '10': 'linear-gradient(135deg, #0f172a 0%, #1e3a5f 100%)',
        '11': 'linear-gradient(135deg, #1a1a2e 0%, #2d1b69 100%)',
        '13': 'linear-gradient(135deg, #1e293b 0%, #cbd5e1 100%)',
        '50': 'linear-gradient(135deg, #1e293b 0%, #64748b 100%)'
    };
    return backgrounds[code] || null;
}

// ─── API CALLS ───────────────────────────────────────────

async function getWeather(query) {
    showLoading();
    try {
        const res = await fetch(`${BASE_URL}?${query}&units=metric&appid=${API_KEY}`);
        if (!res.ok) {
            if (res.status === 404) throw new Error("City not found. Try a different name.");
            if (res.status === 401) throw new Error("API key not active yet. Wait 2 hours after signup.");
            throw new Error("Something went wrong. Please try again.");
        }
        const data = await res.json();
        showWeather(data);
        const forecastQuery = query.startsWith('lat')
            ? query
            : `q=${encodeURIComponent(data.name)}`;
        getForecast(forecastQuery);
    } catch (err) {
        showError(err.message);
    }
}

async function getForecast(query) {
    try {
        const res = await fetch(`${FORECAST_URL}?${query}&units=metric&appid=${API_KEY}`);
        if (!res.ok) return;
        const data = await res.json();
        showForecast(data);
    } catch (err) {
        console.log('Forecast failed:', err.message);
    }
}

function searchCity() {
    const city = searchInput.value.trim();
    if (!city) {
        searchInput.style.borderColor = '#ef4444';
        setTimeout(() => searchInput.style.borderColor = '', 1000);
        return;
    }
    localStorage.setItem('last-city', city);
    getWeather(`q=${encodeURIComponent(city)}`);
}

function useMyLocation() {
    if (!navigator.geolocation) {
        showError("Your browser doesn't support geolocation.");
        return;
    }
    geoBtn.style.animation = 'spin 1s linear infinite';
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            geoBtn.style.animation = '';
            const { latitude: lat, longitude: lon } = pos.coords;
            getWeather(`lat=${lat}&lon=${lon}`);
        },
        () => {
            geoBtn.style.animation = '';
            showError("Couldn't get your location. Please allow location access.");
        }
    );
}

// ─── UI UPDATES ──────────────────────────────────────────

function showWeather(data) {
    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');
    weatherContent.classList.remove('hidden');
    weatherContent.style.animation = 'fadeIn 0.4s ease';

    // update city and date
    cityName.textContent = `${data.name}, ${data.sys.country}`;
    currentDate.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long', month: 'short', day: 'numeric'
    });

    // update temperature and description
    mainTemp.textContent = Math.round(data.main.temp);
    weatherDesc.textContent = data.weather[0].description;

    // update weather icon with pop animation
    const iconCode = data.weather[0].icon;
    weatherIcon.style.transform = 'scale(0)';
    weatherIcon.style.transition = 'transform 0.3s ease';
    setTimeout(() => {
        weatherIcon.setAttribute('name', getWeatherIcon(iconCode));
        weatherIcon.style.transform = 'scale(1)';
    }, 150);

    // change background in dark mode
    const bg = getWeatherBackground(iconCode);
    if (bg) {
        document.body.style.transition = 'background 0.6s ease';
        document.body.style.background = bg;
    }

    // update metric cards
    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    // API gives m/s - converting to km/h
    wind.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
    pressure.textContent = `${data.main.pressure} hPa`;
}

function showForecast(data) {
    if (!forecastCards) return;
    forecastCards.innerHTML = '';
    // get one entry per day at noon
    const daily = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    daily.slice(0, 5).forEach((day, index) => {
        const date = new Date(day.dt * 1000).toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric'
        });
        const temp = Math.round(day.main.temp);
        const icon = getWeatherIcon(day.weather[0].icon);
        const desc = day.weather[0].description;
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.style.animation = `fadeIn 0.3s ease ${index * 0.08}s both`;
        card.innerHTML = `
            <p class="forecast-date">${date}</p>
            <ion-icon name="${icon}" class="forecast-icon"></ion-icon>
            <p class="forecast-temp">${temp}°C</p>
            <p class="forecast-desc">${desc}</p>
        `;
        forecastCards.appendChild(card);
    });
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
    errorState.style.animation = 'none';
    setTimeout(() => {
        errorState.style.animation = 'shake 0.4s ease';
    }, 10);
}

// ─── EVENT LISTENERS ─────────────────────────────────────

themeToggleBtn.addEventListener('click', toggleTheme);
searchBtn.addEventListener('click', searchCity);
geoBtn.addEventListener('click', useMyLocation);

// press Enter to search
searchInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') searchCity();
});

// button click animation
searchBtn.addEventListener('mousedown', () => {
    searchBtn.style.transform = 'scale(0.96)';
});
searchBtn.addEventListener('mouseup', () => {
    searchBtn.style.transform = 'scale(1)';
});

// save last searched city
searchBtn.addEventListener('click', () => {
    const city = searchInput.value.trim();
    if (city) localStorage.setItem('last-city', city);
});

// clear red border when typing
searchInput.addEventListener('input', () => {
    searchInput.style.borderColor = '';
});

// ─── STARTUP ─────────────────────────────────────────────

initTheme();

// load last searched city or default to London
const lastCity = localStorage.getItem('last-city') || 'London';
getWeather(`q=${lastCity}`);