"use strict";
const jsdom = require("../..");

exports["Object.keys on a NodeList gives the correct keys"] = t => {
  const document = jsdom.jsdom("<p>1</p><p>2</p><p>3</p>");
  const nodeList = document.querySelectorAll("p");

  t.deepEqual(Object.keys(nodeList), ["0", "1", "2"]);
  t.done();
};

exports["NodeList is for..of iterable"] = t => {
  const document = jsdom.jsdom("<p>1</p><p>2</p><p>3</p>");
  const nodeList = document.querySelectorAll("p");

  let total = 0;
  for (const p of nodeList) {
    total++;
    t.equal(p.tagName, "P");
  }
  t.equal(total, 3);
  t.done();
};

exports["NodeList is for..of iterable on live content"] = t => {
  const document = jsdom.jsdom("<p>1</p><p>2</p><p>3</p>");
  const nodeList = document.body.childNodes;

  let total = 0;
  for (const p of nodeList) {
    total++;
    t.equal(p.tagName, "P");
    if (total < 3) {
      document.body.appendChild(document.createElement("p"));
    }
  }
  t.equal(total, 5);
  t.done();
};
