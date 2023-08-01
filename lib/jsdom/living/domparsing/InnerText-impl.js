"use strict";

const { parseFragment } = require("../../browser/parser");
const { HTML_NS } = require("../helpers/namespaces.js");
const { isShadowRoot } = require("../helpers/shadow-dom.js");
const NODE_TYPE = require("../node-type.js");
const { getDeclarationForElement } = require("../helpers/style-rules.js");
const { ELEMENT_NODE, TEXT_NODE } = require("../node-type");
const { getChildNodes } = require("./parse5-adapter-serialization");

function getComputedStyle(element, property) {
  return getDeclarationForElement(element).getPropertyValue(property);
}

function isRendered(element) {
  return (
    !element.getAttributeNS(null, "hidden") &&
    getComputedStyle(element, "display") !== "none" &&
    getComputedStyle(element, "visibility") !== "hidden"
  );
}

function renderedTextCollect(node) {
  let items = [];

  if (node.nodeType === ELEMENT_NODE && !isRendered(node)) {
    return items;
  }
  for (const childNode of getChildNodes(node)) {
    items.push(...renderedTextCollect(childNode));
  }
  if (node.nodeType === TEXT_NODE) {
    let text = node.textContent || "";
    if (!node.parentElement) {
      return items;
    }
    switch (getComputedStyle(node.parentElement, "text-transform")) {
      case "uppercase": {
        text = text.toUpperCase();
        break;
      }
      case "lowercase": {
        text = text.toLowerCase();
        break;
      }
      case "capitalize": {
        text = text
          .split(" ")
          .map(word => word[0].toUpperCase() + word.slice(1))
          .join(" ");
        break;
      }
    }
    text = text.trim();
    items.push(text);
  } else if (node.nodeType === ELEMENT_NODE) {
    if (node._localName === "br") {
      items.push("\n");
    }
    if (
      getComputedStyle(node, "display") === "table-cell" &&
      node.parentElement?.lastChild !== node
    ) {
      items.push("\u0009");
    }
    if (
      getComputedStyle(node, "display") === "table-row" &&
      node.parentElement?.lastChild !== node
    ) {
      items.push("\n");
    }
    if (node._localName === "p") {
      items = [2, ...items, 2];
    }

    if (["block", "flex", "table", "grid"].includes(node.style.display)) {
      items = [1, ...items, 1];
    }
  }
  return items;
}

// https://html.spec.whatwg.org/multipage/dom.html#the-innertext-idl-attribute
exports.implementation = class InnerTextImpl {
  get innerText() {
    if (!isRendered(this)) {
      return this.textContent;
    }
    let results = [];
    for (const node of getChildNodes(this)) {
      const current = renderedTextCollect(node);
      results.push(...current);
    }
    results = results.filter(Boolean);
    while (typeof results[0] === "number") {
      results.shift();
    }
    while (typeof results.at(-1) === "number") {
      results.pop();
    }
    results = results.map(result => typeof result === "number" ? "\n".repeat(result) : result);
    return results.join("");
  }
  set innerText(text) {
    const contextElement = isShadowRoot(this) ? this.host : this;
    const fragment = parseFragment(text, contextElement);

    let contextObject = this;
    if (
      this.nodeType === NODE_TYPE.ELEMENT_NODE &&
      this.localName === "template" &&
      this.namespaceURI === HTML_NS
    ) {
      contextObject = this._templateContents;
    }

    contextObject._replaceAll(fragment);
  }
};
