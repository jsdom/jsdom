"use strict";
const vm = require("vm");

const HTMLElementImpl = require("./HTMLElement-impl").implementation;

const NODE_TYPE = require("../node-type");
const documentBaseURL = require("../helpers/document-base-url").documentBaseURL;
const resourceLoader = require("../../browser/resource-loader");
const internalConstants = require("../helpers/internal-constants");
const reportException = require("../helpers/runtime-script-errors");
const domSymbolTree = internalConstants.domSymbolTree;
const Event = require("../generated/Event");

const URL = require("whatwg-url").URL;

const jsMimes = new Set([
  "application/ecmascript",
  "application/javascript",
  "application/x-ecmascript",
  "application/x-javascript",
  "text/ecmascript",
  "text/javascript",
  "text/javascript1.0",
  "text/javascript1.1",
  "text/javascript1.2",
  "text/javascript1.3",
  "text/javascript1.4",
  "text/javascript1.5",
  "text/jscript",
  "text/livescript",
  "text/x-ecmascript",
  "text/x-javascript"
]);

class HTMLScriptElementImpl extends HTMLElementImpl {
  constructor(args, privateData) {
    super(args, privateData);

    this._alreadyStarted = false;
    this._parserInserted = false;
    this._nonBlocking = true;
    this._readyToParserExecute = false;
  }

  _attach() {
    super._attach();

    if (!this._parserInserted) {
      this._prepare();
    }
  }

  _attrModified(name, value, oldValue) {
    super._attrModified(name, value, oldValue);

    if (name === "async" && value !== null) {
      this._nonBlocking = false;
    } else if (name === "src" && value !== null && oldValue === null) {
      this._prepare();
    }
  }

  _prepare() {
    if (this._alreadyStarted) {
      return;
    }

    const wasParserInserted = this._parserInserted;
    this._parserInserted = false;

    if (wasParserInserted && !this.hasAttribute("async")) {
      this._nonBlocking = true;
    }

    if (!this.hasAttribute("src") && this.text === "") {
      return;
    }

    if (!this._ownerDocument) {
      return;
    }

    let blockType;
    if (this.getAttribute("type") === "" || (!this.hasAttribute("type") && this.getAttribute("language") === "") ||
        (!this.hasAttribute("type") && !this.hasAttribute("language"))) {
      blockType = "text/javascript";
    } else if (this.hasAttribute("type")) {
      blockType = this.getAttribute("type").trim();
    } else {
      blockType = "text/" + this.getAttribute("language");
    }

    if (!jsMimes.has(blockType.toLowerCase())) {
      return;
    }

    if (wasParserInserted) {
      this._parserInserted = true;
      this._nonBlocking = false;
    }
    this._alreadyStarted = true;

    if (this._parserInserted) {
      // missing: [if] element's node document is not the Document of the parser that created the element, [...] abort
    }

    if (!this._ownerDocument.implementation._hasFeature("ProcessExternalResources", "script")) {
      return;
    }

    if (this.hasAttribute("event") && this.hasAttribute("for")) {
      const forAttr = this.getAttribute("for").trim().toLowerCase();
      const eventAttr = this.getAttribute("event").trim().toLowerCase();
      if (forAttr !== "window") {
        return;
      }
      if (eventAttr !== "onload" && eventAttr !== "onload()") {
        return;
      }
    }

    // missing step 13

    let url;
    if (this.hasAttribute("src")) {
      const src = this.getAttribute("src");
      if (src === "") {
        const event = Event.createImpl(["error"], { isTrusted: true });
        this.dispatchEvent(event);
        return;
      }

      try {
        url = new URL(src, documentBaseURL(this._ownerDocument)).href;
      } catch (e) {
        const event = Event.createImpl(["error"], { isTrusted: true });
        this.dispatchEvent(event);
        return;
      }
    } else {
      url = documentBaseURL(this._ownerDocument);
    }

    if (this.hasAttribute("src") && this.hasAttribute("defer") && this._parserInserted && !this.hasAttribute("async")) {
      const obj = { tag: this, filename: url, text: null };
      this.ownerDocument._scriptsExecuteAtParseEnd.push(obj);
      resourceLoader.load(this, url, text => {
        obj.text = text;
        this._readyToParserExecute = true;
        if (obj.onload) {
          obj.onload();
        }
      });
    } else if (this.hasAttribute("src") && this._parserInserted && !this.hasAttribute("async")) {
      const obj = { tag: this, filename: url, text: null };
      this.ownerDocument._pendingParsingBlockingScript = obj;
      resourceLoader.load(this, url, text => {
        obj.text = text;
        this._readyToParserExecute = true;
        if (obj.onload) {
          obj.onload();
        }
      });
    } else if (!this.hasAttribute("src") && this._parserInserted) { // need to check nesting level & blocking style sheets
      const obj = { tag: this, filename: url, text: this.text };
      this.ownerDocument._pendingParsingBlockingScript = obj;
      this._readyToParserExecute = true;
    } else if (this.hasAttribute("src") && !this.hasAttribute("async") && !this._nonBlocking) {
      const asapScripts = this.ownerDocument._scriptsExecuteASAP;
      const obj = { tag: this, filename: url, text: null, ready: false };
      asapScripts.push(obj);
      resourceLoader.load(this, url, text => {
        if (asapScripts[0] !== this) {
          obj.text = text; // filled text is our ready marker
          return;
        }
        do {
          const entry = asapScripts.shift();
          this._eval(true, entry.text, entry.filename);
        } while (asapScripts[0] && asapScripts[0].text !== null);
      });
    } else if (this.hasAttribute("src")) {
      const asapScripts = this.ownerDocument._scriptsExecuteASAP;
      const obj = { tag: this, filename: url, ready: false };
      asapScripts.push(obj);
      resourceLoader.load(this, url, (text, scriptUrl) => {
        this._eval(true, text, scriptUrl);
        asapScripts.splice(asapScripts.indexOf(obj), 1);
      });
    } else {
      resourceLoader.enqueue(this, url, () => {
        this._eval(false, this.text, this.ownerDocument.URL);
      })();
    }
  }

