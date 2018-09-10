const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const request = require('request');

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var cheerio = require("cheerio");

// Require all models
var db = require("./models");

var PORT = 3000;

// Initialize Express
var app = express();

// Configure middleware

// Use morgan logger for logging requests
app.use(logger("dev"));
// Use body-parser for handling form submissions
app.use(bodyParser.urlencoded({ extended: true }));
// Use express.static to serve the public folder as a static directory
app.use(express.static("public"));

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newreleases");

//===============================================
//                  Routes
//===============================================



//MOVIES REQUEST
app.get("/scrape", function (req, res) {
    request('https://www.metacritic.com/browse/movies/release-date/theaters/date', function (error, response, html) {
        const $ = cheerio.load(html),
            scoreResults = [],
            splitDateAndTitleArray = [];

        $('div.image_strip').each(function (i, element) {
            //Getting the data from the HTML, and splitting them into an array.
            const data = $(element).text().trim().split('\n');

            //Deleting all the white space with filter function.
            const filteredArray = data.filter(function (str) {
                return /\S/.test(str);
            });

            //Pushes scores into scoreResults
            for (var scores = 0; scores < filteredArray.length; scores = scores + 2) {
                scoreResults.push(filteredArray[scores]);
            }

            //Array for Date and Title. (Need to split them)
            dateAndTitleArray = [];
            for (var dateAndTitle = 1; dateAndTitle < filteredArray.length; dateAndTitle = dateAndTitle + 2) {
                dateAndTitleArray.push(filteredArray[dateAndTitle]);
            }

            for (j = 0; j < dateAndTitleArray.length; j++) {
                //Looking for a number in each index (j)
                string = dateAndTitleArray[j]

                //Putting the characters as a variable
                const characterFour = string.charAt(4)
                const characterFive = string.charAt(5)
                const characterSix = string.charAt(6)
                if (isNaN(characterFive) === false) {
                    commaArray = string.replace(characterFive, characterFive + ",")

                    // console.log(commaArray);
                    let titleAndDateSplit = commaArray.split(",")
                    splitDateAndTitleArray.push(titleAndDateSplit)
                }
                else {
                    commaArray = string.replace(characterFive, "," + characterFive)
                    // console.log(commaArray);
                    let titleAndDateSplit = commaArray.split(",")
                    splitDateAndTitleArray.push(titleAndDateSplit)

                }
            }

            //Pushing the scores into the split array.
            for (var p = 0; p < splitDateAndTitleArray.length; p++) {
                splitDateAndTitleArray[p].push(scoreResults[p]);

            }

            //Converts the array into objects and pushes into the movies array
            splitDateAndTitleArray.forEach(element => {
                let movies = {
                    releaseDate: element[0],
                    title: element[1],
                    score: element[2]
                }
                console.log(movies);
                db.Movie.create(movies)
                .then(dbMovies => {
                    console.log(dbMovies);
                }).catch(err => res.json(err))
            });


        });
        res.send("Scrape Complete");
    });
});




//TO DO - 
//GET NEW GAMES AND NEW ALBUMS INTO THERE (DB)
//PUT THEM ON A WEBPAGE
//LET SAVING HAPPEN IN DB
//I DUNNO WHAT ELSE.


// Start the server
app.listen(PORT, function () {
    console.log("App running on port " + PORT + "!");
});


