require('dotenv').config();

const express = require('express');
const hbs = require('hbs');

// require spotify-web-api-node package here:
const SpotifyWebApi = require('spotify-web-api-node');


const app = express();

app.set('view engine', 'hbs');
app.set('views', __dirname + '/views');
app.use(express.static(__dirname + '/public'));

// setting the spotify-api goes here:
const spotifyApi = new SpotifyWebApi({
    clientId: process.env.CLIENT_ID,
    clientSecret: process.env.CLIENT_SECRET
});

spotifyApi
    .clientCredentialsGrant()
    .then(data => spotifyApi.setAccessToken(data.body['access_token']))
    .catch(error => console.log('Something went wrong when retrieving an access token', error));


// Our routes go here:
app.get("/", (req, res) => res.render("index"))

app.get("/artist-search", (req, res) => {
    const artistName = req.query.artistName
    spotifyApi
        .searchArtists(artistName)
        .then(data => {
            const resultArtists = data.body.artists.items;
            // ----> 'HERE WHAT WE WANT TO DO AFTER RECEIVING THE DATA FROM THE API'
            res.render("artist-search-results", { resultArtists: data.body.artists.items })
        })
        .catch(err => console.log('The error while searching artists occurred: ', err));
})

app.get('/albums/:artistId', (req, res, next) => {
    const id = req.params.id;
    spotifyApi
        .getArtistAlbums(id)
        .then(data => {
            res.render('albums', { albums: data.body.items })
            console.log('Albums information', { albums: data.body.items });
        }, function (err) {
            console.error(err);
        });
});

app.get('/tracks/:idTrack', (req, res) => {
    const idTrack = req.params.idTrack;

    spotifyApi
        .getAlbumTracks(idTrack)
        .then((data) => {
            console.log('tracks data', data)
            res.render('tracks', { tracks: data.body.items });

            console.log('tracks', tracks)
        })
        .catch((err) => console.log(err));

})

app.listen(3000, () => console.log('My Spotify project running on port 3000 ???? ???? ???? ????'));
