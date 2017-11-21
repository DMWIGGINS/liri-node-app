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

            for (var i = 0; i < tweets.length; i++)  {
            console.log(tweets[i].created_at);
            console.log(tweets[i].text);
            }
            
        }
    });
}