"use strict";
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

module.exports = () => {
  const bench = new Bench();
  const { window } = new JSDOM();
  const audio = window.document.createElement("audio");

  bench.add("dispatch 100 queued media events", async () => {
    const completed = new Promise(resolve => {
      let remaining = 100;
      audio.onvolumechange = () => {
        if (--remaining === 0) {
          resolve();
        }
      };
    });
    for (let i = 0; i < 100; ++i) {
      audio.volume = i % 2;
    }
    await completed;
  });

  bench.add("dispatch 100 queued messages", async () => {
    const completed = new Promise(resolve => {
      let remaining = 100;
      window.onmessage = () => {
        if (--remaining === 0) {
          resolve();
        }
      };
    });
    for (let i = 0; i < 100; ++i) {
      window.postMessage("message", "*");
    }
    await completed;
  });

  return bench;
};
