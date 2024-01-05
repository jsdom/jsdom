"use strict";
const assert = require("node:assert/strict");
const { describe, test } = require("node:test");

const { JSDOM } = require("../..");

describe("non-document-type-child-node", () => {
  test(
    "TextNode should implement NonDocumentTypeChildNode:nextElementSibling",
    () => {
      const doc = (new JSDOM("<div id='1'>1</div> <div id='2'>2</div>")).window.document;
      const newCommentNode1 = doc.createComment("comment1");
      const textnode1 = doc.createTextNode("Text1");
      const element2 = doc.querySelector("div[id='2']");
      doc.body.insertBefore(textnode1, element2);
      doc.body.insertBefore(newCommentNode1, element2);
      assert.equal(textnode1.nextElementSibling.id, "2");
    }
  );

  test(
    "TextNode should implement NonDocumentTypeChildNode:previousElementSibling",
    () => {
      const doc = (new JSDOM("<div id='1'>1</div> <div id='2'>2</div>")).window.document;
      const newCommentNode1 = doc.createComment("comment1");
      const textnode1 = doc.createTextNode("Text1");
      doc.body.appendChild(textnode1);
      doc.body.insertBefore(newCommentNode1, textnode1);
      assert.equal(textnode1.previousElementSibling.id, "2");
    }
  );

  test(
    "CommentNode should implement NonDocumentTypeChildNode:nextElementSibling",
    () => {
      const doc = (new JSDOM("<div id='1'>1</div> <div id='2'>2</div>")).window.document;

      const newCommentNode1 = doc.createComment("comment1");
      const newCommentNode2 = doc.createComment("comment2");
      const element1 = doc.querySelector("div[id='1']");
      doc.body.insertBefore(newCommentNode1, element1);
      doc.body.insertBefore(newCommentNode2, element1);
      assert.equal(newCommentNode1.nextElementSibling.id, "1");
    }
  );

  test(
    "CommentNode should implement NonDocumentTypeChildNode:previousElementSibling",
    () => {
      const doc = (new JSDOM("<div id='1'>1</div> <div id='2'>2</div>")).window.document;

      const newCommentNode1 = doc.createComment("comment1");
      const newCommentNode2 = doc.createComment("comment2");
      doc.body.appendChild(newCommentNode1);
      doc.body.appendChild(newCommentNode2);
      assert.equal(newCommentNode2.previousElementSibling.id, "2");
    }
  );

  test(
    "Element should implement NonDocumentTypeChildNode:nextElementSibling",
    () => {
      const doc = (new JSDOM(`<!DOCTYPE html>
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
    </html>`)).window.document;

      const element1 = doc.querySelector("div[id='1']");
      assert.equal(element1.nextElementSibling.id, "2");
      assert.equal(element1.nextElementSibling.nextElementSibling.id, "3");
      assert.equal(element1.nextElementSibling.nextElementSibling.nextElementSibling, null);
    }
  );

  test(
    "Element should implement NonDocumentTypeChildNode:previousElementSibling",
    () => {
      const doc = (new JSDOM(`<!DOCTYPE html>
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
    </html>`)).window.document;

      const element3 = doc.querySelector("div[id='3']");
      assert.equal(element3.previousElementSibling.id, "2");
      assert.equal(element3.previousElementSibling.previousElementSibling.id, "1");
      assert.equal(element3.previousElementSibling.previousElementSibling.previousElementSibling, null);
    }
  );
});
