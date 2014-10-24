var HtmlToDom     = require('./htmltodom').HtmlToDom,
    jsdom         = require('../../jsdom'),
    defineGetter  = require('../utils').defineGetter,
    defineSetter  = require('../utils').defineSetter,
    Contextify    = require('contextify'),
    DOMWindow     = require('./Window');

/**
 * Creates a window having a document. The document can be passed as option,
 * if omitted, a new document will be created.
 */
exports.windowAugmentation = function(dom, options) {
  options = options || {};
  var window = exports.createWindow(options);

  if (!options.document) {
    var browser = browserAugmentation(dom, options);

    options.document = (browser.HTMLDocument)             ?
                        new browser.HTMLDocument(options) :
                        new browser.Document(options);



    options.document.write('<html><head></head><body></body></html>');
  }

  var doc = window.document = options.document;

  if (doc.addEventListener) {
    if (doc.readyState == 'complete') {
      var ev = doc.createEvent('HTMLEvents');
      ev.initEvent('load', false, false);
      process.nextTick(function () {
        window.dispatchEvent(ev);
      });
    }
    else {
      doc.addEventListener('load', function(ev) {
        window.dispatchEvent(ev);
      });
    }
  }

  return window;
};

/**
 * Creates a document-less window.
 */
exports.createWindow = function(options) {
  var window = new DOMWindow(options);

  Contextify(window);

  // We need to set up self references using Contextify's getGlobal() so that
  // the global object identity is correct (window === this).
  // See Contextify README for more info.
  var windowGlobal = window.getGlobal();

  // Set up the window as if it's a top level window.
  // If it's not, then references will be corrected by frame/iframe code.
  // Note: window.frames is maintained in the HTMLFrameElement init function.
  window.window = window.frames
                = window.self
                = window.parent
                = window.top = windowGlobal;

  return window;
};

/**
 * Augments the given DOM by adding browser-specific properties and methods (BOM).
 * Returns the augmented DOM.
 */
var browserAugmentation = exports.browserAugmentation = function(dom, options) {

  if(!options) {
    options = {};
  }

  // set up html parser - use a provided one or try and load from library
  var parser = options.parser;

  if (dom._augmented && dom._parser === parser && dom._parsingMode === options.parsingMode) {
    return dom;
  }

  dom._parser = parser;
  dom._parsingMode = options.parsingMode;
  var htmltodom = new HtmlToDom(parser, options.parsingMode);

  function setInnerHTML(node, html) {
    //Clear the children first:
    var child;
    while ((child = node._childNodes[0])) {
      node.removeChild(child);
    }

    var isDoc = node.nodeName === '#document';
    if (isDoc) {
      parseDocType(node, html);

      if (node._doctype) {
        node._childNodes[0] = node._doctype;
      }
    }
    if (html !== "" && html != null) {
      if (isDoc) {
        htmltodom.appendHtmlToDocument(html, node);
      } else {
        htmltodom.appendHtmlToElement(html, node);
      }
    }
  }

  if (!dom.HTMLDocument) {
    dom.HTMLDocument = dom.Document;
  }

  dom.HTMLDocument.prototype.write = function(text) {
    if (this._writeAfterElement) {
      // If called from an script element directly (during the first tick),
      // the new elements are inserted right after that element.
      var tempDiv       = this.createElement('div');
      setInnerHTML(tempDiv, text);

      var child    = tempDiv.firstChild;
      var previous = this._writeAfterElement;
      var parent   = this._writeAfterElement.parentNode;

      while (child) {
        var node = child;
        child    = child.nextSibling;
        parent.insertBefore(node, previous.nextSibling);
        previous = node;
      }
    } else if (this.readyState === "loading") {
      // During page loading, document.write appends to the current element
      // Find the last child that has been added to the document.
      var node = this;
      while (node.lastChild && node.lastChild.nodeType === this.ELEMENT_NODE) {
        node = node.lastChild;
      }
      setInnerHTML(node, text || "<html><head></head><body></body></html>");
    } else if (text) {
      setInnerHTML(this, text);
    }
  };

  defineSetter(dom.Element.prototype, 'innerHTML', function(html) {
    setInnerHTML(this, html);
    return html;
  });

  var DOC_HTML5      = /<!doctype html>/i,
      DOC_TYPE       = /<!DOCTYPE (\w(.|\n)*)">/i,
      DOC_TYPE_START = '<!DOCTYPE ',
      DOC_TYPE_END   = '">';

  function parseDocType(doc, html) {
    var publicID = '',
        systemID = '',
        fullDT = '',
        name = 'html',
        set = true,
        doctype = html.match(DOC_HTML5);

    //Default, No doctype === null
    doc._doctype = null;

    if (doctype && doctype[0]) { //Handle the HTML shorty doctype
      fullDT = doctype[0];
    } else { //Parse the doctype
      // find the start
      var start     = html.indexOf(DOC_TYPE_START),
          end       = html.indexOf(DOC_TYPE_END),
          docString;

      if (start < 0 || end < 0) {
        return;
      }

      docString = html.substr(start, (end-start)+DOC_TYPE_END.length);
      doctype = docString.replace(/[\n\r]/g,'').match(DOC_TYPE);

      if (!doctype) {
        return;
      }

      fullDT = doctype[0];
      doctype = doctype[1].split(' "');
      var _id1 = doctype.length ? doctype.pop().replace(/"/g, '') : '',
          _id2 = doctype.length ? doctype.pop().replace(/"/g, '') : '';

      if (_id1.indexOf('-//') !== -1) {
        publicID = _id1;
      }
      if (_id2.indexOf('-//') !== -1) {
        publicID = _id2;
      }
      if (_id1.indexOf('://') !== -1) {
        systemID = _id1;
      }
      if (_id2.indexOf('://') !== -1) {
        systemID = _id2;
      }
      if (doctype.length) {
        doctype = doctype[0].split(' ');
        name = doctype[0];
      }
    }
    doc._doctype = new dom.DOMImplementation().createDocumentType(name, publicID, systemID);
    doc._doctype._ownerDocument = doc;
    doc._doctype._parentNode = doc;
    doc._doctype._fullDT = fullDT;
    doc._doctype.toString = function() {
      return this._fullDT;
    };
  }

  defineGetter(dom.Document.prototype, 'parentWindow', function() {
    if (!this._parentWindow) {
      this.parentWindow = exports.windowAugmentation(dom, {document: this, url: this.URL});
    }
    return this._parentWindow;
  });

  dom._augmented = true;
  return dom;
};
