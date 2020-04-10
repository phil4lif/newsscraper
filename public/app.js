// var axios = require("axios");
$(document).ready(function(){
$('.modal').modal();

$(".modal-trigger").on("click", function () {
    console.log($(this).attr("data-id"))
    $("#mod").text($(this).attr("data-id"))
    $(".add-note").attr("data-id", $(this).attr("data-id"))
})

$("#scrape").on("click", function () {
    // console.log("scraping for new articles")
    $.ajax({
        method: "GET",
        url: "/scrape"
    }).then(function(data){
        console.log("scraped /n/n" + data)
    })
})

$(".add-note").on("click", function () {
    console.log("add-note")
    console.log($(this).attr("data-id"));
    // axios.post("/articles/:id", {
    var thisId = $(this).attr("data-id");
    // })
    var queryURL = "/articles/" + thisId;
    console.log(thisId)
    $.ajax({
        method: "POST",
        url: queryURL,
        data: {
            title: $("#titleinput").val(),
            body: $("#bodyinput").val()
        }
    }).then(function(data){
        console.log(data);
    })
})

});
