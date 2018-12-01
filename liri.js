require("dotenv").config();
var request = require('request');

//`node liri.js spotify-this-song '<song name here>'`
var spotify_this_song = function () { 
    var keys = require("./keys");
    var Spotify = require('node-spotify-api');
    var spotify = new Spotify(keys.spotify);
    var matchFound = 0;
    var searchLimit = 50;
    var searchOffset = 0;
    var songToSearch = "";
    var songToCompare = "";

    logThis("\n Added To Log: user called spotify_this_song from command line, first on line 12 & 13 require(./keys) and require(node-spotify-api), ");

    if (process.argv.length > 3) {
        if (process.argv.length == 4) {
            songToSearch += process.argv[3];
            songToCompare += process.argv[3];
        }
        else {
            for (var s = 3; s < process.argv.length; s++) {
                songToSearch += process.argv[s];
                songToCompare += process.argv[s];
                if (s < (process.argv.length - 1)) {
                    songToSearch += "%20";
                    songToCompare += " ";
                }
            }
        }
        logThis("\n Added To Log: spotify_this_song line 26 user asked for song named " + songToCompare + ", ");
    }
    else if (process.argv.length == 3) {
        logThis("\n Added To Log: spotify_this_song line 55 user didn't specify a song, so we default to The Sign, ");
        songToSearch = "The%20Sign";
        songToCompare = "The Sign";
    }

    spotify
        .search({ type: 'track', query: songToSearch, limit: searchLimit, offset: searchOffset })
        .then(
            function (response) {
                var responseRow = response.tracks.items;
                if (responseRow) {
                    for (var r = 0; r < responseRow.length; r++) {
                        if (matchFound == 0) {
                            var lowerName = responseRow[r].name.toLowerCase();
                            var lowerComparison = songToCompare.toLowerCase();

                            if (lowerName == lowerComparison) {
                                matchFound = 1;
                                logThis("\n Added To Log: FOUND MATCH spotify_this_song line 93 \n");
                                logThis("\n Added To Log: Song Name:" + responseRow[r].name + ", ");
                                console.log("");
                                var numberOfArtists = responseRow[r].artists.length;
                                if (numberOfArtists > 1) { console.log("Artists:"); }
                                else { console.log("Artist:"); }
                                logThis("\n Added To Log: Cast: ");
                                for (var a = 0; a < numberOfArtists; a++) {
                                    console.log('--' + responseRow[r].artists[a].name);
                                    logThis("\n Added To Log: " + responseRow[r].artists[a].name + ", ");
                                }
                                console.log("");
                                console.log("Song Name:"); console.log('--' + responseRow[r].name); console.log("");
                                console.log("Preview Link:");
                                if (responseRow[r].preview_url) { console.log('--' + responseRow[r].preview_url); }
                                else { console.log("-- no preview available"); }
                                console.log("");

                                console.log("Album Name:"); console.log('--' + responseRow[r].album.name);


                                logThis("\n Added To Log: Album: " + responseRow[r].album.name + ", ");

                            }
                        }

                        else {
                            logThis("\n Added To Log: END spotify_this_song \n \n");
                            return;
                        }
                    }
                    if (matchFound == 0) {
                        console.log(""); console.log("No match yet - getting another 50"); console.log("");
                        searchOffset += 50;
                    }
                }
                else {
                    console.log(""); console.log("Nothing matched that name.  Sorry."); console.log("");
                    logThis("\n Added To Log: spotify_this_song line 116 NO MATCHES Found \n");
                    logThis("\n Added To Log: END spotify_this_song \n \n");
                }
            }

        )
        .catch(function (err) {
            console.log(err);
            logThis("\n Added To Log: spotify_this_song line 126 FAILED with error " + err + "\n");
            logThis("\n Added To Log: END spotify_this_song \n \n");
        }
        );
}; 

//`node liri.js concert-this- '<artist/band name here>'`
var concert_this = function () {
    var moment = require('moment');
    var numberOfArgs = process.argv.length;
    var artistToSearch = "";
    var artistToDisplay = "";
    logThis("\n Added To Log: user called concert_this from command line, first on line 129 require(moment), ");
    if (numberOfArgs == 3) {
        console.log("Please type the name of the artist or band and press Enter: ");
        logThis("\n Added To Log: user did NOT provide a band/artist name so we sent them back to command line with request to type it in and press Enter, ");
        return;
    }
    else {
        if (numberOfArgs == 4) {
            artistToSearch += process.argv[3];
            artistToDisplay += process.argv[3];
        }
        else {
            for (var s = 3; s < numberOfArgs; s++) {
                artistToSearch += process.argv[s];
                artistToDisplay += process.argv[s];
                if (s < (numberOfArgs - 1)) {
                    artistToSearch += "%20";
                    artistToDisplay += " ";
                }
            }
            logThis("\n Added To Log: concert_this line 158 user asked for band/artist, " + artistToDisplay);
        }
    }

    var queryURL = "https://rest.bandsintown.com/artists/" + artistToSearch + "/events?app_id=trilogy";
    request.get(queryURL, function (err, response) {
        if (err) {
            logThis("\n Added To Log:  concert_this line 167 ajax request failed with error: " + error + ", \n");
            logThis("\n Added To Log:  END concert_this \n \n");
        }

        var responseBody = JSON.parse(response.body); 
        console.log("");
        console.log("***************");
        console.log("Upcoming events for " + artistToDisplay);

        if (responseBody.length > 0) {
            logThis("\n Added To Log: FOUND EVENTS: \n");

            for (let i in responseBody) {
                var rawDate = responseBody[i].datetime;
                var formattedTimeDate = moment(rawDate).format('MM/DD/YYYY');

                console.log("");
                console.log(responseBody[i].venue.name);
                console.log(responseBody[i].venue.city);
                console.log(formattedTimeDate);
                logThis("\n Added To Log: " + responseBody[i].venue.name + " " + responseBody[i].venue.city + " " + formattedTimeDate);

                if (i < (responseBody.length - 1)) {
                    console.log("  --------------------  ");
                    logThis(", ");
                }

            }
        }
        else {
            console.log("Nothing coming up, sorry.");
            logThis("\n Added To Log: NOTHING FOUND \n");
        }
        console.log("***************");
        logThis("\n Added To Log: END concert_this \n \n");
    });
}; 

