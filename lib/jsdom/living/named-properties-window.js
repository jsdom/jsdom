"use strict";
const mapper = require("../utils").mapper;
const hasOwnProp = Object.prototype.hasOwnProperty;
const namedPropertiesTracker = require("../named-properties-tracker");
const ELEMENT_NODE = 1;

function isNamedPropertyElement(element) {
  // (for the name attribute)

  // use hasOwnProperty to make sure contentWindow comes from the prototype,
  // and is not set directly on the node by a script.
  if ("contentWindow" in element && !hasOwnProp.call(element, "contentWindow")) {
    return true;
  }

  switch (element.nodeName) {
    case "A":
    case "APPLET":
    case "AREA":
    case "EMBED":
    case "FORM":
    case "FRAMESET":
    case "IMG":
    case "OBJECT":
      return true;
  }

  return false;
}

function namedPropertyResolver(HTMLCollection, window, name) {
  function filter(node) {
    if (node.nodeType !== ELEMENT_NODE) {
      return false;
    }

    if (node.getAttribute("id") === name) {
      return true;
    }

    if (isNamedPropertyElement(node)) {
      return node.getAttribute("name") === name;
    }

    return false;
  }

  const document = window._document;
  const objects = new HTMLCollection(
    document.documentElement,
    mapper(document, filter, true)
  );

  const length = objects.length;
  for (let i = 0; i < length; ++i) {
    const node = objects[i];

    if ("contentWindow" in node && !hasOwnProp.call(node, "contentWindow")) {
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

exports.initializeWindow = function (window, HTMLCollection) {
  namedPropertiesTracker.create(window, namedPropertyResolver.bind(null, HTMLCollection));
};

exports.elementAttributeModified = function (element, name, value, oldValue) {
  if (!element._attached) {
    return;
  }

  if (name === "id" || (name === "name" && isNamedPropertyElement(element))) {
    const tracker = namedPropertiesTracker.get(element._ownerDocument._global);

    // (tracker will be null if the document has no Window)
    if (tracker) {
      tracker.maybeUntrack(oldValue);
      tracker.track(value);
    }
  }
};

exports.nodeAttachedToDocument = function (node) {
  if (node.nodeType !== ELEMENT_NODE) {
    return;
  }

  const tracker = namedPropertiesTracker.get(node._ownerDocument._global);
  if (!tracker) {
    return;
  }

  tracker.track(node.getAttribute("id"));

  if (isNamedPropertyElement(node)) {
    tracker.track(node.getAttribute("name"));
  }
};

exports.nodeDetachedFromDocument = function (node) {
  if (node.nodeType !== ELEMENT_NODE) {
    return;
  }

  const tracker = namedPropertiesTracker.get(node._ownerDocument._global);
  if (!tracker) {
    return;
  }

  tracker.maybeUntrack(node.getAttribute("id"));

  if (isNamedPropertyElement(node)) {
    tracker.maybeUntrack(node.getAttribute("name"));
  }
};
