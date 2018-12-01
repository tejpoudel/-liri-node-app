  
##   ** LIRI**
### Author: Tej Poudel
  
  LIRI is a Language Interpretation and Recognition Interface.
  
* LIRI will be a command line node app that takes in parameters and gives you back data.
* LIRI is ran via terminal.
* A log.txt is provided to see data results

<table>
  <tr>
    <th>Liri Commands</th>
    <th>Retrieved Data</th>
    <th>API</th>
  </tr>
  <tr>
    <td>Concert-this</td>
    <td>retrieves concert date and time</td>
    <td>Band of Town, OMDB</td>
  </tr>
  <tr>
    <td>spotify-this-song</td>
    <td>Song details</td>
    <td>SPOTIFY</td>
  </tr>
  <tr>
    <td>movie-this</td>
    <td>Movie info</td>
    <td>OMDB</td>
  </tr>
  <tr>
    <td>do-what-it-says</td>
    <td>Random inputs</td>
    <td>local</td>
  </tr>
  </table>

## Heres a Snapshot of LIRI App

![OMDB](https://github.com/tejpoudel/liri-node-app/blob/master/images/OMDB%20API.png)

## A log.txt is provided to display all data pulled by LIRI

![logs](https://github.com/tejpoudel/liri-node-app/blob/master/images/%20log.png)

<br>

## Here are the packages I used: 
       
        var fs = require("fs");
        var omdb = require('omdb');
	    var request = require("request");
        var keys = require("./keys");
        var Spotify = require('node-spotify-api');

