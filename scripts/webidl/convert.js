/* eslint-disable no-console, no-process-exit */

"use strict";

const path = require("path");
const fs = require("fs");
const rimraf = require("rimraf");

const Webidl2js = require("webidl2js");

const transformer = new Webidl2js({
  implSuffix: "-impl",
  suppressErrors: true
});

function addDir(dir) {
  const resolved = path.resolve(__dirname, dir);
  transformer.addSource(resolved, resolved);
}

addDir("../../lib/jsdom/living/traversal");
addDir("../../lib/jsdom/living/events");
addDir("../../lib/jsdom/living/attributes");
addDir("../../lib/jsdom/living/window");
addDir("../../lib/jsdom/living/nodes");
addDir("../../lib/jsdom/living/navigator");
addDir("../../lib/jsdom/living/file-api");
addDir("../../lib/jsdom/living/xhr");
addDir("../../lib/jsdom/living/domparsing");


const outputDir = path.resolve(__dirname, "../../lib/jsdom/living/generated/");

(function() {
  // we don't wanna build this on post install since it was already built with
  // prepublish, but installing from github won't have the generated scripts 
  // and cding into node_modules to run scripts is messy :)
  if (process.argv.includes('--postinstall) && fs.existsSync(outputDir)) return;

  // Clean up any old stuff lying around.
  rimraf.sync(outputDir);
  fs.mkdirSync(outputDir);

  transformer.generate(outputDir)
    .catch(err => {
      console.error(err);
      process.exit(1);
    });
}());
