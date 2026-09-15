"use strict";
const { Bench } = require("tinybench");
const { JSDOM, VirtualConsole } = require("../..");

module.exports = () => {
  const bench = new Bench();
  const { window } = new JSDOM("", { virtualConsole: new VirtualConsole() });
  const smallBlob = new window.Blob([new Uint8Array(1024)]);
  const largeBlob = new window.Blob([new Uint8Array(32 * 1024 * 1024)]);
  const smallURL = window.URL.createObjectURL(smallBlob);
  const largeURL = window.URL.createObjectURL(largeBlob);
  bench.addEventListener("complete", () => window.close(), { once: true });

  for (const [name, blob] of [["1 KiB", smallBlob], ["32 MiB", largeBlob]]) {
    bench.add(`create/revoke URL: ${name}`, () => {
      const url = window.URL.createObjectURL(blob);
      window.URL.revokeObjectURL(url);
    });
  }

  function read(url, range, expectError = false) {
    return new Promise((resolve, reject) => {
      const xhr = new window.XMLHttpRequest();
      xhr.open("GET", url);
      xhr.responseType = "arraybuffer";
      if (range !== undefined) {
        xhr.setRequestHeader("Range", range);
      }
      xhr.onload = () => {
        if (expectError) {
          reject(new Error("The invalid range unexpectedly succeeded"));
        } else {
          resolve(xhr.response.byteLength);
        }
      };
      xhr.onerror = () => {
        if (expectError) {
          resolve();
        } else {
          reject(new Error("The blob request failed"));
        }
      };
      xhr.send();
    });
  }

  bench.add("async XHR: 1 KiB", () => read(smallURL));
  bench.add("async XHR: 16 MiB range", () => read(largeURL, "bytes=1-16777216"));
  const invalidRange = `bytes=${" ".repeat(16000)}x`;
  bench.add("reject range: 16000 spaces", () => read(smallURL, invalidRange, true));

  return bench;
};
