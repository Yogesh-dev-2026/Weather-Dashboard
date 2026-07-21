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
    applyTheme(theme);
}

function toggleTheme() {
    const current = document.documentElement.getAttribute('data-theme');
    const next = current === 'dark' ? 'light' : 'dark';
    applyTheme(next)
    localStorage.setItem('weather-theme', next);
}

function applytheme(theme) {
        document.documentElement.setAttribute('data-theme', theme);
        // animate icon when switching
        themeIcon.style.transform = "rotate(360deg)";
        themeIcon.style.transition = "transform 0.4 s ease";
        setTimeout(() =>{
          themeIcon.setAttribute('name', theme === 'dark' ? 'sunny-outline' : 'moon-outline');
          themeIcon.style.transform = "rotate(0deg)";  
        }, 200);
}

initTheme();

// -- WEATHER ICONS -----------------------
 function getWeatherIcon(iconCode) {
    const code = iconCode.slice(0,2);
    const isDay = iconCode.endswith("d");

    const icons ={ 
        "01": isDay ? "sunny-outline" : "moon-outline",
        "02": isDay ? "partly-sunny-outline" : "cloudy-night-outline",
        "03": "cloud-outline",
        "04": "cloudy-outline", 
        "09": "rainy-outline",
        "10": isDay ? "rainy-outline" : "rainy-outline",
        "11": "thunderstorm-outline",
        "13": "snow-outline",
        "50": "water-outline", 
    };

    return icons[code] || "partly-sunny-outline";
 }

// map weather to background gradient 
 function getWeatherBackground(iconCode) {
    const code = iconCode.slice(0, 2);
    const isDay = iconCode.endswith("d");
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
        '13': 'linear-gradient(135deg, #1e293b 0%, #e2e8f0 100%)',
        '50': 'linear-gradient(135deg, #1e293b 0%, #64748b 100%)'
    };
    return backgrounds[code] || "linear-gradient(135deg, #0f172a 0%, #1e1b4b 100%)";
}


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
        const forecastQuery = query.startsWith("lat")
            ? query
            :"q=${encodeURIComponent(data.name)}";
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
        showforecastCards(data);
        } catch (err) {
            //forecast failing silently - not critical
            console.log("Forecart load failed:". err.message);
        }
}

function searchCity() {
    const city = searchInput.value.trim();
    if (!city) return;
    getWeather("q=${encodeURIComponent(city)}");
}

function useMyLocation() {
    if (!navigator.geolocation) {
        showError("Your browser doesn't support geolocation.");
        return;
    }
    geoBtn.style.transform = "scale(0.9)";
    setTimeout(() => geoBtn.style.Transform = "scale(1)", 200);
    navigator.geolocation.getCurrentPosition(
        (pos) => {
            const {latitude: lat, longitiude: lon } = pos.coords;
            getWeather ("lat=${lat}&lon=${lon}");
        },
        () => {
            showError("Couldn't get Your location. Please allow location access.");
        }
    );
}

// --- UI UPDATES ------------------

function showWeather(data) {
    loadingState.classList.add('hidden');
    errorState.classList.add('hidden');
    weatherContent.classList.remove('hidden');

    // fade in effect
    weatherContent.style.opacity = '0';
    setTimeout(() => {
        weatherContent.style.transition = 'opacity 0.4s ease';
        weatherContent.style.opacity = '1';
    }, 50);

    cityName.textContent = `${data.name}, ${data.sys.country}`;
    currentDate.textContent = new Date().toLocaleDateString('en-US', {
        weekday: 'long', month: 'short', day: 'numeric'
    });
    mainTemp.textContent = Math.round(data.main.temp);
    weatherDesc.textContent = data.weather[0].description;

    const iconCode = data.weather[0].icon;
    weatherIcon.setAttribute('name', getWeatherIcon(iconCode));

    // change background based on weather
    document.body.style.background = getWeatherBackground(iconCode);
    document.body.style.transition = 'background 0.6s ease';

    feelsLike.textContent = `${Math.round(data.main.feels_like)}°C`;
    humidity.textContent = `${data.main.humidity}%`;
    // API gives wind in m/s - converting to km/h
    wind.textContent = `${(data.wind.speed * 3.6).toFixed(1)} km/h`;
    pressure.textContent = `${data.main.pressure} hPa`;
}

function showForecast(data) {
    if (!forecastCards) return;
    forecastCards.innerHTML = '';
    // get one entry per day at midday
    const daily = data.list.filter(item => item.dt_txt.includes('12:00:00'));
    daily.slice(0, 5).forEach(day => {
        const date = new Date(day.dt * 1000).toLocaleDateString('en-US', {
            weekday: 'short', month: 'short', day: 'numeric'
        });
        const temp = Math.round(day.main.temp);
        const icon = getWeatherIcon(day.weather[0].icon);
        const desc = day.weather[0].description;
        const card = document.createElement('div');
        card.className = 'forecast-card';
        card.innerHTML = `
            <p class="forecast-date">${date}</p>
            <ion-icon name="${icon}" class="forecast-icon"></ion-icon>
            <p class="forecast-temp">${temp}°C</p>
            <p class="forecast-desc">${desc}</p>
        `;
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-4px)';
            card.style.transition = 'transform 0.2s ease';
        });
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
        });
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