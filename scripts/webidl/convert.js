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

addDir("../../lib/jsdom/living/aborting");
addDir("../../lib/jsdom/living/attributes");
addDir("../../lib/jsdom/living/constraint-validation");
addDir("../../lib/jsdom/living/domparsing");
addDir("../../lib/jsdom/living/events");
addDir("../../lib/jsdom/living/fetch");
addDir("../../lib/jsdom/living/file-api");
addDir("../../lib/jsdom/living/hr-time");
addDir("../../lib/jsdom/living/mutation-observer");
addDir("../../lib/jsdom/living/navigator");
addDir("../../lib/jsdom/living/nodes");
addDir("../../lib/jsdom/living/svg");
addDir("../../lib/jsdom/living/traversal");
addDir("../../lib/jsdom/living/websockets");
addDir("../../lib/jsdom/living/webstorage");
addDir("../../lib/jsdom/living/window");
addDir("../../lib/jsdom/living/xhr");

const outputDir = path.resolve(__dirname, "../../lib/jsdom/living/generated/");

// Clean up any old stuff lying around.
rimraf.sync(outputDir);
fs.mkdirSync(outputDir);

transformer.generate(outputDir)
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
