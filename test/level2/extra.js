/* Contains extra test cases for parts of DOM Level 2 that aren't covered by the standard W3C test cases. */
var core = require("../../lib/jsdom/living");

exports['create an empty document'] = function (test) {
  var dom = new core.DOMImplementation();
  var document = dom.createDocument(null, null, null);
  test.equal(document.childNodes.length, 0, "document should not contain any nodes");
  test.done();
}

exports['doctype ownerDocument'] = function (test) {
  var dom = new core.DOMImplementation();
  var doctype = dom.createDocumentType("bananas");
  var document = dom.createDocument(null, null, doctype);
  test.equal(doctype.ownerDocument, document, 'doctype should belong to the document');
  test.done();
}

exports['doctype child of ownerDocument'] = function (test) {
  var dom = new core.DOMImplementation();
  var doctype = dom.createDocumentType("hatstand");
  var document = dom.createDocument(null, null, doctype);
  test.equal(document.firstChild, doctype, 'doctype should be a child of the document')
  test.done();
}
