var userFormEl = document.querySelector("#user-form");
var cityInputEl = document.querySelector("#cityname");
// var cityContainterEL = document.querySelector("#city-container");
// var headerDataEL = document.querySelector("#subtitle");
var rightSideEl = document.querySelector("#right-container");
var citySearchTerm = document.querySelector("#city-search-term");

var city = "";
var state = "";
var country = "";

var formSubmitHandler = function (event) {
   event.preventDefault(); // To disable <button> "submit/refresh page" behaviour
   // get value from input element
   var userCity = cityInputEl.value.trim().split(",");
   city = userCity[0].trim();
   state = userCity[1].trim();
   country = userCity[2].trim();

   // if city name matches city in Repo then run our function to
   // retrieve the data
   if (userCity) {
      console.log(city, state, country);
      getCityData(city, state, country);
      // Then, run this code to clear the form and remove the <input> element's value.
      cityInputEl.value = "";
   } else {
      window.alert("Please enter a City Name");
   }
};

var displayWeatherDOM = function (weatherForecast) {
   // cityContainterEL.textContent = "";
   // citySearchTerm.textContent =

   var topCardEl = document.createElement("div");
   topCardEl.classList = "card col-12";
   topCardEl.id = "big-card";

   var todaysData = document.createElement("div");
   todaysData.classList = "card-header col-12";

   var tempRow = document.createElement("div");
   tempRow.classList = "flex-row";

   // <h2 class="card-header subtitle" id="subtitle"><span id="city-search-term"></span></h2>;
   var cityAndDate = document.createElement("h2");
   cityAndDate.classList = "flex-col col-12 col-md-5";
   cityAndDate.textContent = weatherForecast[0].city + " " + moment(weatherForecast[0].date).format("l") + " ";

   var imgEl = document.createElement("img");
   imgEl.classList = "flex-col col-12 col-md-2";
   imgEl.src = "https://openweathermap.org/img/wn/" + weatherForecast[0].icon + ".png";

   console.log(cityAndDate);
   var weatherInfo = document.createElement("ul");
   weatherInfo.classList = "col-12 list-group";

   var liTempEl = document.createElement("li");
   liTempEl.textContent = "Temp: " + weatherForecast[0].temp + " °F";
   weatherInfo.appendChild(liTempEl);

   var liWindEl = document.createElement("li");
   liWindEl.textContent = "Wind: " + weatherForecast[0].windSpeed + " MPH";
   weatherInfo.appendChild(liWindEl);

   var liHumidEl = document.createElement("li");
   liHumidEl.textContent = "Humidity: " + weatherForecast[0].humidity + " %";
   weatherInfo.appendChild(liHumidEl);

   var uvIndexEl = document.createElement("li");
   uvIndexEl.textContent = "UV Index: " + weatherForecast[0].uvIndex;
   uvIndexEl.classList = weatherForecast[0].uvColor;
   weatherInfo.appendChild(uvIndexEl);
   // todaysData.setAttribute(weatherForecast);

   tempRow.appendChild(cityAndDate);
   tempRow.appendChild(imgEl);
   todaysData.appendChild(tempRow);
   topCardEl.appendChild(todaysData);
   topCardEl.appendChild(weatherInfo);
   rightSideEl.appendChild(topCardEl);

   // for (var i = 1; i < weatherForecast.length; i++) {
   //    var todaysData = document.createElement("div");
   //    todaysData.classList = "col-12 col-md-9";

   //    // <h2 class="card-header subtitle" id="subtitle"><span id="city-search-term"></span></h2>;
   //    var cityName = document.createElement("h2");

   //    var imgEl = document.createElement("img");
   //    cityName.id = "city-container";
   //    cityName.textContent = weatherForecast[i].city + " " + moment(weatherForecast[i].date).format("l") + " ";
   //    console.log(weatherForecast[i].icon);
   //    imgEl.src = "https://openweathermap.org/img/wn/" + weatherForecast[i].icon + ".png";

   //    console.log(cityName);
   //    // todaysData.setAttribute(weatherForecast);

   //    todaysData.appendChild(cityName);
   //    todaysData.appendChild(imgEl);
   //    headerDataEL.appendChild(imgEl);
   //    cityContainterEL.appendChild(todaysData);
   // }
};

