"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

describe("HTMLElement.tabIndex / SVGElement.tabIndex reflection", () => {
  describe("non-focusable elements (default tabIndex is -1)", () => {
    it("returns -1 when the tabindex attribute is missing", () => {
      const { document } = new JSDOM(`<div></div>`).window;
      const div = document.querySelector("div");
      assert.equal(div.tabIndex, -1);
    });

    it("returns -1 for empty or invalid values", () => {
      const { document } = new JSDOM(`<div></div>`).window;
      const div = document.querySelector("div");

      div.setAttribute("tabindex", "");
      assert.equal(div.tabIndex, -1, "empty string");

      div.setAttribute("tabindex", "   ");
      assert.equal(div.tabIndex, -1, "whitespace only");

      div.setAttribute("tabindex", "foo");
      assert.equal(div.tabIndex, -1, "non-numeric string 'foo'");

      div.setAttribute("tabindex", "--1");
      assert.equal(div.tabIndex, -1, "invalid signs '--1'");

      div.setAttribute("tabindex", "++1");
      assert.equal(div.tabIndex, -1, "invalid signs '++1'");

      div.setAttribute("tabindex", "\u00A01");
      assert.equal(div.tabIndex, -1, "non-ASCII whitespace prefix");
    });

    it("parses leading integers with trailing characters per HTML rules", () => {
      const { document } = new JSDOM(`<div></div>`).window;
      const div = document.querySelector("div");

      div.setAttribute("tabindex", "1x");
      assert.equal(div.tabIndex, 1, "'1x'");

      div.setAttribute("tabindex", "0foo");
      assert.equal(div.tabIndex, 0, "'0foo'");

      div.setAttribute("tabindex", "-5px");
      assert.equal(div.tabIndex, -5, "'-5px'");

      div.setAttribute("tabindex", "+10%");
      assert.equal(div.tabIndex, 10, "'+10%'");
    });

    it("returns valid signed integers", () => {
      const { document } = new JSDOM(`<div></div>`).window;
      const div = document.querySelector("div");

      div.setAttribute("tabindex", "0");
      assert.equal(div.tabIndex, 0);

      div.setAttribute("tabindex", "-0");
      assert.equal(div.tabIndex, 0);

      div.setAttribute("tabindex", "42");
      assert.equal(div.tabIndex, 42);

      div.setAttribute("tabindex", "-7");
      assert.equal(div.tabIndex, -7);

      div.setAttribute("tabindex", "  15\n\t");
      assert.equal(div.tabIndex, 15);
    });

    it("handles 32-bit signed integer boundaries and overflows", () => {
      const { document } = new JSDOM(`<div></div>`).window;
      const div = document.querySelector("div");

      div.setAttribute("tabindex", "2147483647");
      assert.equal(div.tabIndex, 2147483647, "max signed 32-bit int");

      div.setAttribute("tabindex", "-2147483648");
      assert.equal(div.tabIndex, -2147483648, "min signed 32-bit int");

      div.setAttribute("tabindex", "2147483648");
      assert.equal(div.tabIndex, -1, "positive 32-bit overflow (2^31)");

      div.setAttribute("tabindex", "99999999999");
      assert.equal(div.tabIndex, -1, "large positive overflow");

      div.setAttribute("tabindex", "-2147483649");
      assert.equal(div.tabIndex, -1, "negative 32-bit underflow (-(2^31 + 1))");

      div.setAttribute("tabindex", "-99999999999");
      assert.equal(div.tabIndex, -1, "large negative underflow");
    });

    it("handles detached summary elements as non-focusable default (-1)", () => {
      const { document } = new JSDOM(`<summary></summary>`).window;
      const summary = document.querySelector("summary");
      assert.equal(summary.tabIndex, -1);

      summary.setAttribute("tabindex", "invalid");
      assert.equal(summary.tabIndex, -1);

      summary.setAttribute("tabindex", "99999999999");
      assert.equal(summary.tabIndex, -1);
    });
  });

  describe("focusable elements (default tabIndex is 0)", () => {
    it("returns 0 when the tabindex attribute is missing", () => {
      const { document } = new JSDOM(`
        <button></button>
        <a></a>
        <input>
        <select></select>
        <textarea></textarea>
        <details><summary></summary></details>
        <svg xmlns="http://www.w3.org/2000/svg"><a></a></svg>
      `).window;

      assert.equal(document.querySelector("button").tabIndex, 0);
      assert.equal(document.querySelector("a").tabIndex, 0);
      assert.equal(document.querySelector("input").tabIndex, 0);
      assert.equal(document.querySelector("select").tabIndex, 0);
      assert.equal(document.querySelector("textarea").tabIndex, 0);
      assert.equal(document.querySelector("details summary").tabIndex, 0);
      assert.equal(document.querySelector("svg a").tabIndex, 0);
    });

    it("returns 0 for empty or invalid values", () => {
      const { document } = new JSDOM(`<button></button>`).window;
      const button = document.querySelector("button");

      button.setAttribute("tabindex", "");
      assert.equal(button.tabIndex, 0, "empty string");

      button.setAttribute("tabindex", "   ");
      assert.equal(button.tabIndex, 0, "whitespace only");

      button.setAttribute("tabindex", "foo");
      assert.equal(button.tabIndex, 0, "non-numeric string 'foo'");

      button.setAttribute("tabindex", "--1");
      assert.equal(button.tabIndex, 0, "invalid signs '--1'");

      button.setAttribute("tabindex", "++1");
      assert.equal(button.tabIndex, 0, "invalid signs '++1'");

      button.setAttribute("tabindex", "\u00A01");
      assert.equal(button.tabIndex, 0, "non-ASCII whitespace prefix");
    });

    it("parses leading integers with trailing characters per HTML rules", () => {
      const { document } = new JSDOM(`<button></button>`).window;
      const button = document.querySelector("button");

      button.setAttribute("tabindex", "1x");
      assert.equal(button.tabIndex, 1, "'1x'");

      button.setAttribute("tabindex", "0foo");
      assert.equal(button.tabIndex, 0, "'0foo'");

      button.setAttribute("tabindex", "-5px");
      assert.equal(button.tabIndex, -5, "'-5px'");

      button.setAttribute("tabindex", "+10%");
      assert.equal(button.tabIndex, 10, "'+10%'");
    });

    it("handles 32-bit signed integer boundaries and overflows", () => {
      const { document } = new JSDOM(`<button></button>`).window;
      const button = document.querySelector("button");

      button.setAttribute("tabindex", "2147483647");
      assert.equal(button.tabIndex, 2147483647, "max signed 32-bit int");

      button.setAttribute("tabindex", "-2147483648");
      assert.equal(button.tabIndex, -2147483648, "min signed 32-bit int");

      button.setAttribute("tabindex", "2147483648");
      assert.equal(button.tabIndex, 0, "positive 32-bit overflow (2^31)");

      button.setAttribute("tabindex", "99999999999");
      assert.equal(button.tabIndex, 0, "large positive overflow");

      button.setAttribute("tabindex", "-2147483649");
      assert.equal(button.tabIndex, 0, "negative 32-bit underflow (-(2^31 + 1))");

      button.setAttribute("tabindex", "-99999999999");
      assert.equal(button.tabIndex, 0, "large negative underflow");
    });

    it("handles summary elements inside details as focusable default (0)", () => {
      const { document } = new JSDOM(`<details><summary></summary></details>`).window;
      const summary = document.querySelector("details summary");
      assert.equal(summary.tabIndex, 0);

      summary.setAttribute("tabindex", "invalid");
      assert.equal(summary.tabIndex, 0);

      summary.setAttribute("tabindex", "99999999999");
      assert.equal(summary.tabIndex, 0);
    });

    it("handles SVG <a> elements as focusable default (0)", () => {
      const { document } = new JSDOM(`<svg xmlns="http://www.w3.org/2000/svg"><a></a></svg>`)
        .window;
      const svgA = document.querySelector("svg a");
      assert.equal(svgA.tabIndex, 0);

      svgA.setAttribute("tabindex", "invalid");
      assert.equal(svgA.tabIndex, 0);

      svgA.setAttribute("tabindex", "99999999999");
      assert.equal(svgA.tabIndex, 0);
    });
  });

  describe("tabIndex setter", () => {
    it("sets the tabindex attribute to string representation of 32-bit signed int", () => {
      const { document } = new JSDOM(`<div></div>`).window;
      const div = document.querySelector("div");

      div.tabIndex = 5;
      assert.equal(div.getAttribute("tabindex"), "5");
      assert.equal(div.tabIndex, 5);

      div.tabIndex = -1;
      assert.equal(div.getAttribute("tabindex"), "-1");
      assert.equal(div.tabIndex, -1);

      div.tabIndex = 0;
      assert.equal(div.getAttribute("tabindex"), "0");
      assert.equal(div.tabIndex, 0);
    });
  });
});
