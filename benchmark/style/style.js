"use strict";
const documentBench = require("../document-bench");

// Style benchmarks based on https://github.com/jsdom/jsdom/issues/3985

const cssText =
  "color: blue; background-color: white; padding: 10px; border: 1px solid black; animation: 3s linear 1s slide-in;";

module.exports = () => {
  const { document, bench } = documentBench();
  const window = document.defaultView;

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

  bench.add("getComputedStyle: flat (20 siblings)", () => {
    for (let i = 0; i < 20; i++) {
      const div = document.createElement("div");
      div.style.color = "blue";
      document.body.appendChild(div);
      window.getComputedStyle(div).color;
    }
  });

  bench.add("getComputedStyle: deep (10-level nesting)", () => {
    let parent = document.body;
    for (let i = 0; i < 10; i++) {
      const div = document.createElement("div");
      div.style.color = "blue";
      parent.appendChild(div);
      parent = div;
    }
    window.getComputedStyle(parent).color;
  });

  bench.add("getComputedStyle: deep, all levels (10-level nesting)", () => {
    let parent = document.body;
    for (let i = 0; i < 10; i++) {
      const div = document.createElement("div");
      div.style.color = "blue";
      parent.appendChild(div);
      parent = div;
    }
    let el = parent;
    while (el !== document.body) {
      window.getComputedStyle(el).color;
      el = el.parentElement;
    }
  });

  return bench;
};
