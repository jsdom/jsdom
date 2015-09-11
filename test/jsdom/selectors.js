"use strict";
const jsdom = require("../..");
const domExceptionPredicate = require("../util").domExceptionPredicate;

// These tests are mostly random regression tests, not systematic parsing tests. They are compiled from the bug tracker.
exports["div:last-child > span[title] (GH-972)"] = t => {
  const document = jsdom.jsdom("<div><div><span title='title text'>text</span></div></div>");

  t.doesNotThrow(() => {
    document.firstChild.querySelector("div:last-child > span[title]");
  });

  t.done();
};

exports["div[title=''] (GH-1163)"] = t => {
  const document = jsdom.jsdom(`<!doctype html><html><head></head><body>
    <div></div><div title=""></div><div title="yes"></div>
  </body></html>`);

  t.strictEqual(document.querySelectorAll("div[title='']").length, 1);
  t.strictEqual(document.querySelectorAll("div[title][title='']").length, 1);
  t.done();
};

exports["matches smoke test"] = t => {
  const document = jsdom.jsdom(`<html><body><div id="main"><p class="foo">Foo</p><p>Bar</p></div></body></html>`);
  const div = document.body.children.item(0);

  const element = document.querySelector("#main p");
  t.strictEqual(element.matches("#main p"), true, "p and first-p");
  t.strictEqual(element.matches("#asdf"), false, "doesn't match wrong selector");

  const element2 = div.querySelector("p");
  t.strictEqual(element2.matches("p"), true, "p and first-p");
  t.strictEqual(element2.matches("#asdf"), false, "doesn't match wrong selector");

  const element3 = document.querySelector("#main p:not(.foo)");
  t.strictEqual(element3.matches("#main p:not(.foo)"), true, "p and second-p");
  t.strictEqual(element3.matches("#asdf"), false, "doesn't match wrong selector");

  t.done();
};

exports["querySelector smoke test"] = t => {
  const document = jsdom.jsdom(`<html><body><div id="main"><p class="foo">Foo</p><p>Bar</p></div></body></html>`);
  const div = document.body.children.item(0);

  const element = document.querySelector("#main p");
  t.equal(element, div.children.item(0), "p and first-p");

  const element2 = div.querySelector("p");
  t.equal(element2, div.children.item(0), "p and first-p");

  const element3 = document.querySelector("#main p:not(.foo)");
  t.equal(element3, div.children.item(1), "p and second-p");

  const element4 = document.querySelector("#asdf");
  t.strictEqual(element4, null, "nonexistent becomes null");

  t.done();
};

exports["querySelector smoke test on a document fragment"] = t => {
  const document = jsdom.jsdom(`<html><body><div id="main"><p class="foo">Foo</p><p>Bar</p></div></body></html>`);
  const div = document.body.children.item(0);
  const fragment = document.createDocumentFragment();

  fragment.appendChild(div);
  t.strictEqual(document.body.firstChild, null);

  const element = fragment.querySelector("#main p");
  t.strictEqual(element, div.children.item(0), "p and first-p");

  const element2 = fragment.querySelector("p");
  t.strictEqual(element2, div.children.item(0), "p and first-p");

  const element3 = fragment.querySelector("#main p:not(.foo)");
  t.strictEqual(element3, div.children.item(1), "p and second-p");

  const element4 = fragment.querySelector("#asdf");
  t.strictEqual(element4, null, "nonexistent becomes null");

  t.done();
};

exports["querySelectorAll smoke test"] = t => {
  const document = jsdom.jsdom(`<html><body><div id="main"><p>Foo</p><p>Bar</p></div><div id="next">` +
                               `<div id="next-child"><p>Baz</p></div></div></body></html>`);
  const div = document.body.children.item(0);

  const elements = document.querySelectorAll("#main p");
  t.equal(elements.length, 2, "two results");
  t.equal(elements.item(0), div.children.item(0), "p and first-p");
  t.equal(elements.item(1), div.children.item(1), "p and second-p");

  const elements2 = div.querySelectorAll("p");
  t.equal(elements2.length, 2, "two results");
  t.equal(elements2.item(0), div.children.item(0), "p and first-p");
  t.equal(elements2.item(1), div.children.item(1), "p and second-p");

  t.equal(div.querySelectorAll("#main").length, 0, "It should not return the base element");

  t.equal(div.querySelectorAll("div").length, 0, "There are no div elements under div#main");

  const elements3 = div.querySelectorAll("#main p");
  t.equal(elements3.length, 2, "two results");
  t.equal(elements3.item(0), div.children.item(0), "p and first-p");
  t.equal(elements3.item(1), div.children.item(1), "p and second-p");

  const topNode = document.createElement("p");
  const newNode = document.createElement("p");
  topNode.id = "fuz";
  newNode.id = "buz";
  topNode.appendChild(newNode);
  t.equal(topNode.querySelectorAll("#fuz").length, 0, "It should not return the base element that is orphaned");

  const elements4 = topNode.querySelectorAll("#fuz #buz");
  t.equal(elements4.length, 1, "one result");
  t.equal(elements4.item(0), newNode, "newNode and first-p");

  const elements5 = div.querySelectorAll("p");
  t.equal(elements5.length, 2, "It should not return elements that are not within the base element's subtrees");
  t.equal(elements5.item(0), div.children.item(0), "p and first-p");
  t.equal(elements5.item(1), div.children.item(1), "p and second-p");
  t.strictEqual(topNode.parentNode, null, "topNode.parentNode is null");

  const nextChildDiv = document.getElementById("next-child");
  const elements6 = nextChildDiv.querySelectorAll("p");
  t.equal(elements6.length, 1, "p under div#next-child");
  t.equal(elements6.item(0), nextChildDiv.children.item(0), "child of div#next-child");
  t.done();
};

