// declaring variables in global memory
var searchHistory = [];
var lastCity;
var lat;
var lon;
var currentDate = moment().format("l");
var input;


// ensuring document is fully rendered before running javascript
$(document).ready(function () {

    // declare function used to set the current weather
    function setCurrentWeather() {
        var APIKey = "cd1360e64dac90fdead91678a4865808";
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&appid=" + APIKey;

        // using ajax call to get data from the API
        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

            // declaring local variables and getting their values from the API data
            var cityName = response.name;
            var currentTemp = Math.floor(((response.main.temp)-273.15) * 1.80 + 32);
            var currentHumidity = response.main.humidity;
            var currentWind = response.wind.speed;
            var currentIcon = response.weather[0].icon;
            lat = response.coord.lat;
            lon = response.coord.lon;

            // execute oneCall function to set UV index and 5-day forecasts
            oneCall();

            // change the HTML elements to reflect the current weather values
            $("#name-date").text(cityName + "  (" + currentDate + ")");
            $("#current-temp").text(currentTemp);
            $("#current-humidity").text(currentHumidity);
            $("#current-wind").text(currentWind);
            $(".current-weather-image").attr("src", "https://openweathermap.org/img/wn/" + currentIcon + "@2x.png");

        })
    }

    // declaring oneCall function used for setting current UV index and the 5 day forecast
    function oneCall() {
        var exclude = "miuntely,hourly,alerts";
        var APIKey = "cd1360e64dac90fdead91678a4865808";
        var queryURL = "https://api.openweathermap.org/data/2.5/onecall?lat=" + lat + "&lon=" + lon + "&exclude=" + exclude + "&appid=" + APIKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

            var currentUV = response.current.uvi;
            
            $("#current-uv").text(currentUV);

            if (currentUV <= 3) {
                $("#current-uv").removeClass("UVyellow");
                $("#current-uv").removeClass("UVred");
                $("#current-uv").addClass("UVgreen");
            } else if (currentUV > 3 && currentUV <= 6) {
                $("#current-uv").removeClass("UVgreen");
                $("#current-uv").removeClass("UVred");
                $("#current-uv").addClass("UVyellow");
            } else {
                $("#current-uv").removeClass("UVgreen");
                $("#current-uv").removeClass("UVyellow");
                $("#current-uv").addClass("UVred");
            }

            var results = response.daily;

            $(".5-day-forecast").empty();
            
            for (var i = 1; i < 6; i++) {

                var temp = Math.floor(((results[i].temp.day)-273.15) * 1.80 + 32);
                var humidity = results[i].humidity;
                var icon = results[i].weather[0].icon;
                
                var unixDate = ((results[i].dt) * 1000);
                var dateObject = new Date(unixDate);
                var formattedDate = (dateObject.toLocaleString()).split(",");             


                $(".5-day-forecast").append(`
                <div class="card m-2 p-1" style="width: 9rem;">
                    <img src="https://openweathermap.org/img/wn/${icon}@2x.png" class="card-img-top" alt="weather icon">
                    <div class="card-body">
                    <h5>${formattedDate[0]}</h5>
                    <br>
                    <p>Temp: ${temp} *F</p>
                    <p>Humidity: ${humidity}%</p>
                    </div>
                </div>
                `);

            }

        });

    }

    function setSearchHistory() {
        $(".search-history").prepend(`
            <button class="historyItem" data-city="${city}">${city}</button>
        `)
    }



    $(".searchBtn").on("click", function () {
        
        input = $(".searchBar").val();

        setCurrentWeather();

        city = $(".searchBar").val();
        searchHistory.unshift({city});
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        $(".searchBar").val("");
        
        setSearchHistory(city);

    });




    $(".search-history").on("click", function (event) {

        input = event.target.getAttribute("data-city");

        setCurrentWeather();

    })









});     // ending of document.ready