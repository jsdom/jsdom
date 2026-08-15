"use strict";
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

module.exports = () => {
  const bench = new Bench();

  const CONTROLS = 100;
  const { document } = (new JSDOM()).window;

  for (let i = 0; i < CONTROLS; i++) {
    const label = document.createElement("label");
    label.htmlFor = `control-${i}`;
    label.textContent = `Control ${i}`;

    const input = document.createElement("input");
    input.id = `control-${i}`;

    document.body.append(label, input);
  }

  const inputs = document.querySelectorAll("input");

  bench.add(`read labels for 1 of ${CONTROLS} controls after mutation`, () => {
    document.body.toggleAttribute("data-mutated");
    return inputs[0].labels.length;
  });

  bench.add(`read labels for ${CONTROLS} controls after mutation`, () => {
    document.body.toggleAttribute("data-mutated");
    let labelCount = 0;
    for (const input of inputs) {
      labelCount += input.labels.length;
    }
    return labelCount;
  });

  return bench;
};
