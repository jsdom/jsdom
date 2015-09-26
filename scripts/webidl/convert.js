"use strict";
const fs = require("fs");
const path = require("path");
const Q = require("q");
const recursive = require("recursive-readdir");
const webidl2js = require("webidl2js");

const UTIL_PATH = "lib/jsdom/living/generated/util.js";

function readConcatenatedSource(files) {
  return Q.all(files.map(f => {
    return Q.nfcall(fs.readFile, f, { encoding: "utf8" });
  })).then(sources => {
    let src = "";
    for (let i = 0; i < sources.length; ++i) {
      src += sources[i];
    }
    return src;
  });
}

function generateClasses(src, outputDir, implDir, utilPath) {
  webidl2js.generate(src, outputDir, implDir, { suppressErrors: true, implSuffix: "-impl", utilPath });
}

function doConversion(inputPath) {
  let isDir;

  return Q.nfcall(fs.stat, inputPath)
  .then(inputStat => {
    isDir = inputStat.isDirectory();
    if (isDir) {
      return Q.nfcall(recursive, inputPath, ["*.js"]);
    }

    return [inputPath]; // get dir name
  })
  .then(readConcatenatedSource)
  .then(src => {
    const folder = isDir ? inputPath : path.dirname(inputPath);
    generateClasses(src, folder, ".", UTIL_PATH);
  });
}

doConversion("lib/jsdom/living/generated/events").done();
