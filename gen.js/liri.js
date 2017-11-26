var fs = require("fs");

function myTweets() {
    var Twitter = require('twitter');
    var client = require("./keys.js");
    var T = new Twitter(client);

    var params = {
        screen_name: 'classaccount3',
        count: 20
    };
    T.get('statuses/user_timeline', params, function (error, tweets, response) {

        if (!error) {

            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].created_at);
                console.log(tweets[i].text);
                fs.appendFile("log.txt", tweets[i].created_at + ", " + tweets[i].text + ", ", function (error) {
                    if (error) {
                        return console.log(error);
                    }
                });
            }

        } else {
            return console.log(JSON.stringify(error));

        }
    });
};

function spotifyThis() {
    var Spotify = require('node-spotify-api');
    var secret = require('./keys_spotify.js');
    var song = new Spotify(secret);

    // If no song is provided then default to "The Sign" by Ace of Base.
    if (process.argv.length < 4) {
        console.log("Ace of Base");
        console.log("The Sign");
        console.log("https://open.spotify.com/track/0hrBpAOgrt8RXigk83LLNE");
        console.log("The Sign (US Album) [Remastered]");


        fs.appendFile("log.txt", "Ace of Base, The Sign, https://open.spotify.com/track/0hrBpAOgrt8RXigk83LLNE, The Sign (US Album) [Remastered], ", function (error) {
            if (error) {
                return console.log(error);
            }
        });


    } else {

        song.search({
            type: 'track',
            query: process.argv[3],
            limit: 1

        }, function (err, data) {
            if (err) {
                return console.log('Error occurred: ' + err);

            } else {

                console.log(data.tracks.items[0].artists[0].name);
                console.log(data.tracks.items[0].name);
                console.log(data.tracks.items[0].external_urls.spotify);
                console.log(data.tracks.items[0].album.name);

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

function movieThis() {
    var request = require("request");
    movieKey = require('./keys_omdb.js');


    if (process.argv.length < 4) {
        var movieName = "Mr. Nobody";
    } else {
        movieName = process.argv[3];
    }


    var queryUrl = "http://www.omdbapi.com/?t=" + movieName + "&y=&plot=short&apikey=" + movieKey.movie_key;

    request(queryUrl, function (error, response, body) {

        // If the request was successful...
        if (!error && response.statusCode === 200) {

            // Then log the Release Year for the movie
            console.log(JSON.parse(body).Title);
            console.log(JSON.parse(body).Year);
            console.log(JSON.parse(body).Ratings[0].Source);
            console.log(JSON.parse(body).Ratings[0].Value);
            console.log(JSON.parse(body).Ratings[1].Source);
            console.log(JSON.parse(body).Ratings[1].Value);
            console.log(JSON.parse(body).Country);
            console.log(JSON.parse(body).Language);
            console.log(JSON.parse(body).Plot);
            console.log(JSON.parse(body).Actors);

            fs.appendFile("log.txt", JSON.parse(body).Title + ", " + JSON.parse(body).Year + ", " + JSON.parse(body).Ratings[0].Source + ", " + JSON.parse(body).Ratings[0].Value + ", " + JSON.parse(body).Ratings[1].Source + ", " + JSON.parse(body).Ratings[1].Value + ", " + JSON.parse(body).Country + ", " + JSON.parse(body).Language + ", " + JSON.parse(body).Plot + ", " + JSON.parse(body).Actors + ", ", function (error) {
                if (error) {
                    return console.log(error);
                }
            });

        }

    });



};

if (process.argv[2] === "my-tweets") {
    myTweets();


} else if (process.argv[2] === "spotify-this-song") {
    spotifyThis();

} else if (process.argv[2] === "movie-this") {
    movieThis();

} else if (process.argv[2] === "do-what-it-says") {

    fs.readFile("random.txt", "utf8", function (error, data) {
        if (error) {
            return console.log(error);
        } else {
            var random = data.split(",");
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