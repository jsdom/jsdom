"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

const STRING_TYPE = 2;

function evaluateString(document, expression, contextNode = document) {
  return document.evaluate(expression, contextNode, null, STRING_TYPE, null).stringValue;
}

describe("XPath: name() and local-name()", () => {
  describe("HTML elements", () => {
    // jsdom reports HTML element nodeNames in upper case, but the XPath data model requires the
    // lower case qualified name that browsers also return.
    it("name() returns the lower case element name", () => {
      const { document } = new JSDOM(`<div id="root"><span>x</span></div>`).window;
      assert.equal(evaluateString(document, "name()", document.getElementById("root")), "div");
      assert.equal(evaluateString(document, "name(//span)"), "span");
    });

    it("local-name() returns the lower case element name", () => {
      const { document } = new JSDOM(`<div id="root"><span>x</span></div>`).window;
      assert.equal(evaluateString(document, "local-name()", document.getElementById("root")), "div");
      assert.equal(evaluateString(document, "local-name(//span)"), "span");
    });
  });

  describe("attributes", () => {
    it("name() returns the attribute name", () => {
      const { document } = new JSDOM(`<div id="root" data-x="1"></div>`).window;
      assert.equal(evaluateString(document, "name(//@data-x)"), "data-x");
      assert.equal(evaluateString(document, "local-name(//@data-x)"), "data-x");
    });
  });

  describe("node types without a name", () => {
    // XPath 1.0 §4.1 and §4.2: for node types other than element, attribute and processing
    // instruction, both functions return the empty string.
    const cases = [
      ["text node", "name(//text())"],
      ["comment node", "name(//comment())"],
      ["document node", "name(/)"]
    ];

    for (const [label, expression] of cases) {
      it(`name() returns an empty string for a ${label}`, () => {
        const { document } = new JSDOM(`<div id="root">t<!-- c --></div>`).window;
        assert.equal(evaluateString(document, expression), "");
      });
    }

    it("local-name() returns an empty string for a text node", () => {
      const { document } = new JSDOM(`<div id="root">t</div>`).window;
      assert.equal(evaluateString(document, "local-name(//text())"), "");
    });
  });

  describe("empty node-sets", () => {
    // Both functions take the first node in document order and return "" for an empty set.
    it("name() returns an empty string", () => {
      const { document } = new JSDOM(`<div></div>`).window;
      assert.equal(evaluateString(document, "name(//nope)"), "");
    });

    it("local-name() returns an empty string", () => {
      const { document } = new JSDOM(`<div></div>`).window;
      assert.equal(evaluateString(document, "local-name(//nope)"), "");
    });
  });

  describe("namespaced XML", () => {
    it("name() returns the qualified name including the prefix", () => {
      const dom = new JSDOM(`<root xmlns:p="urn:example"><p:item/></root>`, { contentType: "application/xml" });
      const { document } = dom.window;
      assert.equal(evaluateString(document, "name(//*[local-name() = 'item'])"), "p:item");
    });

    it("local-name() returns only the local part", () => {
      const dom = new JSDOM(`<root xmlns:p="urn:example"><p:item/></root>`, { contentType: "application/xml" });
      const { document } = dom.window;
      assert.equal(evaluateString(document, "local-name(//*[local-name() = 'item'])"), "item");
    });
  });

  describe("interaction with other functions", () => {
    it("name() is usable inside a boolean expression", () => {
      const { document } = new JSDOM(`<div id="root"><h3>x</h3></div>`).window;
      const contextNode = document.getElementById("root").firstElementChild;
      const result = document.evaluate(`name() = "h3"`, contextNode, null, /* BOOLEAN_TYPE */ 3, null);
      assert.equal(result.booleanValue, true);
    });

    it("name() defaults to the context node", () => {
      const { document } = new JSDOM(`<div id="root"></div>`).window;
      const contextNode = document.getElementById("root");
      assert.equal(evaluateString(document, "name()", contextNode), evaluateString(document, "name(.)", contextNode));
    });
  });
});
