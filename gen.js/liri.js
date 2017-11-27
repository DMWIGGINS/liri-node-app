// need file systems npm (fs) to append results to log.txt and to read our random.txt file
var fs = require("fs");

// create function myTweets to run if user types my-tweets
function myTweets() {

    // need Twitter npm to query Twitter
    var Twitter = require('twitter');
    // grabbing the keys and tokens for Twitter from the key.js file
    var client = require("./keys.js");
    var T = new Twitter(client);

    // search will be last 20 tweets from my account (accessed via my screen name)
    var params = {
        screen_name: 'classaccount3',
        count: 20
    };

    // calling the search
    T.get('statuses/user_timeline', params, function (error, tweets, response) {

        // if no error than loop through each tweet and list the creation date/time and the actual tweet
        if (!error) {

            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].created_at);
                console.log(tweets[i].text);
            
                // append each date/time and tweet to the log.tx file each loop iteration
                fs.appendFile("log.txt", tweets[i].created_at + ", " + tweets[i].text + ", ", function (error) {
                    if (error) {
                        return console.log(error);
                    }
                });
            }
            // return error to console if loop fails
        } else {
            return console.log(JSON.stringify(error));
        }
    });
};

// create function spotifyThis for when user types spotify-this-song
function spotifyThis() {
    // need node-spotify-api npm to query Spotify 
    var Spotify = require('node-spotify-api');
    // grabbing id and secret from keys_spotify file
    var secret = require('./keys_spotify.js');
    var song = new Spotify(secret);

    // If no song is provided then return the song The Sign by Ace of Base
    if (process.argv.length < 4) {
        console.log("Ace of Base");
        console.log("The Sign");
        console.log("https://open.spotify.com/track/0hrBpAOgrt8RXigk83LLNE");
        console.log("The Sign (US Album) [Remastered]");

        // append result to log.txt file
        fs.appendFile("log.txt", "Ace of Base, The Sign, https://open.spotify.com/track/0hrBpAOgrt8RXigk83LLNE, The Sign (US Album) [Remastered], ", function (error) {
            if (error) {
                // if error than show in console
                return console.log(error);
            }
        });
    } else {

        // if song is provided then search for 1 song with the title
        song.search({
            type: 'track',
            query: process.argv[3],
            limit: 1

        }, function (error, data) {
            // if error then console.log the error
            if (error) {
                return console.log('Error occurred: ' + error);
            } else {
                // return the artist name, song name, link to the song in spotify and the name of the album the song is from
                console.log(data.tracks.items[0].artists[0].name);
                console.log(data.tracks.items[0].name);
                console.log(data.tracks.items[0].external_urls.spotify);
                console.log(data.tracks.items[0].album.name);

                // append the data returned about the song to the log.txt file
                fs.appendFile("log.txt", data.tracks.items[0].artists[0].name + ", " + data.tracks.items[0].name + ", " + data.tracks.items[0].external_urls.spotify + ", " + data.tracks.items[0].album.name + ", ",
                    function (error) {
                        if (error) {
                            return console.log(error);
                        }
                    });
            }
        });
    }
};

// create function movieThis for when the user types movie-this
function movieThis() {

    // need request npm to query OMDB
    var request = require("request");
    // grab key from keys_omdb file
    movieKey = require('./keys_omdb.js');

    // if user doesn't type a specific movie than use Mr. Nobody as default
    if (process.argv.length < 4) {
        var movieName = "Mr. Nobody";
    } else {
        movieName = process.argv[3];
    }

    // search with queryUrl which includes name of movie and movie key
    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=" + movieKey.movie_key;

    request(queryUrl, function (error, response, body) {

        // If the request was successful...
        if (!error && response.statusCode === 200) {

            // log movie title
            console.log(JSON.parse(body).Title);
            // log release year
            console.log(JSON.parse(body).Year);
            // log rating from OMDB
            console.log(JSON.parse(body).Ratings[0].Source + " Rating:  " + JSON.parse(body).Ratings[0].Value)
            // log rating from Rotten Tomatoes
            console.log(JSON.parse(body).Ratings[1].Source + " Rating:  " + JSON.parse(body).Ratings[1].Value);
            // log country where movie was produced
            console.log(JSON.parse(body).Country);
            // log language of movie
            console.log(JSON.parse(body).Language);
            // log plot summary
            console.log(JSON.parse(body).Plot);
            // log actors in movie
            console.log(JSON.parse(body).Actors);

            // append all returned movie info to log.txt file
            fs.appendFile("log.txt", JSON.parse(body).Title + ", " + JSON.parse(body).Year + ", " + JSON.parse(body).Ratings[0].Source + ", " + JSON.parse(body).Ratings[0].Value + ", " + JSON.parse(body).Ratings[1].Source + ", " + JSON.parse(body).Ratings[1].Value + ", " + JSON.parse(body).Country + ", " + JSON.parse(body).Language + ", " + JSON.parse(body).Plot + ", " + JSON.parse(body).Actors + ", ", function (error) {
                // if error than show in console
                if (error) {
                    return console.log(error);
                }
            });
        } else {
            // if error than show in console            
            return console.log(error);
        }
    });
};

// reads what the user types and runs the corresponding function
if (process.argv[2] === "my-tweets") {
    myTweets();

} else if (process.argv[2] === "spotify-this-song") {
    spotifyThis();

} else if (process.argv[2] === "movie-this") {
    movieThis();

    // if user types do-what-it-says we will grab the text from random.txt file and execute it
} else if (process.argv[2] === "do-what-it-says") {

    fs.readFile("random.txt", "utf8", function (error, data) {
        // if error than console.log it
        if (error) {
            return console.log(error);
            // if no error than split the string at the , and put into an array
        } else {
            var random = data.split(",");
            // match the first part of the text (random[0]) to corresponding function and (random[1]) to parameter
            if (random[0] === "spotify-this-song") {
                process.argv[3] = random[1];
                spotifyThis();
            } else if (random[0] === "my-tweets") {
                myTweets();
            } else if (random[0] === "movie-this") {
                process.argv[3] = random[1];
                movieThis();
            }
        }
    });
}