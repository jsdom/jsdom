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
      // Close the JSDOM window to clean up undici connections before exiting.
      // Use setTimeout to allow libuv handles to finish closing - this avoids
      // assertion failures on Windows when there are pending handles.
      // See: https://github.com/nodejs/node/issues/56645
      dom.window.close();
      setTimeout(() => process.exit(0), 50);
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
