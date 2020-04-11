var db = require("../models");
var axios = require("axios");
var cheerio = require("cheerio");

function apiRoutes(app) {
    app.get("/scrape", function (req, res) {
        db.Article.find({}).then(function (dbArticle) {
            var articlesArr = []
            for (var i = 0; i < 10; i++) {
                articlesArr.push({
                    title: dbArticle[i].title,
                    link: dbArticle[i].link,
                    id: dbArticle[i]._id,
                    imagesource: dbArticle[i].imagesource,
                })
            }
            var hbsObject = {
                articles: articlesArr
            };
            console.log(hbsObject)
            res.render("index", hbsObject)
        }
        )
});

    app.get("/", function (req, res) {
        axios.get("https://www.npr.org/sections/news/")
            .then(function (response) {
                // console.log(response.data)
                var $ = cheerio.load(response.data);
                $("article h2").each(function (i, element) {
                    var result = {};

                    result.title = $(this)
                        .children("a")
                        .text();
                    result.link = $(this)
                        .children("a")
                        .attr("href");
                    result.imagesource = $(this)
                        .parent().parent().parent().find("img")
                        .attr("src");

                    db.Article.create(result)
                        .then(function (dbArticle) {
                            // console.log(dbArticle);
                        })
                        .catch(function (err) {
                            // console.log(err);
                        });
                })
            })
    })

    app.get("/articles", function (req, res) {
        // Grab every document in the Articles collection
        db.Article.find({})
            .populate("comment")
            .then(function (dbArticle) {
                // If we were able to successfully find Articles, send them back to the client
                res.json(dbArticle);
            })
            .catch(function (err) {
                // If an error occurred, send it to the client
                res.json(err);
            });
    });

    app.get("/articles/:id", function (req, res) {
        db.Article.findOne({ _id: req.params.id })
            .populate("comment")
            .then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err)
            })
    })

    app.post("/articles/:id", function (req, res) {
        db.Comment.create(req.body)
            .then(function (dbComment) {
                return db.Article.findOneAndUpdate({ _id: req.params.id }, { $push: { comment: dbComment._id } }, { new: true });
            }).then(function (dbArticle) {
                res.json(dbArticle);
            })
            .catch(function (err) {
                res.json(err);
            })
    });

}
module.exports = apiRoutes