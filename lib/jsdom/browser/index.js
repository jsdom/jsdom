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
  dom.Document.prototype._htmlToDom = htmltodom;
  dom.Document.prototype._domImpl = dom.DOMImplementation;

  defineGetter(dom.Document.prototype, 'parentWindow', function() {
    if (!this._parentWindow) {
      this.parentWindow = exports.windowAugmentation(dom, {document: this, url: this.URL});
    }
    return this._parentWindow;
  });

  dom._augmented = true;
  return dom;
};
