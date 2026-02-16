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

  {
    let divs = [];

    bench.add("getComputedStyle: flat (20 siblings)", () => {
      for (const div of divs) {
        window.getComputedStyle(div).color;
      }
    }, {
      beforeEach() {
        document.body.innerHTML = "";
        divs = [];
        for (let i = 0; i < 20; i++) {
          const div = document.createElement("div");
          div.style.color = "blue";
          document.body.appendChild(div);
          divs.push(div);
        }
      }
    });
  }

  {
    let leaf;

    bench.add("getComputedStyle: deep (10-level nesting)", () => {
      window.getComputedStyle(leaf).color;
    }, {
      beforeEach() {
        document.body.innerHTML = "";
        let parent = document.body;
        for (let i = 0; i < 10; i++) {
          const div = document.createElement("div");
          div.style.color = "blue";
          parent.appendChild(div);
          parent = div;
        }
        leaf = parent;
      }
    });
  }

  {
    let elements = [];

    bench.add("getComputedStyle: deep, all levels (10-level nesting)", () => {
      for (const el of elements) {
        window.getComputedStyle(el).color;
      }
    }, {
      beforeEach() {
        document.body.innerHTML = "";
        elements = [];
        let parent = document.body;
        for (let i = 0; i < 10; i++) {
          const div = document.createElement("div");
          div.style.color = "blue";
          parent.appendChild(div);
          elements.push(div);
          parent = div;
        }
      }
    });
  }

  return bench;
};
