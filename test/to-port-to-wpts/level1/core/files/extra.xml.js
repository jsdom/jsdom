"use strict";
const jsdom = require("../../../../../lib/old-api.js");

exports.extra = function() {
  var doc = jsdom.jsdom(undefined, { parsingMode: "xml" });

  var splitTextTest = doc.createElement("splitTextTest");
  splitTextTest.appendChild(doc.createTextNode("Split me"));
  splitTextTest.appendChild(doc.createElement("last"));
  doc.appendChild(splitTextTest);

  doc.normalize();
  return doc;
};
