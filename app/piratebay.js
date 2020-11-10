'use strict';

let chalk = require('chalk');
let Prompt = require('./lib/prompt.js').Prompt;
let Utils = require('./lib/utils.js').Utils;
let PiratebayBase = require('thepiratebay');

let Piratebay = {
  tracks: [],
  tracksSelected: [],

  get: async (name) => {
    return await new Promise((resolve, reject) => {
      PiratebayBase.search(name, {
        // default - 'all' | 'all', 'audio', 'video', 'xxx',
        //                   'applications', 'games', 'other'
        //
        // You can also use the category number:
        // `/search/0/99/{category_number}`
        category: 'audio',
        filter: {
          verified: false, // default - false | Filter all VIP or trusted torrents
        },
        page: 0, // default - 0 - 99
        orderBy: 'leeches', // default - name, date, size, seeds, leeches
        sortBy: 'desc', // default - desc, asc
      })
        .then(function (res) {
          resolve(res);
        })
        .catch(function (err) {
          console.log(chalk.red('Error: The Pirate Bay - ' + err));
          resolve(false);
        });
    });
  },

  getTracks: async (tracks) => {
    console.log(chalk.blueBright('- Start The Pirate Bay.'));

    let type = await Prompt.radio({
      name: 'colors',
      message: 'Search tracks by?',
      choices: ['Music', 'Album', 'Artists', 'Music & Artists', 'Album & Artists'],
    });

    if (!type) {
      type = 'Music';
    }

    Piratebay.tracks = [];
    for (let i = 0; i < tracks.items.length; i++) {
      let artists = [];
      tracks.items[i].track.album.artists.map((o) => {
        artists.push(o.name);
      });
      artists = artists.toString();

      let music = tracks.items[i].track.name;
      let album = tracks.items[i].track.album.name;

      let search = '';
      if (type === 'Music') {
        search = music;
      } else if (type === 'Album') {
        search = album;
      } else if (type === 'Artists') {
        search = artists;
      } else if (type === 'Music & Artists') {
        search = music + ' ' + artists;
      } else {
        search = album + ' ' + artists;
      }

      Piratebay.tracks.push({
        search: search,
        music: music,
        album: album,
        artists: artists,
      });
    }

    Piratebay.tracks = Utils.arrOfObjRemoveDuplicates(Piratebay.tracks, 'search');

    for (let i = 0, len = Piratebay.tracks.length; i < len; i++) {
      let o = Piratebay.tracks[i];
      console.log('- Search: ' + chalk.yellow(o.search) + '. Track: ' + chalk.yellow(o.music) + '. Album: ' + chalk.yellow(o.album) + '. Artists: ' + chalk.yellow(o.artists));
      o.piratebay = await Piratebay.get(o.search);
    }

    Piratebay.tracks.map((o) => {
      if (o.piratebay.length === 0) {
        console.log("- Track isn't find. " + 'Track: ' + chalk.yellow(o.music) + '. Album: ' + chalk.yellow(o.album) + '. Artists: ' + chalk.yellow(o.artists));
      }
    });

    Piratebay.tracksSelected = [];
    for (let i = 0; i < Piratebay.tracks.length; i++) {
      if (Piratebay.tracks[i].piratebay.length === 0) {
        continue;
      }

      let result = await Prompt.radio({
        name: 'colors',
        message: 'Track: ' + Piratebay.tracks[i].music + '. Album: ' + Piratebay.tracks[i].album + '. Artists: ' + Piratebay.tracks[i].artists + '?',
        choices: Piratebay.tracks[i].piratebay.map((o) => o.name),
      });

      if (!result) {
        continue;
      }

      result = Piratebay.tracks[i].piratebay.find((o) => o.name === result);
      if (!result) {
        continue;
      }

      Piratebay.tracksSelected.push({
        music: Piratebay.tracks[i].music,
        album: Piratebay.tracks[i].album,
        piratebay: result,
      });
    }

    return true;
  },
};

module.exports.Piratebay = Piratebay;