  _eval(wasExternal, text, filename) {
    const beforeEv = Event.createImpl(["beforescriptexecute"], { isTrusted: true, bubbles: true, cancelable: true });
    if (!this.dispatchEvent(beforeEv)) {
      return;
    }

    let neutralisedDoc;
    if (wasExternal) {
      neutralisedDoc = this.ownerDocument;
      ++neutralisedDoc._ignoreDestructiveWritesCounter;
    }

    const oldScriptElement = this.ownerDocument._currentScript;
    this.ownerDocument._currentScript = this;

    createScript(this, text, filename);

    this.ownerDocument._currentScript = oldScriptElement;

    if (wasExternal) {
      --neutralisedDoc._ignoreDestructiveWritesCounter;
    }

    const afterEv = Event.createImpl(["afterscriptexecute"], { isTrusted: true, bubbles: true });
    if (!this.dispatchEvent(afterEv)) {
      return;
    }

    if (!wasExternal) { // if loaded by resource loader, event is taken care of there
      setImmediate(() => {
        const loadEv = Event.createImpl(["load"], { isTrusted: true });
        if (!this.dispatchEvent(loadEv)) {
          return;
        }
      });
    }
  }

  get text() {
    let text = "";
    for (const child of domSymbolTree.childrenIterator(this)) {
      if (child.nodeType === NODE_TYPE.TEXT_NODE) {
        text += child.nodeValue;
      }
    }
    return text;
  }

  set text(text) {
    this.textContent = text;
  }

  get src() {
    return resourceLoader.resolveResourceUrl(this._ownerDocument, this.getAttribute("src"));
  }

  set src(V) {
    this.setAttribute("src", V);
  }
}

function createScript(element, code, filename) {
  const document = element.ownerDocument;
  const window = document && document._global;

  if (window) {
    try {
      vm.runInContext(code, window, { filename, displayErrors: false });
    } catch (e) {
      reportException(window, e, filename);
    }
  }
}

module.exports = {
  implementation: HTMLScriptElementImpl
};
