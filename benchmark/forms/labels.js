"use strict";
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

module.exports = () => {
  const bench = new Bench();

  function addTask(controlCount, labelCount, readCount) {
    const { document } = (new JSDOM()).window;
    const inputs = [];

    for (let i = 0; i < controlCount; i++) {
      if (i < labelCount) {
        const label = document.createElement("label");
        label.htmlFor = `control-${i}`;
        label.textContent = `Control ${i}`;
        document.body.append(label);
      }

      const input = document.createElement("input");
      input.id = `control-${i}`;
      document.body.append(input);
      inputs.push(input);
    }

    bench.add(`read labels for ${readCount}/${controlCount} controls after mutation (${labelCount} labels)`, () => {
      document.body.toggleAttribute("data-mutated");
      let labels = 0;
      for (let i = 0; i < readCount; i++) {
        labels += inputs[i].labels.length;
      }
      return labels;
    });
  }

  addTask(100, 100, 1);
  addTask(10, 10, 10);
  addTask(100, 100, 100);
  addTask(100, 10, 100);
  addTask(100, 0, 100);

  return bench;
};
