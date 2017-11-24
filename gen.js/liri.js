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

        }
    });

} else if (process.argv[2] === "spotify-this-song") {
    var Spotify = require('node-spotify-api');
    var secret = require('./keys.js');
    var song = new Spotify(secret);


   
    song.search({
        type: 'track',
        query: 'All the Small Things',
        limit: 1

    }, function (err, data) {
        if (err) {
            return console.log('Error occurred: ' + err);
        }

        // console.log(data);
        // console.log(JSON.stringify(data));
    
        console.log(data.tracks.items[0].artists[0].name);
        console.log(data.tracks.items[0].album.name);
        console.log(data.tracks.items[0].name);
        console.log(data.tracks.items[0].external_urls.spotify);
        
        
    });
}


// "href":"https://api.spotify.com/v1/tracks/7yCPwWs66K8Ba5lFuU2bcx"

// Artist(s)
// The song's name
// A preview link of the song from Spotify
// The album that the song is from


// If no song is provided then your program will default to "The Sign" by Ace of Base.