'use strict';

let chalk = require('chalk');

let Utils = {
  consoleTrace: () => {
    let str = '';
    for (let i = 0, len = 40; i < len; i++) {
      str += '-';
    }
    console.log(chalk.white(str));
  },

  arrOfObjRemoveDuplicates: (original, prop) => {
    var arr = [];
    var obj = {};

    for (var i in original) {
      obj[original[i][prop]] = original[i];
    }

    for (i in obj) {
      arr.push(obj[i]);
    }

    return arr;
  },
};

module.exports.Utils = Utils;
