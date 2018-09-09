<<<<<<< HEAD
var express = require("express");
var bodyParser = require("body-parser");
var logger = require("morgan");
var mongoose = require("mongoose");
=======
const express = require("express");
const bodyParser = require("body-parser");
const logger = require("morgan");
const mongoose = require("mongoose");
const request = require('request');
>>>>>>> 9d9b587d5bb7dc9e3b73849dc9879e211dd20d2c

// Our scraping tools
// Axios is a promised-based http library, similar to jQuery's Ajax method
// It works on the client and on the server
var axios = require("axios");
var cheerio = require("cheerio");

// Require all models
<<<<<<< HEAD
var db = require("./models");
=======
// var db = require("./models");
>>>>>>> 9d9b587d5bb7dc9e3b73849dc9879e211dd20d2c

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
<<<<<<< HEAD
=======

// Connect to the Mongo DB
mongoose.connect("mongodb://localhost/newreleases");

//===============================================
//                  Routes
//===============================================

// app.get("/scrape", function(req, res){
//     axios.get('https://www.metacritic.com/browse/movies/release-date/theaters/date')
//     .then(function(response){
//         const $ = cheerio.load(response.data);


//         console.log();

    
        
//         const results = {};
        
        



//         $('movie h2').each(function(i, element){
//             var result = {};

//             result.title = $(this)
//                 .children('')
                
//         });
//     });
// });



request('https://www.metacritic.com/browse/movies/release-date/theaters/date', function(error, response, html){
    const $ = cheerio.load(html);

    result = [];
    $('div.image_strip').each(function(i, element){
        const title = $(element).text();
        console.log(title);
        result.push(title);

    });
    console.log(result)
});


// Start the server
app.listen(PORT, function() {
    console.log("App running on port " + PORT + "!");
  });
>>>>>>> 9d9b587d5bb7dc9e3b73849dc9879e211dd20d2c
