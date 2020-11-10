'use strict';

let fs = require('fs');
let chalk = require('chalk');
let TransmissionBase = require('transmission');

let Transmission = {
  transmission: null,

  start: async (obj) => {
    console.log(chalk.blueBright('- Start Transmission.'));

    return await new Promise((resolve, reject) => {
      Transmission.transmission = new TransmissionBase(obj);
      Transmission.transmission.sessionStats(function (err, result) {
        if (err) {
          console.log(chalk.red('Error: Transmission - ' + err));
          return resolve(false);
        }
        return resolve(true);
      });
    });
  },

  add: async (dir, url) => {
    return await new Promise((resolve, reject) => {
      if (!fs.existsSync(dir)) {
        fs.mkdirSync(dir);
      }
      Transmission.transmission.addUrl(
        url,
        {
          'download-dir': dir,
        },
        function (err, result) {
          if (err) {
            console.log(chalk.red('Error: Transmission - ' + err));
            return resolve(false);
          }
          var id = result.id;
          console.log(chalk.green('Added a new torrent. Torrent Id: ' + id));
          return resolve(true);
        }
      );
    });
  },
};

module.exports.Transmission = Transmission;
