"use strict";

const jsdom = require("../..").jsdom;

exports["TextNode should implement NonDocumentTypeChildNode:nextElementSibling"] = t => {
  const doc = jsdom("<div id='1'>1</div> <div id='2'>2</div>");
  const newCommentNode1 = doc.createComment("comment1");
  const textnode1 = doc.createTextNode("Text1");
  const element2 = doc.querySelector("div[id='2']");
  doc.body.insertBefore(textnode1, element2);
  doc.body.insertBefore(newCommentNode1, element2);
  t.strictEqual(textnode1.nextElementSibling.id, "2");
  t.done();
};

exports["TextNode should implement NonDocumentTypeChildNode:previousElementSibling"] = t => {
  const doc = jsdom("<div id='1'>1</div> <div id='2'>2</div>");
  const newCommentNode1 = doc.createComment("comment1");
  const textnode1 = doc.createTextNode("Text1");
  doc.body.appendChild(textnode1);
  doc.body.insertBefore(newCommentNode1, textnode1);
  t.strictEqual(textnode1.previousElementSibling.id, "2");
  t.done();
};

exports["CommentNode should implement NonDocumentTypeChildNode:nextElementSibling"] = t => {
  const doc = jsdom("<div id='1'>1</div> <div id='2'>2</div>");

  const newCommentNode1 = doc.createComment("comment1");
  const newCommentNode2 = doc.createComment("comment2");
  const element1 = doc.querySelector("div[id='1']");
  doc.body.insertBefore(newCommentNode1, element1);
  doc.body.insertBefore(newCommentNode2, element1);
  t.strictEqual(newCommentNode1.nextElementSibling.id, "1");
  t.done();
};

exports["CommentNode should implement NonDocumentTypeChildNode:previousElementSibling"] = t => {
  const doc = jsdom("<div id='1'>1</div> <div id='2'>2</div>");

  const newCommentNode1 = doc.createComment("comment1");
  const newCommentNode2 = doc.createComment("comment2");
  doc.body.appendChild(newCommentNode1);
  doc.body.appendChild(newCommentNode2);
  t.strictEqual(newCommentNode2.previousElementSibling.id, "2");
  t.done();
};

exports["Element should implement NonDocumentTypeChildNode:nextElementSibling"] = t => {
  const doc = jsdom(`<!DOCTYPE html>
<?foo bar?>
<html id="html_id">
  <head>
      <title>NonDocumentTypeChildNode</title>
  </head>
  <body>
    <!-- comment 1 -->
    <div id='1'>1</div>
    <!-- comment 2 -->
    <div id='2'>2</div>
    <!-- comment 3 -->
    <div id='3'>3</div>
    <!-- comment 4 -->
  </body>
</html>`);

  const element1 = doc.querySelector("div[id='1']");
  t.strictEqual(element1.nextElementSibling.id, "2");
  t.strictEqual(element1.nextElementSibling.nextElementSibling.id, "3");
  t.strictEqual(element1.nextElementSibling.nextElementSibling.nextElementSibling, null);
  t.done();
};

exports["Element should implement NonDocumentTypeChildNode:previousElementSibling"] = t => {
  const doc = jsdom(`<!DOCTYPE html>
<?foo bar?>
<html id="html_id">
  <head>
      <title>NonDocumentTypeChildNode</title>
  </head>
  <body>
    <!-- comment 1 -->
    <div id='1'>1</div>
    <!-- comment 2 -->
    <div id='2'>2</div>
    <!-- comment 3 -->
    <div id='3'>3</div>
    <!-- comment 4 -->
  </body>
</html>`);

  const element3 = doc.querySelector("div[id='3']");
  t.strictEqual(element3.previousElementSibling.id, "2");
  t.strictEqual(element3.previousElementSibling.previousElementSibling.id, "1");
  t.strictEqual(element3.previousElementSibling.previousElementSibling.previousElementSibling, null);
  t.done();
};
