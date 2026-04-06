const apiKey = "6b2a8ed792083ac4eeffb531cd604100";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {

    try {
        // Get coordinates for ANY place
        let geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
        let geoData = await geoRes.json();

        if (geoData.length === 0) {
            geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city},IN&limit=1&appid=${apiKey}`);
            geoData = await geoRes.json();
        }

        if (geoData.length === 0) {
            document.querySelector(".error").style.display = "block";
            document.querySelector(".weather").style.display = "none";
            return;
        }

        const lat = geoData[0].lat;
        const lon = geoData[0].lon;

        const response = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );

        const data = await response.json();

        document.querySelector(".city").innerHTML = data.name;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        const condition = data.weather[0].main;

        if (condition == "Clouds") weatherIcon.src = "clouds.png";
        else if (condition == "Clear") weatherIcon.src = "clear.png";
        else if (condition == "Rain") weatherIcon.src = "rain.png";
        else if (condition == "Drizzle") weatherIcon.src = "drizzle.png";
        else if (condition == "Mist") weatherIcon.src = "mist.png";
        else if (condition == "Snow") weatherIcon.src = "snow.png";

        document.querySelector(".weather").style.display = "block";
        document.querySelector(".error").style.display = "none";

    } catch (error) {
        document.querySelector(".error").style.display = "block";
        document.querySelector(".weather").style.display = "none";
    }
}

searchBtn.addEventListener("click", () => {
    checkWeather(searchBox.value);
});

searchBox.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        checkWeather(searchBox.value);
    }
});
