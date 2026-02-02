"use strict";
const { JSDOM } = require("../../../..");
const idlUtils = require("../generated/utils");

const dom = new JSDOM();
const xhr = new dom.window.XMLHttpRequest();
const xhrImpl = idlUtils.implForWrapper(xhr);

const chunks = [];

process.stdin.on("data", chunk => {
  chunks.push(chunk);
});

process.stdin.on("end", () => {
  // eslint-disable-next-line no-restricted-globals -- We can't avoid receiving `Buffer`s from `process.stdin`.
  const buffer = Buffer.concat(chunks);

  const config = JSON.parse(buffer.toString());
  xhrImpl._adoptSerializedRequest(config);

  function writeResultAndExit() {
    process.stdout.write(JSON.stringify(xhrImpl._serializeResponse()), () => {
      // Exit immediately. The process destruction will handle all connection cleanup.
      process.exit(0);
    });
  }

  try {
    xhr.addEventListener("loadend", writeResultAndExit, false);
    xhr.send(xhrImpl._body);
  } catch (error) {
    xhrImpl._error = error;
    writeResultAndExit();
  }
});
