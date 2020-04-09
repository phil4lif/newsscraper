var express = require("express");
var logger = require("morgan");
var mongoose = require("mongoose");

var axios = require("axios");
var cheerio = require("cheerio");


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

var apiRoutes = require("./routes/api-routes")
apiRoutes(app)
app.listen(PORT, function() {
    console.log("App running on port " + PORT);
});