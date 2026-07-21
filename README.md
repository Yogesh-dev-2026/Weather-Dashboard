Vanilla JS Weather Dashboard 🌤️

Built this to practice working with real APIs using plain JavaScript —
no React, no frameworks, just HTML CSS and JS from scratch.
Took me longer than expected to figure out why the weather icons
weren't loading (wrong base URL the whole time).

Live Demo

🌐 View Live

What it does


Search weather for any city in the world
Shows temperature, feels like, humidity, wind speed and pressure
5 day forecast with daily breakdown
Use your current location with one click
Dark and light mode toggle — remembers your preference
Background changes colour based on weather condition
Remembers last city you searched
Works on mobile too


What I learned building this


Fetching data from a REST API using async/await
Handling API error codes — 404 city not found, 401 bad key
Using localStorage to save theme and last searched city
CSS variables make dark/light mode much easier than I expected
Geolocation API — didn't know browsers could do this before
Converting wind speed from m/s to km/h (API gives m/s)
Mapping API icon codes to ionicons for a cleaner look
Ionicons for interactive weather icons instead of plain images


Tech used


HTML
CSS
Vanilla JavaScript
OpenWeather API
Ionicons


How to run locally


Get a free API key from openweathermap.org
Clone the repo:


bashgit clone https://github.com/Yogesh-dev-2026/Weather-Dashboard.git
cd Weather-Dashboard


Open script.js and replace YOUR_OPENWEATHER_API_KEY_HERE with your key:


javascriptconst API_KEY = 'your_actual_key_here';


Open with Live Server in VS Code — right click index.html → Open with Live Server
That's it — app loads London weather by default



Note: Opening index.html directly as a file won't work — you need Live Server or any local server because of API calls.



Project structure

Weather-Dashboard/
├── index.html      — page structure and layout
├── style.css       — dark/light themes and animations
├── script.js       — API calls, search, theme toggle
└── README.md

Known issues


New OpenWeather API keys take up to 2 hours to activate after signup
Very long city names overflow the display on small screens
Forecast shows nothing if no 12:00:00 entry exists for that day


What I want to add next


Temperature toggle between Celsius and Fahrenheit
Search history dropdown
Animated weather backgrounds


Author

Yogesh Madhukumar — still learning, building as I go 🚀

© 2026 Weather Dashboard. All rights reserved.