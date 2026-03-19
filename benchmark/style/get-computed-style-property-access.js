"use strict";
const documentBench = require("../document-bench");

// Measures the lazy resolution path: accessing individual computed style
// properties via getPropertyValue after getComputedStyle.

const FEW_PROPERTIES = ["color", "display", "visibility", "opacity"];
const MANY_PROPERTIES = [
  "color", "display", "visibility", "opacity",
  "background-color", "font-size", "font-weight", "font-style",
  "margin-top", "margin-right", "margin-bottom", "margin-left",
  "padding-top", "padding-right", "padding-bottom", "padding-left",
  "border-top-width", "border-right-width", "border-bottom-width", "border-left-width",
  "width", "height", "top", "left", "right", "bottom",
  "line-height", "float", "clear", "border-collapse"
];

module.exports = () => {
  const { document, bench } = documentBench(doc => {
    const div = doc.createElement("div");
    div.style.color = "blue";
    div.style.display = "block";
    div.style.visibility = "visible";
    div.style.opacity = "0.5";
    doc.body.appendChild(div);
  });
  const window = document.defaultView;

  bench.add("few properties (4)", () => {
    const cs = window.getComputedStyle(document.body.firstChild);
    for (const prop of FEW_PROPERTIES) {
      cs.getPropertyValue(prop);
    }
  });

  bench.add("many properties (30)", () => {
    const cs = window.getComputedStyle(document.body.firstChild);
    for (const prop of MANY_PROPERTIES) {
      cs.getPropertyValue(prop);
    }
  });

  return bench;
};
