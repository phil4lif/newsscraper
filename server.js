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

var exphbs = require("express-handlebars");

app.engine("handlebars", exphbs({ defaultLayout: "main" }));
app.set("view engine", "handlebars");

mongoose.connect("mongodb://localhost/newsscraper", { useNewUrlParser: true });

app.get("/", function(req, res) {
    db.Article.find({}).then(function(dbArticle){
        var hbsObject = {
            articles: dbArticle
        };
        console.log(hbsObject);
        res.render("index", hbsObject)
    })
    
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
    })
})

app.get("/articles", function(req, res) {
    // Grab every document in the Articles collection
    db.Article.find({})
      .then(function(dbArticle) {
        // If we were able to successfully find Articles, send them back to the client
        res.json(dbArticle);
      })
      .catch(function(err) {
        // If an error occurred, send it to the client
        res.json(err);
      });
  });

app.get("/articles/:id", function(req, res) {
    db.Article.findOne({ _id: req.params.id})
    .populate("note")
    .then(function(dbArticle){
        res.json(dbArticle);
    })
    .catch(function(err){
        res.json(err)
    })
})

app.post("/articles/:id", function(req, res) {
    db.Note.create(req.body)
    .then(function(dbNote){
      return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: {note:dbNote._id }}, { new:true });
    }).then(function(dbArticle) {
      res.json(dbArticle);
    })
    .catch(function(err){
      res.json(err);
    })
  });


app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});