'use strict';

let PromptBase = require('prompt-base');
let PromptCheckbox = require('prompt-checkbox');
let PromptRadio = require('prompt-radio');

let Prompt = {
  input: async (obj) => {
    return await new Promise((resolve, reject) => {
      let prompt = new PromptBase(obj);
      prompt
        .run()
        .then(function (res) {
          resolve(res);
        })
        .catch(function (err) {
          reject('Error occurred: ' + err);
        });
    });
  },

  checkbox: async (obj) => {
    return await new Promise((resolve, reject) => {
      let prompt = new PromptCheckbox(obj);
      prompt
        .run()
        .then(function (res) {
          resolve(res);
        })
        .catch(function (err) {
          reject('Error occurred: ' + err);
        });
    });
  },

  radio: async (obj) => {
    return await new Promise((resolve, reject) => {
      let prompt = new PromptRadio(obj);
      prompt
        .run()
        .then(function (res) {
          resolve(res);
        })
        .catch(function (err) {
          reject('Error occurred: ' + err);
        });
    });
  },
};

module.exports.Prompt = Prompt;
