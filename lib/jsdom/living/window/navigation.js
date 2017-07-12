"use strict";
const whatwgURL = require("whatwg-url");
const arrayEqual = require("array-equal");
const notImplemented = require("../../browser/not-implemented.js");
const HashChangeEvent = require("../generated/HashChangeEvent.js");
const PopStateEvent = require("../generated/PopStateEvent.js");
const reportException = require("../helpers/runtime-script-errors.js");
const idlUtils = require("../generated/utils.js");

exports.traverseHistory = (window, specifiedEntry, flags = {}) => {
  // Not spec compliant, just minimal. Lots of missing steps.

  const nonBlockingEvents = Boolean(flags.nonBlockingEvents);

  const document = idlUtils.implForWrapper(window._document);

  const currentEntry = window._sessionHistory[window._currentSessionHistoryEntryIndex];

  if (currentEntry.title === undefined) {
    currentEntry.title = document.title;
  }

  document._URL = specifiedEntry.url;

  let hashChanged = false;
  let oldURL;
  let newURL;
  if (specifiedEntry.url.fragment !== currentEntry.url.fragment) {
    hashChanged = true;
    oldURL = currentEntry.url;
    newURL = specifiedEntry.url;
  }

  const state = specifiedEntry.stateObject; // TODO structured clone
  document._history._state = state;

  const stateChanged = specifiedEntry.document._history._latestEntry !== specifiedEntry;
  specifiedEntry.document._history._latestEntry = specifiedEntry;

  if (nonBlockingEvents) {
    window.setTimeout(fireEvents, 0);
  } else {
    fireEvents();
  }

  function fireEvents() {
    if (stateChanged) {
      window.dispatchEvent(PopStateEvent.create(["popstate", {
        bubbles: true,
        cancelable: false,
        state
      }]));
    }

    if (hashChanged) {
      window.dispatchEvent(HashChangeEvent.create(["hashchange", {
        bubbles: true,
        cancelable: false,
        oldURL: whatwgURL.serializeURL(oldURL),
        newURL: whatwgURL.serializeURL(newURL)
      }]));
    }
  }

  window._currentSessionHistoryEntryIndex = window._sessionHistory.indexOf(specifiedEntry);
};

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
  navigateFetch(window);
};

// https://html.spec.whatwg.org/#scroll-to-fragid
function navigateToFragment(window, newURL, flags) {
  const document = idlUtils.implForWrapper(window._document);

  document._history._clearHistoryTraversalTasks();

  if (!flags.replace) {
    window._sessionHistory.splice(window._currentSessionHistoryEntryIndex + 1, Infinity);
    const newEntry = { document, url: newURL };
    window._sessionHistory.push(newEntry);
    exports.traverseHistory(window, newEntry, { nonBlockingEvents: true });
  } else {
    // handling replace=true here deviates from spec, but matches real browser behaviour
    // see https://github.com/whatwg/html/issues/2796 for spec bug
    const currentEntry = window._sessionHistory[window._currentSessionHistoryEntryIndex];
    const oldURL = currentEntry.url;
    currentEntry.url = newURL;
    window.setTimeout(() => {
      window.dispatchEvent(HashChangeEvent.create(["hashchange", {
        bubbles: true,
        cancelable: false,
        oldURL: whatwgURL.serializeURL(oldURL),
        newURL: whatwgURL.serializeURL(newURL)
      }]));
    }, 0);
  }
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
