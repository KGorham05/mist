const mongoose = require('mongoose');
const db = require('../models/');

mongoose
    .connect(process.env.MONGODB_URI || 'mongodb://localhost:27017/appDB', { useNewUrlParser: true, useCreateIndex: true })
    .then(() => console.log("MongoDB Connected!"))
    .catch(err => console.error(err));

const setupArticleRoutes = (app) => {
    //get all news articles from the database 
    app.get("/api/articles", (req, res) => {
        db.Article
            .find({}).limit(12)
            .then(dbArticle => res.json(dbArticle))
            .catch(err => res.json(err))
    })

    //save an article
    app.post("/api/articles/:articleId/:userId", (req, res) => {
        console.log("worked")
        db.Article
            .findOneAndUpdate({ _id: req.params.articleId }, { saved: true }, { new: true })
            .then(dbArticle => {
                return db.User.findOneAndUpdate({ _id: req.params.userId }, { $push: { articles: dbArticle._id } }, { new: true })
            })
            .then(dbArticle => res.json(dbArticle))
    });

    //Get saved articles for the profile page
    app.get("/saved/:userId", (req, res) => {
        db.User
            .find({ _id: req.params.userId })
            .populate("articles")
            .then(dbArticles => {
                console.log(dbArticles)
                res.json(dbArticles)
            })
    })

    //SCRAPE route
    const cheerio = require("cheerio")
    const axios = require("axios")
    app.get("/scrape", (req, res) => {

        axios.get("http://www.nintendolife.com/pokemon/news").then(function (response) {
            var $ = cheerio.load(response.data)
            var array = [];
            $("li.item-article").each(function (i, element) {
                var title = $(element).find("div.item-wrap").find("div.info").find("div.info-wrap").find("p.heading").find("a").find("span.title").text()
                var image = $(element).find("div.item-wrap").find("div.image").find("a").find("img").attr("src");
                var summary = $(element).find("div.item-wrap").find("div.info").find("div.info-wrap").find("p.text").text()
                var link = $(element).find("div.item-wrap").find("div.info").find("div.info-wrap").find("p.heading").find("a").attr("href")
                link = "https://nintendolife.com/" + link

                let post = {
                    title: title,
                    image: image,
                    summary: summary,
                    link: link
                }
                array.push(post);
                db.Article
                    .create(array)
                    .then((dbArticles) => {
                        res.json(dbArticles)
                    })
                    .catch(err => console.log(err))
            })

        })
    })

    //clear scraped articles 
    app.get("/api/clear", (req, res) => {
        db.Article
            .deleteMany({ saved: false })
            .then((dbArticles) => {
                console.log(dbArticles)
                res.json(dbArticles)
            }
            )
    })
}

module.exports = setupArticleRoutes;