exports["querySelectorAll smoke test on a document fragment"] = t => {
  const document = jsdom.jsdom(`<html><body><div id="main"><p>Foo</p><p>Bar</p></div>` +
                               `<div id="next"><div id="next-child"><p>Baz</p></div></div></body></html>`);
  const fragment = document.createDocumentFragment();
  fragment.appendChild(document.body.firstChild);
  fragment.appendChild(document.body.firstChild);

  t.strictEqual(document.body.firstChild, null, "The body should now be empty");

  const div = fragment.firstChild;

  const elements = fragment.querySelectorAll("#main p");
  t.equal(elements.length, 2, "two results");
  t.equal(elements.item(0), div.children.item(0), "p and first-p");
  t.equal(elements.item(1), div.children.item(1), "p and second-p");

  const elements2 = div.querySelectorAll("p");
  t.equal(elements2.length, 2, "two results");
  t.equal(elements2.item(0), div.children.item(0), "p and first-p");
  t.equal(elements2.item(1), div.children.item(1), "p and second-p");
  t.equal(div.querySelectorAll("#main").length, 0, "It should not return the base element");
  t.equal(div.querySelectorAll("div").length, 0, "There are no div elements under div#main");

  const elements3 = div.querySelectorAll("#main p");
  t.equal(elements3.length, 2, "two results");
  t.equal(elements3.item(0), div.children.item(0), "p and first-p");
  t.equal(elements3.item(1), div.children.item(1), "p and second-p");

  const topNode = document.createElement("p");
  const newNode = document.createElement("p");
  topNode.id = "fuz";
  newNode.id = "buz";
  topNode.appendChild(newNode);
  t.equal(topNode.querySelectorAll("#fuz").length, 0, "It should not return the base element that is orphaned");

  const elements4 = topNode.querySelectorAll("#fuz #buz");
  t.equal(elements4.length, 1, "one result");
  t.equal(elements4.item(0), newNode, "newNode and first-p");

  const elements5 = div.querySelectorAll("p");
  t.equal(elements5.length, 2, "It should not return elements that are not within the base element's subtrees");
  t.equal(elements5.item(0), div.children.item(0), "p and first-p");
  t.equal(elements5.item(1), div.children.item(1), "p and second-p");
  t.equal(topNode.parentNode, null, "topNode.parentNode is null");

  const nextChildDiv = fragment.querySelectorAll("#next-child").item(0);
  t.notStrictEqual(nextChildDiv, null, "id selector on fragment not null");

  const elements6 = nextChildDiv.querySelectorAll("p");
  t.equal(elements6.length, 1, "p under div#next-child");
  t.equal(elements6.item(0), nextChildDiv.children.item(0), "child of div#next-child");

  const elements7 = fragment.querySelectorAll("p");
  t.equal(elements7.length, 3, "all p");
  t.equal(elements7.item(0), div.children.item(0), "p and first-p");
  t.equal(elements7.item(1), div.children.item(1), "p and second-p");
  t.equal(elements7.item(2), nextChildDiv.children.item(0), "child of div#next-child");

  t.done();
};

exports["invalid selector //MAIN MENU... (GH-1214)"] = function (t) {
  const document = jsdom.jsdom();

  const selector = " //MAIN MENU - (used to keep mobile menu options hidden and keep weather/search and menu " +
                   "on one line) // #tncms-region-nav-main-nav-right-nav";

  t.throws(() => document.querySelector(selector), domExceptionPredicate(document, "SyntaxError"));
  t.throws(() => document.querySelectorAll(selector), domExceptionPredicate(document, "SyntaxError"));
  t.throws(() => document.body.matches(selector), domExceptionPredicate(document, "SyntaxError"));

  t.done();
};
