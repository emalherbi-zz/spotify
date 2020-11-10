'use strict';

let chalk = require('chalk');
let Prompt = require('./lib/prompt.js').Prompt;
let SpotifyBase = require('node-spotify-api');

let Spotify = {
  id: '',
  secret: '',

  playlists: [],
  playlist: '',

  tracks: [],

  start: (obj) => {
    Spotify.id = obj.id;
    Spotify.secret = obj.secret;
  },

  get: async (url) => {
    return await new Promise((resolve, reject) => {
      let spotify = new SpotifyBase({
        id: Spotify.id,
        secret: Spotify.secret,
      });
      spotify
        .request(url)
        .then(function (res) {
          resolve(res);
        })
        .catch(function (err) {
          console.log(chalk.red('Error: Spotify - ' + err));
          resolve(false);
        });
    });
  },

  getPlaylists: async () => {
    console.log(chalk.blueBright('- Start Spotify.'));

    let user = await Prompt.input({
      name: 'user',
      message: "What's your spotify username?",
    });

    if (!user) {
      console.log(chalk.yellow('- Please. Inform a spotify username...'));
      return false;
    }

    console.log('- User: ' + chalk.green(user));
    console.log(chalk.green('- Read user playlists...'));

    Spotify.playlists = [];
    Spotify.playlists = await Spotify.get('https://api.spotify.com/v1/users/' + user + '/playlists');

    if (!Spotify.playlists) {
      console.log(chalk.yellow('- Please. Inform a spotify username...'));
      return false;
    }

    Spotify.playlist = await Prompt.radio({
      name: 'colors',
      message: 'Which playlist of music do you want to download torrent?',
      choices: Spotify.playlists.items.map((o) => o.name),
    });

    if (!Spotify.playlist) {
      console.log(chalk.yellow('- Please. Select one playlist...'));
      return false;
    }

    console.log(chalk.green('- Read tracks in Spotify...'));
    let ids = Spotify.playlists.items.find((o) => (o.name === Spotify.playlist ? o.id : 0));

    if (ids === 0) {
      return false;
    }

    Spotify.tracks = [];
    Spotify.tracks = await Spotify.get('https://api.spotify.com/v1/users/' + user + '/playlists/' + ids.id + '/tracks?market=PT');

    if (!Spotify.tracks) {
      console.log(chalk.yellow("- Tracks ins't find on playlist..."));
      return false;
    }

    return true;
  },
};

module.exports.Spotify = Spotify;
