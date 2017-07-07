"use strict";
const whatwgURL = require("whatwg-url");
const arrayEqual = require("array-equal");
const notImplemented = require("../../browser/not-implemented.js");
const reportException = require("../helpers/runtime-script-errors.js");
const idlUtils = require("../generated/utils.js");
const applyDocumentFeatures = require("../../browser/documentfeatures").applyDocumentFeatures;
const resourceLoader = require("../../browser/resource-loader");
const parseContentType = require("content-type-parser");

exports.evaluateJavaScriptURL = (window, urlRecord) => {
  const urlString = whatwgURL.serializeURL(urlRecord);
  const scriptSource = whatwgURL.percentDecode(Buffer.from(urlString)).toString();
  if (window._runScripts === "dangerously") {
    try {
      return window.eval(scriptSource);
    } catch (e) {
      reportException(window, e, urlString);
    }
  }
  return undefined;
};

// https://html.spec.whatwg.org/#navigating-across-documents
exports.navigate = (window, newURL, flags) => {
  // This is NOT a spec-compliant implementation of navigation in any way. It implements a few selective steps that
  // are nice for jsdom users, regarding hash changes and JavaScript URLs. Full navigation support is being worked on
  // and will likely require some additional hooks to be implemented.

  const document = idlUtils.implForWrapper(window._document);
  const currentURL = document._URL;

  if (!flags.reloadTriggered && urlEquals(currentURL, newURL, { excludeFragments: true })) {
    if (newURL.fragment !== currentURL.fragment) {
      navigateToFragment(window, newURL, flags);
    }
    return;
  }

  // NOT IMPLEMENTED: Prompt to unload the active document of browsingContext.

  // NOT IMPLEMENTED: form submission algorithm
  // const navigationType = 'other';

  // NOT IMPLEMENTED: if resource is a response...
  if (newURL.scheme === "javascript") {
    window.setTimeout(() => {
      const result = exports.evaluateJavaScriptURL(window, newURL);
      if (typeof result === "string") {
        notImplemented("string results from 'javascript:' URLs", window);
      }
    }, 0);
    return;
  }
  navigateFetch(window, newURL, flags);
};

// https://html.spec.whatwg.org/#scroll-to-fragid
function navigateToFragment(window, newURL, flags) {
  const document = idlUtils.implForWrapper(window._document);

  window._sessionHistory.clearHistoryTraversalTasks();

  if (!flags.replacement) {
    // handling replacement=true here deviates from spec, but matches real browser behaviour
    // see https://github.com/whatwg/html/issues/2796 for spec bug
    window._sessionHistory.removeAllEntriesAfterCurrentEntry();
  }
  const newEntry = { document, url: newURL };
  window._sessionHistory.addEntryAfterCurrentEntry(newEntry);
  window._sessionHistory.traverseHistory(newEntry, { nonBlockingEvents: true, replacement: flags.replacement });
}

// https://html.spec.whatwg.org/#process-a-navigate-fetch
function navigateFetch(window, newURL, flags) {
  const document = idlUtils.implForWrapper(window._document);
  const newWindow = loadPage(document, newURL);
  const newDocument = idlUtils.implForWrapper(newWindow._document);
  const newEntry = {
    document: newDocument,
    url: newURL,
  };
  window._sessionHistory.unloadCurrentDocument();
  if (!flags.replacement) {
    window._sessionHistory.removeAllEntriesAfterCurrentEntry();
  }
  window._sessionHistory.addEntryAfterCurrentEntry(newEntry);
  window._sessionHistory.traverseHistory(newEntry, { nonBlockingEvents: true, replacement: flags.replacement });
}

function urlEquals(a, b, flags) {
  if (a.scheme !== b.scheme ||
      a.username !== b.username ||
      a.password !== b.password ||
      a.host !== b.host ||
      a.port !== b.port ||
      !arrayEqual(a.path, b.path) ||
      a.query !== b.query ||
      // Omitted per spec: url.fragment !== this._url.fragment ||
      a.cannotBeABaseURL !== b.cannotBeABaseURL) {
    return false;
  }
  return flags.excludeFragments || a.fragment === b.fragment;
}

function loadPage(oldDocument, newURL) {
  const serializedURL = whatwgURL.serializeURL(newURL);
  // This is not great, but prevents a require cycle during webidl2js generation
  const wnd = new oldDocument._defaultView.constructor({
    parsingMode: "html",
    url: newURL.scheme === "javascript" || serializedURL === "about:blank" ? oldDocument.URL : serializedURL,
    resourceLoader: oldDocument._customResourceLoader,
    userAgent: oldDocument._defaultView.navigator.userAgent,
    referrer: oldDocument.URL,
    cookieJar: oldDocument._cookieJar,
    pool: oldDocument._pool,
    encoding: oldDocument._encoding,
    agentOptions: oldDocument._agentOptions,
    sessionHistory: oldDocument._defaultView._sessionHistory,
    strictSSL: oldDocument._strictSSL,
    proxy: oldDocument._proxy,
    runScripts: oldDocument._defaultView._runScripts,
    onNavigationStart: oldDocument._defaultView._onNavigationStart,
  });
  const contentDoc = idlUtils.implForWrapper(wnd._document);
  applyDocumentFeatures(contentDoc, oldDocument._implementation._features);

  const parent = oldDocument._defaultView;
  const contentWindow = contentDoc._defaultView;

  // TODO: These three properties probably don't apply for navigation (i.e. they're only for iframes)
  // contentWindow._parent = parent;
  // contentWindow._top = parent.top;
  // contentWindow._frameElement = frame;

  contentWindow._virtualConsole = parent._virtualConsole;

  // Handle about:blank with a simulated load of an empty document.
  if (serializedURL === "about:blank") {
    // Cannot be done inside the enqueued callback; the documentElement etc. need to be immediately available.
    contentDoc.write("<html><head></head><body></body></html>");
    contentDoc.close();
    // TODO: should be frame in iframe context
    resourceLoader.enqueue(contentDoc)(); // to fire the load event
  } else if (newURL.scheme === "javascript") {
    // Cannot be done inside the enqueued callback; the documentElement etc. need to be immediately available.
    contentDoc.write("<html><head></head><body></body></html>");
    contentDoc.close();
    const result = evaluateJavaScriptURL(contentWindow, url);
    if (typeof result === "string") {
      contentDoc.body.textContent = result;
    }
    // TODO: should be frame in iframe context
    resourceLoader.enqueue(contentDoc)(); // to fire the load event
  } else {
    resourceLoader.loadBase(
      // TODO: should call `load` with frame in iframe context
      contentDoc,
      serializedURL,
      { defaultEncoding: oldDocument._encoding, detectMetaCharset: true },
      (err, html, response) => {
        if (err) {
          // TODO: do something smarter with errors
          throw err;
        }
        if (response) {
          const contentType = parseContentType(response.headers["content-type"]);
          if (contentType) {
            if (contentType.isXML()) {
              contentDoc._parsingMode = "xml";
            }
            contentDoc._encoding = contentType.get("charset");
          }
        }
        contentDoc.write(html);
        contentDoc.close();
      }
    );
  }
  return contentWindow;
}
