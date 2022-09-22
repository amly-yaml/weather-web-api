// declare the variable
const searchCity = $("#search-city");
const searchButton = $("#search-button");
const message = $(".msg");

const weatherList = $(".cities");
const showingOnecity = $(".one-city");

// delcare the list array keeping the city of name
const weatherDataList = [];

// declare apikey and unit
const apiKey = "API_KEY";
// const unit = "metric"; // C
const unit = "imperial"; // F

// click the search button and display informations
searchButton.on("click", displayWeatherInformation);

// display all the weather informations
function displayWeatherInformation(event) {
  // console.log(event);
  event.preventDefault();
  if (searchCity.val() === "") {
    message.text("You must enter a city name. 😃");
  } else {
    // console.log("Click search button.");
    // city = searchCity.val();
    getWeatherData(searchCity.val());
    searchCity.val("");
  }
}

// display the next 3 days weather condition
function addCityList(searchid) {
  const weatherUrl =
    "https://api.openweathermap.org/data/2.5/forecast?id=" +
    searchid +
    "&units=" +
    unit +
    "&appid=" +
    apiKey +
    "";

  $.ajax({
    url: weatherUrl,
    method: "GET",
  }).then(function (response) {
    for (var i = 0; i < 3; i++) {
      const iconurl =
        "http://openweathermap.org/img/wn/" +
        response.list[(i + 1) * 8 - 1].weather[0].icon +
        "@2x.png";
      const showDate = new Date(
        response.list[(i + 1) * 8 - 1].dt * 1000
      ).toDateString();

      const listBody = $("<li>").attr("class", "city" + i);
      weatherList.append(listBody);

      const date = $("<p>").attr("class", "currentDate").text(showDate);
      listBody.append(date);

      const cityTitle = $("<h4>").attr("class", "city-title");
      listBody.append(cityTitle);
      const cityPlace = $("<span>")
        .attr("class", "city-place")
        .html(response.city.name);
      const city_Name = $("<sup>")
        .attr("class", "cityname")
        .html(response.city.country);
      cityTitle.append(cityPlace).append(city_Name);

      const cityTemp = $("<span>")
        .attr("class", "city-temp")
        .html(response.list[(i + 1) * 8 - 1].main.temp);
      listBody.append(cityTemp);

      const showUnit = $("<sup>").text("°F");
      cityTemp.append(showUnit);

      const figure = $("<figure>");
      const cityIcon = $("<img>")
        .attr("class", "city-icon")
        .attr("src", iconurl);
      const cityWeather = $("<figcaption>")
        .attr("class", "weather-description")
        .html(response.list[(i + 1) * 8 - 1].weather[0].description);
      listBody.append(figure);
      figure.append(cityIcon).append(cityWeather);

      $(".current-day").text("Today");
      message.html("");
    }
  });
}

// display today/current weather condition
function getCurrentWetherInformation(searchCity) {
  const weatherUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    searchCity +
    "&units=" +
    unit +
    "&appid=" +
    apiKey +
    "";

  $.ajax({
    url: weatherUrl,
    method: "GET",
  }).then(function (weatherInformation) {
    const weather = {
      cityname: weatherInformation.name,
      shortname: weatherInformation.sys.country,
      weatherTemp: weatherInformation.main.temp,
      /* you will fetch the weather icon and its size using the icon data*/
      weatherIcon: `http://openweathermap.org/img/wn/${weatherInformation.weather[0].icon}@2x.png`,
      weatherDescription: weatherInformation.weather[0].description,
    };
    const today = new Date().toDateString();

    const listBody = $("<li>").attr("class", "city");
    showingOnecity.append(listBody);

    const date = $("<p>").attr("class", "currentDate").text(today);
    listBody.append(date);

    const cityTitle = $("<h4>").attr("class", "city-title");
    listBody.append(cityTitle);
    const cityPlace = $("<span>")
      .attr("class", "city-place")
      .html(weather.cityname);
    const city_Name = $("<sup>")
      .attr("class", "cityname")
      .html(weather.shortname);
    cityTitle.append(cityPlace).append(city_Name);

    const cityTemp = $("<span>")
      .attr("class", "city-temp")
      .html(weather.weatherTemp);
    listBody.append(cityTemp);

    const showUnit = $("<sup>").text("°F");
    cityTemp.append(showUnit);

    const figure = $("<figure>");
    const cityIcon = $("<img>")
      .attr("class", "city-icon")
      .attr("src", weather.weatherIcon);
    const cityWeather = $("<figcaption>")
      .attr("class", "weather-description")
      .html(weather.weatherDescription);
    listBody.append(figure);
    figure.append(cityIcon).append(cityWeather);
    $(".next-date").text("Next 3 Days Forecast");
    message.html("");
  });
}

// checking the duplicate city or not in the weather list
function getWeatherData(inputCity) {
  const weatherUrl =
    "https://api.openweathermap.org/data/2.5/weather?q=" +
    inputCity +
    "&units=" +
    unit +
    "&appid=" +
    apiKey +
    "";

  $.ajax({
    url: weatherUrl,
    method: "GET",
  })
    .then(function (weatherData) {
      if (weatherDataList.length === 0) {
        weatherDataList.push(inputCity);
        getCurrentWetherInformation(inputCity);
        addCityList(weatherData.id);
      } else {
        if (weatherDataList.indexOf(inputCity) === -1) {
          weatherDataList.push(inputCity);
          getCurrentWetherInformation(inputCity);
          addCityList(weatherData.id);
        } else {
          message.text(
            inputCity.toUpperCase() +
              " city had already searched on the dashboard. 😃"
          );
        }
      }
    })
    .fail(() => {
      message.text("That city name doesn't Exist!! 😃");
    });
}
