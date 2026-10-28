"use strict";

module.exports = getDirectionality;
const { isHTMLElement, isShadowRoot, getParentElement } = require("../css/utils/dom.js");
const { asciiLowercase } = require("./strings.js");
const { ltrRanges, rtlRanges } = require("../../../generated/bidi-ranges.js");
const textInputTypes = new Set([
  "button",
  "email",
  "hidden",
  "password",
  "reset",
  "search",
  "submit",
  "tel",
  "text",
  "url",
]);

function getDirectionAttribute(element) {
  if (!isHTMLElement(element)) {
    return "";
  }
  const value = element.getAttributeNS(null, "dir");
  if (value !== null) {
    const direction = asciiLowercase(value);
    if (direction === "ltr" || direction === "rtl" || direction === "auto") {
      return direction;
    }
  }
  return "";
}

function excludesText(element) {
  return (
    getDirectionAttribute(element) !== "" ||
    isHTMLElement(element, "bdi", "script", "style", "textarea")
  );
}

function findContainedTextAutoDirectionality(element, canExcludeRoot) {
  if (canExcludeRoot && excludesText(element)) {
    return undefined;
  }
  for (let child = element.firstChild; child !== null;) {
    if (child.nodeType === 1) {
      if (excludesText(child)) {
        child = child._nextAfterSubtree(element);
        continue;
      }
      if (isHTMLElement(child, "slot")) {
        const root = child.getRootNode();
        if (isShadowRoot(root)) {
          return getDirectionality(root._host);
        }
      }
    } else if (child.nodeType === 3 || child.nodeType === 4) {
      const direction = findStringDirectionality(child.data);
      if (direction !== undefined) {
        return direction;
      }
    }
    child = child._nextInTree(element);
  }
  return undefined;
}

function containsCodePoint(ranges, point) {
  let low = 0;
  let high = ranges.length;
  while (low < high) {
    const middle = (low + high) >>> 1;
    const [begin, end] = ranges[middle];
    if (point < begin) {
      high = middle;
    } else if (point >= end) {
      low = middle + 1;
    } else {
      return true;
    }
  }
  return false;
}

function findStringDirectionality(string) {
  for (const character of string) {
    const codePoint = character.codePointAt(0);
    if (containsCodePoint(rtlRanges, codePoint)) {
      return "rtl";
    }
    if (containsCodePoint(ltrRanges, codePoint)) {
      return "ltr";
    }
  }
  return undefined;
}

function getAutoDirectionality(element) {
  if (
    isHTMLElement(element, "textarea") ||
    (isHTMLElement(element, "input") && textInputTypes.has(element.type))
  ) {
    return element.value.length === 0 ? null : (findStringDirectionality(element.value) ?? "ltr");
  }
  if (isHTMLElement(element, "slot") && isShadowRoot(element.getRootNode())) {
    const nodes = element._assignedNodes;
    if (nodes.length > 0) {
      for (const node of nodes) {
        let direction;
        if (node.nodeType === 3) {
          direction = findStringDirectionality(node.data);
        } else if (node.nodeType === 1) {
          direction = findContainedTextAutoDirectionality(node, true);
        }
        if (direction !== undefined) {
          return direction;
        }
      }
      return null;
    }
  }
  return findContainedTextAutoDirectionality(element) ?? null;
}

function getDirectionality(element) {
  const direction = getDirectionAttribute(element);
  if (direction === "ltr" || direction === "rtl") {
    return direction;
  }
  if (direction === "auto" || isHTMLElement(element, "bdi")) {
    return getAutoDirectionality(element) ?? "ltr";
  }
  if (isHTMLElement(element, "input") && element.type === "tel") {
    return "ltr";
  }
  const parent = getParentElement(element);
  return parent ? getDirectionality(parent) : "ltr";
}
