"use strict";
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

const ELEMENTS = 1000;
const DEFINITIONS = 500;
const ROWS = 400;

module.exports = () => {
  const bench = new Bench();

  addBenchmarks(bench, 0);
  addBenchmarks(bench, DEFINITIONS);
  for (const definitionCount of [0, 10, 25, 100]) {
    addUIMountBenchmark(bench, definitionCount);
  }
  addCustomElementControls(bench);

  return bench;
};

function addBenchmarks(bench, definitionCount) {
  const { window } = new JSDOM();
  const { document } = window;
  const suffix = definitionCount === 0 ? "empty registry" : `${definitionCount} definitions`;

  registerDefinitions(window, definitionCount);

  bench.add(`createElement(): ${ELEMENTS} ordinary elements, ${suffix}`, () => {
    for (let i = 0; i < ELEMENTS; ++i) {
      document.createElement("div");
    }
  });

  const subtree = createSubtree(document);
  bench.add(`append()/remove(): ${ELEMENTS}-element ordinary subtree, ${suffix}`, () => {
    document.body.append(subtree);
    subtree.remove();
  });
}

function addUIMountBenchmark(bench, definitionCount) {
  const { window } = new JSDOM();
  const { document } = window;
  const suffix = definitionCount === 0 ? "empty registry" : `${definitionCount} definitions`;

  registerDefinitions(window, definitionCount);

  bench.add(`create/append/remove: ${ROWS}-row ordinary UI tree, ${suffix}`, () => {
    const tree = createUITree(document);
    document.body.append(tree);
    tree.remove();
  });
}

function addCustomElementControls(bench) {
  const { window } = new JSDOM();
  const { document } = window;

  window.customElements.define("benchmark-element", class extends window.HTMLElement {});
  window.customElements.define("benchmark-button", class extends window.HTMLButtonElement {}, { extends: "button" });

  bench.add(`createElement(): ${ELEMENTS} defined autonomous custom elements`, () => {
    for (let i = 0; i < ELEMENTS; ++i) {
      document.createElement("benchmark-element");
    }
  });

  bench.add(`createElement(): ${ELEMENTS} defined customized built-ins`, () => {
    for (let i = 0; i < ELEMENTS; ++i) {
      document.createElement("button", { is: "benchmark-button" });
    }
  });

  const subtree = createSubtree(document, "unregistered-element");
  bench.add(`append()/remove(): ${ELEMENTS}-element undefined custom subtree`, () => {
    document.body.append(subtree);
    subtree.remove();
  });
}

function createSubtree(document, localName = "div") {
  const parent = document.createElement("div");

  for (let i = 0; i < ELEMENTS; ++i) {
    parent.append(document.createElement(localName));
  }

  return parent;
}

function createUITree(document) {
  const main = document.createElement("main");

  for (let i = 0; i < ROWS; ++i) {
    const row = document.createElement("section");
    row.className = "row";

    const label = document.createElement("label");
    label.htmlFor = `field-${i}`;
    label.textContent = `Field ${i}`;

    const input = document.createElement("input");
    input.id = `field-${i}`;
    input.value = String(i);

    const button = document.createElement("button");
    button.type = "button";
    button.textContent = "Save";

    const status = document.createElement("span");
    status.textContent = "Ready";

    row.append(label, input, button, status);
    main.append(row);
  }

  return main;
}

function registerDefinitions(window, count) {
  for (let i = 0; i < count; ++i) {
    window.customElements.define(`custom-element-${i}`, class extends window.HTMLElement {});
  }
}
