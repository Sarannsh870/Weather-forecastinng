document.addEventListener('DOMContentLoaded', function() {
    const searchBtn = document.getElementById('search-btn');
    const locationInput = document.getElementById('location');
    const weatherDisplay = document.getElementById('weather-display');
    const apiKey = 'b65b0d0d97682a5d10115a2d76766096';
    
    searchBtn.addEventListener('click', getWeather);
    locationInput.addEventListener('keypress', function(e) {
        if (e.key === 'Enter') {
            getWeather();
        }
    });
    
    function getWeather() {
        const location = locationInput.value.trim();
        if (!location) {
            alert('Please enter a location');
            return;
        }
        
        // Get selected options
        const selectedOptions = [];
        document.querySelectorAll('input[name="weather-option"]:checked').forEach(option => {
            selectedOptions.push(option.value);
        });
        
        if (selectedOptions.length === 0) {
            alert('Please select at least one weather option');
            return;
        }
        
        // Show loading message
        weatherDisplay.innerHTML = '<p>Loading weather data...</p>';
        
        // Fetch weather data
        fetch(`https://api.openweathermap.org/data/2.5/weather?q=${location}&appid=${apiKey}&units=metric`)
            .then(response => {
                if (!response.ok) {
                    throw new Error('Location not found');
                }
                return response.json();
            })
            .then(data => {
                displayWeather(data, selectedOptions);
            })
            .catch(error => {
                weatherDisplay.innerHTML = `<p class="error">Error: ${error.message}</p>`;
            });
    }
    
    function displayWeather(data, selectedOptions) {
        let html = `<h2>Weather in ${data.name}, ${data.sys.country}</h2>`;
        
        selectedOptions.forEach(option => {
            switch(option) {
                case 'temp':
                    html += `<div class="weather-item">Temperature: ${data.main.temp}°C</div>`;
                    break;
                case 'feels_like':
                    html += `<div class="weather-item">Feels Like: ${data.main.feels_like}°C</div>`;
                    break;
                case 'humidity':
                    html += `<div class="weather-item">Humidity: ${data.main.humidity}%</div>`;
                    break;
                case 'pressure':
                    html += `<div class="weather-item">Pressure: ${data.main.pressure} hPa</div>`;
                    break;
                case 'wind':
                    html += `<div class="weather-item">Wind Speed: ${data.wind.speed} m/s</div>`;
                    break;
                case 'description':
                    const description = data.weather[0].description;
                    html += `<div class="weather-item">Weather: ${description.charAt(0).toUpperCase() + description.slice(1)}</div>`;
                    break;
            }
        });
        
        weatherDisplay.innerHTML = html;
    }
});