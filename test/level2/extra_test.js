/* Contains extra test cases for parts of DOM Level 2 that aren't covered by
 * the standard W3C test cases. */
// var assert = require('assert'),
    // core = require("../../lib/jsdom/level2/core").dom.level2.core;

var assert, core;

exports.hooks = {
  before_all: function() {
    assert = require('assert');
    core = require("../../lib/jsdom/level2/core").dom.level2.core;
  },
  before_each: function() {
  },
  after_each: function() {},
  after_all: function() {
    assert = undefined;
    core = undefined;
  }
}

exports.tests = {
  create_empty_document: function () {
    var dom = new core.DOMImplementation();
    var document = dom.createDocument(null, null, null);
    assert.equal(0, document.childNodes.length, "Document shouldn't contain any nodes");
  },
  create_document_with_namespaceURI_but_not_qualifiedName: function () {
    var dom = new core.DOMImplementation();
    assert.throws(function () { dom.createDocument("http://example.org/motorcycle", null, null); },
                  core.DOMException,'createDocument accepted invalid arguments');
  },
  create_document_with_namespaceURI_but_not_qualifiedName_TEST: function () {
    var dom = new core.DOMImplementation();
    assert.throws(function () { dom.createDocument("http://example.org/motorcycle", null, null); },
                  core.DOMException.NAMESPACE_ERR, 'createDocument accepted invalid arguments');
  },
  doctype_ownerDocument: function () {
    var dom = new core.DOMImplementation();
    var doctype = dom.createDocumentType("bananas");
    var document = dom.createDocument(null, null, doctype);
    assert.equal(document, doctype.ownerDocument, 'Doctype does not belong to the document');
  },
  doctype_child_of_ownerDocument: function () {
    var dom = new core.DOMImplementation();
    var doctype = dom.createDocumentType("hatstand");
    var document = dom.createDocument(null, null, doctype);
    assert.equal(doctype, document.firstChild, 'Doctype is not a child of the document');
  }
}
