"use strict";
const { JSDOM } = require("../../../../..");

exports.extra = function() {
  var doc = (new JSDOM(undefined, { contentType: "application/xml" })).window.document;

  var splitTextTest = doc.createElement("splitTextTest");
  splitTextTest.appendChild(doc.createTextNode("Split me"));
  splitTextTest.appendChild(doc.createElement("last"));
  doc.appendChild(splitTextTest);

  doc.normalize();
  return doc;
};
