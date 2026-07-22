# Vanilla JS Weather Dashboard 🌤️

I built this while trying to learn how APIs work using plain JavaScript.
No React, no libraries — just HTML, CSS and JS from scratch.
Honestly the hardest part was figuring out why the weather icons
weren't loading. Turned out I had the wrong base URL the whole time.
Once I fixed that everything clicked into place.

## Live Demo
🌐 [View Live](https://yogesh-weather.netlify.app)

## Screenshots
> Dark mode and light mode both supported

## What it does
- Search weather for any city in the world
- Shows temperature, feels like, humidity, wind speed and pressure
- 5 day forecast with daily breakdown
- One click to use your current location
- Dark and light mode toggle — saves your preference in localStorage
- Background colour changes based on current weather condition
- Remembers the last city you searched so it loads it next time
- Responsive — works on mobile screens too

## What I learned building this
- How to use async/await to fetch data from a real REST API
- Handling different API errors properly — 404 for city not found, 401 for bad key
- Using localStorage to save the theme and last searched city
- CSS variables make switching between dark and light mode way cleaner than I expected
- Geolocation API — had no idea browsers could do this before this project
- Wind speed from the API comes in m/s so I had to convert it to km/h
- Mapping OpenWeather icon codes to ionicons for a better looking UI
- How to stagger animations on forecast cards using CSS animation delay

## Tech used
- HTML
- CSS
- Vanilla JavaScript
- OpenWeather API
- Ionicons

## How to run it locally

1. Get a free API key from [openweathermap.org](https://openweathermap.org/api)

> Note: New API keys take up to 2 hours to activate after signup. If search shows an error right away — just wait a bit and try again.

2. Clone the repo:
```bash
git clone https://github.com/Yogesh-dev-2026/Weather-Dashboard.git
cd Weather-Dashboard
```

3. Open `script.js` and replace the placeholder with your key:
```javascript
const API_KEY = 'your_actual_key_here';
```

4. Open with Live Server in VS Code:
```
Right click index.html →
Open with Live Server
```

5. App loads London weather by default — start searching any city

> Important: Don't just double click index.html to open it. API calls won't work that way. You need Live Server or any local server running.

## Project structure
```
Weather-Dashboard/
├── index.html       — page layout and sections
├── style.css        — dark and light themes, animations
├── script.js        — API calls, search, theme toggle, forecast
└── README.md
```

## Known issues
- Very long city names overflow the display on small screens
- Forecast sometimes shows nothing if the API doesn't have a 12:00:00 entry for that day
- Background colour only changes in dark mode — kept light mode clean on purpose

## What I want to add next
- Celsius and Fahrenheit toggle
- Search history dropdown so you don't retype the same cities
- Animated weather background that reacts to rain or sun

## Author
Yogesh Madhukumar — still learning, building as I go 🚀

© 2026 Weather Dashboard. All rights reserved.