// Tutorial by http://youtube.com/CodeExplained
//select elements
const iconElement = document.querySelector(".weather-icon");
const tempElement = document.querySelector(".temprature-value p");
const descriptionElement = document.querySelector(".temprature-description p");
const notificationElement = document.querySelector(".notification");
const locationElement = document.querySelector(".location p");
const windElement = document.querySelector(".wind-speed");
const loader = document.querySelector(".loader-container");
const humidity = document.querySelector(".humidity");
const btn = document.querySelector(".btn");
const date = document.querySelector(".date");
let currentDate = new Date();
let day = currentDate.getDay();
let hour = currentDate.getHours();
let minutes = currentDate.getMinutes();
//hide the loader
window.addEventListener("load", () => {
  loader.classList.add("vanish");
});
//set the date
if (day === 1) {
  day = "monday";
} else if (day === 2) {
  day = "tuesday";
} else if (day === 3) {
  day = "wednesday";
} else if (day === 4) {
  day = "thursday";
} else if (day === 5) {
  day = "friday";
} else if (day === 6) {
  day = "saturday";
} else {
  day = "sunday";
}
if (minutes < 10) {
  minutes = "0" + minutes;
}
if (hour > 12) {
  date.innerHTML = `<p>${day} ${Math.abs(hour - 12)}:${minutes} AM</p>`;
} else {
  date.innerHTML = `<p>${day} ${hour}:${minutes} PM</p>`;
}
//app data
const weather = {};
weather.temperature = {
  unit: "celsius",
};
//app const and var
const kelvin = 273;
//api key
const apiKey = "f8bb4b3984a23fa21558713ecf6d9acf";
if ("geolocation" in navigator) {
  navigator.geolocation.getCurrentPosition(setposition, showError);
} else {
  notificationElement.style.display = "block";
  notificationElement.innerHTML =
    "<p>your browser doesn't support this feature</p>";
}
//set user position
function setposition(position) {
  let lat = position.coords.latitude;
  let long = position.coords.longitude;
  getWeather(long, lat);
}
//show error to user
function showError(err) {
  notificationElement.style.display = "block";
  notificationElement.innerHTML = `<p>${err.message}</p>`;
  setTimeout(() => {
    swal({
      title: "please open the GPS to make it work",
      icon: "warning",
    });
  }, 1000);
}
//send an api to the server to get weather data
function getWeather(long, lat) {
  const api_url = `https://api.openweathermap.org/data/2.5/onecall?lat=${lat}&lon=${long}&appid=${apiKey}`;
  fetch(api_url)
    .then((res) => {
      return res.json();
    })
    .then((data) => {
      console.log(data);
      weather.temperature.value = Math.round(data.current.temp - kelvin);
      weather.iconId = data.current.weather[0].icon;
      weather.tempDescription = data.current.weather[0].description;
      weather.location = data.timezone;
      weather.windSpeed = data.current.wind_speed;
      weather.humidity = data.current.humidity;
    })
    .then(displayWeather);
}
//display data to the user
function displayWeather() {
  iconElement.innerHTML = `<img src ="icons/${weather.iconId}.png"/>`;
  tempElement.innerHTML = `<p>${weather.temperature.value}° <span>c<span>`;
  descriptionElement.innerText = weather.tempDescription;
  locationElement.innerText = weather.location;
  windElement.innerHTML = `<p> wind speed: ${weather.windSpeed} <span class="speed">km/h<span>`;
  humidity.innerHTML = `<p>humidity: <span>${weather.humidity}%</span></p>`;
}
//convert celsius to fahrenheit
function converToFahrenheit(temp) {
  return (temp * 9) / 5 + 32;
}
//handle the click of the user
tempElement.addEventListener("click", () => {
  if (weather.temperature.value === undefined) return;
  if (weather.temperature.unit === "celsius") {
    let fahrenheit = Math.round(converToFahrenheit(weather.temperature.value));
    tempElement.innerHTML = `<p>${fahrenheit}° <span>f<span>`;
    weather.temperature.unit = "fahrenheit";
  } else {
    tempElement.innerHTML = `<p>${weather.temperature.value}° <span>c<span>`;
    weather.temperature.unit = "celsius";
  }
});
btn.addEventListener("click", () => {
  humidity.classList.toggle("show");
  if (btn.innerHTML == "read more") {
    btn.innerHTML = "read less";
  } else {
    btn.innerHTML = "read more";
  }
});
