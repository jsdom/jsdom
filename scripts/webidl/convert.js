/* eslint-disable no-console, no-process-exit */

"use strict";

const path = require("path");

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
addDir("../../lib/jsdom/living/xhr");
addDir("../../lib/jsdom/living/domparsing");

transformer.generate(path.resolve(__dirname, "../../lib/jsdom/living/generated/"))
  .catch(err => {
    console.error(err);
    process.exit(1);
  });
