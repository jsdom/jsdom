/* Contains extra test cases for parts of DOM Level 2 that aren't covered by
 * the standard W3C test cases. */

global.assert = require('assert');

function TestSuite(name) {
  this.name = name;
  this.tests = {};

  TestSuite.prototype.before_all = function(){}
  TestSuite.prototype.before_each = function(){}
  TestSuite.prototype.after_each = function(){}
  TestSuite.prototype.after_all = function(){}

  TestSuite.prototype.run_test = function (test) {
    var result = {name: test, result: 'PASSED'}
    this.before_each.apply(this.tests);
    try {
      this.tests[test]();
    } catch(e) {
      result.result = 'FAILED';
      result.error = e;
    }
    this.after_each.apply(this.tests);
    return(result);
  }

  TestSuite.prototype.run = function () {
    // TODO: eventually, accept a single test, a list of tests, an array of tests, or nothing
    var valid_tests = this.test_names(),
        results = [],
        self = this;
    var tests = get_values(arguments) || valid_tests;
    this.before_all.apply(this.tests);
    tests.forEach(function(test){
      if (valid_tests.indexOf(test) > -1) {
        results.push(self.run_test(test));
      } else {
        results.push({name: test, result: 'NOT FOUND'})
      }
    });
    this.after_all.apply(this.tests);
    return(results);
  }

  TestSuite.prototype.test_names = function () {
    var names = [];
    for (var test in this.tests) {
      if (this.tests.hasOwnProperty(test)) {
        names.push(test);
      }
    }
    return(names);
  }

  // private
  var get_values = function(args) {
    if (args.length == 0) return;
    var values = [];
    for (var i=0; i < args.length; i++) {
      values.push(args[i]);
    }
    return(values);
  }
}

var suite = new TestSuite('level2/extra');
suite.before_all = function() {
  this.core = require("../../lib/jsdom/level2/core").dom.level2.core;
}
suite.before_each = function() {
  this.dom = new this.core.DOMImplementation();
}
suite.after_each = function() {
  this.dom = undefined;
  delete(this.dom);
}
suite.after_all = function() {
  this.core = undefined;
  delete(this.core);
}

suite.tests = {
  create_empty_document: function () {
    var document = this.dom.createDocument(null, null, null);
    assert.equal(0, document.childNodes.length, "Document shouldn't contain any nodes");
  },
  create_document_with_namespaceURI_but_not_qualifiedName: function () {
    assert.throws(function () { this.dom.createDocument("http://example.org/motorcycle", null, null); },
                  this.core.DOMException.NAMESPACE_ERR, 'createDocument accepted invalid arguments');
  },
  doctype_ownerDocument: function () {
    var doctype = this.dom.createDocumentType("bananas");
    var document = this.dom.createDocument(null, null, doctype);
    assert.equal(document, doctype.ownerDocument, 'Doctype does not belong to the document');
  },
  doctype_child_of_ownerDocument: function () {
    var doctype = this.dom.createDocumentType("hatstand");
    var document = this.dom.createDocument(null, null, doctype);
    assert.equal(doctype, document.firstChild, 'Doctype is not a child of the document');
  }
}

exports.run = function() { return(suite.run.apply(suite, arguments)); }
exports.test_names = suite.test_names();
