var express = require('express');
var mongoose = require('mongoose');
var mongojs = require('mongojs');
var request = require('request');
var cheerio = require('cheerio');

var db = require ('./models');
var app = express();

var MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost/scraper'

mongoose.Promise =  Promise;
mongoose.connect(MONGODB_URI);

var databaseUrl = "scraper";
var collections = ["scrapedData"];

db.on("error", function(error) {
  console.log("Database Error:", error);
});

// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));


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


        
        db.scrapedData.find({}, function(error, found) {
          if (error) {
            console.log(error);
          }

          else {
            res.json(found);
          }


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