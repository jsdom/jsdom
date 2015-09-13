"use strict";
const jsdom = require("../..");

exports["Object.keys on a NodeList gives the correct keys"] = function (t) {
  const document = jsdom.jsdom("<p>1</p><p>2</p><p>3</p>");
  const nodeList = document.querySelectorAll("p");

  t.deepEqual(Object.keys(nodeList), ["0", "1", "2"]);
  t.done();
};
