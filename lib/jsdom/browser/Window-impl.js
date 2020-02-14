"use strict";
const vm = require("vm");
const { CSSStyleDeclaration } = require("cssstyle");
const DOMException = require("domexception/webidl2js-wrapper.js");
const webIDLConversions = require("webidl-conversions");
const { Performance: RawPerformance } = require("w3c-hr-time");
const { btoa, atob } = require("abab");

const notImplemented = require("./not-implemented.js");
const { isValidTargetOrigin, define, mixin } = require("../utils.js");
const namedPropertiesWindow = require("../living/named-properties-window.js");
const EventTargetImpl = require("../living/events/EventTarget-impl.js").implementation;
const GlobalEventHandlersImpl = require("../living/nodes/GlobalEventHandlers-impl.js").implementation;
const WindowEventHandlersImpl = require("../living/nodes/WindowEventHandlers-impl.js").implementation;
const WebSocketImpl = require("../living/websockets/WebSocket-impl").implementation;
const SessionHistory = require("../living/window/SessionHistory.js");
const idlUtils = require("../living/generated/utils.js");
const MessageEvent = require("../living/generated/MessageEvent.js");
const PageTransitionEvent = require("../living/generated/PageTransitionEvent.js");
const BarProp = require("../living/generated/BarProp.js");
const Document = require("../living/generated/Document.js");
const External = require("../living/generated/External.js");
const Navigator = require("../living/generated/Navigator.js");
const Performance = require("../living/generated/Performance.js");
const Screen = require("../living/generated/Screen.js");
const Storage = require("../living/generated/Storage.js");
const Selection = require("../living/generated/Selection.js");
const reportException = require("../living/helpers/runtime-script-errors.js");
const { fireAnEvent } = require("../living/helpers/events.js");
const { forEachMatchingSheetRuleOfElement, getResolvedValue, propertiesWithResolvedValueImplemented,
  SHADOW_DOM_PSEUDO_REGEXP } = require("../living/helpers/style-rules.js");

