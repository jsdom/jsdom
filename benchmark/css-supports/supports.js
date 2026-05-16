"use strict";

const documentBench = require("../document-bench.js");

module.exports = () => {
  const { document, bench } = documentBench();
  const { CSS } = document.defaultView;

  bench.add("CSS.supports('color', 'red') [2 args]", () => {
    CSS.supports("color", "red");
  });

  bench.add("CSS.supports('unknown-prop', 'value') [2 args - false]", () => {
    CSS.supports("unknown-prop", "value");
  });

  bench.add("CSS.supports('display: flex') [fast path]", () => {
    CSS.supports("display: flex");
  });

  bench.add("CSS.supports('--my-custom: red') [custom prop]", () => {
    CSS.supports("--my-custom: red");
  });

  bench.add("CSS.supports('(display: grid) and (not (display: inline-grid))')", () => {
    CSS.supports("(display: grid) and (not (display: inline-grid))");
  });

  let counter = 0;
  bench.add("CSS.supports('color: ...') [cache miss simulation]", () => {
    CSS.supports(`color: red${counter++}`);
  });

  const modernizrQueries = [
    "display: grid",
    "display: flex",
    "position: sticky",
    "backdrop-filter: blur(2px)",
    "container-type: inline-size",
    "aspect-ratio: 16/9",
    "scroll-behavior: smooth",
    "(transform-style: preserve-3d) or (-webkit-transform-style: preserve-3d)",
    "color: color(display-p3 1 0.5 0)"
  ];
  bench.add("Real-world: Modernizr-like startup batch (9 queries)", () => {
    for (const query of modernizrQueries) {
      CSS.supports(query);
    }
  });

  bench.add("Real-world: CSS-in-JS component list render (100 iterations)", () => {
    for (let i = 0; i < 100; i++) {
      CSS.supports("gap", "1em");
      CSS.supports("display", "contents");
      CSS.supports("mask-image", "linear-gradient(#000, #fff)");
    }
  });

  return bench;
};
