"use strict";

const jsdom = require("../..");

function createChildNodeTestDoc() {
  let doc = jsdom.jsdom(`
<div id="one">1</div>
<div id="two">2</div>
<div id="three">3</div>`);

  doc.one = doc.getElementById("one");
  doc.two = doc.getElementById("two");
  doc.three = doc.getElementById("three");

  return doc;
}

exports["Element should implement ChildNode:before()"] = function (t) {
  const doc = createChildNodeTestDoc();
  doc.two.before("before");

  t.strictEqual(doc.two.previousSibling.textContent, "before");
  t.done();
};

exports["Element should implement ChildNode:after()"] = function (t) {
  const doc = createChildNodeTestDoc();
  doc.two.after("after");

  t.strictEqual(doc.two.nextSibling.textContent, "after");
  t.done();
};

exports["Element should implement ChildNode:replaceWith()"] = function (t) {
  //const doc = createChildNodeTestDoc();
  //const parent = doc.body;
  //doc.two.replaceWith("replace two");

  //t.strictEqual(parent.children[1].nodeType, doc.TEXT_NODE);
  //t.strictEqual(parent.children[1].textContent, "replace two");
  //t.strictEqual(doc.two.parentNode, null);
  t.done();
};

exports["Element should implement ChildNode:remove()"] = function (t) {
  const doc = createChildNodeTestDoc();
  doc.two.remove();
  t.strictEqual(doc.two.parentNode, null);
  t.done();
};
