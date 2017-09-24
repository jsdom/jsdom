"use strict";

const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { jsdom } = require("../../lib/old-api.js");

// Tests for node.cloneNode
// Spec: https://dom.spec.whatwg.org/#dom-node-clonenodedeep

describe("node-clone-node", () => {
  specify(
    "Should be able to clone elements with strange names containing colons",
    () => {
      // https://github.com/tmpvar/jsdom/issues/1142#issuecomment-108122608
      const doc = jsdom("KSL.com <http://KSL.com> has not verified the accuracy of the information provided with");

      // Parses as <http: ksl.com=""> has not verified ...</http:>

      let clone;
      assert.doesNotThrow(() => {
        clone = doc.body.cloneNode(true);
      });

      assert.equal(doc.body.outerHTML, clone.outerHTML);
    }
  );

  specify(
    "Should be able to clone elements with strange names containing angle brackets",
    () => {
      // https://github.com/tmpvar/jsdom/issues/1142#issuecomment-108122608
      const doc = jsdom("<p>Blah blah blah<p><Home-Schooling</b><p><p>In talking with parents who home-school");

      // Parses as <home-schooling< b=""></home-schooling>

      let clone;
      assert.doesNotThrow(() => {
        clone = doc.body.cloneNode(true);
      });

      assert.equal(doc.body.outerHTML, clone.outerHTML);
    }
  );

  specify("Cloning a text node", () => {
    const doc = jsdom("<p>Some text</p>");

    const original = doc.querySelector("p").firstChild;
    const clone = original.cloneNode();

    assert.notEqual(clone, original);
    assert.equal(clone.constructor, doc.defaultView.Text);
    assert.equal(clone.data, original.data);
  });

  specify("Cloning a comment node", () => {
    const doc = jsdom("<body><!-- Some text --></body>");

    const original = doc.body.firstChild;
    const clone = original.cloneNode();

    assert.notEqual(clone, original);
    assert.equal(clone.constructor, doc.defaultView.Comment);
    assert.equal(clone.data, original.data);
  });

  specify("Cloning a comment node", () => {
    const doc = jsdom("<body><!-- Some text --></body>");

    const original = doc.body.firstChild;
    const clone = original.cloneNode();

    assert.notEqual(clone, original);
    assert.equal(clone.constructor, doc.defaultView.Comment);
    assert.equal(clone.data, original.data);
  });

  specify("Cloning a doctype node", () => {
    const doc = jsdom("<!DOCTYPE html><title>stuff</title>");

    const original = doc.doctype;
    const clone = original.cloneNode();

    assert.notEqual(clone, original);
    assert.equal(clone.constructor, doc.defaultView.DocumentType);
    assert.equal(clone.name, original.name);
    assert.equal(clone.publicId, original.publicId);
    assert.equal(clone.systemId, original.systemId);
  });

  specify("Cloning a document fragment node, shallowly", () => {
    const doc = jsdom();

    const original = doc.createDocumentFragment();
    const div = doc.createElement("div");
    div.innerHTML = "<p>Hello</p>";
    original.appendChild(div);

    const clone = original.cloneNode();

    assert.notEqual(clone, original);
    assert.equal(clone.constructor, doc.defaultView.DocumentFragment);
    assert.equal(clone.childNodes.length, 0);
  });

  specify("Cloning a document fragment node, deeply", () => {
    const doc = jsdom();

    const original = doc.createDocumentFragment();
    const div = doc.createElement("div");
    div.innerHTML = "<p>Hello</p>";
    original.appendChild(div);

    const clone = original.cloneNode(true);

    assert.notEqual(clone, original);
    assert.equal(clone.constructor, doc.defaultView.DocumentFragment);
    assert.equal(clone.childNodes.length, 1);
    assert.notEqual(clone.childNodes[0], div);
    assert.equal(clone.childNodes[0].constructor, doc.defaultView.HTMLDivElement);
  });

  specify("Deep heterogenous clone of a document", () => {
    const doc = jsdom("<body><!-- comment -->text<p attr='stuff'>element</p>");

    const clone = doc.cloneNode(true);

    assert.notEqual(clone, doc);
    assert.notEqual(clone.body, doc.body);
    assert.equal(clone.constructor, doc.defaultView.HTMLDocument);
    assert.equal(clone.documentElement.outerHTML, doc.documentElement.outerHTML);
  });
});
