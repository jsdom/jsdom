"use strict";
const assert = require("node:assert/strict");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../../..");

describe("level2/grid-template-columns-calc", () => {
  specify("mixed bare length + top-level calc track lists are kept (GH-4141)", () => {
    const { document } = (new JSDOM()).window;
    const el = document.createElement("div");
    const values = [
      "100px 1fr",
      "40% 60%",
      "6.25rem 50%",
      "calc(100px) calc(100% - 100px)",
      "calc(100%) calc(50%)",
      "repeat(2, minmax(calc(50% - 2rem), 50%))",
      "minmax(8rem, calc(100% - 8rem))",
      "100px calc(100% - 100px)",
      "6.25rem calc((100% - 6.25rem) / 1)",
      "6.25rem 60% calc((40% - 6.25rem) / 2) calc((40% - 6.25rem) / 2)"
    ];

    for (const value of values) {
      el.style.gridTemplateColumns = "";
      el.style.gridTemplateColumns = value;
      assert.equal(el.style.gridTemplateColumns, value, value);
    }

    el.style.gridTemplateRows = "";
    el.style.gridTemplateRows = "100px calc(100% - 100px)";
    assert.equal(el.style.gridTemplateRows, "100px calc(100% - 100px)");
  });

  specify("box-shadow still rejects percent calc used as a length (GH-4141)", () => {
    const { document } = (new JSDOM()).window;
    const el = document.createElement("div");

    el.style.boxShadow = "1px calc(2px + 2%)";
    assert.equal(el.style.boxShadow, "");

    el.style.boxShadow = "1px calc(2px + 2px)";
    assert.equal(el.style.boxShadow, "1px calc(2px + 2px)");
  });
});
