"use strict";
const documentBench = require("../document-bench");

module.exports = () => {
  const { document, bench } = documentBench();

  const rules = Array.from({ length: 500 }, (_, i) => `.c${i} { display: flex; padding: ${i}px; border: 1px solid; }`);
  rules.push(...Array.from({ length: 100 }, (_, i) => `[data-a${i}] [data-b] { opacity: 0.5; }`));
  const style = document.createElement("style");
  style.textContent = rules.join("\n");
  document.head.append(style);

  let inputs;
  bench.add("focus() between siblings under 30 ancestors", () => {
    for (const input of inputs) {
      input.focus();
    }
  }, {
    beforeEach() {
      const ancestors = Array.from({ length: 30 }, (_, i) => `<div class="c${i * 15}">`).join("");
      document.body.innerHTML = `${ancestors}${"<input>".repeat(10)}${"</div>".repeat(30)}`;
      inputs = document.querySelectorAll("input");
    }
  });

  return bench;
};
