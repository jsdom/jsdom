"use strict";

const parse5 = require("parse5");
const { ParserStream } = require("parse5-parser-stream");

const { createElement } = require("../../living/helpers/create-element");
const { HTML_NS } = require("../../living/helpers/namespaces");

const DocumentType = require("../../../generated/idl/DocumentType");
const DocumentFragment = require("../../../generated/idl/DocumentFragment");
const Text = require("../../../generated/idl/Text");
const Comment = require("../../../generated/idl/Comment");

const attributes = require("../../living/attributes");
const nodeTypes = require("../../living/node-type");

const serializationAdapter = require("../../living/domparsing/parse5-adapter-serialization");
const {
  customElementReactionsStack, invokeCEReactions, lookupCEDefinition
} = require("../../living/helpers/custom-elements");


class JSDOMParse5Adapter {
  #mode;
  #scriptingMode;
  #scriptWithEndTag = null;

  constructor(documentImpl, { mode = "document", scriptingMode = "Normal" } = {}) {
    this._documentImpl = documentImpl;
    this._globalObject = documentImpl._globalObject;
    this.#mode = mode;
    this.#scriptingMode = documentImpl._defaultView === null || documentImpl._scriptingDisabled ||
      documentImpl._defaultView._settings.runScripts !== "dangerously" ?
      "Disabled" :
      scriptingMode;

    // Since the createElement hook doesn't provide the parent element, we keep track of this using _currentElement:
    // https://github.com/inikulin/parse5/issues/285.
    this._currentElement = undefined;
  }

  _ownerDocument() {
    const { _currentElement } = this;

    // The _currentElement is undefined when parsing elements at the root of the document.
    if (_currentElement) {
      return _currentElement.localName === "template" && _currentElement.namespaceURI === HTML_NS ?
        _currentElement.content._ownerDocument :
        _currentElement._ownerDocument;
    }

    return this._documentImpl;
  }

  createDocument() {
    // parse5's model assumes that parse(html) will call into here to create the new Document, then return it. However,
    // jsdom's model assumes we can create a Window (and through that create an empty Document), do some other setup
    // stuff, and then parse, stuffing nodes into that Document as we go. So to adapt between these two models, we just
    // return the already-created Document when asked by parse5 to "create" a Document.
    return this._documentImpl;
  }

  createDocumentFragment() {
    const ownerDocument = this._ownerDocument();
    return DocumentFragment.createImpl(this._globalObject, [], { ownerDocument });
  }