class WindowImpl extends EventTargetImpl {
  constructor(globalObject, args, { globalProxy, options }) {
    super(globalObject);

    const rawPerformance = new RawPerformance();
    this.windowInitialized = rawPerformance.now();
    this.rawPerformance = rawPerformance;

    if (!idlUtils.hasOwn(globalObject, idlUtils.implSymbol)) {
      // This is needed during initialization of EventTarget implementations:
      Object.defineProperty(globalObject, idlUtils.implSymbol, { value: this, configurable: true });
      this._globalImpl = this;
    }

    this._initGlobalEvents();

    ///// PRIVATE DATA PROPERTIES

    this[idlUtils.wrapperSymbol] = this._globalProxy = globalProxy;
    this._resourceLoader = options.resourceLoader;

    // List options explicitly to be clear which are passed through
    this.document = Document.createImpl(globalObject, [], {
      options: {
        parsingMode: options.parsingMode,
        contentType: options.contentType,
        encoding: options.encoding,
        cookieJar: options.cookieJar,
        url: options.url,
        lastModified: options.lastModified,
        referrer: options.referrer,
        concurrentNodeIterators: options.concurrentNodeIterators,
        parseOptions: options.parseOptions,
        defaultView: this
      }
    });
    const documentOrigin = this.origin;

    // https://html.spec.whatwg.org/#session-history
    this._sessionHistory = new SessionHistory({
      document: this.document,
      url: this.document._URL,
      stateObject: null
    }, this);

    this._virtualConsole = options.virtualConsole;

    this._runScripts = options.runScripts;

    // Set up the window as if it's a top level window.
    // If it's not, then references will be corrected by frame/iframe code.
    this.parent = this.top = this;
    this.frameElement = null;

    // This implements window.frames.length, since window.frames returns a
    // self reference to the window object.  This value is incremented in the
    // HTMLFrameElement implementation.
    this.length = 0;

    this._pretendToBeVisual = options.pretendToBeVisual;
    this._storageQuota = options.storageQuota;

    // Some properties (such as localStorage and sessionStorage) share data
    // between windows in the same origin. This object is intended
    // to contain such data.
    if (options.commonForOrigin && options.commonForOrigin[documentOrigin]) {
      this._commonForOrigin = options.commonForOrigin;
    } else {
      this._commonForOrigin = {
        [documentOrigin]: {
          localStorageArea: new Map(),
          sessionStorageArea: new Map(),
          windowsInSameOrigin: [this]
        }
      };
    }

    this._currentOriginData = this._commonForOrigin[documentOrigin];

    ///// WEB STORAGE

    this._localStorage = Storage.createImpl(globalObject, [], {
      associatedWindow: this,
      storageArea: this._currentOriginData.localStorageArea,
      type: "localStorage",
      url: this.document.documentURI,
      storageQuota: this._storageQuota
    });
    this._sessionStorage = Storage.createImpl(globalObject, [], {
      associatedWindow: this,
      storageArea: this._currentOriginData.sessionStorageArea,
      type: "sessionStorage",
      url: this.document.documentURI,
      storageQuota: this._storageQuota
    });

    ///// SELECTION

    // https://w3c.github.io/selection-api/#dfn-selection
    this._selection = Selection.createImpl(globalObject);

    // https://html.spec.whatwg.org/multipage/timers-and-user-prompts.html#timers

    // In the spec the list of active timers is a set of IDs. We make it a map of IDs to Node.js timer objects, so that
    // we can call Node.js-side clearTimeout() when clearing, and thus allow process shutdown faster.
    this.listOfActiveTimers = new Map();
    this.latestTimerId = 0;

    // https://html.spec.whatwg.org/multipage/imagebitmap-and-animations.html#animation-frames

    this.animationFrameCallbackId = 0;
    this.animationFrameNodejsInterval = null;
    this.mapOfAnimationFrameCallbacks = new Map();

    // Unlike the spec, where an animation frame happens every 60 Hz regardless, we optimize so that if there are no
    // requestAnimationFrame() calls outstanding, we don't fire the timer. This helps us track that.
    this.numberOfOngoingAnimationFrameCallbacks = 0;

    ///// MISC PROPERTIES

    this.locationbar = BarProp.createImpl(globalObject);
    this.menubar = BarProp.createImpl(globalObject);
    this.personalbar = BarProp.createImpl(globalObject);
    this.scrollbars = BarProp.createImpl(globalObject);
    this.statusbar = BarProp.createImpl(globalObject);
    this.toolbar = BarProp.createImpl(globalObject);
    this.external = External.createImpl(globalObject);
    this.navigator = Navigator.createImpl(globalObject, [], { userAgent: this._resourceLoader._userAgent });
    this.performance = Performance.createImpl(globalObject, [], { rawPerformance });
    this.screen = Screen.createImpl(globalObject);

    namedPropertiesWindow.initializeWindow(globalObject, this._globalProxy);

    define(this, {
      name: "",
      status: "",
      devicePixelRatio: 1,
      innerWidth: 1024,
      innerHeight: 768,
      outerWidth: 1024,
      outerHeight: 768,
      pageXOffset: 0,
      pageYOffset: 0,
      screenX: 0,
      screenLeft: 0,
      screenY: 0,
      screenTop: 0,
      scrollX: 0,
      scrollY: 0
    });

    ///// INITIALIZATION

    process.nextTick(() => {
      if (!this.document) {
        return; // window might've been closed already
      }

      if (this.document.readyState === "complete") {
        fireAnEvent("load", this, undefined, {}, this.document);
      } else {
        this.document.addEventListener("load", () => {
          fireAnEvent("load", this, undefined, {}, this.document);

          if (!this.document._pageShowingFlag) {
            this.document._pageShowingFlag = true;
            fireAnEvent("pageshow", this, PageTransitionEvent, { persisted: false }, this.document);
          }
        });
      }
    });
  }

  get window() {
    return this;
  }

  get self() {
    return this;
  }

  get frames() {
    return this;
  }

  get history() {
    return this.document._history;
  }

  get location() {
    return this.document._location;
  }

  get origin() {
    return this.document._origin;
  }

  get localStorage() {
    if (this.origin === "null") {
      throw DOMException.create(this._globalObject, [
        "localStorage is not available for opaque origins",
        "SecurityError"
      ]);
    }

    return this._localStorage;
  }

  get sessionStorage() {
    if (this.origin === "null") {
      throw DOMException.create(this._globalObject, [
        "sessionStorage is not available for opaque origins",
        "SecurityError"
      ]);
    }

    return this._sessionStorage;
  }
  setTimeout(handler, timeout = 0, ...args) {
    return timerInitializationSteps(handler, timeout, args, { window: this, repeat: false });
  }
  setInterval(handler, timeout = 0, ...args) {
    return timerInitializationSteps(handler, timeout, args, { window: this, repeat: true });
  }

