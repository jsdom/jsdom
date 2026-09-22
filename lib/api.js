"use strict";
const fs = require("node:fs").promises;
const path = require("node:path");
const { pathToFileURL } = require("node:url");
const vm = require("node:vm");
const toughCookie = require("tough-cookie");
const sniffHTMLEncoding = require("html-encoding-sniffer");
const whatwgURL = require("whatwg-url");
const { legacyHookDecode } = require("@exodus/bytes/encoding.js");
const { URL } = require("whatwg-url");
const { MIMEType } = require("whatwg-mimetype");
const { getGlobalDispatcher } = require("undici");
const idlUtils = require("./generated/idl/utils.js");
const VirtualConsole = require("./jsdom/virtual-console.js");
const { createWindow } = require("./jsdom/browser/Window.js");
const { parseIntoDocument } = require("./jsdom/browser/parser");
const { fragmentSerialization } = require("./jsdom/living/domparsing/serialization.js");
const createDecompressInterceptor = require("./jsdom/browser/resources/decompress-interceptor.js");
const {
  JSDOMDispatcher, DEFAULT_USER_AGENT, fetchCollected
} = require("./jsdom/browser/resources/jsdom-dispatcher.js");
const requestInterceptor = require("./jsdom/browser/resources/request-interceptor.js");

class CookieJar extends toughCookie.CookieJar {
  constructor(store, options) {
    // jsdom cookie jars must be loose by default
    super(store, { looseMode: true, ...options });
  }
}

const window = Symbol("window");
let sharedFragmentDocument = null;

class JSDOM {
  constructor(input = "", options = {}) {
    const mimeType = new MIMEType(options.contentType === undefined ? "text/html" : options.contentType);
    const { html, encoding } = normalizeHTML(input, mimeType);

    const normalized = normalizeOptions(options, encoding, mimeType);

    this[window] = createWindow(normalized.windowOptions);

    const documentImpl = this[window]._document;

    normalized.beforeParse(this[window]._globalProxy);

    parseIntoDocument(html, documentImpl);

    documentImpl.close();
  }

  get window() {
    // It's important to grab the global proxy, instead of just the result of `createWindow(...)`, since otherwise
    // things like `window.eval` don't exist.
    return this[window]._globalProxy;
  }

  get virtualConsole() {
    return this[window]._settings.virtualConsole;
  }

  get cookieJar() {
    return this[window]._settings.cookieJar;
  }

  serialize() {
    return fragmentSerialization(this[window]._document, { requireWellFormed: false });
  }

  nodeLocation(node) {
    if (!this[window]._document._parseOptions.sourceCodeLocationInfo) {
      throw new Error("Location information was not saved for this jsdom. Use includeNodeLocations during creation.");
    }

    return idlUtils.implForWrapper(node).sourceCodeLocation;
  }

  getInternalVMContext() {
    if (!vm.isContext(this[window])) {
      throw new TypeError("This jsdom was not configured to allow script running. " +
        "Use the runScripts option during creation.");
    }

    return this[window];
  }

  reconfigure(settings) {
    if ("windowTop" in settings) {
      this[window]._top = settings.windowTop;
    }

    if ("url" in settings) {
      const document = this[window]._document;

      const url = whatwgURL.parseURL(settings.url);
      if (url === null) {
        throw new TypeError(`Could not parse "${settings.url}" as a URL`);
      }

      document._URL = url;
      document._origin = whatwgURL.serializeURLOrigin(document._URL);
      this[window]._sessionHistory.currentEntry.url = url;
      document._clearBaseURLCache();
    }
  }

  static fragment(string = "") {
    if (!sharedFragmentDocument) {
      sharedFragmentDocument = (new JSDOM()).window.document;
    }

    const template = sharedFragmentDocument.createElement("template");
    template.innerHTML = string;
    return template.content;
  }

  static async fromURL(url, options = {}) {
    options = normalizeFromURLOptions(options);

    // Build the dispatcher for the initial request
    // For the initial fetch, we default to "usable" instead of no resource loading, since fromURL() implicitly requests
    // fetching the initial resource. This does not impact further resource fetching, which uses options.resources.
    const resourcesForInitialFetch = options.resources !== undefined ? options.resources : "usable";
    const { dispatcher } = createResourceSettings(resourcesForInitialFetch, options.cookieJar);

    const headers = { Accept: "text/html,application/xhtml+xml,application/xml;q=0.9,*/*;q=0.8" };
    if (options.referrer) {
      headers.Referer = options.referrer;
    }

    const response = await fetchCollected(dispatcher, {
      url,
      headers
    });

    if (!response.ok) {
      throw new Error(`Resource was not loaded. Status: ${response.status}`);
    }

    return new JSDOM(response.body, {
      ...options,
      url: response.url,
      contentType: response.headers["content-type"] || undefined
    });
  }

  static async fromFile(filename, options = {}) {
    options = normalizeFromFileOptions(filename, options);
    const nodeBuffer = await fs.readFile(filename);

    return new JSDOM(nodeBuffer, options);
  }
}

