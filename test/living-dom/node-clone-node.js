"use strict";
const jsdom = require("../..").jsdom;

// Tests for node.cloneNode
// Spec: https://dom.spec.whatwg.org/#dom-node-clonenodedeep

exports["Should be able to clone elements with strange names containing colons"] = t => {
  // https://github.com/tmpvar/jsdom/issues/1142#issuecomment-108122608
  const doc = jsdom("KSL.com <http://KSL.com> has not verified the accuracy of the information provided with");

  // Parses as <http: ksl.com=""> has not verified ...</http:>

  let clone;
  t.doesNotThrow(() => {
    clone = doc.body.cloneNode(true);
  });

  t.equal(doc.body.outerHTML, clone.outerHTML);

  t.done();
};

exports["Should be able to clone elements with strange names containing angle brackets"] = t => {
  // https://github.com/tmpvar/jsdom/issues/1142#issuecomment-108122608
  const doc = jsdom("<p>Blah blah blah<p><Home-Schooling</b><p><p>In talking with parents who home-school");

  // Parses as <home-schooling< b=""></home-schooling>

  let clone;
  t.doesNotThrow(() => {
    clone = doc.body.cloneNode(true);
  });

  t.equal(doc.body.outerHTML, clone.outerHTML);

  t.done();
};

exports["Cloning a text node"] = t => {
  const doc = jsdom("<p>Some text</p>");

  const original = doc.querySelector("p").firstChild;
  const clone = original.cloneNode();

  t.notEqual(clone, original);
  t.equal(clone.constructor, doc.defaultView.Text);
  t.equal(clone.data, original.data);
  t.done();
};

exports["Cloning a comment node"] = t => {
  const doc = jsdom("<body><!-- Some text --></body>");

  const original = doc.body.firstChild;
  const clone = original.cloneNode();

  t.notEqual(clone, original);
  t.equal(clone.constructor, doc.defaultView.Comment);
  t.equal(clone.data, original.data);
  t.done();
};

exports["Cloning a comment node"] = t => {
  const doc = jsdom("<body><!-- Some text --></body>");

  const original = doc.body.firstChild;
  const clone = original.cloneNode();

  t.notEqual(clone, original);
  t.equal(clone.constructor, doc.defaultView.Comment);
  t.equal(clone.data, original.data);
  t.done();
};

exports["Cloning a doctype node"] = t => {
  const doc = jsdom("<!DOCTYPE html><title>stuff</title>");

  const original = doc.doctype;
  const clone = original.cloneNode();

  t.notEqual(clone, original);
  t.equal(clone.constructor, doc.defaultView.DocumentType);
  t.equal(clone.name, original.name);
  t.equal(clone.publicId, original.publicId);
  t.equal(clone.systemId, original.systemId);
  t.done();
};

exports["Cloning a document fragment node, shallowly"] = t => {
  const doc = jsdom();

  const original = doc.createDocumentFragment();
  const div = doc.createElement("div");
  div.innerHTML = "<p>Hello</p>";
  original.appendChild(div);

  const clone = original.cloneNode();

  t.notEqual(clone, original);
  t.equal(clone.constructor, doc.defaultView.DocumentFragment);
  t.equal(clone.childNodes.length, 0);
  t.done();
};

exports["Cloning a document fragment node, deeply"] = t => {
  const doc = jsdom();

  const original = doc.createDocumentFragment();
  const div = doc.createElement("div");
  div.innerHTML = "<p>Hello</p>";
  original.appendChild(div);

  const clone = original.cloneNode(true);

  t.notEqual(clone, original);
  t.equal(clone.constructor, doc.defaultView.DocumentFragment);
  t.equal(clone.childNodes.length, 1);
  t.notEqual(clone.childNodes[0], div);
  t.equal(clone.childNodes[0].constructor, doc.defaultView.HTMLDivElement);
  t.done();
};

exports["Deep heterogenous clone of a document"] = t => {
  const doc = jsdom("<body><!-- comment -->text<p attr='stuff'>element</p>");

  const clone = doc.cloneNode(true);

  t.notEqual(clone, doc);
  t.notEqual(clone.body, doc.body);
  t.equal(clone.constructor, doc.defaultView.HTMLDocument);
  t.equal(clone.documentElement.outerHTML, doc.documentElement.outerHTML);
  t.done();
};