  clearTimeout(handle = 0) {
    const nodejsTimer = this.listOfActiveTimers.get(handle);
    if (nodejsTimer) {
      clearTimeout(nodejsTimer);
      this.listOfActiveTimers.delete(handle);
    }
  }
  clearInterval(handle = 0) {
    const nodejsTimer = this.listOfActiveTimers.get(handle);
    if (nodejsTimer) {
      // We use setTimeout() in timerInitializationSteps even for this.setInterval().
      clearTimeout(nodejsTimer);
      this.listOfActiveTimers.delete(handle);
    }
  }

  // The `requestAnimationFrame` and `cancelAnimationFrame` methods
  // are only created on the wrapper when `_pretendToBeVisual` is `true`.
  requestAnimationFrame(callback) {
    const handle = ++this.animationFrameCallbackId;
    this.mapOfAnimationFrameCallbacks.set(handle, callback);

    if (++this.numberOfOngoingAnimationFrameCallbacks === 1) {
      this.animationFrameNodejsInterval = setInterval(() => {
        runAnimationFrameCallbacks(this, this.rawPerformance.now() - this.windowInitialized);
      }, 1000 / 60);
    }

    return handle;
  }

  cancelAnimationFrame(handle) {
    if (this.mapOfAnimationFrameCallbacks.has(handle)) {
      if (--this.numberOfOngoingAnimationFrameCallbacks === 0) {
        clearInterval(this.animationFrameNodejsInterval);
        this.animationFrameNodejsInterval = null;
      }
    }

    this.mapOfAnimationFrameCallbacks.delete(handle);
  }

  postMessage(message, options) {
    const targetOrigin = idlUtils.isObject(options) ? options.targetOrigin : options;

    if (!isValidTargetOrigin(targetOrigin)) {
      // TODO: Fix me
      throw DOMException.create(this._globalObject, [
        "Failed to execute 'postMessage' on 'Window': Invalid target origin '" +
        targetOrigin + "' in a call to 'postMessage'.",
        "SyntaxError"
      ]);
    }

    // TODO: targetOrigin === '/' - requires reference to source window
    // See https://github.com/jsdom/jsdom/pull/1140#issuecomment-111587499
    if (targetOrigin !== "*" && targetOrigin !== this.origin) {
      return;
    }

    // TODO: event.source - requires reference to source window
    // TODO: event.origin - requires reference to source window
    // TODO: event.ports
    // TODO: event.data - structured clone message - requires cloning DOM nodes
    setTimeout(() => {
      fireAnEvent("message", this, MessageEvent, { data: message });
    }, 0);
  }

  atob(str) {
    const result = atob(str);
    if (result === null) {
      throw DOMException.create(this._globalObject, [
        "The string to be decoded contains invalid characters.",
        "InvalidCharacterError"
      ]);
    }
    return result;
  }

  btoa(str) {
    const result = btoa(str);
    if (result === null) {
      throw DOMException.create(this._globalObject, [
        "The string to be encoded contains invalid characters.",
        "InvalidCharacterError"
      ]);
    }
    return result;
  }

  stop() {
    const manager = this.document._requestManager;
    if (manager) {
      manager.close();
    }
  }

  close() {
    // Recursively close child frame windows, then ourselves (depth-first).
    const { length, _globalObject } = this;
    for (let i = 0; i < length; ++i) {
      _globalObject[i].close();
    }

    // Clear out all listeners. Any in-flight or upcoming events should not get delivered.
    this._eventListeners = Object.create(null);

    if (this.document) {
      if (this.document.body) {
        this.document.body.innerHTML = "";
      }

      if (this.document.close) {
        // It's especially important to clear out the listeners here
        // because document.close() causes a "load" event to fire.
        this.document._eventListeners = Object.create(null);
        this.document.close();
      }
      const manager = this.document._requestManager;
      if (manager) {
        manager.close();
      }
      delete this.document;
    }

    for (const nodejsTimer of this.listOfActiveTimers.values()) {
      clearTimeout(nodejsTimer);
    }
    this.listOfActiveTimers.clear();

    if (this.animationFrameNodejsInterval !== null) {
      clearInterval(this.animationFrameNodejsInterval);
    }
    WebSocketImpl.cleanUpWindow(this);
  }