function normalizeFromURLOptions(options) {
  // Checks on options that are invalid for `fromURL`
  if (options.url !== undefined) {
    throw new TypeError("Cannot supply a url option when using fromURL");
  }
  if (options.contentType !== undefined) {
    throw new TypeError("Cannot supply a contentType option when using fromURL");
  }

  // Normalize fields needed for the initial request. The constructor handles the remaining options after fetching.
  const normalized = { ...options };

  if (options.referrer !== undefined) {
    normalized.referrer = (new URL(options.referrer)).href;
  }

  if (options.cookieJar === undefined) {
    normalized.cookieJar = new CookieJar();
  }

  return normalized;
}

function normalizeFromFileOptions(filename, options) {
  const normalized = { ...options };

  if (normalized.contentType === undefined) {
    const extname = path.extname(filename);
    if (extname === ".xhtml" || extname === ".xht" || extname === ".xml") {
      normalized.contentType = "application/xhtml+xml";
    }
  }

  if (normalized.url === undefined) {
    normalized.url = pathToFileURL(path.resolve(filename)).href;
  }

  return normalized;
}

function normalizeOptions(options, encoding, mimeType) {
  // `options.contentType` was parsed into `mimeType` by the caller.
  if (!mimeType.isHTML() && !mimeType.isXML()) {
    throw new RangeError(`The given content type of "${options.contentType}" was not a HTML or XML content type`);
  }

  const parsingMode = mimeType.isHTML() ? "html" : "xml";
  const url = options.url === undefined ? "about:blank" : (new URL(options.url)).href;
  const referrer = options.referrer === undefined ? "" : (new URL(options.referrer)).href;
  const sourceCodeLocationInfo = Boolean(options.includeNodeLocations);
  if (sourceCodeLocationInfo && parsingMode === "xml") {
    throw new TypeError("Cannot set includeNodeLocations to true with an XML content type");
  }

  const cookieJar = options.cookieJar === undefined ? new CookieJar() : options.cookieJar;
  const virtualConsole = options.virtualConsole === undefined ?
                         (new VirtualConsole()).forwardTo(console) :
                         options.virtualConsole;
  if (!(virtualConsole instanceof VirtualConsole)) {
    throw new TypeError("virtualConsole must be an instance of VirtualConsole");
  }

  const resourceSettings = createResourceSettings(options.resources, cookieJar);
  const runScripts = options.runScripts === undefined ? undefined : String(options.runScripts);
  if (runScripts !== undefined && runScripts !== "dangerously" && runScripts !== "outside-only") {
    throw new RangeError(`runScripts must be undefined, "dangerously", or "outside-only"`);
  }

  const { beforeParse = () => {} } = options;
  const pretendToBeVisual = Boolean(options.pretendToBeVisual);
  const storageQuota = options.storageQuota === undefined ? 5000000 : Number(options.storageQuota);

  return {
    windowOptions: {
      settings: {
        runScripts,
        pretendToBeVisual,
        storageQuota,
        cookieJar,
        virtualConsole,
        ...resourceSettings
      },
      documentOptions: {
        url,
        referrer,
        contentType: mimeType.essence,
        parsingMode,
        encoding,
        parseOptions: { sourceCodeLocationInfo }
      }
    },
    beforeParse
  };
}

function createResourceSettings(resources, cookieJar) {
  const resourceOptions = resources === undefined || resources === "usable" ? {} : resources;
  if (typeof resourceOptions !== "object" || resourceOptions === null) {
    throw new TypeError(`resources must be undefined, "usable", or an object`);
  }

  const {
    userAgent = DEFAULT_USER_AGENT,
    dispatcher = getGlobalDispatcher(),
    interceptors = []
  } = resourceOptions;

  return {
    userAgent,
    dispatcher: new JSDOMDispatcher({
      baseDispatcher: dispatcher,
      cookieJar,
      userAgent,
      // User interceptors come first (outermost), then the decompression interceptor.
      userInterceptors: [...interceptors, createDecompressInterceptor()]
    }),
    // This controls automatic subresource fetching; XHR works regardless.
    loadSubresources: resources !== undefined
  };
}

function normalizeHTML(html, mimeType) {
  let encoding = "UTF-8";

  if (html instanceof Uint8Array) {
    // leave as-is
  } else if (ArrayBuffer.isView(html)) {
    html = new Uint8Array(html.buffer, html.byteOffset, html.byteLength);
  } else if (html instanceof ArrayBuffer) {
    html = new Uint8Array(html);
  }

  if (html instanceof Uint8Array) {
    encoding = sniffHTMLEncoding(html, {
      xml: mimeType.isXML(),
      transportLayerEncodingLabel: mimeType.parameters.get("charset")
    });
    html = legacyHookDecode(html, encoding);
  } else {
    html = String(html);
  }

  return { html, encoding };
}

exports.JSDOM = JSDOM;

exports.VirtualConsole = VirtualConsole;
exports.CookieJar = CookieJar;
exports.requestInterceptor = requestInterceptor;

exports.toughCookie = toughCookie;
