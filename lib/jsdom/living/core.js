"use strict";

var utils = require("../utils");
var core = require("../level3/core").dom.level3.core;
require("./node");

// modify cloned instance for more info check: https://github.com/tmpvar/jsdom/issues/325
core = Object.create(core);


/*
  // Introduced in Living Standard:
  interface DOMImplementation {
    [NewObject] Document createHTMLDocument(optional DOMString title);
  };
*/

core.DOMImplementation.prototype.createHTMLDocument = function(title) {
  // Let doc be a new document that is an HTML document.
  // Set doc's content type to "text/html".
  var document = new core.Document({
    contentType: "text/html"
  });

  // Values set according to w3c test suite:
  // https://github.com/w3c/web-platform-tests/blob/master/dom/nodes/DOMImplementation-createHTMLDocument.html
  document.URL = document.documentURI = "about:blank";
  document.compatMode = "CSS1Compat";
  document.characterSet = "UTF-8";

  // Create a doctype, with "html" as its name and with its node document set
  // to doc. Append the newly created node to doc.
  document.doctype = this.createDocumentType("html", "", "");

  // Create an html element in the HTML namespace, and append it to doc.
  var htmlElement = document.createElementNS("http://www.w3.org/1999/xhtml", "html");
  document.appendChild(htmlElement);

  // Create a head element in the HTML namespace, and append it to the html
  // element created in the previous step.
  var headElement = document.createElement("head");
  htmlElement.appendChild(headElement);

  // If the title argument is not omitted:
  if (title !== undefined) {
    // Create a title element in the HTML namespace, and append it to the head
    // element created in the previous step.
    var titleElement = document.createElement("title");
    headElement.appendChild(titleElement);

    // Create a Text node, set its data to title (which could be the empty
    // string), and append it to the title element created in the previous step.
    titleElement.appendChild(document.createTextNode(title));
  }

  // Create a body element in the HTML namespace, and append it to the html
  // element created in the earlier step.
  htmlElement.appendChild(document.createElement("body"));

  // doc's origin is an alias to the origin of the context object's associated
  // document, and doc's effective script origin is an alias to the effective
  // script origin of the context object's associated document.

  return document;
};



// https://dom.spec.whatwg.org/#concept-element-local-name
utils.defineGetter(core.Node.prototype, "localName", function() {
  if (this.nodeType !== 1 /* ELEMENT_NODE */) {
    return this._localName || null;
  }

  var nodeName = this._nodeName.split(":")[1] || this._nodeName;
  if (nodeName) { nodeName = nodeName.toLowerCase(); }
  return this._localName || nodeName || null;
});

// https://dom.spec.whatwg.org/#interface-nodefilter
core.NodeFilter = function () {
  throw new TypeError("Illegal constructor");
};

/**
 * Returns an unsigned short that will be used to tell if a given Node must
 * be accepted or not by the NodeIterator or TreeWalker iteration
 * algorithm. This method is expected to be written by the user of a
 * NodeFilter.
 *
 * @see https://developer.mozilla.org/en-US/docs/Web/API/NodeFilter
 * @interface
 *
 * @param  {Node} node DOM Node
 * @return {FILTER_ACCEPT|FILTER_REJECT|FILTER_SKIP}
 */
core.NodeFilter.acceptNode = function(/* node */) {
  throw new Error("This method is expected to be written by the user of a NodeFilter.");
};

var nodeFilterConstants = {
  // Constants for whatToShow
  SHOW_ALL                    : 0xFFFFFFFF,
  SHOW_ELEMENT                : 0x00000001,
  SHOW_ATTRIBUTE              : 0x00000002,
  SHOW_TEXT                   : 0x00000004,
  SHOW_CDATA_SECTION          : 0x00000008,
  SHOW_ENTITY_REFERENCE       : 0x00000010,
  SHOW_ENTITY                 : 0x00000020,
  SHOW_PROCESSING_INSTRUCTION : 0x00000040,
  SHOW_COMMENT                : 0x00000080,
  SHOW_DOCUMENT               : 0x00000100,
  SHOW_DOCUMENT_TYPE          : 0x00000200,
  SHOW_DOCUMENT_FRAGMENT      : 0x00000400,
  SHOW_NOTATION               : 0x00000800,

  // Constants returned by acceptNode
  FILTER_ACCEPT               : 1,
  FILTER_REJECT               : 2,
  FILTER_SKIP                 : 3
};

utils.addConstants(core.NodeFilter, nodeFilterConstants);
utils.addConstants(core.NodeFilter.prototype, nodeFilterConstants);


exports.dom = { living: { core: core } };
