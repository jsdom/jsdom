"use strict";
const namedPropertiesTracker = require("../named-properties-tracker");
const NODE_TYPE = require("./node-type");
const HTMLCollection = require("./generated/HTMLCollection");
const { treeOrderSorter } = require("../utils");
const idlUtils = require("./generated/utils");

function isNamedPropertyElement(element) {
  // (for the name attribute)

  // use hasOwnProperty to make sure contentWindow comes from the prototype,
  // and is not set directly on the node by a script.
  if ("contentWindow" in element && !idlUtils.hasOwn(element, "contentWindow")) {
    return true;
  }

  switch (element.nodeName) {
    case "A":
    case "AREA":
    case "EMBED":
    case "FORM":
    case "FRAMESET":
    case "IMG":
    case "OBJECT":
      return true;
    default:
      return false;
  }
}

/**
 * @param {object} window
 * @param {string} name
 * @param {() => Set<Element>} values
 * @return {Element | HTMLCollection | undefined}
 */
function namedPropertyResolver(window, name, values) {
  function getResult() {
    const results = [];

    for (const node of values().keys()) {
      if (node.nodeType !== NODE_TYPE.ELEMENT_NODE) {
        continue;
      }

      if (node.getAttributeNS(null, "id") === name) {
        results.push(node);
      } else if (node.getAttributeNS(null, "name") === name && isNamedPropertyElement(node)) {
        results.push(node);
      }
    }

    results.sort(treeOrderSorter);

    return results;
  }

  const { document } = window;
  /** @type {HTMLCollection} */
  const objects = HTMLCollection.create(window, [], {
    element: idlUtils.implForWrapper(document.documentElement),
    query: getResult
  });

  const { length } = objects;
  for (let i = 0; i < length; ++i) {
    const node = objects[i];

    if ("contentWindow" in node && !idlUtils.hasOwn(node, "contentWindow") &&
       node.getAttributeNS(null, "name") === name) {
      return node.contentWindow;
    }
  }

  if (length === 0) {
    return undefined;
  }

  if (length === 1) {
    return objects[0];
  }

  return objects;
}

exports.initializeWindow = function (windowWrapper, windowProxy) {
  namedPropertiesTracker.create(windowWrapper, windowProxy, namedPropertyResolver.bind(null));
};

exports.elementAttributeModified = function (element, name, value, oldValue) {
  if (!element._attached) {
    return;
  }

  const useName = isNamedPropertyElement(element);

  if (name === "id" || (name === "name" && useName)) {
    const tracker = namedPropertiesTracker.get(element._ownerDocument._globalObject);

    // (tracker will be null if the document has no Window)
    if (tracker) {
      if (name === "id" && (!useName || element.getAttributeNS(null, "name") !== oldValue)) {
        tracker.untrack(oldValue, element);
      }

      if (name === "name" && element.getAttributeNS(null, "id") !== oldValue) {
        tracker.untrack(oldValue, element);
      }

      tracker.track(value, element);
    }
  }
};

exports.nodeAttachedToDocument = function (node) {
  if (node.nodeType !== NODE_TYPE.ELEMENT_NODE) {
    return;
  }

  const tracker = namedPropertiesTracker.get(node._ownerDocument._globalObject);
  if (!tracker) {
    return;
  }

  tracker.track(node.getAttributeNS(null, "id"), node);

  if (isNamedPropertyElement(node)) {
    tracker.track(node.getAttributeNS(null, "name"), node);
  }
};

exports.nodeDetachedFromDocument = function (node) {
  if (node.nodeType !== NODE_TYPE.ELEMENT_NODE) {
    return;
  }

  const tracker = namedPropertiesTracker.get(node._ownerDocument._globalObject);
  if (!tracker) {
    return;
  }

  tracker.untrack(node.getAttributeNS(null, "id"), node);

  if (isNamedPropertyElement(node)) {
    tracker.untrack(node.getAttributeNS(null, "name"), node);
  }
};
