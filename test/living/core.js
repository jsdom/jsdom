//A closure to keep jshint happy.
(function () {
    "use strict";

    var level = require('../../lib/jsdom').level;
    var core = require('../../lib/jsdom/living').dom.living.core;

    var load = require('../util').load(__dirname, level('living', 'core'));

    exports['A document contains and precedes its document type'] = function (t) {
      var doc = load('test');
      var doctype = doc.doctype;

      t.ok(doc.compareDocumentPosition(doctype) & core.Node.DOCUMENT_POSITION_CONTAINED_BY, 'Doctype contained');
      t.ok(doc.compareDocumentPosition(doctype) & core.Node.DOCUMENT_POSITION_FOLLOWING, 'Doctype follows');
      t.done();

    };

    exports['A document contains and precedes its newly attached document type'] = function (t) {
      var doc = load('test');
      var doctype = doc.doctype;
      var newDoctype = doc.implementation.createDocumentType(doctype.name, null, null);

      doc.replaceChild(newDoctype, doctype);

      t.ok(doc.compareDocumentPosition(newDoctype) & core.Node.DOCUMENT_POSITION_CONTAINED_BY, 'Doctype contained');
      t.ok(doc.compareDocumentPosition(newDoctype) & core.Node.DOCUMENT_POSITION_FOLLOWING, 'Doctype follows');
      t.done();

    };

    exports['Two document nodes obtained from the same document are disconnected & implementation specific'] = function (t) {
      var docA = load('test');
      var docB = load('test');

      t.ok(docA.compareDocumentPosition(docB) & core.Node.DOCUMENT_POSITION_DISCONNECTED, 'Disconnected');
      t.ok(docA.compareDocumentPosition(docB) & core.Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC, 'Implementation Specific');
      t.done();
    };

    exports['A document is disconnected from and precedes a DocumentFragment'] = function (t) {
      var doc = load('test');
      var fragment = doc.createDocumentFragment();
      fragment.innerHTML = '<span>I AM SPAN</span>';

      t.ok(doc.compareDocumentPosition(fragment) & core.Node.DOCUMENT_POSITION_DISCONNECTED, 'Fragment disconnected');
      t.ok(doc.compareDocumentPosition(fragment) & core.Node.DOCUMENT_POSITION_FOLLOWING, 'Fragment follows');
      t.ok(doc.compareDocumentPosition(fragment) & core.Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC, 'Implementation Specific');
      t.done();
    };

    exports['A document node compared to itself returns nothing'] = function (t) {
      var doc = load('test');

      t.equal(doc.compareDocumentPosition(doc), 0, 'No Bitmask');
      t.done();
    };

    exports['A document and a newly created document are disconnected and implementation specific'] = function (t) {
      var doc = load('test');
      var newDoc = doc.implementation.createDocument();

      t.ok(doc.compareDocumentPosition(newDoc) & core.Node.DOCUMENT_POSITION_DISCONNECTED, 'Fragment disconnected');
      t.ok(doc.compareDocumentPosition(newDoc) & core.Node.DOCUMENT_POSITION_FOLLOWING, 'Fragment follows');
      t.ok(doc.compareDocumentPosition(newDoc) & core.Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC, 'Implementation Specific');
      t.done();
    };

    exports['A document contains and precedes its document element and vice versa'] = function (t) {
      var doc = load('test');
      var documentElement = doc.documentElement;

      t.ok(doc.compareDocumentPosition(documentElement) & core.Node.DOCUMENT_POSITION_CONTAINED_BY, 'DocumentElement contained');
      t.ok(doc.compareDocumentPosition(documentElement) & core.Node.DOCUMENT_POSITION_FOLLOWING, 'DocumentElement follows');
      t.ok(documentElement.compareDocumentPosition(doc) & core.Node.DOCUMENT_POSITION_CONTAINS, 'Document contains');
      t.ok(documentElement.compareDocumentPosition(doc) & core.Node.DOCUMENT_POSITION_PRECEDING, 'Document precedes');
      t.done();
    };

    exports['Document contains and precedes a newly attached element and vice versa'] = function (t) {
      var doc = load('test');
      var newElement = doc.createElement('p');
      doc.documentElement.appendChild(newElement);

      t.ok(doc.compareDocumentPosition(newElement) & core.Node.DOCUMENT_POSITION_CONTAINED_BY, 'Document contains');
      t.ok(doc.compareDocumentPosition(newElement) & core.Node.DOCUMENT_POSITION_FOLLOWING, 'Document precedes');
      t.ok(newElement.compareDocumentPosition(doc) & core.Node.DOCUMENT_POSITION_CONTAINS, 'Element contained');
      t.ok(newElement.compareDocumentPosition(doc) & core.Node.DOCUMENT_POSITION_PRECEDING, 'Element follows');
      t.done();
    };

    exports['Document contains and precedes an existing element and vice versa'] = function (t) {
      var doc = load('test');
      var element = doc.querySelectorAll('span').item(0);

      t.ok(doc.compareDocumentPosition(element) & core.Node.DOCUMENT_POSITION_CONTAINED_BY, 'Document contains');
      t.ok(doc.compareDocumentPosition(element) & core.Node.DOCUMENT_POSITION_FOLLOWING, 'Document precedes');
      t.ok(element.compareDocumentPosition(doc) & core.Node.DOCUMENT_POSITION_CONTAINS, 'Element contained');
      t.ok(element.compareDocumentPosition(doc) & core.Node.DOCUMENT_POSITION_PRECEDING, 'Element follows');
      t.done();
    };

    exports['Document contains and precedes a newly attached processing instruction and vice versa'] = function (t) {
      var doc = load('test');
      var pi = doc.createProcessingInstruction('PITARGET', 'PIDATA');

      doc.appendChild(pi);

      t.ok(doc.compareDocumentPosition(pi) & core.Node.DOCUMENT_POSITION_CONTAINED_BY, 'Document contains');
      t.ok(doc.compareDocumentPosition(pi) & core.Node.DOCUMENT_POSITION_FOLLOWING, 'Document precedes');
      t.ok(pi.compareDocumentPosition(doc) & core.Node.DOCUMENT_POSITION_CONTAINS, 'Element contained');
      t.ok(pi.compareDocumentPosition(doc) & core.Node.DOCUMENT_POSITION_PRECEDING, 'Element follows');

      t.done();
    };

})();