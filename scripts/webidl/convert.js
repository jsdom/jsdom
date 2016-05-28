"use strict";

const path = require("path");

const Webidl2js = require("webidl2js");

const transformer = new Webidl2js();
transformer.options.suppressErrors = true;
transformer.options.implSuffix = "-impl";

function addDir(dir) {
  const resolved = path.resolve(__dirname, dir);
  transformer.addSource(resolved, resolved);
}

addDir(path.resolve(__dirname, "../../lib/jsdom/living/traversal"));
addDir(path.resolve(__dirname, "../../lib/jsdom/living/events"));
addDir(path.resolve(__dirname, "../../lib/jsdom/living/attributes"));
addDir(path.resolve(__dirname, "../../lib/jsdom/living/window"));
addDir(path.resolve(__dirname, "../../lib/jsdom/living/nodes"));
addDir(path.resolve(__dirname, "../../lib/jsdom/living/navigator"));

transformer.generate(path.resolve(__dirname, "../../lib/jsdom/living/generated/")).done();
