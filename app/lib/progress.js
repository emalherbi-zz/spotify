'use strict';

let term = require('terminal-kit').terminal;

let Progress = {
  bar: null,
  progress: 0,
  interval: null,

  start: (interval) => {
    if (typeof interval === 'undefined') {
      interval = 1500;
    }

    Progress.bar = term.progressBar({
      width: 80,
      title: 'Progress: ',
      eta: true,
      percent: true,
    });

    Progress.progress = 0.01;

    Progress.interval = setInterval(() => {
      Progress.progress += 0.01;

      if (Progress.progress <= 0.9) {
        Progress.bar.update(Progress.progress);
      }
    }, interval);
  },

  done: () => {
    clearInterval(Progress.interval);

    Progress.progress = 1;
    Progress.bar.update(Progress.progress);

    setTimeout(() => {
      term('\n');
      // process.exit();

      Progress.bar = null;
      Progress.progress = 0;
      Progress.interval = null;
    }, 500);
  },
};

module.exports.Progress = Progress;
