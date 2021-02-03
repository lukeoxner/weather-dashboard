
var lat;
var lon;
var currentDate = moment().format("l");
console.log(currentDate);



$(document).ready(function () {

    
    function setCurrentWeather() {
        var APIKey = "cd1360e64dac90fdead91678a4865808";
        var input = $(".searchBar").val();
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&appid=" + APIKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

            // console.log(response);

            var cityName = response.name;
            var currentTemp = Math.floor(((response.main.temp)-273.15) * 1.80 + 32);
            var currentHumidity = response.main.humidity;
            var currentWind = response.wind.speed;
            var currentIcon = response.weather[0].icon;
            lat = response.coord.lat;
            lon = response.coord.lon;

            oneCall();

            $("#name-date").text(cityName + "  (" + currentDate + ")");
            $("#current-temp").text(currentTemp);
            $("#current-humidity").text(currentHumidity);
            $("#current-wind").text(currentWind);
            $(".current-weather-image").attr("src", "https://openweathermap.org/img/wn/" + currentIcon + "@2x.png");

        })
    }

    function oneCall() {
        var exclude = "miuntely,hourly,alerts";
        var APIKey = "cd1360e64dac90fdead91678a4865808";
        var input = $(".searchBar").val();
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
            console.log(results);
            
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


                console.log(humidity);
            }


        });






    }

    // function setForecast() {
    //     var APIKey = "cd1360e64dac90fdead91678a4865808";
    //     var input = $(".searchBar").val();
    //     var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + input + "&appid=" + APIKey;

    //     console.log("input: " + input);

    //     $.ajax({
    //         url: queryURL,
    //         method: "GET"
    //     }).then(function(response) {

    //         console.log(response);

    //         // var temp = Math.floor(((response.main.temp)-273.15) * 1.80 + 32);
    //         // var humidity = response.main.humidity;

 

    //     });   
    // }





    $(".searchBtn").on("click", function () {
        
        setCurrentWeather();


    });














});     // ending of document.ready