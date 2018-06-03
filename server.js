var express = require('express');
var mongoose = require('mongoose');
var mongojs = require('mongojs');
var request = require('request');
var cheerio = require('cheerio');
var ObjectID = require('mongodb').ObjectID;

var app = express();

mongoose.connect('mongodb://localhost/scraper');

var databaseUrl = "scraper";
var collections = ["scrapedData"];

var db = mongojs(databaseUrl, collections);
db.on("error", function(error) {
  console.log("Database Error:", error);
});

// var db = mongoose.connection;
// db.on('error', console.error.bind(console, 'connection error:'));
// db.once('open', function() {
//   // we're connected!
//   console.log("We're connected")
// });

// var articleInfo = {
//   _id: new ObjectID(),
//   title: String,
//   link: String,
//   summary: String,
//   date: Date
// };

app.get("/scrape", function(req, res) {

    request("https://www.gamespot.com", function(error, response, html) {

      var $ = cheerio.load(html);

      $(".media-title").each(function(i, element) {

        var title = $(element).text();
        var link = $(element).closest("a").attr("href");
        var summary = $(element).next().text();
        var date = $(element).siblings("footer").text();
  
        console.log("title: " + title);
        console.log("link: https://www.gamespot.com" + link);
        console.log("summary: " + summary);
        console.log("date: " + date);
        console.log("--------------------------------")

        if (summary && date) {
  
          db.scrapedData.insert({
            title: title,
            link: link,
            summary: summary,
            date: date
          },
          function(err, inserted) {
            if (err) {
  
              console.log(err);
            }
            else {

              console.log("data inserted: " + JSON.stringify(inserted));
            }
          });
        }
      });
    });
    res.send("Scrape Complete");
});

// Listen on port 3000
app.listen(3000, function() {
    console.log("App running on port 3000!");
  });