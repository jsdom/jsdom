"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const MouseEvent = require("../generated/MouseEvent");
const { domSymbolTree } = require("../helpers/internal-constants");
const NODE_TYPE = require("../node-type");
const { isDisabled } = require("../helpers/form-controls");

function isLabelable(node) {
  // labelable logic defined at: https://html.spec.whatwg.org/multipage/forms.html#category-label
  if (node.nodeType !== NODE_TYPE.ELEMENT_NODE) {
    return false;
  }

  switch (node.tagName) {
    case "BUTTON":
    case "KEYGEN":
    case "METER":
    case "OUTPUT":
    case "PROGRESS":
    case "SELECT":
    case "TEXTAREA":
      return true;

    case "INPUT":
      return node.type !== "hidden";
  }

  return false;
}

function getRootNode(node) {
  let root;
  for (const ancestor of domSymbolTree.ancestorsIterator(node)) {
    root = ancestor;
  }
  return root;
}

function sendClickToAssociatedNode(node) {
  node.dispatchEvent(MouseEvent.createImpl([
    "click",
    {
      bubbles: true,
      cancelable: true,
      view: node.ownerDocument ? node.ownerDocument.defaultView : null,
      screenX: 0,
      screenY: 0,
      clientX: 0,
      clientY: 0,
      button: 0,
      detail: 1,
      relatedTarget: null
    }
  ]));
}

class HTMLLabelElementImpl extends HTMLElementImpl {
  get control() {
    if (this.hasAttribute("for")) {
      const forValue = this.getAttribute("for");
      if (forValue === "") {
        return null;
      }
      const root = getRootNode(this);
      for (const descendant of domSymbolTree.treeIterator(root)) {
        if (descendant.nodeType === NODE_TYPE.ELEMENT_NODE &&
          descendant.getAttribute("id") === forValue) {
          return isLabelable(descendant) ? descendant : null;
        }
      }
      return null;
    }
    for (const descendant of domSymbolTree.treeIterator(this)) {
      if (isLabelable(descendant)) {
        return descendant;
      }
    }
    return null;
  }

  get form() {
    const node = this.control;
    if (node) {
      return node.form;
    }
    return null;
  }

  _activationBehavior() {
    const node = this.control;
    if (node && !isDisabled(node)) {
      sendClickToAssociatedNode(node);
    }
  }
}

module.exports = {
  implementation: HTMLLabelElementImpl
};
