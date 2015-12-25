"use strict";

const CharacterData = require("./generated/CharacterData").interface;

module.exports = function (core) {
  core.CharacterData = CharacterData;
};
