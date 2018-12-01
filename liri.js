require("dotenv").config();
const request = require('request');

//`node liri.js spotify-this-song '<song name here>'`
let spotify_this_song = function () {
    const keys = require('./keys');
    const Spotify = require('node-spotify-api');
    const spotify = new Spotify(keys.spotify);

    let songToCompare = "";
    let songToSearch = "";
    let searchOffset = 0;
    let searchLimit = 50;
    let matchFound = 0;

    logThis("\n LOGGING: user called spotify_this_song from command line, first on line 12 & 13 require(./keys) and require(node-spotify-api), ");
    if (process.argv.length > 3) {
        if (process.argv.length == 4) {
            songToSearch += process.argv[3];
            songToCompare += process.argv[3];
        } else {
            for (let s = 3; s < process.argv.length; s++) {
                songToSearch += process.argv[s];
                songToCompare += process.argv[s];
                if (s < (process.argv.length - 1)) {
                    songToCompare += " ";
                    songToSearch += "%20";
                }
            }
        }
        logThis("\n LOGGING: spotify_this_song line 26 user asked for song named " + songToCompare + ", ");
    } else if (process.argv.length == 3) {
        logThis("\n LOGGING: spotify_this_song line 55 user didn't specify a song, so we default to The Sign, ");
        songToCompare = "The%20Sign";
        songToSearch = "The Sign";
    }

    spotify
        .search({ type: 'track', query: songToSearch, limit: searchLimit, offset: searchOffset })
        .then(
            function (response) {

                let responseRow = response.tracks.items;

                if (responseRow) {

                    for (let r = 0; r < responseRow.length; r++) {
                        if (matchFound == 0) {
                            let lowerName = responseRow[r].name.toLowerCase();
                            let lowerComparison = songToCompare.toLowerCase();

                            if (lowerName == lowerComparison) {
                                matchFound = 1;

                                logThis("\n LOGGING: FOUND MATCH spotify_this_song line 93 \n");
                                logThis("\n LOGGING: Song Name:" + responseRow[r].name + ", ");

                                console.log("");

                                let numberOfArtists = responseRow[r].artists.length;

                                if (numberOfArtists > 1) { console.log("Artists:"); }
                                else { console.log("Artist:"); }

                                logThis("\n LOGGING: Cast: ");

                                for (let a = 0; a < numberOfArtists; a++) {
                                    console.log('--' + responseRow[r].artists[a].name);
                                    logThis("\n LOGGING: " + responseRow[r].artists[a].name + ", ");
                                }
                                console.log("");

                                console.log("Song Name:"); console.log('--' + responseRow[r].name); console.log("");

                                console.log("Preview Link:");
                                if (responseRow[r].preview_url) { console.log('--' + responseRow[r].preview_url); }
                                else { console.log("-- no preview available"); }
                                console.log("");

                                console.log("Album Name:"); console.log('--' + responseRow[r].album.name);


                                logThis("\n LOGGING: Album: " + responseRow[r].album.name + ", ");

                            }
                        }

                        else {
                            logThis("\n LOGGING: END spotify_this_song \n \n");
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
                    logThis("\n LOGGING: spotify_this_song line 116 NO MATCHES Found \n");
                    logThis("\n LOGGING: END spotify_this_song \n \n");

                }
            }
        )
        .catch(function (err) {
            console.log(err);
            logThis("\n LOGGING: spotify_this_song line 126 FAILED with error " + err + "\n");
            logThis("\n LOGGING: END spotify_this_song \n \n");
        }
        );
}

//node liri.js concert-this <artist/band name here>
let concert_this = function () {

    const moment = require('moment');
    let numberOfArgs = process.argv.length;
    let artistToSearch = "";
    let artistToDisplay = "";
    logThis("\n LOGGING: user called concert_this from command line, first on line 129 require(moment), ");


    if (numberOfArgs == 3) {
        console.log("Please type the name of the artist or band and press Enter: ");
        logThis("\n LOGGING: user did NOT provide a band/artist name so we sent them back to command line with request to type it in and press Enter, ");
        return;
    }

    else {
        if (numberOfArgs == 4) {
            artistToSearch += process.argv[3];
            artistToDisplay += process.argv[3];
        }
        else {
            for (let s = 3; s < numberOfArgs; s++) {
                artistToSearch += process.argv[s];
                artistToDisplay += process.argv[s];
                if (s < (numberOfArgs - 1)) {
                    artistToSearch += "%20";
                    artistToDisplay += " ";
                }
            }

            logThis("\n LOGGING: concert_this line 158 user asked for band/artist, " + artistToDisplay);
        }
    }

    const queryURL = "https://rest.bandsintown.com/artists/" + artistToSearch + "/events?app_id=trilogy";
    request.get(queryURL, function (err, response) {
        if (err) {
            logThis("\n LOGGING:  concert_this line 167 ajax request failed with error: " + error + ", \n");
            logThis("\n LOGGING:  END concert_this \n \n");
        }

        const responseBody = JSON.parse(response.body); 
        console.log("");
        console.log("======================");
        console.log("Upcoming events for " + artistToDisplay);

        if (responseBody.length > 0) {
            logThis("\n LOGGING: FOUND EVENTS: \n");

            for (let i in responseBody) {
                let rawDate = responseBody[i].datetime;
                let formattedTimeDate = moment(rawDate).format('MM/DD/YYYY');

                console.log("");
                console.log(responseBody[i].venue.name);
                console.log(responseBody[i].venue.city);
                console.log(formattedTimeDate);
                logThis("\n LOGGING: " + responseBody[i].venue.name + " " + responseBody[i].venue.city + " " + formattedTimeDate);

                if (i < (responseBody.length - 1)) {
                    console.log("  ---===---   ");
                    logThis(", ");
                }

            }
        }

        else {
            console.log("Nothing coming up, sorry.");
            logThis("\n LOGGING: NOTHING FOUND \n");
        }
        console.log("======================");
        logThis("\n LOGGING: END concert_this \n \n");
    });
}; 

//`node liri.js movie-this '<movie name here>'`
let movie_this = function () {
    const omdb = require('omdb');

    logThis("\n LOGGING: user called movie_this from command line, first on line 184 require(OMDB), ");
    let numberOfArgs = process.argv.length;
    let movieToSearch = "";
    let movieToDisplay = "";

    if (numberOfArgs == 3) {
        console.log("If you haven't watched \'Mr. Nobody,\' then you should:");
        console.log("<http://www.imdb.com/title/tt0485947/>");
        console.log("It's on Netlix!");

        logThis("\n LOGGING:  movie_this line 194, but no movie name was given, ");
        logThis("\n LOGGING: so we defaulted to Mr. Nobody \n");
        logThis("\n LOGGING: END movie_this \n \n");
        return;
    }

    else {
        if (numberOfArgs == 4) {
            movieToSearch = process.argv[3];
            movieToDisplay = process.argv[3];
        }
        else {
            for (let s = 3; s < numberOfArgs; s++) {
                movieToSearch += process.argv[s];
                movieToDisplay += process.argv[s];
                if (s < (numberOfArgs - 1)) {
                    movieToSearch += "%20";
                    movieToDisplay += " ";
                }
            }

            logThis("\n LOGGING:  movie_this line 215 user asked for movie name of " + movieToDisplay + ", ");
        }

    }

    request("http://www.omdbapi.com/?t=" + movieToSearch + "&y=&plot=short&tomato=true&apikey=trilogy", function (error, response, body) {
        if (error) {
            logThis("\n LOGGING:  movie_this line 223 ajax request failed with error: " + error + ", \n");
            logThis("\n LOGGING:  END movie_this \n \n");
            return console.error(error);
        }

        if (!response) {
            logThis("\n LOGGING:  movie_this line 229 ajax response movie was NOT FOUND, ");
            logThis("\n LOGGING:  END movie_this \n \n");
            return console.log('Movie not found!');
        }

        let movieBody = JSON.parse(body);
        let imdbRating = "";
        let tomatoRating = "";

        for (let m = 0; m < movieBody.Ratings.length; m++) {
            if (movieBody.Ratings[m].Source == "Internet Movie Database") {
                imdbRating = movieBody.Ratings[m].Value;
            }
            if (movieBody.Ratings[m].Source == "Rotten Tomatoes") {
                tomatoRating = movieBody.Ratings[m].Value;
            }
        } 
        console.log("Title: " + movieBody.Title); 
        console.log("Year: " + movieBody.Year); 
        console.log("IMDB rating: " + imdbRating); 
        console.log("Rotten Tomatos rating: " + tomatoRating); 
        console.log("Country of origin: " + movieBody.Country); 
        console.log("Language: " + movieBody.Language); 
        console.log("Plot: " + movieBody.Plot);
        console.log("Castmembers: ");
        console.log(movieBody.Actors);

        logThis("\n LOGGING: \n movie_this line 256 ajax response FOUND and console.log'd the following: \n ");
        logThis("\n LOGGING: Title: " + movieBody.Title + ", ");
        logThis("\n LOGGING: Year: " + movieBody.Year + ", ");
        logThis("\n LOGGING: IMDB rating: " + imdbRating + ", ");
        logThis("\n LOGGING: Rotten Tomatos rating: " + tomatoRating + ", ");
        logThis("\n LOGGING: Country of origin: " + movieBody.Country + ", ");
        logThis("\n LOGGING: Language: " + movieBody.Language + ", ");
        logThis("\n LOGGING: Plot: " + movieBody.Plot + ", ");
        logThis("\n LOGGING: Castmembers: " + movieBody.Actors + "\n");
        logThis("\n LOGGING:  END movie_this \n \n");
    });
}; 

//`node liri.js do-what-it-says`
let do_what_it_says = function () {
    const fs = require("fs");

    fs.readFile('./random.txt', 'utf8', function (error, data) {

        if (error) {
            return console.log(error);
        }

        let dataArr = data.split(",");
        let nameString = dataArr[0];
        let argString = dataArr[1].replace(/"/g,"");

        { nameString } (argString);
    });

    logThis("\n LOGGING: user called do_what_it_says from command line, ");
    logThis("\n LOGGING: fs.readFile in do_what_it_says line 251, ");
    logThis("\n LOGGING: {nameString}(argString) in do_what_it_says line 261 \n");
    logThis("\n LOGGING: END do_what_it_says \n \n");
};

function logThis(logString) {
    const fs = require("fs");

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
