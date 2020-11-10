'use strict';

let fs = require('fs');
let os = require('os');
let Spotify = require('./spotify.js').Spotify;
let Piratebay = require('./piratebay.js').Piratebay;
let Transmission = require('./transmission.js').Transmission;
let Utils = require('./lib/utils.js').Utils;

let start = async () => {
  let result = false;

  let dir = os.homedir() + '/' + 'Transmission' + '/';
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }

  result = await Transmission.start({
    port: 9091, // DEFAULT : 9091
    host: '127.0.0.1', // DEAFULT : 127.0.0.1
    username: 'admin', // DEFAULT : BLANK
    password: 'admin', // DEFAULT : BLANK
  });

  if (result === false) {
    return;
  }

  Utils.consoleTrace();

  Spotify.start({
    id: '', // CHANGE THIS
    secret: '', // CHANGE THIS
  });

  result = await Spotify.getPlaylists();
  if (result === false) {
    return;
  }

  Utils.consoleTrace();

  result = await Piratebay.getTracks(Spotify.tracks);
  if (result === false) {
    return;
  }

  Piratebay.tracksSelected.map((o) => Transmission.add(dir + Spotify.playlist, o.piratebay.magnetLink));
};

start();

// let seekTorrent = require('seek-torrent');
// let Prompt = require('./lib/prompt.js').Prompt;

// (async () => {
//   let results = await seekTorrent.search('Game of Thrones PT_BR', { type: 'series' });

//   // for (let i = 0; i < results.length; i++) {
//   //   let res = results[i];
//   // }

//   let result = await Prompt.radio({
//     name: 'colors',
//     message: 'Qual dos arquivos deseja realizar o download' + '?',
//     choices: results.map(o => 'Title: ' + o.title + '. Season: ' + o.season + '. Episode:   ' + o.episode + '. Resolution: ' + o.resolution)
//   });

//   /*
//   [
//     {
//       year: 2014,
//       resolution: '1080p',
//       quality: 'BrRip',
//       codec: 'x264',
//       group: 'YIFY',
//       sourceName: 'Extra Torrent',
//       fileName: 'Captain Russia The Summer Soldier (2014) 1080p BrRip x264 - YIFY',
//       title: 'Captain Russia The Summer Soldier'
//     }
//   ]
//   */

// })();
