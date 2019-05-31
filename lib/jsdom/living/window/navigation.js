"use strict";
const whatwgURL = require("whatwg-url");
const arrayEqual = require("array-equal");
const notImplemented = require("../../browser/not-implemented.js");
const reportException = require("../helpers/runtime-script-errors.js");
const idlUtils = require("../generated/utils.js");

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
exports.navigate = (window, newURL, flags, requestArgs) => {
  // This is NOT a spec-compliant implementation of navigation in any way. It implements a few selective steps that
  // are nice for jsdom users, regarding hash changes and JavaScript URLs. Full navigation support is being worked on
  // and will likely require some additional hooks to be implemented.
  if (!window._document) {
    return;
  }

  const document = idlUtils.implForWrapper(window._document);
  const currentURL = document._URL;

  if (!flags.reloadTriggered && urlEquals(currentURL, newURL, { excludeFragments: true })) {
    if (newURL.fragment !== currentURL.fragment) {
      navigateToFragment(window, newURL, flags);
    }

    if (window._notifyNavigateOnSameURL) {
      notifyTargetCreated(window, newURL, requestArgs);
    }

    return;
  }

  // NOT IMPLEMENTED: Prompt to unload the active document of browsingContext.

  // NOT IMPLEMENTED: form submission algorithm
  // const navigationType = 'other';

  // NOT IMPLEMENTED: if resource is a response...
  if (newURL.scheme === "javascript") {
    setTimeout(() => {
      const result = exports.evaluateJavaScriptURL(window, newURL);
      if (typeof result === "string") {
        notImplemented("string results from 'javascript:' URLs", window);
      }
    }, 0);
    return;
  }

  notifyTargetCreated(window, newURL, requestArgs);

  // navigateFetch(window);
};

function notifyTargetCreated(window, newURL, requestArgs) {
  const document = idlUtils.implForWrapper(window._document);
  const ev = window.document.createEvent("CustomEvent");
  if (!requestArgs) {
    requestArgs = { url: whatwgURL.serializeURL(newURL), method: 'get', referrer: document.URL }
  } else {
    requestArgs.referrer = document.URL;
  }
  ev.initCustomEvent("targetcreated", false, false, requestArgs);
  window.dispatchEvent(ev);
}

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
function navigateFetch(window) {
  // TODO:
  notImplemented("navigation (except hash changes)", window);
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
