"use strict";

var CSSStyleDeclaration = require("cssstyle").CSSStyleDeclaration;
var file = require("./file");
var xhr = require("./xhr");
var notImplemented = require("./not-implemented");
var History = require("./history");
var VirtualConsole = require("../virtual-console");
var define = require("../utils").define;
var inherits = require("../utils").inheritFrom;
var EventTarget = require("../living/generated/events/EventTarget");
var namedPropertiesWindow = require("../living/named-properties-window");
var cssom = require("cssom");
var postMessage = require("../living/post-message");
const DOMException = require("../web-idl/DOMException");
const btoa = require("../../base64").btoa;
const atob = require("../../base64").atob;
const idlUtils = require("../living/generated/util");

// NB: the require() must be after assigning `module.export` because this require() is circular
module.exports = Window;
var dom = require("../living");

var cssSelectorSplitRE = /((?:[^,"']|"[^"]*"|'[^']*')+)/;

var defaultStyleSheet = cssom.parse(require("./default-stylesheet"));

dom.Window = Window;

// NOTE: per https://heycam.github.io/webidl/#Global, all properties on the Window object must be own-properties.
// That is why we assign everything inside of the constructor, instead of using a shared prototype.
// You can verify this in e.g. Firefox or Internet Explorer, which do a good job with Web IDL compliance.

function Window(options) {
  EventTarget.setup(this);

  var window = this;

  ///// INTERFACES FROM THE DOM
  // TODO: consider a mode of some sort where these are not shared between all DOM instances
  // It'd be very memory-expensive in most cases, though.
  define(window, dom);

  ///// PRIVATE DATA PROPERTIES

  // vm initialization is defered until script processing is activated (in level1/core)
  this._globalProxy = this;

  this.__timers = [];

  // List options explicitly to be clear which are passed through
  this._document = new dom.HTMLDocument({
    parsingMode: options.parsingMode,
    contentType: options.contentType,
    cookieJar: options.cookieJar,
    parser: options.parser,
    url: options.url,
    referrer: options.referrer,
    cookie: options.cookie,
    deferClose: options.deferClose,
    resourceLoader: options.resourceLoader,
    concurrentNodeIterators: options.concurrentNodeIterators,
    pool: options.pool,
    agentOptions: options.agentOptions,
    userAgent: options.userAgent,
    defaultView: this._globalProxy,
    global: this
  });


  // Set up the window as if it's a top level window.
  // If it's not, then references will be corrected by frame/iframe code.
  this._parent = this._top = this._globalProxy;

  // This implements window.frames.length, since window.frames returns a
  // self reference to the window object.  This value is incremented in the
  // HTMLFrameElement init function (see: level2/html.js).
  this._length = 0;

  if (options.virtualConsole) {
    if (options.virtualConsole instanceof VirtualConsole) {
      this._virtualConsole = options.virtualConsole;
    } else {
      throw new TypeError(
        "options.virtualConsole must be a VirtualConsole (from createVirtualConsole)");
    }
  } else {
    this._virtualConsole = new VirtualConsole();
  }

  ///// GETTERS

  define(this, {
    get length() {
      return window._length;
    },
    get window() {
      return window._globalProxy;
    },
    get frames() {
      return window._globalProxy;
    },
    get self() {
      return window._globalProxy;
    },
    get parent() {
      return window._parent;
    },
    get top() {
      return window._top;
    },
    get document() {
      return window._document;
    },
    get location() {
      return window._document._location;
    }
  });

  namedPropertiesWindow.initializeWindow(this, dom.HTMLCollection);

  ///// METHODS for [ImplicitThis] hack
  // See https://lists.w3.org/Archives/Public/public-script-coord/2015JanMar/0109.html
  this.addEventListener = this.addEventListener.bind(this);
  this.removeEventListener = this.removeEventListener.bind(this);
  this.dispatchEvent = this.dispatchEvent.bind(this);

  ///// METHODS

  this.setTimeout = function (fn, ms) {
    return startTimer(window, setTimeout, clearTimeout, fn, ms);
  };
  this.setInterval = function (fn, ms) {
    return startTimer(window, setInterval, clearInterval, fn, ms);
  };
  this.clearInterval = stopTimer.bind(this, window);
  this.clearTimeout = stopTimer.bind(this, window);
  this.__stopAllTimers = stopAllTimers.bind(this, window);

  this.Image = function (width, height) {
    var element = window._document.createElement("img");
    element.width = width;
    element.height = height;
    return element;
  };

  function wrapConsoleMethod(method) {
    return function () {
      var args = Array.prototype.slice.call(arguments);
      window._virtualConsole.emit.apply(window._virtualConsole, [method].concat(args));
    };
  }

  this.postMessage = postMessage;

  this.atob = function (str) {
    const result = atob(str);
    if (result === null) {
      throw new DOMException(DOMException.INVALID_CHARACTER_ERR,
        "The string to be encoded contains invalid characters.");
    }
    return result;
  };

  this.btoa = function (str) {
    const result = btoa(str);
    if (result === null) {
      throw new DOMException(DOMException.INVALID_CHARACTER_ERR,
        "The string to be encoded contains invalid characters.");
    }
    return result;
  };

  this.File = file.File;
  this.Blob = file.Blob;

  this.FileReader = file.createFileReader({
    window: window
  });

  const xhrObjs = xhr.createXMLHttpRequest({
    window: window
  });

  this.FormData = xhr.FormData;

  this.XMLHttpRequest = xhrObjs.XMLHttpRequest;
  this.XMLHttpRequestUpload = xhrObjs.XMLHttpRequestUpload;

  this.ArrayBuffer = ArrayBuffer;
  this.Date = Date;
  this.RegExp = RegExp;

  this.Int8Array = Int8Array;
  this.Uint8Array = Uint8Array;
  this.Uint8ClampedArray = Uint8ClampedArray;
  this.Int16Array = Int16Array;
  this.Uint16Array = Uint16Array;
  this.Int32Array = Int32Array;
  this.Uint32Array = Uint32Array;
  this.Float32Array = Float32Array;
  this.Float64Array = Float64Array;

  this.stop = function () {
    if (this._document._requestManager) {
      this._document._requestManager.stop();
    }
  };

  this.close = function () {
    // Recursively close child frame windows, then ourselves.
    var currentWindow = this;
    (function windowCleaner(window) {
      var i;
      // We could call window.frames.length etc, but window.frames just points
      // back to window.
      if (window.length > 0) {
        for (i = 0; i < window.length; i++) {
          windowCleaner(window[i]);
        }
      }
      // We"re already in our own window.close().
      if (window !== currentWindow) {
        window.close();
      }
    })(this);

    // Clear out all listeners. Any in-flight or upcoming events should not get delivered.
    idlUtils.implForWrapper(this, "EventTarget")._events = Object.create(null);

    if (this._document) {
      if (this._document._requestManager) {
        this._document._requestManager.close();
      }
      if (this._document.body) {
        this._document.body.innerHTML = "";
      }

      if (this._document.close) {
        // It's especially important to clear out the listeners here because document.close() causes a "load" event to
        // fire.
        this._document._listeners = Object.create(null);
        this._document.close();
      }
      delete this._document;
    }

    stopAllTimers(currentWindow);
  };

  this.getComputedStyle = function (node) {
    var s = node.style;
    var cs = new CSSStyleDeclaration();
    var forEach = Array.prototype.forEach;

    function setPropertiesFromRule(rule) {
      if (!rule.selectorText) {
        return;
      }

      var selectors = rule.selectorText.split(cssSelectorSplitRE);
      var matched = false;
      selectors.forEach(function (selectorText) {
        if (selectorText !== "" && selectorText !== "," && !matched && matchesDontThrow(node, selectorText)) {
          matched = true;
          forEach.call(rule.style, function (property) {
            cs.setProperty(property, rule.style.getPropertyValue(property), rule.style.getPropertyPriority(property));
          });
        }
      });
    }

    function readStylesFromStyleSheet(sheet) {
      forEach.call(sheet.cssRules, function (rule) {
        if (rule.media) {
          if (Array.prototype.indexOf.call(rule.media, "screen") !== -1) {
            forEach.call(rule.cssRules, setPropertiesFromRule);
          }
        } else {
          setPropertiesFromRule(rule);
        }
      });
    }

    readStylesFromStyleSheet(defaultStyleSheet);
    forEach.call(node.ownerDocument.styleSheets, readStylesFromStyleSheet);

    forEach.call(s, function (property) {
      cs.setProperty(property, s.getPropertyValue(property), s.getPropertyPriority(property));
    });

    return cs;
  };

  ///// PUBLIC DATA PROPERTIES (TODO: should be getters)

  this.history = new History(this);

  this.console = {
    assert: wrapConsoleMethod("assert"),
    clear: wrapConsoleMethod("clear"),
    count: wrapConsoleMethod("count"),
    debug: wrapConsoleMethod("debug"),
    error: wrapConsoleMethod("error"),
    group: wrapConsoleMethod("group"),
    groupCollapse: wrapConsoleMethod("groupCollapse"),
    groupEnd: wrapConsoleMethod("groupEnd"),
    info: wrapConsoleMethod("info"),
    log: wrapConsoleMethod("log"),
    table: wrapConsoleMethod("table"),
    time: wrapConsoleMethod("time"),
    timeEnd: wrapConsoleMethod("timeEnd"),
    trace: wrapConsoleMethod("trace"),
    warn: wrapConsoleMethod("warn")
  };

  function notImplementedMethod(name) {
    return function () {
      notImplemented(name, window);
    };
  }

  define(this, {
    navigator: {
      get userAgent() { return options.userAgent; },
      get appName() { return "Node.js jsDom"; },
      get platform() { return process.platform; },
      get appVersion() { return process.version; },
      noUI: true,
      get cookieEnabled() { return true; }
    },

    name: "nodejs",
    innerWidth: 1024,
    innerHeight: 768,
    outerWidth: 1024,
    outerHeight: 768,
    pageXOffset: 0,
    pageYOffset: 0,
    screenX: 0,
    screenY: 0,
    screenLeft: 0,
    screenTop: 0,
    scrollX: 0,
    scrollY: 0,
    scrollTop: 0,
    scrollLeft: 0,
    screen: {
      width: 0,
      height: 0
    },

    alert: notImplementedMethod("window.alert"),
    blur: notImplementedMethod("window.blur"),
    confirm: notImplementedMethod("window.confirm"),
    createPopup: notImplementedMethod("window.createPopup"),
    focus: notImplementedMethod("window.focus"),
    moveBy: notImplementedMethod("window.moveBy"),
    moveTo: notImplementedMethod("window.moveTo"),
    open: notImplementedMethod("window.open"),
    print: notImplementedMethod("window.print"),
    prompt: notImplementedMethod("window.prompt"),
    resizeBy: notImplementedMethod("window.resizeBy"),
    resizeTo: notImplementedMethod("window.resizeTo"),
    scroll: notImplementedMethod("window.scroll"),
    scrollBy: notImplementedMethod("window.scrollBy"),
    scrollTo: notImplementedMethod("window.scrollTo"),

    toString: function () {
      return "[object Window]";
    }
  });

  ///// INITIALIZATION

  process.nextTick(function () {
    if (!window.document) {
      return; // window might've been closed already
    }

    var ev = window.document.createEvent("HTMLEvents");
    ev.initEvent("load", false, false);
    if (window.document.readyState === "complete") {
      window.dispatchEvent(ev);
    } else {
      window.document.addEventListener("load", function (ev) {
        window.dispatchEvent(ev);
      });
    }
  });
}

inherits(EventTarget.interface, Window, EventTarget.interface.prototype);

function matchesDontThrow(el, selector) {
  try {
    return el.matches(selector);
  } catch (e) {
    return false;
  }
}

function startTimer(window, startFn, stopFn, callback, ms) {
  var res = startFn(callback, ms);
  window.__timers.push([res, stopFn]);
  return res;
}

function stopTimer(window, id) {
  if (typeof id === "undefined") {
    return;
  }
  for (var i in window.__timers) {
    if (window.__timers[i][0] === id) {
      window.__timers[i][1].call(window, id);
      window.__timers.splice(i, 1);
      break;
    }
  }
}

function stopAllTimers(window) {
  window.__timers.forEach(function (t) {
    t[1].call(window, t[0]);
  });
  window.__timers = [];
}