  getComputedStyle(element, pseudoElt) {
    if (pseudoElt !== undefined && pseudoElt !== "") {
      // TODO: Parse pseudoElt

      notImplemented("window.computedStyle(element, pseudoElt)", this);

      if (SHADOW_DOM_PSEUDO_REGEXP.test(pseudoElt)) {
        throw new this._globalObject.TypeError("Tried to get the computed style of a Shadow DOM pseudo-element.");
      }
    }

    const declaration = new CSSStyleDeclaration();
    const { forEach } = Array.prototype;
    const { style } = element;

    forEachMatchingSheetRuleOfElement(element, ({ style: ruleStyle }) => {
      forEach.call(ruleStyle, property => {
        declaration.setProperty(
          property,
          ruleStyle.getPropertyValue(property),
          ruleStyle.getPropertyPriority(property)
        );
      });
    });

    // https://drafts.csswg.org/cssom/#dom-window-getcomputedstyle
    for (const property of Object.keys(propertiesWithResolvedValueImplemented)) {
      declaration.setProperty(property, getResolvedValue(element, property));
    }

    forEach.call(style, property => {
      declaration.setProperty(property, style.getPropertyValue(property), style.getPropertyPriority(property));
    });

    return declaration;
  }

  getSelection() {
    return this.document.getSelection();
  }

  // The captureEvents() and releaseEvents() methods must do nothing
  captureEvents() {}
  releaseEvents() {}

  alert() {
    notImplemented("window.alert", this);
  }
  blur() {
    notImplemented("window.blur", this);
  }
  confirm() {
    notImplemented("window.confirm", this);
  }
  focus() {
    notImplemented("window.focus", this);
  }
  moveBy() {
    notImplemented("window.moveBy", this);
  }
  moveTo() {
    notImplemented("window.moveTo", this);
  }
  open() {
    notImplemented("window.open", this);
  }
  print() {
    notImplemented("window.print", this);
  }
  prompt() {
    notImplemented("window.prompt", this);
  }
  resizeBy() {
    notImplemented("window.resizeBy", this);
  }
  resizeTo() {
    notImplemented("window.resizeTo", this);
  }
  scroll() {
    notImplemented("window.scroll", this);
  }
  scrollBy() {
    notImplemented("window.scrollBy", this);
  }
  scrollTo() {
    notImplemented("window.scrollTo", this);
  }

  [idlUtils.inspectCustomSymbol](depth, ctx) {
    if (depth < 0) {
      return "[Window]";
    }

    return `Window ${ctx.stylize(this.location.href, "undefined")}`;
  }
}
exports.implementation = WindowImpl;

mixin(WindowImpl.prototype, WindowEventHandlersImpl.prototype);
mixin(WindowImpl.prototype, GlobalEventHandlersImpl.prototype);

