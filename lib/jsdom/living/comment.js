"use strict";

const Comment = require("./generated/Comment").interface;

module.exports = function (core) {
  core.Comment = Comment;
};
