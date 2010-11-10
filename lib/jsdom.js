
var dom = exports.dom = require("./jsdom/level3/index").dom;
exports.defaultLevel = dom.level3.html;
exports.browserAugmentation = require("./jsdom/browser/index").browserAugmentation;
exports.windowAugmentation = require("./jsdom/browser/index").windowAugmentation;

var createWindow = exports.createWindow = require("./jsdom/browser/index").createWindow;

exports.jsdom = function (html, level, options) {
  html = html || "<html><head></head><body></body></html>";
  level = level || exports.defaultLevel;
  options = options || {};
  
  var browser = exports.browserAugmentation(level, options),
    url = options.url || module.parent.filename,
    doc,
    loadEvent;
    
  if (browser.HTMLDocument) {
    doc = new browser.HTMLDocument(url, options.documentRoot);
    
    doc.addEventListener('load', function(ev) {
      // Window has already been created, re-dispatch the event
      if (this.defaultView) {
        this.defaultView.dispatchEvent(ev);
      }
      else {
        // Save the load event to re-dispatch it later
        loadEvent = ev;
      }
    });
    
    doc.load(html);
  }
  else {
    doc = new browser.Document();
    doc.innerHTML = html;
  }
  
  doc.createWindow = function(url) {
    var window = exports.windowAugmentation(level, { document: doc, url: url });
    
    // Remove ourself
    if (window && window.document && window.document.createWindow) {
      delete window.document.createWindow;
    }
    
    // Document is already loaded
    if (loadEvent && window.dispatchEvent) {
      window.dispatchEvent(loadEvent);
    }
    
    return window;
  };
  return doc;
};

exports.jQueryify = function (window /* path [optional], callback */) {

  if (!window || !window.document) { return; }

  var args = Array.prototype.slice.call(arguments),
      callback = (typeof(args[args.length - 1]) === 'function') && args.pop(),
      path,
      jQueryTag = window.document.createElement("script");

  if (args.length > 1 && typeof(args[1] === 'string')) {
    path = args[1];
  }

  jQueryTag.src = path || 'http://code.jquery.com/jquery-latest.js';
  window.document.body.appendChild(jQueryTag);
  
  jQueryTag.onload = function() {
    if (callback) {
      callback(window, window.jQuery);
    }
  };

  return window;
};