  // https://html.spec.whatwg.org/#create-an-element-for-the-token
  createElement(localName, namespace, attrs) {
    const ownerDocument = this._ownerDocument();

    const isAttribute = attrs.find(attr => attr.name === "is");
    const isValue = isAttribute ? isAttribute.value : null;

    const definition = lookupCEDefinition(ownerDocument, namespace, localName, isValue);

    let willExecuteScript = false;
    if (definition !== null && this.#mode !== "fragment") {
      willExecuteScript = true;
    }

    if (willExecuteScript) {
      ownerDocument._throwOnDynamicMarkupInsertionCounter++;
      customElementReactionsStack.push([]);
    }

    const element = createElement(ownerDocument, localName, namespace, null, isValue, willExecuteScript);
    if (localName === "style" && namespace === HTML_NS) {
      element._markAsParserInserted(this.#mode === "fragment" ? null : this._documentImpl);
    }
    this.adoptAttributes(element, attrs);
    if (localName === "link" && namespace === HTML_NS && this.#mode !== "fragment") {
      element._markAsParserInserted(this._documentImpl);
    }

    if (willExecuteScript) {
      const queue = customElementReactionsStack.pop();
      invokeCEReactions(queue);
      ownerDocument._throwOnDynamicMarkupInsertionCounter--;
    }

    if (localName === "script" && namespace === HTML_NS) {
      // https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-inhead
      element._initializeFromParser(this.#scriptingMode === "Fragment" ? null : this._documentImpl);
      if (this.#scriptingMode === "Inert") {
        element._markAsAlreadyStarted();
      }
    }

    return element;
  }

  createCommentNode(data) {
    const ownerDocument = this._ownerDocument();
    return Comment.createImpl(this._globalObject, [], { data, ownerDocument });
  }

  appendChild(parentNode, newNode) {
    this.insertBefore(parentNode, newNode, null);
  }

  // https://html.spec.whatwg.org/multipage/parsing.html#insert-an-element-at-the-adjusted-insertion-location
  insertBefore(parentNode, newNode, referenceNode) {
    const invokeReactions = this.#mode !== "fragment" && newNode.nodeType === nodeTypes.ELEMENT_NODE;
    if (invokeReactions) {
      customElementReactionsStack.push([]);
    }
    try {
      parentNode._insert(newNode, referenceNode);
    } finally {
      if (invokeReactions) {
        invokeCEReactions(customElementReactionsStack.pop());
      }
    }
  }

  setTemplateContent(templateElement, contentFragment) {
    // This code makes the glue between jsdom and parse5 HTMLTemplateElement parsing:
    //
    // * jsdom during the construction of the HTMLTemplateElement (for example when create via
    //   `document.createElement("template")`), creates a DocumentFragment and set it into _templateContents.
    // * parse5 when parsing a <template> tag creates an HTMLTemplateElement (`createElement` adapter hook) and also
    //   create a DocumentFragment (`createDocumentFragment` adapter hook).
    //
    // At this point we now have to replace the one created in jsdom with one created by parse5.
    const { _ownerDocument, _host } = templateElement._templateContents;
    contentFragment._ownerDocument = _ownerDocument;
    contentFragment._host = _host;

    templateElement._templateContents = contentFragment;
  }

  setDocumentType(document, name, publicId, systemId) {
    const ownerDocument = this._ownerDocument();
    const documentType = DocumentType.createImpl(this._globalObject, [], { name, publicId, systemId, ownerDocument });

    document._append(documentType);
  }

  setDocumentMode(document, mode) {
    // TODO: the rest of jsdom ignores this
    document._mode = mode;
  }

  detachNode(node) {
    node.remove();
  }

  insertText(parentNode, text) {
    const { lastChild } = parentNode;
    if (lastChild && lastChild.nodeType === nodeTypes.TEXT_NODE) {
      lastChild.data += text;
    } else {
      const ownerDocument = this._ownerDocument();
      const textNode = Text.createImpl(this._globalObject, [], { data: text, ownerDocument });
      parentNode._append(textNode);
    }
  }

  insertTextBefore(parentNode, text, referenceNode) {
    const { previousSibling } = referenceNode;
    if (previousSibling && previousSibling.nodeType === nodeTypes.TEXT_NODE) {
      previousSibling.data += text;
    } else {
      const ownerDocument = this._ownerDocument();
      const textNode = Text.createImpl(this._globalObject, [], { data: text, ownerDocument });
      parentNode._insert(textNode, referenceNode);
    }
  }

  adoptAttributes(element, attrs) {
    for (const attr of attrs) {
      const prefix = attr.prefix === "" ? null : attr.prefix;
      attributes.setAttributeValue(element, attr.name, attr.value, prefix, attr.namespace);
    }
  }

  onItemPush(after) {
    this._currentElement = after;
    after._pushedOnStackOfOpenElements?.();
  }

  onItemPop(before, newTop) {
    this._currentElement = newTop;
    if (this.#mode === "interactive" && before._localName === "script" && before._namespaceURI === HTML_NS) {
      // parse5 does not emit a script checkpoint for EOF in text mode.
      // https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incdata
      if (this.#scriptWithEndTag !== before) {
        before._markAsAlreadyStarted();
      }
      this.#scriptWithEndTag = null;
      return;
    }
    if (this.#mode === "document" && before._localName === "script" && before._namespaceURI === HTML_NS) {
      before._prepare();
    }
    before._poppedOffStackOfOpenElements?.();
  }

  markScriptEndTag(script) {
    this.#scriptWithEndTag = script;
  }

  get hasOpenScript() {
    return this._currentElement?._localName === "script" && this._currentElement._namespaceURI === HTML_NS;
  }
}

// Assign shared adapters with serializer.
Object.assign(JSDOMParse5Adapter.prototype, serializationAdapter);

function parseFragment(markup, contextElement, scriptingMode) {
  const ownerDocument = contextElement.localName === "template" && contextElement.namespaceURI === HTML_NS ?
    contextElement.content._ownerDocument :
    contextElement._ownerDocument;

  const config = {
    ...ownerDocument._parseOptions,
    sourceCodeLocationInfo: false,
    treeAdapter: new JSDOMParse5Adapter(ownerDocument, { mode: "fragment", scriptingMode })
  };

  return parse5.parseFragment(contextElement, markup, config);
}

function parseIntoDocument(markup, ownerDocument) {
  const config = {
    ...ownerDocument._parseOptions,
    treeAdapter: new JSDOMParse5Adapter(ownerDocument)
  };

  return parse5.parse(markup, config);
}

// Inert documents and fragments keep the synchronous entry points above.
class HTMLDocumentParser {
  #ownerDocument;
  #signal;
  #onEnd;
  #onError;
  #scriptCreated;
  #stream;
  // Input segments retain insertion points while nested scripts consume or suspend the input before them.
  #tail = { text: "", next: null };
  #input = this.#tail;
  #insertionPoint = null;
  #eof = false;
  #ended = false;
  #blocked = false;
  #writingToStream = false;
  #scriptNestingLevel = 0;
  #scriptAtCheckpoint;
  #pendingScript;

  constructor(ownerDocument, { signal, onEnd, onError, scriptCreated }) {
    this.#ownerDocument = ownerDocument;
    this.#signal = signal;
    this.#onEnd = onEnd;
    this.#onError = onError;
    this.#scriptCreated = scriptCreated;

    const treeAdapter = new JSDOMParse5Adapter(ownerDocument, { mode: "interactive" });
    this.#stream = new ParserStream({
      ...ownerDocument._parseOptions,
      treeAdapter
    });
    signal.addEventListener("abort", () => {
      this.#input = this.#tail;
      this.#tail.text = "";
      // Destroying the stream alone does not stop the tokenizer's current synchronous write.
      this.#stream.parser.tokenizer.pause();
      this.#stream.destroy();
    }, { once: true });
    this.#stream.on("script", (script, _documentWrite, resume) => {
      treeAdapter.markScriptEndTag(script);
      this.#scriptAtCheckpoint = script;
      // The script's end tag ends this chunk. Let parse5 pop the script and restore its insertion mode before
      // running author code, so `document.write()` can synchronously call `stream.write()` again.
      resume();
    });
  }

  get scriptNestingLevel() {
    return this.#scriptNestingLevel;
  }

  get hasInsertionPoint() {
    return this.#insertionPoint !== null || (this.#scriptCreated && !this.#ended);
  }

  get stopped() {
    return this.#ended;
  }

  write(markup) {
    const point = this.#insertionPoint || this.#tail;
    point.text += markup;
    this.#pump(point);
  }

  end(markup = "") {
    this.#tail.text += markup;
    this.#eof = true;
    if (this.#scriptNestingLevel === 0) {
      this.#pump();
    }
  }

  // https://html.spec.whatwg.org/multipage/parsing.html#parsing-main-incdata
  #withInsertionPoint(steps) {
    const oldInsertionPoint = this.#insertionPoint;
    this.#input = { text: "", next: this.#input };
    this.#insertionPoint = this.#input;
    ++this.#scriptNestingLevel;
    const restore = () => {
      --this.#scriptNestingLevel;
      this.#insertionPoint = oldInsertionPoint;
    };
    let result;
    try {
      result = steps();
    } finally {
      if (result === undefined) {
        restore();
      }
    }
    // External script execution includes its load event, after the script's microtask checkpoint.
    return result === undefined ? undefined : result.finally(restore);
  }

  #prepareScript(script) {
    this.#withInsertionPoint(() => {
      const prepared = script._prepare(this.#signal);
      if (prepared !== undefined) {
        // Inline scripts nested by `document.write()` execute immediately, even with blocking stylesheets.
        // https://html.spec.whatwg.org/multipage/scripting.html#prepare-the-script-element
        if (prepared.ready === null &&
            (this.#scriptNestingLevel > 1 || !this.#ownerDocument._hasStyleSheetBlockingScripts)) {
          prepared.execute();
        } else {
          this.#pendingScript = prepared;
        }
      }
    });
  }

  #nextChunkEnd() {
    const { text } = this.#input;
    // Only script end tags require execution checkpoints; false matches in comments, attributes, or escaped script
    // data merely add harmless boundaries. While parse5 still has a script open, its end tag was split across
    // writes or a `>` in the end tag's quoted attribute value ended the previous chunk: keep yielding at every `>`
    // until parse5 pops it, without duplicating its attribute tokenizer or malformed-tag recovery rules.
    const start = this.#stream.parser.treeAdapter.hasOpenScript ? 0 : text.search(/<\/script/i);
    if (start === -1) {
      return text.length;
    }
    const delimiter = text.indexOf(">", start);
    return delimiter === -1 ? text.length : delimiter + 1;
  }

  #pump(limit = this.#tail) {
    // `ParserStream` buffers reentrant writes instead of tokenizing them synchronously. Keep input from parser
    // callbacks in our queue so written scripts still reach their execution checkpoints and EOF stays last.
    if (this.#writingToStream || this.#blocked || this.#signal.aborted || this.#ended) {
      return;
    }
    while (this.#pendingScript === undefined && !this.#signal.aborted) {
      if (this.#input.text === "") {
        if (this.#input === limit) {
          break;
        }
        this.#input = this.#input.next;
        continue;
      }
      const end = this.#nextChunkEnd();
      const chunk = this.#input.text.slice(0, end);
      this.#input.text = this.#input.text.slice(end);
      this.#writingToStream = true;
      try {
        this.#stream.write(chunk);
      } finally {
        this.#writingToStream = false;
      }
      if (this.#scriptAtCheckpoint !== undefined && !this.#signal.aborted) {
        const script = this.#scriptAtCheckpoint;
        this.#scriptAtCheckpoint = undefined;
        this.#prepareScript(script);
      }
    }
    if (this.#pendingScript !== undefined && this.#scriptNestingLevel === 0) {
      const script = this.#pendingScript;
      this.#pendingScript = undefined;
      this.#blocked = true;
      Promise.resolve(this.#ownerDocument._runParsingBlockingScript({
        ready: script.ready,
        execute: () => {
          this.#blocked = false;
          return this.#withInsertionPoint(script.execute);
        }
      }, this.#signal)).then(() => this.#pump()).catch(error => this.#onError(error));
    } else if (!this.#blocked && this.#scriptNestingLevel === 0 && this.#eof && !this.#signal.aborted) {
      this.#ended = true;
      this.#stream.end();
      if (!this.#signal.aborted) {
        this.#onEnd();
      }
    }
  }
}

module.exports = {
  parseFragment,
  parseIntoDocument,
  HTMLDocumentParser
};
