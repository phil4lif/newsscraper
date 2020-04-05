var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");

var db = require("./models");

var PORT = 3000;

var app = express();

app.use(logger("dev"));

app.use(express.urlencoded({ extended: true}));
app.use(express.json());

app.use(express.static("public"));


mongoose.connect("mongodb://localhost/newsscraper", { useNewUrlParser: true });

app.get("/", function(req, res) {
    res.send("Hello")
});

app.get("/scrape", function(req, res){
    axios.get("https://www.npr.org/sections/news/")
    .then(function(response) {
        console.log(response)
        var $ = cheerio.load(response.data);
        $("article h2").each(function(i, element) {
            var result = {};

            result.title = $(this)
            .children("a")
            .text();
            result.link = $(this)
            .children("a")
            .attr("href");

            db.Article.create(result)
            .then(function(dbArticle) {
                console.log(dbArticle);
            })
            .catch(function(err) {
                console.log(err);
            });
        });
        res.send("Scrape Complete")
    })
})



app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});