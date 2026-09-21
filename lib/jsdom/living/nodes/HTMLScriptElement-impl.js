"use strict";
const vm = require("node:vm");
const { getBOMEncoding, labelToName, legacyHookDecode } = require("@exodus/bytes/encoding.js");
const { MIMEType } = require("whatwg-mimetype");
const { serializeURL } = require("whatwg-url");

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const reportException = require("../helpers/runtime-script-errors");
const { asciiLowercase, stripLeadingAndTrailingASCIIWhitespace } = require("../helpers/strings");
const { childTextContent } = require("../helpers/text");
const { fireAnEvent } = require("../helpers/events");
const { isShadowRoot } = require("../helpers/shadow-dom");
const nodeTypes = require("../node-type");
const { fetchCollected } = require("../../browser/resources/jsdom-dispatcher");
const { reportResourceError } = require("../helpers/resource-errors");

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
  #parserDocument = null;
  #preparationTimeDocument = null;
  #forceAsync = true;
  #fromExternalFile = false;
  #alreadyStarted = false;
  #result = "uninitialized";
  #stepsToRunWhenResultIsReady = null;

  // Integration with document load delays and our approximate parser insertion point.
  #stopDelayingLoadEvent = null;
  #parserBlocking = false;
  #fetchSignal = null;

  _markAsParserInserted(document) {
    this.#parserDocument = document;
    this.#forceAsync = false;
  }

  _postConnectionSteps() {
    // `document.write()` parses a detached fragment and then moves its children into the document. Prepare those
    // scripts here, since they were not connected when the parser popped them off its stack.
    if (this.#parserDocument === null || this._isMovingDueToDocumentWrite) {
      this.#prepare();
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

  _attributeChangeSteps(localName, oldValue, value, namespace) {
    super._attributeChangeSteps(localName, oldValue, value, namespace);

    if (namespace === null && localName === "async" && oldValue === null && value !== null) {
      this.#forceAsync = false;
    }

    if (namespace === null && localName === "src" && value !== null && this.isConnected) {
      this._postConnectionSteps();
    }
  }

  _poppedOffStackOfOpenElements() {
    // Both parsers also call this while parsing fragments. Until fragment parsing marks scripts as already started,
    // do not prepare disconnected scripts here: clearing their parser document would make `innerHTML` scripts run.
    // This also preserves the parser document for the temporary fragment used by `document.write()`.
    if (this.isConnected) {
      this.#prepare();
    }
  }

  // https://html.spec.whatwg.org/multipage/scripting.html#prepare-the-script-element
  #prepare() {
    if (this.#alreadyStarted) {
      return;
    }

    const parserDocument = this.#parserDocument;
    this.#parserDocument = null;

    if (parserDocument !== null && !this.hasAttributeNS(null, "async")) {
      this.#forceAsync = true;
    }

    const sourceText = childTextContent(this);
    if (!this.hasAttributeNS(null, "src") && sourceText === "") {
      return;
    }

    if (!this.isConnected) {
      return;
    }

    const scriptBlocksTypeString = this.#getTypeString();
    const type = getType(scriptBlocksTypeString);

    if (type !== "classic") {
      // TODO: implement modules, and then change the check to `type === null`.
      return;
    }

    if (parserDocument !== null) {
      this.#parserDocument = parserDocument;
      this.#forceAsync = false;
    }
    this.#alreadyStarted = true;
    const document = this._ownerDocument;
    this.#preparationTimeDocument = document;
    this.#fetchSignal = document._fetchSignal;

    if (parserDocument !== null && parserDocument !== document) {
      return;
    }

    if (!canRunScript(document)) {
      return;
    }

    // TODO: implement nomodule here, **but only after we support modules**.

    if (this.hasAttributeNS(null, "event") && this.hasAttributeNS(null, "for")) {
      const forValue = asciiLowercase(stripLeadingAndTrailingASCIIWhitespace(this.getAttributeNS(null, "for")));
      const event = asciiLowercase(stripLeadingAndTrailingASCIIWhitespace(this.getAttributeNS(null, "event")));
      if (forValue !== "window" || (event !== "onload" && event !== "onload()")) {
        return;
      }
    }

    if (this.hasAttributeNS(null, "src")) {
      const src = this.getAttributeNS(null, "src");
      if (src === "") {
        this.#queueErrorEvent();
        return;
      }

      this.#fromExternalFile = true;
      const url = document.encodingParseAURL(src);
      if (url === null) {
        this.#queueErrorEvent();
        return;
      }

      const encoding = labelToName(this.getAttributeNS(null, "charset")) || document._encoding;
      this.#fetchExternalScript(serializeURL(url), encoding);
    } else {
      this.#markAsReady({ sourceText, filename: document.URL, lineOffset: getLineOffset(this) });

      if (parserDocument === null) {
        this.#execute();
      } else {
        // Our synchronous parsers do not pause for external scripts. Keep inline parser-inserted scripts ordered
        // behind those scripts, without letting later DOM mutations change the already-prepared source text.
        this.#parserBlocking = true;
        document._queueParsingBlockingScript(null, () => this.#execute());
      }
    }
  }

  // https://html.spec.whatwg.org/multipage/webappapis.html#fetch-a-classic-script
  #fetchExternalScript(url, defaultEncoding) {
    const document = this.#preparationTimeDocument;
    if (!document._defaultView._settings.loadSubresources) {
      return;
    }
    // Aggregate the fetch's load delay and the end-of-parsing wait for pending script execution.
    // https://html.spec.whatwg.org/multipage/parsing.html#the-end
    this.#stopDelayingLoadEvent = document._delayLoadEvent();

    if (this.hasAttributeNS(null, "async") || this.#forceAsync) {
      this.#stepsToRunWhenResultIsReady = () => this.#execute();
    } else if (this.#parserDocument === null) {
      const scripts = document._scriptsToExecuteInOrder;
      scripts.push(this);
      this.#stepsToRunWhenResultIsReady = async () => {
        if (scripts[0] !== this) {
          return;
        }
        while (scripts.length > 0 && scripts[0].#result !== "uninitialized") {
          await scripts[0].#execute();
          scripts.shift();
        }
      };
    } else {
      const ready = Promise.withResolvers();
      this.#stepsToRunWhenResultIsReady = ready.resolve;
      this.#parserBlocking = !this.hasAttributeNS(null, "defer");
      if (this.#parserBlocking) {
        document._queueParsingBlockingScript(ready.promise, () => this.#execute());
      } else {
        document._scriptsToExecuteAfterParsing.push({ ready: ready.promise, execute: () => this.#execute() });
      }
    }

    this.#fetchSource(url, defaultEncoding).then(result => this.#markAsReady(result));
  }

  #queueErrorEvent() {
    this._globalObject._document._queueATask(() => {
      fireAnEvent("error", this);
    });
  }

  async #fetchSource(url, defaultEncoding) {
    const document = this.#preparationTimeDocument;
    try {
      const response = await fetchCollected(document._defaultView._settings.dispatcher, {
        url, headers: { Referer: document.URL }, signal: this.#fetchSignal, element: this
      });
      this.#fetchSignal.throwIfAborted();
      if (!response.ok) {
        throw new Error("Status code: " + response.status);
      }
      const { body } = response;
      const contentType = MIMEType.parse(response.headers["content-type"]);
      const encoding = labelToName(getBOMEncoding(body)) ||
        (contentType && labelToName(contentType.parameters.get("charset"))) || defaultEncoding;
      return { sourceText: legacyHookDecode(body, encoding), filename: url, lineOffset: 0 };
    } catch (error) {
      if (!this.#fetchSignal.aborted) {
        reportResourceError(this, url, error);
      }
      // Cancellation must still release this script's place in the execution order and its load-event delay.
      return null;
    }
  }

  // https://html.spec.whatwg.org/multipage/scripting.html#mark-as-ready
  #markAsReady(result) {
    this.#result = this.#fetchSignal.aborted ? null : result;
    if (this.#stepsToRunWhenResultIsReady !== null) {
      this.#stepsToRunWhenResultIsReady();
      this.#stepsToRunWhenResultIsReady = null;
    }
  }

  // https://html.spec.whatwg.org/multipage/scripting.html#execute-the-script-element
  #execute() {
    let loadEvent;
    try {
      const document = this._ownerDocument;
      if (document._isDestroyed || this.#preparationTimeDocument !== document) {
        return undefined;
      }
      // Aborting a fetch discards its result, but an already-ready dynamic script is no longer fetching.
      // Parser-inserted scripts still belong to the stopped parser.
      if (this.#fetchSignal.aborted && (this.#parserDocument !== null || this.#result === null)) {
        return undefined;
      }
      if (this.#result === null) {
        fireAnEvent("error", this);
        return undefined;
      }

      if (this.#fromExternalFile) {
        document._ignoreDestructiveWritesCounter++;
      }
      const oldCurrentScript = document._currentScript;
      const oldWriteAfterElement = document._writeAfterElement;
      document._currentScript = isShadowRoot(this.getRootNode()) ? null : this;
      if (this.#parserBlocking && this.parentNode !== null) {
        document._writeAfterElement = this;
      }
      try {
        runClassicScript(document, this.#result);
      } finally {
        document._currentScript = oldCurrentScript;
        document._writeAfterElement = oldWriteAfterElement;
        if (this.#fromExternalFile) {
          document._ignoreDestructiveWritesCounter--;
        }
      }

      if (this.#fromExternalFile) {
        // `vm` does not expose synchronous microtask checkpoints for our shared contexts. Preserve a promise turn
        // between running the script and firing `load`; this does not drain recursively queued microtasks.
        // This completes the already-running execution algorithm, even if evaluation or its microtasks destroy
        // the document. https://html.spec.whatwg.org/multipage/scripting.html#execute-the-script-element
        loadEvent = Promise.resolve().then(() => {
          fireAnEvent("load", this);
        });
      }
      return loadEvent;
    } finally {
      if (this.#stopDelayingLoadEvent !== null) {
        Promise.resolve(loadEvent).then(this.#stopDelayingLoadEvent);
        this.#stopDelayingLoadEvent = null;
      }
    }
  }

  #getTypeString() {
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
      return stripLeadingAndTrailingASCIIWhitespace(typeAttr);
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

  // https://html.spec.whatwg.org/multipage/scripting.html#dom-script-async
  get async() {
    return this.#forceAsync || this.hasAttributeNS(null, "async");
  }

  set async(value) {
    this.#forceAsync = false;
    if (value) {
      this.setAttributeNS(null, "async", "");
    } else {
      this.removeAttributeNS(null, "async");
    }
  }

  // https://html.spec.whatwg.org/multipage/scripting.html#script-processing-model
  _cloningSteps(copy) {
    copy.#alreadyStarted = this.#alreadyStarted;
  }
}

function getLineOffset(element) {
  for (const child of element._children()) {
    if (child.nodeType === nodeTypes.TEXT_NODE) {
      return child.sourceCodeLocation ? child.sourceCodeLocation.startLine - 1 : 0;
    }
  }
  return 0;
}

function canRunScript(document) {
  const window = document._defaultView;
  // TODO: check whether the document is fully active.
  return window && !document._isDestroyed && window._settings.runScripts === "dangerously" &&
    !document._scriptingDisabled && window._document === document;
}

// https://html.spec.whatwg.org/multipage/webappapis.html#run-a-classic-script
function runClassicScript(document, { sourceText, filename, lineOffset }) {
  if (!canRunScript(document)) {
    return;
  }

  // `vm.runInContext()` parses and evaluates together, so syntax errors are created in the document's realm
  // and reported at execution time.
  try {
    vm.runInContext(sourceText, document._globalObject, { filename, lineOffset, displayErrors: false });
  } catch (e) {
    reportException(document._defaultView, e, filename);
  }
}

function getType(typeString) {
  const lowercased = asciiLowercase(typeString);
  // A JavaScript MIME type essence match is a string comparison, not MIME type parsing: parameters are not allowed.
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
