//requirements
require("dotenv").config();
var keys = require("./keys.js");
var axios = require("axios");
var cmd = process.argv[2];
var moment = require("moment");
var Spotify = require("node-spotify-api");
var spotify = new Spotify(keys.spotify);
var fs = require("fs");
var queryterm = process.argv[3];
//concert-this (artist/band here)
var exec = function(command, term) {
  if (command === "concert-this") {
    var artist = term.split(" ").join("%20");
    var querURL =
      "https://rest.bandsintown.com/artists/" +
      artist +
      "/events?app_id=codingbootcamp";
    axios
      .get(querURL)
      .then(function(response) {
        console.log(querURL);
        console.log(response.data[0].lineup);
        console.log(
          "Date of Event: " +
            moment(response.data[0].datetime).format("MMMM Do YYYY,h:mm a")
        );
        console.log("Venue: " + response.data[0].venue.name);
        console.log("Location: " + response.data[0].venue.city);
        console.log("Country: " + response.data[0].venue.country);
      })
      .catch(function(error) {
        if (error.response) {
          console.log(error.response.data);
          console.log(error.response.status);
          console.log(error.response.headers);
        } else if (error.request) {
          console.log(error.request);
        } else {
          console.log("Error:" + error.message);
        }
      });
  }
  //spotify-this-song
  if (command === "spotify-this-song") {
    var song = term;
    if (song != null) {
      spotify
        .search({ type: "track", query: song, limit: 3 })
        .then(function(response) {
          console.log(response.tracks.items[0].name);
          console.log(response.tracks.items[0].album.name);
          console.log(response.tracks.items[0].artists[0].name);
          console.log(response.tracks.items[0].external_urls.spotify);
        })
        .catch(function(err) {
          console.log(err);
        });
    } else {
      spotify
        .search({ type: "track", query: "The Sign ace of base", limit: 3 })
        .then(function(response) {
          console.log(response.tracks.items[0].name);
          console.log(response.tracks.items[0].album.name);
          console.log(response.tracks.items[0].artists[0].name);
          console.log(response.tracks.items[0].external_urls.spotify);
        })
        .catch(function(err) {
          console.log(err);
        });
    }
  }
  //movie-this
  if (command === "movie-this") {
    if (term != null) {
      var mov = queryterm.split(" ").join("+");

      var queryUrl =
        "http://www.omdbapi.com/?t=" + mov + "&y=&plot=short&apikey=trilogy";
    } else {
      var queryUrl =
        "http://www.omdbapi.com/?t=Mr+Nobody&y=&plot=short&apikey=trilogy";
    }
    axios.get(queryUrl).then(function(response) {
      console.log(response.data.Title);
      console.log("Year: " + response.data.Year);
      console.log("IMBD User Score: " + response.data.imdbRating);
      console.log("Metascore: " + response.data.Metascore);
      console.log("Country(s) of Production: " + response.data.Country);
      console.log("Language: " + response.data.Language);
      console.log("Actors: " + response.data.Actors);
      console.log("Plot: " + response.data.Plot);
    });
  }
};
//do-what-it-says
if (cmd === "do-what-it-says") {
  fs.readFile("random.txt", function(err, data) {
    if (err) {
      console.log(err);
    } else {
      var prompt = data.toString().split(",");
      ctrl = prompt[0];
      trm = prompt[1];
      if (ctrl != "do-what-it-says") {
        exec(ctrl, trm);
      } else {
        console.log("No way.");
      }
    }
  });
} else {
  exec(cmd, queryterm);
}
