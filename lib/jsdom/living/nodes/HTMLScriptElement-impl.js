"use strict";
const vm = require("vm");
const { getBOMEncoding, labelToName, legacyHookDecode } = require("@exodus/bytes/encoding.js");
const { MIMEType } = require("whatwg-mimetype");
const { serializeURL } = require("whatwg-url");

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const reportException = require("../helpers/runtime-script-errors");
const { domSymbolTree } = require("../helpers/internal-constants");
const { asciiLowercase } = require("../helpers/strings");
const { childTextContent } = require("../helpers/text");
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
  #alreadyStarted = false;

  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    this._parserInserted = false; // set by the parser
  }

  _postConnectionSteps() {
    // In our current terribly-hacky document.write() implementation, we parse in a div them move elements into the main
    // document. Thus _eval() will bail early when it gets in _poppedOffStackOfOpenElements(), since we're not attached
    // then. Instead, we'll let it eval here.
    if (!this._parserInserted || this._isMovingDueToDocumentWrite) {
      this._eval();
    }
  }

  // https://html.spec.whatwg.org/multipage/scripting.html#script-processing-model, moved from the
  // children changed steps to the children inserted steps in
  // https://github.com/whatwg/html/pull/12282. Being inserted-only is what keeps a removal or a
  // character data change from running the script.
  _childrenInsertedSteps() {
    super._childrenInsertedSteps();

    if (!this.isConnected) {
      return;
    }

    this._postConnectionSteps();
  }

  _canRunScript() {
    const document = this._ownerDocument;
    // Equivalent to the spec's "scripting is disabled" check.
    if (!document._defaultView || document._defaultView._runScripts !== "dangerously" || document._scriptingDisabled) {
      return false;
    }

    return true;
  }

  _fetchExternalScript() {
    const document = this._ownerDocument;
    const resourceLoader = document._resourceLoader;
    const defaultEncoding = labelToName(this.getAttributeNS(null, "charset")) || document._encoding;

    if (!this._canRunScript()) {
      return;
    }

    const src = this.getAttributeNS(null, "src");
    const url = this._ownerDocument.encodingParseAURL(src);
    if (url === null) {
      return;
    }
    const urlString = serializeURL(url);

    const onLoadExternalScript = (data, response) => {
      if (!response.ok) {
        throw new Error("Status code: " + response.status);
      }

      const contentType = MIMEType.parse(response.headers.get("content-type")) || new MIMEType("text/plain");

      const encoding = labelToName(getBOMEncoding(data)) ||
        labelToName(contentType.parameters.get("charset")) ||
        defaultEncoding;
      const script = legacyHookDecode(data, encoding);

      this._innerEval(script, urlString);
    };

    resourceLoader.fetch(urlString, {
      element: this,
      onLoad: onLoadExternalScript
    });
  }

  _fetchInternalScript() {
    const document = this._ownerDocument;

    if (!this._canRunScript()) {
      return;
    }

    if (!this._parserInserted) {
      this._innerEval(this.text, document.URL);
      return;
    }

    document._queue.push(null, () => {
      this._innerEval(this.text, document.URL);
    }, null, false, this);
  }

  _attributeChangeSteps(localName, oldValue, value, namespace) {
    super._attributeChangeSteps(localName, oldValue, value, namespace);

    if (namespace === null && localName === "src" && value !== null && this.isConnected) {
      this._postConnectionSteps();
    }
  }

  _poppedOffStackOfOpenElements() {
    // This seems to roughly correspond to
    // https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incdata:prepare-a-script, although we certainly
    // don't implement the full semantics.
    // Both parsers also call this while parsing fragments. Until fragment parsing marks scripts as already started,
    // do not prepare disconnected scripts here: that would clear `_parserInserted` and make `innerHTML` scripts run.
    // This also preserves `_parserInserted` for the temporary fragment used by `document.write()`.
    if (this.isConnected) {
      this._eval();
    }
  }

  // Vaguely similar to https://html.spec.whatwg.org/multipage/scripting.html#prepare-a-script, but we have a long way
  // to go before it's aligned.
  _eval() {
    if (this.#alreadyStarted) {
      return;
    }

    const wasParserInserted = this._parserInserted;
    this._parserInserted = false;

    if (!this.hasAttributeNS(null, "src") && this.text.length === 0) {
      return;
    }

    if (!this.isConnected) {
      return;
    }

    const scriptBlocksTypeString = this._getTypeString();
    const type = getType(scriptBlocksTypeString);

    if (type !== "classic") {
      // TODO: implement modules, and then change the check to `type === null`.
      return;
    }

    this._parserInserted = wasParserInserted;
    this.#alreadyStarted = true;

    // TODO: implement nomodule here, **but only after we support modules**.

    // At this point we completely depart from the spec.

    if (this.hasAttributeNS(null, "src")) {
      this._fetchExternalScript();
    } else {
      this._fetchInternalScript();
    }
  }

  _innerEval(text, filename) {
    this._ownerDocument._writeAfterElement = this;
    processJavaScript(this, text, filename);
    delete this._ownerDocument._writeAfterElement;
  }

  _getTypeString() {
    const typeAttr = this.getAttributeNS(null, "type");
    const langAttr = this.getAttributeNS(null, "language");

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
    return childTextContent(this);
  }

  set text(text) {
    this.textContent = text;
  }

  // https://html.spec.whatwg.org/multipage/scripting.html#script-processing-model
  _cloningSteps(copy) {
    copy.#alreadyStarted = this.#alreadyStarted;
  }
}

function processJavaScript(element, code, filename) {
  const document = element.ownerDocument;
  const window = document && document._global;

  if (window) {
    document._currentScript = element;

    let lineOffset = 0;
    if (!element.hasAttributeNS(null, "src")) {
      for (const child of domSymbolTree.childrenIterator(element)) {
        if (child.nodeType === nodeTypes.TEXT_NODE) {
          if (child.sourceCodeLocation) {
            lineOffset = child.sourceCodeLocation.startLine - 1;
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

function getType(typeString) {
  const lowercased = asciiLowercase(typeString);
  // Cannot use whatwg-mimetype parsing because that strips whitespace. The spec demands a strict string comparison.
  // That is, the type="" attribute is not really related to MIME types at all.
  if (jsMIMETypes.has(lowercased)) {
    return "classic";
  }
  if (lowercased === "module") {
    return "module";
  }
  return null;
}

module.exports = {
  implementation: HTMLScriptElementImpl
};
