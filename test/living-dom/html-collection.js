"use strict";
const jsdom = require("../..");

exports["HTMLCollection: access by indices"] = t => {
  const document = jsdom.jsdom("<p id='p1'>1</p><p id='p2'>2</p><p id='p3'>3</p>");
  const collection = document.getElementsByTagName("p");

  t.strictEqual(collection[0], document.getElementById("p1"));
  t.strictEqual(collection[2], document.getElementById("p3"));

  t.done();
};

exports["HTMLCollection: access by id"] = t => {
  const document = jsdom.jsdom("<p id='p1'>1</p><p id='p2'>2</p><p id='p3'>3</p>");
  const collection = document.getElementsByTagName("p");

  t.strictEqual(collection.p1, document.getElementById("p1"));
  t.strictEqual(collection.p3, document.getElementById("p3"));

  t.done();
};

exports["HTMLCollection: access by name"] = t => {
  const document = jsdom.jsdom("<p id='e1' name='p1'>1</p><p id='e2' name='p2'>2</p><p>3</p>");
  const collection = document.getElementsByTagName("p");

  t.strictEqual(collection.p1, document.getElementById("e1"));
  t.strictEqual(collection.p2, document.getElementById("e2"));

  t.done();
};

exports["HTMLCollection: conflict keys"] = t => {
  const document = jsdom.jsdom("<p id='length'>1</p><p>2</p><p>3</p>");
  const collection = document.getElementsByTagName("p");

  t.strictEqual(collection.length, 3);

  t.done();
};


exports["HTMLCollection: conflict keys accessible by namedItem()"] = t => {
  const document = jsdom.jsdom("<p id='length'>1</p><p id='namedItem'>2</p><p>3</p>");
  const collection = document.getElementsByTagName("p");

  t.strictEqual(collection.namedItem("length"), document.getElementById("length"));
  t.strictEqual(collection.namedItem("namedItem"), document.getElementById("namedItem"));

  t.done();
};
