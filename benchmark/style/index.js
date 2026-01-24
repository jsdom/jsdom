"use strict";
const suite = require("../document-suite");

// Style benchmarks based on https://github.com/jsdom/jsdom/issues/3985

const cssText =
  "color: blue; background-color: white; padding: 10px; border: 1px solid black; animation: 3s linear 1s slide-in;";

exports["innerHTML: simple divs (no styles)"] = suite(document => {
  document.body.innerHTML = "<div>Hello</div>".repeat(20);
});

exports["innerHTML: divs with inline styles"] = suite(document => {
  document.body.innerHTML = `<div style="${cssText}">Cell</div>`.repeat(20);
});

exports["createElement + style properties"] = suite(document => {
  for (let i = 0; i < 20; i++) {
    const div = document.createElement("div");
    div.style.color = "blue";
    div.style.backgroundColor = "white";
    div.style.padding = "10px";
    div.style.border = "1px solid black";
    div.style.animation = "3s linear 1s slide-in";
  }
});

exports["createElement + setAttribute('style')"] = suite(document => {
  for (let i = 0; i < 20; i++) {
    const div = document.createElement("div");
    div.setAttribute("style", cssText);
  }
});

exports["createElement + style.cssText"] = suite(document => {
  for (let i = 0; i < 20; i++) {
    const div = document.createElement("div");
    div.style.cssText = cssText;
  }
});
