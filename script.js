const apiKey = "6b2a8ed792083ac4eeffb531cd604100";
const apiUrl = "https://api.openweathermap.org/data/2.5/weather?units=metric&q=";

const searchBox = document.querySelector(".search input");
const searchBtn = document.querySelector(".search button");
const weatherIcon = document.querySelector(".weather-icon");

async function checkWeather(city) {

    try {
        // Try multiple search formats
        let geoData = [];

        // 1️⃣ Direct search
        let geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city}&limit=1&appid=${apiKey}`);
        geoData = await geoRes.json();

        // 2️⃣ If not found, try with India (helps for places like Kodagu, Kashmir)
        if (geoData.length === 0) {
            geoRes = await fetch(`https://api.openweathermap.org/geo/1.0/direct?q=${city},IN&limit=1&appid=${apiKey}`);
            geoData = await geoRes.json();
        }

        // 3️⃣ If still not found → show error
        if (geoData.length === 0) {
            document.querySelector(".error").style.display = "block";
            document.querySelector(".weather").style.display = "none";
            return;
        }

        const { lat, lon, name, country } = geoData[0];

        // Fetch weather
        const weatherRes = await fetch(
            `https://api.openweathermap.org/data/2.5/weather?lat=${lat}&lon=${lon}&units=metric&appid=${apiKey}`
        );

        const data = await weatherRes.json();

        // UI update
        document.querySelector(".city").innerHTML = `${name}, ${country}`;
        document.querySelector(".temp").innerHTML = Math.round(data.main.temp) + "°C";
        document.querySelector(".humidity").innerHTML = data.main.humidity + "%";
        document.querySelector(".wind").innerHTML = data.wind.speed + " km/h";

        const condition = data.weather[0].main;

        // Icon
        if (condition == "Clouds") weatherIcon.src = "clouds.png";
        else if (condition == "Clear") weatherIcon.src = "clear.png";
        else if (condition == "Rain") weatherIcon.src = "rain.png";
        else if (condition == "Drizzle") weatherIcon.src = "drizzle.png";
        else if (condition == "Mist") weatherIcon.src = "mist.png";
        else if (condition == "Snow") weatherIcon.src = "snow.png";

        // Background change
        changeBackground(condition);

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

/* FIX: Enter key support (mobile friendly) */
searchBox.addEventListener("keypress", function(e) {
    if (e.key === "Enter") {
        checkWeather(searchBox.value);
    }
});
