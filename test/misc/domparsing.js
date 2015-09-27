"use strict";
const jsdom = require("../..");
const domExceptionPredicate = require("../util").domExceptionPredicate;

// http://www.w3.org/TR/DOM-Parsing/
// (which is referenced by http://html.spec.whatwg.org/ )

exports["Setting outerHTML on the documentElement is not allowed"] = t => {
  const doc = jsdom.jsdom("<html/>");

  t.throws(() => {
    doc.documentElement.outerHTML = "<html><head><title></title></head><body></body></html>";
  }, domExceptionPredicate(doc, "NoModificationAllowedError"));

  t.done();
};

exports["Setting outerHTML on an Element without a parent should have no effect"] = t => {
  const doc = jsdom.jsdom("<html/>");

  const element = doc.createElement("div");
  element.textContent = "foo";

  element.outerHTML = "<p>bar</p>";
  t.strictEqual(element.outerHTML, "<div>foo</div>");

  t.done();
};

exports["Setting outerHTML on an Element"] = t => {
  const doc = jsdom.jsdom("<html><head></head><body>foo<p>bar</p></body></html>");

  const newHtml = "<b>az</b>";

  const oldElement = doc.body.children[0];
  oldElement.outerHTML = newHtml;

  t.strictEqual(oldElement.outerHTML, "<p>bar</p>");
  t.strictEqual(doc.body.children[0].outerHTML, newHtml);
  t.done();
};

exports["Setting outerHTML on <body>"] = t => {
  const doc = jsdom.jsdom("<html><head></head><body>foo<p>bar</p></body></html>");

  const newHtml = "<body><h1>Hysterocrates crassipes</h1>" +
                    "<p>spinnensoort in de taxonomische indeling van de vogelspinnen</p></body>";

  const oldBody = doc.body;
  oldBody.outerHTML = newHtml;

  t.strictEqual(oldBody.outerHTML, "<body>foo<p>bar</p></body>");
  t.strictEqual(doc.body.outerHTML, newHtml);
  t.done();
};

exports["Setting outerHTML on an Element with a DocumentFragment as parent"] = t => {
  const doc = jsdom.jsdom();

  const fragment = doc.createDocumentFragment();
  const oldElement = doc.createElement("div");
  fragment.appendChild(oldElement);
  oldElement.innerHTML = "foo<p>bar</p>";

  const newHtml = "<div><h1>Hysterocrates crassipes</h1>" +
                "<p>spinnensoort in de taxonomische indeling van de vogelspinnen</p></div>";

  // the <body> element should not be included
  // (because the context node will be a temporary <body> element)
  oldElement.outerHTML = "<body>" + newHtml + "</body>";

  t.strictEqual(oldElement.outerHTML, "<div>foo<p>bar</p></div>");
  t.strictEqual(fragment.firstChild.outerHTML, newHtml);
  t.done();
};
