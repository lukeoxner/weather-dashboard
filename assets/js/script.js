






$(document).ready(function () {

    $(".searchBtn").on("click", function () {
        var APIKey = "cd1360e64dac90fdead91678a4865808";
        var input = $(".searchBar").val();
        var queryURL = "https://api.openweathermap.org/data/2.5/weather?q=" + input + "&appid=" + APIKey;

        console.log("input: " + input);

        $.ajax({
            url: queryURL,
            method: "GET"
        }).then(function(response) {

            console.log(response);









        })





    })














});     // ending of document.ready