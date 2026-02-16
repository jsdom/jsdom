"use strict";
const documentBench = require("../document-bench");

module.exports = () => {
  const { document, bench } = documentBench();
  const window = document.defaultView;

  {
    let divs = [];

    bench.add("flat (20 siblings)", () => {
      for (const div of divs) {
        window.getComputedStyle(div);
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

    bench.add("deep (10-level nesting)", () => {
      window.getComputedStyle(leaf);
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

    bench.add("deep, all levels (10-level nesting)", () => {
      for (const el of elements) {
        window.getComputedStyle(el);
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
