"use strict";

const jsdom = require("../..").jsdom;

exports["ProcessingInstruction should implement NonDocumentTypeChildNode:nextElementSibling"] = t => {
  const document = jsdom("<main></main>");
  const processingInstruction = document.createProcessingInstruction("xml", "version='1.0'")

  document.insertBefore(processingInstruction, document.documentElement)
  t.strictEqual(processingInstruction.nextElementSibling, document.documentElement)

  document.insertBefore(document.lastChild, processingInstruction)
  t.strictEqual(processingInstruction.nextElementSibling, null)

  t.done();
};

exports["ProcessingInstruction should implement NonDocumentTypeChildNode:previousElementSibling"] = t => {
  const document = jsdom("<main></main>");
  const processingInstruction = document.createProcessingInstruction("xml", "version='Foo'")

  document.insertBefore(processingInstruction, document.documentElement)
  t.strictEqual(processingInstruction.previousElementSibling, null)

  document.insertBefore(document.documentElement, processingInstruction)
  t.strictEqual(processingInstruction.previousElementSibling, document.documentElement)

  t.done();
};

exports["TextNode should implement NonDocumentTypeChildNode:nextElementSibling"] = t => {
  const document = jsdom("<section></section>");
  const textNode = document.createTextNode("Foo Text");
  const element = document.querySelector("section");

  document.body.insertBefore(textNode, element);
  t.strictEqual(textNode.nextElementSibling, element);

  document.body.appendChild(textNode);
  t.strictEqual(textNode.nextElementSibling, null);
  t.done();
};

exports["TextNode should implement NonDocumentTypeChildNode:previousElementSibling"] = t => {
  const document = jsdom("<section></section>");
  const textNode = document.createTextNode("Foo Text");
  const element = document.querySelector("section");

  document.body.insertBefore(textNode, element);
  t.strictEqual(textNode.previousElementSibling, null);

  document.body.appendChild(textNode);
  t.strictEqual(textNode.previousElementSibling, element);
  t.done();
};

exports["CommentNode should implement NonDocumentTypeChildNode:nextElementSibling"] = t => {
  const document = jsdom("<section></section>");
  const comment = document.createComment("Foo Comment");
  const element = document.querySelector("section");

  document.body.insertBefore(comment, element);
  t.strictEqual(comment.nextElementSibling, element);

  document.body.appendChild(comment);
  t.strictEqual(comment.nextElementSibling, null);
  t.done();
};

exports["CommentNode should implement NonDocumentTypeChildNode:previousElementSibling"] = t => {
  const document = jsdom("<section></section>");
  const comment = document.createComment("foo comment");
  const element = document.querySelector("section");

  document.body.appendChild(comment);
  t.strictEqual(comment.previousElementSibling, element);

  document.body.insertBefore(comment, element);
  t.strictEqual(comment.previousElementSibling, null);
  t.done();
};

exports["Element should implement NonDocumentTypeChildNode:nextElementSibling"] = t => {
  const document = jsdom("<!-- comment --><section></section><!-- comment -->");
  const aside = document.createElement("aside");
  const element = document.querySelector("section");

  document.body.insertBefore(aside, document.body.firstChild);
  t.strictEqual(aside.nextElementSibling, element);

  document.body.appendChild(aside);
  t.strictEqual(aside.nextElementSibling, null);
  t.done();
};

exports["Element should implement NonDocumentTypeChildNode:previousElementSibling"] = t => {
  const document = jsdom("<!-- comment --><section></section><!-- comment -->");
  const aside = document.createElement("aside");
  const element = document.querySelector("section");

  document.body.insertBefore(aside, document.body.firstChild);
  t.strictEqual(aside.previousElementSibling, null);

  document.body.appendChild(aside);
  t.strictEqual(aside.previousElementSibling, element);
  t.done();
};
