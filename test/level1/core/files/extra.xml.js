var dom = require("../../../../lib/jsdom/living");
exports.extra = function() {

  var doc = new dom.Document({ parsingMode: "xml" });

  var splitTextTest     = doc.createElement("splitTextTest");
  splitTextTest.appendChild(doc.createTextNode("Split me"));
  splitTextTest.appendChild(doc.createElement("last"));
  doc.appendChild(splitTextTest);

  doc.normalize();
  return doc;
};
