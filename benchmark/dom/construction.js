"use strict";
const suite = require("../document-suite");

exports.createElement = suite(function (document) {
  document.createElement("div");
});

exports.createTextNode = suite(function (document) {
  document.createTextNode("foo");
});

exports.createComment = suite(function (document) {
  document.createComment("foo");
});

exports.createDocumentFragment = suite(function (document) {
  document.createDocumentFragment("foo");
});

exports.createNodeIterator = suite(function (document) {
  document.createNodeIterator(document.documentElement);
});

exports.createEvent = suite(function (document) {
  document.createEvent("Event");
});

exports.createProcessingInstruction = suite(function (document) {
  document.createProcessingInstruction("php", "echo 123; ?");
});