exports.init = (windowImpl, { wrapper }) => {
  Object.defineProperty(windowImpl, idlUtils.wrapperSymbol, {
    get() {
      return this._globalProxy;
    }
  });

  function Option(text, value, defaultSelected, selected) {
    if (text === undefined) {
      text = "";
    } else {
      text = webIDLConversions.DOMString(text, {
        context: "Failed to construct 'Option': Parameter 1"
      });
    }

    if (value !== undefined) {
      value = webIDLConversions.DOMString(value, {
        context: "Failed to construct 'Option': Parameter 2"
      });
    }

    defaultSelected = webIDLConversions.boolean(defaultSelected, {
      context: "Failed to construct 'Option': Parameter 3"
    });
    selected = webIDLConversions.boolean(selected, {
      context: "Failed to construct 'Option': Parameter 4"
    });

    const option = windowImpl.document.createElement("option");

    if (text !== "") {
      option.text = text;
    }
    if (value !== undefined) {
      option.setAttributeNS(null, "value", value);
    }
    if (defaultSelected) {
      option.setAttributeNS(null, "selected", "");
    }
    option._selectedness = selected;

    return idlUtils.wrapperForImpl(option);
  }
  Object.defineProperty(Option, "prototype", {
    value: wrapper.HTMLOptionElement.prototype,
    configurable: false,
    enumerable: false,
    writable: false
  });
  Object.defineProperty(wrapper, "Option", {
    value: Option,
    configurable: true,
    enumerable: false,
    writable: true
  });

  function Image() {
    const img = windowImpl.document.createElement("img");

    if (arguments.length > 0) {
      img.setAttributeNS(null, "width", webIDLConversions.DOMString(arguments[0], {
        context: "Failed to construct 'Image': Parameter 1"
      }));
    }
    if (arguments.length > 1) {
      img.setAttributeNS(null, "height", webIDLConversions.DOMString(arguments[1], {
        context: "Failed to construct 'Image': Parameter 2"
      }));
    }

    return idlUtils.wrapperForImpl(img);
  }
  Object.defineProperty(Image, "prototype", {
    value: wrapper.HTMLImageElement.prototype,
    configurable: false,
    enumerable: false,
    writable: false
  });
  Object.defineProperty(wrapper, "Image", {
    value: Image,
    configurable: true,
    enumerable: false,
    writable: true
  });

  function Audio(src) {
    const audio = windowImpl.document.createElement("audio");
    audio.setAttributeNS(null, "preload", "auto");

    if (src !== undefined) {
      audio.setAttributeNS(null, "src", webIDLConversions.DOMString(src, {
        context: "Failed to construct 'Audio': Parameter 1"
      }));
    }

    return audio;
  }
  Object.defineProperty(Audio, "prototype", {
    value: wrapper.HTMLAudioElement.prototype,
    configurable: false,
    enumerable: false,
    writable: false
  });
  Object.defineProperty(wrapper, "Audio", {
    value: Audio,
    configurable: true,
    enumerable: false,
    writable: true
  });

  Object.defineProperty(wrapper, "console", {
    configurable: true,
    enumerable: false,
    writable: true,
    value: {
      __proto__: {},
      assert: wrapConsoleMethod(windowImpl, "assert"),
      clear: wrapConsoleMethod(windowImpl, "clear"),
      count: wrapConsoleMethod(windowImpl, "count"),
      countReset: wrapConsoleMethod(windowImpl, "countReset"),
      debug: wrapConsoleMethod(windowImpl, "debug"),
      dir: wrapConsoleMethod(windowImpl, "dir"),
      dirxml: wrapConsoleMethod(windowImpl, "dirxml"),
      error: wrapConsoleMethod(windowImpl, "error"),
      group: wrapConsoleMethod(windowImpl, "group"),
      groupCollapsed: wrapConsoleMethod(windowImpl, "groupCollapsed"),
      groupEnd: wrapConsoleMethod(windowImpl, "groupEnd"),
      info: wrapConsoleMethod(windowImpl, "info"),
      log: wrapConsoleMethod(windowImpl, "log"),
      table: wrapConsoleMethod(windowImpl, "table"),
      time: wrapConsoleMethod(windowImpl, "time"),
      timeLog: wrapConsoleMethod(windowImpl, "timeLog"),
      timeEnd: wrapConsoleMethod(windowImpl, "timeEnd"),
      trace: wrapConsoleMethod(windowImpl, "trace"),
      warn: wrapConsoleMethod(windowImpl, "warn")
    }
  });
};

function timerInitializationSteps(handler, timeout, args, {
  window,
  repeat,
  previousHandle: handle = ++window.latestTimerId
}) {
  // This appears to be unspecced, but matches browser behavior for close()ed windows.
  if (!window.document) {
    return 0;
  }

  // TODO: implement timer nesting level behavior.

  const methodContextProxy = window._globalProxy;

  function task() {
    if (!window.listOfActiveTimers.has(handle)) {
      return;
    }

    try {
      if (typeof handler === "function") {
        handler.apply(methodContextProxy, args);
      } else if (window._runScripts === "dangerously") {
        vm.runInContext(handler, window._globalObject, {
          filename: window.location.href,
          displayErrors: false
        });
      }
    } catch (e) {
      reportException(window, e, window.location.href);
    }

    if (repeat && window.listOfActiveTimers.has(handle)) {
      timerInitializationSteps(handler, timeout, args, {
        window,
        repeat: true,
        previousHandle: handle
      });
    }
  }

  if (timeout < 0) {
    timeout = 0;
  }

  const nodejsTimer = setTimeout(task, timeout);
  window.listOfActiveTimers.set(handle, nodejsTimer);

  return handle;
}

function runAnimationFrameCallbacks(window, now) {
  const { mapOfAnimationFrameCallbacks } = window;

  // Converting to an array is important to get a sync snapshot and thus match spec semantics.
  const callbackHandles = [...mapOfAnimationFrameCallbacks.keys()];
  for (const handle of callbackHandles) {
    // This has() can be false if a callback calls cancelAnimationFrame().
    if (mapOfAnimationFrameCallbacks.has(handle)) {
      const callback = mapOfAnimationFrameCallbacks.get(handle);
      mapOfAnimationFrameCallbacks.delete(handle);
      try {
        callback(now);
      } catch (e) {
        reportException(window, e, window.location.href);
      }
    }
  }
}

function wrapConsoleMethod(window, method) {
  return (...args) => {
    window._virtualConsole.emit(method, ...args);
  };
}