//`node liri.js movie-this '<movie name here>'`
var movie_this = function () {
    var omdb = require('omdb');

    logThis("\n Added To Log: user called movie_this from command line, first on line 184 require(OMDB), ");
    var numberOfArgs = process.argv.length;
    var movieToSearch = "";
    var movieToDisplay = "";

    if (numberOfArgs == 3) {
        console.log("If you haven't watched \'Mr. Nobody,\' then you should:");
        console.log("<http://www.imdb.com/title/tt0485947/>");
        console.log("It's on Netlix!");

        logThis("\n Added To Log:  movie_this line 194, but no movie name was given, ");
        logThis("\n Added To Log: so we defaulted to Mr. Nobody \n");
        logThis("\n Added To Log: END movie_this \n \n");
        return;
    }

    else {
        if (numberOfArgs == 4) {
            movieToSearch = process.argv[3];
            movieToDisplay = process.argv[3];
        }
        else {
            for (var s = 3; s < numberOfArgs; s++) {
                movieToSearch += process.argv[s];
                movieToDisplay += process.argv[s];
                if (s < (numberOfArgs - 1)) {
                    movieToSearch += "%20";
                    movieToDisplay += " ";
                }
            }
            logThis("\n Added To Log:  movie_this line 215 user asked for movie name of " + movieToDisplay + ", ");
        }

    }

    request("http://www.omdbapi.com/?t=" + movieToSearch + "&y=&plot=short&tomato=true&apikey=trilogy", function (error, response, body) {
        if (error) {
            logThis("\n Added To Log:  movie_this line 223 ajax request failed with error: " + error + ", \n");
            logThis("\n Added To Log:  END movie_this \n \n");
            return console.error(error);
        }

        if (!response) {
            logThis("\n Added To Log:  movie_this line 229 ajax response movie was NOT FOUND, ");
            logThis("\n Added To Log:  END movie_this \n \n");
            return console.log('Movie not found!');
        }

        var movieBody = JSON.parse(body);
        var imdbRating = "";
        var tomatoRating = "";

        for (var m = 0; m < movieBody.Ratings.length; m++) {
            if (movieBody.Ratings[m].Source == "Internet Movie Database") {
                imdbRating = movieBody.Ratings[m].Value;
            }
            if (movieBody.Ratings[m].Source == "Rotten Tomatoes") {
                tomatoRating = movieBody.Ratings[m].Value;
            }
        } 
        console.log("Title: " + movieBody.Title); //Movie Title
        console.log("Year: " + movieBody.Year); //Year the movie came out
        console.log("IMDB rating: " + imdbRating); //IMDB Rating
        console.log("Rotten Tomatos rating: " + tomatoRating); //Rotten Tomatoes Rating
        console.log("Country of origin: " + movieBody.Country); //Country where the movie was produced
        console.log("Language: " + movieBody.Language); //Language of the movie
        console.log("Plot: " + movieBody.Plot); //plot
        console.log("Castmembers: ") //actors
        console.log(movieBody.Actors);

        logThis("\n Added To Log: \n movie_this line 256 ajax response FOUND and console.log'd the following: \n ");
        logThis("\n Added To Log: Title: " + movieBody.Title + ", ");
        logThis("\n Added To Log: Year: " + movieBody.Year + ", ");
        logThis("\n Added To Log: IMDB rating: " + imdbRating + ", ");
        logThis("\n Added To Log: Rotten Tomatos rating: " + tomatoRating + ", ");
        logThis("\n Added To Log: Country of origin: " + movieBody.Country + ", ");
        logThis("\n Added To Log: Language: " + movieBody.Language + ", ");
        logThis("\n Added To Log: Plot: " + movieBody.Plot + ", ");
        logThis("\n Added To Log: Castmembers: " + movieBody.Actors + "\n");
        logThis("\n Added To Log:  END movie_this \n \n");
    });//end request

}; //end var = movie_this 

//`node liri.js do-what-it-says`
var do_what_it_says = function () {
    var fs = require("fs");

    fs.readFile('./random.txt', 'utf8', function (error, data) {

        if (error) {
            return console.log(error);
        }

        var dataArr = data.split(",");
        var nameString = dataArr[0];
        var argString = dataArr[1].replace(/"/g, "");

        { nameString } (argString);
    });//close fs.readFile

    logThis("\n Added To Log: user called do_what_it_says from command line, ");
    logThis("\n Added To Log: fs.readFile in do_what_it_says line 251, ");
    logThis("\n Added To Log: {nameString}(argString) in do_what_it_says line 261 \n");
    logThis("\n Added To Log: END do_what_it_says \n \n");

};//end var do_what_it_says

function logThis(logString) {
    var fs = require("fs");

    fs.appendFile("log.txt", logString, function (err) {
        if (err) {
            return console.log(err);
        }
    });
}

spotify_this_song();
concert_this();
movie_this();
do_what_it_says();
