"use strict";
const documentBench = require("../document-bench");

// Style benchmarks based on https://github.com/jsdom/jsdom/issues/3985

const cssText =
  "color: blue; background-color: white; padding: 10px; border: 1px solid black; animation: 3s linear 1s slide-in;";

module.exports = () => {
  const { document, bench } = documentBench();

  bench.add("innerHTML: simple divs (no styles)", () => {
    document.body.innerHTML = "<div>Hello</div>".repeat(20);
  });

  bench.add("innerHTML: divs with inline styles", () => {
    document.body.innerHTML = `<div style="${cssText}">Cell</div>`.repeat(20);
  });

  bench.add("createElement + style properties", () => {
    for (let i = 0; i < 20; i++) {
      const div = document.createElement("div");
      div.style.color = "blue";
      div.style.backgroundColor = "white";
      div.style.padding = "10px";
      div.style.border = "1px solid black";
      div.style.animation = "3s linear 1s slide-in";
    }
  });

  bench.add("createElement + setAttribute('style')", () => {
    for (let i = 0; i < 20; i++) {
      const div = document.createElement("div");
      div.setAttribute("style", cssText);
    }
  });

  bench.add("createElement + style.cssText", () => {
    for (let i = 0; i < 20; i++) {
      const div = document.createElement("div");
      div.style.cssText = cssText;
    }
  });

  return bench;
};
