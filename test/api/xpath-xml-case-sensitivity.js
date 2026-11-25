"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

const NUMBER_TYPE = 1;
const STRING_TYPE = 2;

function numberValue(document, expression) {
  return document.evaluate(expression, document, null, NUMBER_TYPE, null).numberValue;
}

function stringValue(document, expression) {
  return document.evaluate(expression, document, null, STRING_TYPE, null).stringValue;
}

describe("XPath: name case-sensitivity", () => {
  describe("XML documents (case-sensitive, per XPath 1.0)", () => {
    const markup = `<root Attr="v" attr="w"><Child Attr="x"/></root>`;
    const makeDoc = () => new JSDOM(markup, { contentType: "application/xml" }).window.document;

    it("matches an attribute with an upper case name", () => {
      const document = makeDoc();
      assert.equal(numberValue(document, "count(//@Attr)"), 2);
    });

    it("does not conflate attributes whose names differ only in case", () => {
      const document = makeDoc();
      assert.equal(stringValue(document, "string(/root/@Attr)"), "v");
      assert.equal(stringValue(document, "string(/root/@attr)"), "w");
    });

    it("matches an attribute predicate with an upper case name", () => {
      const document = makeDoc();
      assert.equal(numberValue(document, "count(//Child[@Attr = 'x'])"), 1);
      assert.equal(numberValue(document, "count(//Child[@attr = 'x'])"), 0);
    });

    it("matches an element with a mixed case name", () => {
      const document = makeDoc();
      assert.equal(numberValue(document, "count(//Child)"), 1);
      assert.equal(numberValue(document, "count(//child)"), 0);
    });

    it("still returns the attribute value through string()", () => {
      const document = makeDoc();
      assert.equal(stringValue(document, "string(//Child/@Attr)"), "x");
    });
  });

  describe("HTML documents (case-insensitive)", () => {
    // The HTML parser lower-cases attribute names, and XPath name tests against an HTML document
    // still have to match regardless of the case used in the expression.
    const makeDoc = () => new JSDOM(`<div Data-X="v"><SPAN>t</SPAN></div>`).window.document;

    it("matches an attribute written in a different case", () => {
      const document = makeDoc();
      assert.equal(numberValue(document, "count(//@Data-X)"), 1);
      assert.equal(numberValue(document, "count(//@data-x)"), 1);
      assert.equal(numberValue(document, "count(//@DATA-X)"), 1);
    });

    it("matches an element written in a different case", () => {
      const document = makeDoc();
      assert.equal(numberValue(document, "count(//div)"), 1);
      assert.equal(numberValue(document, "count(//DIV)"), 1);
      assert.equal(numberValue(document, "count(//span)"), 1);
      assert.equal(numberValue(document, "count(//SPAN)"), 1);
    });

    it("matches an attribute predicate written in a different case", () => {
      const document = makeDoc();
      assert.equal(numberValue(document, "count(//div[@Data-X = 'v'])"), 1);
      assert.equal(numberValue(document, "count(//div[@data-x = 'v'])"), 1);
    });
  });
});
