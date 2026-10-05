"use strict";
const documentBench = require("../document-bench");

// Focusing checks `display` on every flat tree ancestor, so its cost depends on the tree depth and the number of
// style rules. Approximates a component-heavy page with CSS-in-JS class rules and some attribute-only rules.

const DEPTH = 30;
const CLASS_RULES = 500;
const ATTRIBUTE_RULES = 100;
const INPUTS = 10;

module.exports = () => {
  const { document, bench } = documentBench();

  let css = "";
  for (let i = 0; i < CLASS_RULES; i++) {
    css += `.c${i} { display: flex; padding: ${i}px; margin: 1px 2px; border: 1px solid blue; }\n`;
  }
  for (let i = 0; i < ATTRIBUTE_RULES; i++) {
    css += `[data-a${i}] [data-b] { opacity: 0.5; }\n`;
  }
  const style = document.createElement("style");
  style.textContent = css;
  document.head.append(style);

  const inputs = [];
  let parent = document.body;

  function buildTree() {
    document.body.innerHTML = "";
    inputs.length = 0;
    parent = document.body;
    for (let i = 0; i < DEPTH; i++) {
      const div = document.createElement("div");
      div.className = `c${i * 7} c${i * 7 + 1}`;
      parent.append(div);
      parent = div;
    }
    for (let i = 0; i < INPUTS; i++) {
      const input = document.createElement("input");
      parent.append(input);
      inputs.push(input);
    }
  }

  bench.add(`focus() between siblings (${DEPTH} ancestors)`, () => {
    for (const input of inputs) {
      input.focus();
    }
  }, { beforeEach: buildTree });

  bench.add(`focus() on the focused element (${DEPTH} ancestors)`, () => {
    for (let i = 0; i < INPUTS; i++) {
      inputs[0].focus();
    }
  }, { beforeEach: buildTree });

  return bench;
};
