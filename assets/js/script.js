// declaring variables in global memory
var searchHistory = [];
var lastCity;
var lat;
var lon;
var currentDate = moment().format("l");
var input;


// ensuring document is fully rendered before running javascript
$(document).ready(function () {

    var searches = JSON.parse(localStorage.getItem('searchHistory') || '[]');

    if (searches[0] !== undefined) {
        
        lastCity = searches[0].city;

        console.log(lastCity); 

        input = lastCity;

        setCurrentWeather();
    }

    console.log(searches);

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

            // declaring currentUV variable and assigning value from API data
            var currentUV = response.current.uvi;
            $("#current-uv").text(currentUV);

            // use if-else statements to color the UV index area based on UV severity
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

            // clear existing 5-day forecast if the user has already done a different city
            $(".5-day-forecast").empty();
            
            // use for loop to set up each day of the 5 day forecast
            for (var i = 1; i < 6; i++) {

                var temp = Math.floor(((results[i].temp.day)-273.15) * 1.80 + 32);
                var humidity = results[i].humidity;
                var icon = results[i].weather[0].icon;
                // convert unix date from API into a more useful format
                var unixDate = ((results[i].dt) * 1000);
                var dateObject = new Date(unixDate);
                var formattedDate = (dateObject.toLocaleString()).split(",");             

                // append the new forecast card into the 5 day forecast element
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

    // declaring function to add button for the previously searched city
    function setSearchHistory() {
        $(".search-history").prepend(`
            <button class="historyItem" data-city="${city}">${city}</button>
        `)
    }

    // set up event listener for the search button
    $(".searchBtn").on("click", function () {
        
        input = $(".searchBar").val();

        setCurrentWeather();

        city = $(".searchBar").val();
        searchHistory.unshift({city});
        localStorage.setItem("searchHistory", JSON.stringify(searchHistory));
        $(".searchBar").val("");
        
        setSearchHistory(city);

    });



    // set up event listener to enable the user to click on their previously searched cities
    $(".search-history").on("click", function (event) {

        input = event.target.getAttribute("data-city");

        setCurrentWeather();

    })

});     // ending of document.ready function