"use strict";

const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

const ROW_COUNT = 24;
const FILLER_ELEMENTS_PER_ROW = 38;

module.exports = () => {
  const bench = new Bench();
  const { document } = (new JSDOM()).window;
  const container = document.createElement("form");
  const controls = [];

  // Approximate a form with 24 labeled controls in a roughly 1,000-element subtree.
  for (let row = 0; row < ROW_COUNT; ++row) {
    const wrapper = document.createElement("div");
    const id = `base-ui-«r${row}»-label`;

    const label = document.createElement("span");
    label.id = id;
    label.textContent = `Label ${row}`;
    wrapper.append(label);

    const control = document.createElement("input");
    control.setAttribute("aria-labelledby", id);
    controls.push(control);
    wrapper.append(control);

    for (let item = 0; item < FILLER_ELEMENTS_PER_ROW; ++item) {
      wrapper.append(document.createElement("span"));
    }

    container.append(wrapper);
  }

  document.body.append(container);

  function resolveLabels() {
    for (const control of controls) {
      const id = control.getAttribute("aria-labelledby");
      const label = container.querySelector(`[id="${id}"]`);
      if (label === null) {
        throw new Error(`Could not resolve ${id}`);
      }
    }
  }

  bench.add("querySelector(): resolve 24 aria-labelledby references", resolveLabels);

  bench.add("querySelector(): resolve 24 aria-labelledby references after mutation", () => {
    container.toggleAttribute("data-render");
    resolveLabels();
  });

  return bench;
};
