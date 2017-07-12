"use strict";
const suite = require("../document-suite");

exports.createElement = suite(document => {
  document.createElement("div");
});

exports.createTextNode = suite(document => {
  document.createTextNode("foo");
});

exports.createComment = suite(document => {
  document.createComment("foo");
});

exports.createDocumentFragment = suite(document => {
  document.createDocumentFragment("foo");
});

exports.createNodeIterator = suite(document => {
  document.createNodeIterator(document.documentElement);
});

exports.createEvent = suite(document => {
  document.createEvent("Event");
});

exports.createProcessingInstruction = suite(document => {
  document.createProcessingInstruction("php", "echo 123; ?");
});
