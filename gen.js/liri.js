var Twitter = require('twitter');
var client = require("./keys.js");
var T = new Twitter(client);

if (process.argv[2] === "my-tweets") {

    var params = {
        screen_name: 'classaccount3',
        count: 20
    };
    T.get('statuses/user_timeline', params, function (error, tweets, response) {

        if (!error) {

            for (var i = 0; i < tweets.length; i++) {
                console.log(tweets[i].created_at);
                console.log(tweets[i].text);
            }
        } else {
            return console.log(JSON.stringify(error));

        }
    });

} else if (process.argv[2] === "spotify-this-song") {


    var Spotify = require('node-spotify-api');
    var secret = require('./keys_spotify.js');
    var song = new Spotify(secret);

    // If no song is provided then default to "The Sign" by Ace of Base.
    if (process.argv.length < 4) {
        console.log("Ace of Base");
        console.log("The Sign");
        console.log("https://open.spotify.com/track/0hrBpAOgrt8RXigk83LLNE");
        console.log("The Sign (US Album) [Remastered]");
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

            }
        });

    }
} else if (process.argv[2] === "movie-this") {
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
        };
        // * Title of the movie.response.title
        // * Year the movie came out. response.year
        // * IMDB Rating of the movie. response.ratings[0].source and response.ratings[0].value
        // * Rotten Tomatoes Rating of the movie. response.ratings[1].source and response.ratings[1].value
        // * Country where the movie was produced. response.country
        // * Language of the movie. response.language
        // * Plot of the movie. response.plot
        // * Actors in the movie. response.actors
    });
}