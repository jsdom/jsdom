"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

describe("XPath: evaluate() result type conversions", () => {
  function makeDocument() {
    return new JSDOM(`<!doctype html><html><body><p id="a">hi</p><p id="b">yo</p></body></html>`)
      .window.document;
  }

  describe("document node string-value", () => {
    // Per XPath, a document node's string-value is the concatenation of all its descendant text
    // nodes. Document.textContent is null per DOM, which used to leak a null through string(/).
    it("string(/) returns the concatenated text of the document", () => {
      const document = makeDocument();
      assert.equal(
        document.evaluate("string(/)", document, null, 2 /* STRING_TYPE */, null).stringValue,
        "hiyo",
      );
    });

    it("string(/) with ANY_TYPE reports STRING_TYPE rather than a node type", () => {
      const document = makeDocument();
      assert.equal(
        document.evaluate("string(/)", document, null, 0 /* ANY_TYPE */, null).resultType,
        2 /* STRING_TYPE */,
      );
    });

    it("string(/) on a document without elements returns an empty string", () => {
      const { document } = new JSDOM("", { contentType: "text/html" }).window;
      assert.equal(
        document.evaluate("string(/)", document, null, 2 /* STRING_TYPE */, null).stringValue,
        "",
      );
    });

    it("an element node still stringifies via textContent", () => {
      const document = makeDocument();
      assert.equal(
        document.evaluate("string(//p[1])", document, null, 2 /* STRING_TYPE */, null).stringValue,
        "hi",
      );
    });
  });

  describe("mismatched result types throw XPathException TYPE_ERR", () => {
    const FIRST_ORDERED_NODE_TYPE = 9;
    const ORDERED_NODE_SNAPSHOT_TYPE = 7;

    function assertTypeErr(document, fn) {
      assert.throws(fn, (e) => {
        assert.equal(e.name, "XPathException");
        assert.equal(e.code, document.defaultView.XPathException.TYPE_ERR);
        return true;
      });
    }

    it("throws TYPE_ERR for a string result requested as FIRST_ORDERED_NODE_TYPE", () => {
      const document = makeDocument();
      assertTypeErr(document, () =>
        document.evaluate("string(/)", document, null, FIRST_ORDERED_NODE_TYPE, null),
      );
    });

    it("throws TYPE_ERR for a number result requested as ORDERED_NODE_SNAPSHOT_TYPE", () => {
      const document = makeDocument();
      assertTypeErr(document, () =>
        document.evaluate("count(//p)", document, null, ORDERED_NODE_SNAPSHOT_TYPE, null),
      );
    });

    it("throws TYPE_ERR for a boolean result requested as FIRST_ORDERED_NODE_TYPE", () => {
      const document = makeDocument();
      assertTypeErr(document, () =>
        document.evaluate("true()", document, null, FIRST_ORDERED_NODE_TYPE, null),
      );
    });

    it("still throws NotSupportedError for an unrecognized result type", () => {
      const document = makeDocument();
      assert.throws(
        () => document.evaluate("//p", document, null, 42, null),
        (e) => {
          assert.equal(e.name, "NotSupportedError");
          return true;
        },
      );
    });
  });

  describe("node-set results are unaffected", () => {
    it("FIRST_ORDERED_NODE_TYPE still yields singleNodeValue", () => {
      const document = makeDocument();
      const result = document.evaluate(
        "//p",
        document,
        null,
        9 /* FIRST_ORDERED_NODE_TYPE */,
        null,
      );
      assert.equal(result.singleNodeValue.id, "a");
    });

    it("ORDERED_NODE_SNAPSHOT_TYPE still yields snapshotLength and snapshotItem", () => {
      const document = makeDocument();
      const result = document.evaluate(
        "//p",
        document,
        null,
        7 /* ORDERED_NODE_SNAPSHOT_TYPE */,
        null,
      );
      assert.equal(result.snapshotLength, 2);
      assert.equal(result.snapshotItem(1).id, "b");
    });
  });
});
