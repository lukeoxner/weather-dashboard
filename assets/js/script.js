
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

            setUV();

            $("#name-date").text(cityName + "  (" + currentDate + ")");
            $("#current-temp").text(currentTemp);
            $("#current-humidity").text(currentHumidity);
            $("#current-wind").text(currentWind);
            $(".current-weather-image").attr("src", "http://openweathermap.org/img/wn/" + currentIcon + "@2x.png");

        })
    }

    function setUV() {
        var APIKey = "cd1360e64dac90fdead91678a4865808";
        var input = $(".searchBar").val();
        var queryURL = "http://api.openweathermap.org/data/2.5/uvi?lat=" + lat + "&lon=" + lon + "&appid=" + APIKey;

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

            var currentUV = response.value;
            
            $("#current-uv").text(currentUV);

            if (currentUV <= 2) {
                $("#current-uv").addClass("UVgreen");
            } else if (currentUV > 2 && currentUV <= 5) {
                $("#current-uv").addClass("UVyellow");
            } else if (currentUV > 5 && currentUV <= 7) {
                $("#current-uv").addClass("UVyellow");
            } else if (currentUV > 7 && currentUV <= 10) {
                $("#current-uv").addClass("UVred");
            } else {
                $("#current-uv").addClass("UVpurple");
            }


        });






    }

    function setForecast() {
        var APIKey = "cd1360e64dac90fdead91678a4865808";
        var input = $(".searchBar").val();
        var queryURL = "https://api.openweathermap.org/data/2.5/forecast?q=" + input + "&appid=" + APIKey;

        console.log("input: " + input);

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

            console.log(response);

            // var currentTempu = Math.floor(((response.main.temp)-273.15) * 1.80 + 32);
            // var currentHumidityu = response.main.humidity;

 

        });   
    }





    $(".searchBtn").on("click", function () {
        
        setCurrentWeather();
        setForecast();


    });














});     // ending of document.ready