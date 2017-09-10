"use strict";

const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { jsdom } = require("../../lib/old-api.js");

// Spec: https://dom.spec.whatwg.org/#dom-node-ownerdocument

describe("node-owner-document", () => {
  specify("ownerDocument returns null for document nodes", () => {
    const doc = jsdom();
    assert.equal(doc.ownerDocument, null);
  });

  specify(
    "ownerDocument returns the appropriate document for in-document nodes",
    () => {
      const doc = jsdom("<!DOCTYPE html><p>Text</p><!-- comment -->");
      const el = doc.querySelector("p");
      const text = el.firstChild;
      const comment = el.nextSibling;
      const doctype = doc.doctype;

      assert.equal(el.nodeType, doc.ELEMENT_NODE);
      assert.equal(el.ownerDocument, doc, "element node");

      assert.equal(text.nodeType, doc.TEXT_NODE);
      assert.equal(text.ownerDocument, doc, "text node");

      assert.equal(comment.nodeType, doc.COMMENT_NODE);
      assert.equal(comment.ownerDocument, doc, "comment node");

      assert.equal(doctype.nodeType, doc.DOCUMENT_TYPE_NODE);
      assert.equal(doctype.ownerDocument, doc, "doctype node");
    }
  );

  specify(
    "ownerDocument returns the appropriate document for detached nodes",
    () => {
      const doc = jsdom();
      const el = doc.createElement("p");
      const text = doc.createTextNode("text");
      const comment = doc.createComment("comment");
      const doctype = doc.implementation.createDocumentType("blah", "blah", "blah");
      const fragment = doc.createDocumentFragment();
      const pi = doc.createProcessingInstruction("blah", "blah");

      assert.equal(el.nodeType, doc.ELEMENT_NODE);
      assert.equal(el.ownerDocument, doc, "element node");

      assert.equal(text.nodeType, doc.TEXT_NODE);
      assert.equal(text.ownerDocument, doc, "text node");

      assert.equal(comment.nodeType, doc.COMMENT_NODE);
      assert.equal(comment.ownerDocument, doc, "comment node");

      assert.equal(doctype.nodeType, doc.DOCUMENT_TYPE_NODE);
      assert.equal(doctype.ownerDocument, doc, "doctype node");

      assert.equal(fragment.nodeType, doc.DOCUMENT_FRAGMENT_NODE);
      assert.equal(fragment.ownerDocument, doc, "document fragment node");

      assert.equal(pi.nodeType, doc.PROCESSING_INSTRUCTION_NODE);
      assert.equal(pi.ownerDocument, doc, "procesing instruction node");
    }
  );
});
