var express = require('express');
var mongoose = require('mongoose');
var mongojs = require('mongojs');
var request = require('request');
var cheerio = require('cheerio');

var db = require('./models');
var app = express();

var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/scraper'

mongoose.Promise = Promise;
mongoose.connect(MONGODB_URI);

var databaseUrl = "scraper";
var collections = ["scrapedData"];

db.on("error", function (error) {
  console.log("Database Error:", error);
});

app.use(bodyParser.urlencoded({
  extended: true
}));
app.use(express.static("public"));


app.get("/scrape", function (req, res) {

  request("https://www.gamespot.com", function (error, response, html) {

    var $ = cheerio.load(html);

    $(".media-title").each(function (i, element) {

      var result = {};

      result.title = $(element).text();
      result.link = $(element).closest("a").attr("href");
      result.summary = $(element).next().text();
      result.date = $(element).siblings("footer").text();

      console.log("title: " + title);
      console.log("link: https://www.gamespot.com" + link);
      console.log("summary: " + summary);
      console.log("date: " + date);
      console.log("--------------------------------")

      db.scrapedData.findOne({
        title: title
      }, function (error, found) {
        if (error) {
          console.log(error);
        } else {
          if (!title) {
            db.scrapedData.create(result)
              .then(function (dbArtcile) {
                console.log(dbData)
              })
              .catch(function (err) {
                return res.json(err);
              })
          }
        }
      });
    });
  });
  res.send("Scrape Complete");
});

// Listen on port 3000
app.listen(3000, function () {
  console.log("App running on port 3000!");
});