"use strict";
const vm = require("vm");
const whatwgEncoding = require("whatwg-encoding");

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const { reflectURLAttribute } = require("../../utils");
const resourceLoader = require("../../browser/resource-loader");
const reportException = require("../helpers/runtime-script-errors");
const { domSymbolTree } = require("../helpers/internal-constants");
const nodeTypes = require("../node-type");

const jsMIMETypes = new Set([
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
  _attach() {
    super._attach();
    this._eval();
  }

  _attrModified(name, value, oldValue) {
    super._attrModified(name, value, oldValue);

    if (this._attached && !this._startedEval && name === "src" && oldValue === null && value !== null) {
      resourceLoader.load(
        this,
        this.src,
        { defaultEncoding: whatwgEncoding.labelToName(this.getAttribute("charset")) || this._ownerDocument._encoding },
        this._innerEval
      );
    }
  }

  // Also used during parsing as a hack around proper script evaluation.
  //
  // Note: because of how hacky this all is, this is generally called twice during initial parsing cases: 1) When the
  // element is inserted into the document (when its start tag is encountered), when there's no text content and no
  // src="" attribute. 2a) Once the src="" attribute is encountered, if applicable. 2b) Once the end tag is encountered
  // and there is interesting child text content, if applicable. Note that both 2a) and 2b) can be true in strange
  // cases (see e.g. the html/semantics/scripting-1/the-script-element/execution-timing/115.html WPT).
  _eval() {
    if (!this._attached || this._startedEval) {
      return;
    }

    if (this.src) {
      this._startedEval = true;
      resourceLoader.load(
        this,
        this.src,
        { defaultEncoding: whatwgEncoding.labelToName(this.getAttribute("charset")) || this._ownerDocument._encoding },
        this._innerEval
      );
    } else if (this.text.trim().length > 0) {
      this._startedEval = true;
      resourceLoader.enqueue(this, this._ownerDocument.URL, this._innerEval)(null, this.text);
    }
  }

  _innerEval(text, filename) {
    const typeString = this._getTypeString();

    if (this._ownerDocument._defaultView && this._ownerDocument._defaultView._runScripts === "dangerously" &&
        jsMIMETypes.has(typeString.toLowerCase())) {
      this._ownerDocument._writeAfterElement = this;
      processJavaScript(this, text, filename);
      delete this._ownerDocument._writeAfterElement;
    }
  }

  _getTypeString() {
    const typeAttr = this.getAttribute("type");
    const langAttr = this.getAttribute("language");

    if (typeAttr === "") {
      return "text/javascript";
    }

    if (typeAttr === null && langAttr === "") {
      return "text/javascript";
    }

    if (typeAttr === null && langAttr === null) {
      return "text/javascript";
    }

    if (typeAttr !== null) {
      return typeAttr.trim();
    }

    if (langAttr !== null) {
      return "text/" + langAttr;
    }

    return null;
  }

  get text() {
    let text = "";
    for (const child of domSymbolTree.childrenIterator(this)) {
      if (child.nodeType === nodeTypes.TEXT_NODE) {
        text += child.nodeValue;
      }
    }
    return text;
  }

  set text(text) {
    this.textContent = text;
  }

  get src() {
    return reflectURLAttribute(this, "src");
  }

  set src(V) {
    this.setAttribute("src", V);
  }
}

function processJavaScript(element, code, filename) {
  const document = element.ownerDocument;
  const window = document && document._global;

  if (window) {
    document._currentScript = element;

    let lineOffset = 0;
    if (!element.src) {
      for (const child of domSymbolTree.childrenIterator(element)) {
        if (child.nodeType === nodeTypes.TEXT_NODE) {
          if (child.__location) {
            lineOffset = child.__location.line - 1;
          }
          break;
        }
      }
    }

    try {
      vm.runInContext(code, window, { filename, lineOffset, displayErrors: false });
    } catch (e) {
      reportException(window, e, filename);
    } finally {
      document._currentScript = null;
    }
  }
}

module.exports = {
  implementation: HTMLScriptElementImpl
};