var getOneDayData = function (groupData, index) {
   // console.log(groupData, index);
   const CURRENT_DAY = 0;
   const MODERATE = 3.0;
   const HIGH = 6.0;
   const VERY_HIGH = 8.0;
   const EXTREME = 11.0;

   var weatherData = {
      city: city,
      state: state,
      country: country,
      date: "",
      icon: "",
      temp: "",
      humidity: "",
      windSpeed: "",
      uvIndex: "",
      uvColor: "",
      description: "",
   };
   if (index === CURRENT_DAY) {
      weatherData.date = new Date(groupData.dt * 1000);
      weatherData.icon = groupData.weather[0].icon;
      weatherData.temp = groupData.temp;
      weatherData.humidity = groupData.humidity;
      weatherData.windSpeed = groupData.wind_speed;
      weatherData.uvIndex = parseFloat(groupData.uvi);
      weatherData.description = groupData.weather[0].description;
   } else {
      weatherData.date = new Date(groupData[index].dt * 1000);
      weatherData.icon = groupData[index].weather[0].icon;
      weatherData.temp = groupData[index].temp;
      weatherData.humidity = groupData[index].humidity;
      weatherData.windSpeed = groupData[index].wind_speed;
      weatherData.uvIndex = parseFloat(groupData[index].uvi);
      weatherData.description = groupData[index].weather[0].description;
   }
   if (weatherData.uvIndex < MODERATE) {
      weatherData.uvColor = "green";
   } else if (weatherData.uvIndex < HIGH) {
      weatherData.uvColor = "orange";
   } else if (weatherData.uvIndex < VERY_HIGH) {
      weatherData.uvColor = "red";
   } else if (weatherData.uvIndex < EXTREME) {
      weatherData.uvColor = "purple";
   }
   return weatherData;
};

var getCityData = function (city, state, country) {
   var apiCity =
      "https://api.openweathermap.org/data/2.5/weather?q=" +
      city +
      "," +
      state +
      "," +
      country +
      "&units=imperial&appid=58f880309006154d3fa9ee5e7617aa87";
   // Make a request to the url
   fetch(apiCity)
      .then(function (response) {
         console.log(city);
         if (response.ok) {
            response.json().then(function (data) {
               console.log(data);
               latitude = data.coord.lat;
               longitude = data.coord.lon;
               // displayWeather(data, city);
               getWeatherData(latitude, longitude);
            });
         } else {
            throw new Error(response.statusText); //
         }
      })
      .catch(function (error) {
         // '.catch()' method is being chained onto the end
         // to verify connection to API
         window.alert("OpenWeather Server Is Not Responding: ", error);
      });
};

// function to retrive
var getWeatherData = function (latitude, longitude) {
   var apiOneCall =
      "https://api.openweathermap.org/data/2.5/onecall?lat=" +
      latitude +
      "&lon=" +
      longitude +
      "&exclude=minutely,hourly,alerts&units=imperial&appid=58f880309006154d3fa9ee5e7617aa87";

   fetch(apiOneCall)
      .then(function (response) {
         if (response.ok) {
            // console.log(response);
            response.json().then(function (data) {
               console.log("OneCall Data: ", data);
               var weatherForecast = [];
               // Loop to push 5 day forecast to our object array
               const CURRENT_DAY = 0;
               const FORECAST_DAYS = 6;
               weatherForecast.push(getOneDayData(data.current, CURRENT_DAY));
               for (var forecastDay = 1; forecastDay < FORECAST_DAYS; forecastDay++) {
                  weatherForecast.push(getOneDayData(data.daily, forecastDay));
               }
               console.log("Weather Forecast: ", weatherForecast);
               displayWeatherDOM(weatherForecast);
            });
         } else {
            throw new Error(response.statusText); //
         }
      })
      .catch(function (error) {
         window.alert("OpenWeather Server Is Not Responding: ", error);
      });
};

userFormEl.addEventListener("submit", formSubmitHandler);
