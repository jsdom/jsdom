"use strict";

var jsdom = require("../..").jsdom;
const load = require("../util").load(__dirname);

exports["core.TextNode should implement NonDocumentTypeChildNode:nextElementSibling"] = function (t) {
  const doc = jsdom("<div id='1'>1</div> <div id='2'>2</div>");
  var newCommentNode1 = doc.createComment("comment1");
  var textnode1 = doc.createTextNode("Text1");
  var element2 = doc.querySelector("div[id='2']");
  doc.body.insertBefore(textnode1, element2);
  doc.body.insertBefore(newCommentNode1, element2);
  t.strictEqual(textnode1.nextElementSibling.id, "2");
  t.done();
};

exports["core.TextNode should implement NonDocumentTypeChildNode:previousElementSibling"] = function (t) {
  const doc = jsdom("<div id='1'>1</div> <div id='2'>2</div>");
  var newCommentNode1 = doc.createComment("comment1");
  var textnode1 = doc.createTextNode("Text1");
  doc.body.appendChild(textnode1);
  doc.body.insertBefore(newCommentNode1, textnode1);
  t.strictEqual(textnode1.previousElementSibling.id, "2");
  t.done();
};

exports["core.CommentNode should implement NonDocumentTypeChildNode:nextElementSibling"] = function (t) {
  const doc = jsdom("<div id='1'>1</div> <div id='2'>2</div>");

  var newCommentNode1 = doc.createComment("comment1");
  var newCommentNode2 = doc.createComment("comment2");
  var element1 = doc.querySelector("div[id='1']");
  doc.body.insertBefore(newCommentNode1, element1);
  doc.body.insertBefore(newCommentNode2, element1);
  t.strictEqual(newCommentNode1.nextElementSibling.id, "1");
  t.done();
};

exports["core.CommentNode should implement NonDocumentTypeChildNode:previousElementSibling"] = function (t) {
  const doc = jsdom("<div id='1'>1</div> <div id='2'>2</div>");

  var newCommentNode1 = doc.createComment("comment1");
  var newCommentNode2 = doc.createComment("comment2");
  doc.body.appendChild(newCommentNode1);
  doc.body.appendChild(newCommentNode2);
  t.strictEqual(newCommentNode2.previousElementSibling.id, "2");
  t.done();
};

exports["Element should implement NonDocumentTypeChildNode:nextElementSibling"] = function (t) {
  const doc = load("non-document-type-child-node");

  var element1 = doc.querySelector("div[id='1']");
  t.strictEqual(element1.nextElementSibling.id, "2");
  t.strictEqual(element1.nextElementSibling.nextElementSibling.id, "3");
  t.strictEqual(element1.nextElementSibling.nextElementSibling.nextElementSibling, null);
  t.done();
};

exports["Element should implement NonDocumentTypeChildNode:previousElementSibling"] = function (t) {
  const doc = load("non-document-type-child-node");

  var element3 = doc.querySelector("div[id='3']");
  t.strictEqual(element3.previousElementSibling.id, "2");
  t.strictEqual(element3.previousElementSibling.previousElementSibling.id, "1");
  t.strictEqual(element3.previousElementSibling.previousElementSibling.previousElementSibling, null);
  t.done();
};
