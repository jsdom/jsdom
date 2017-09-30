"use strict";

const HTMLElementImpl = require("./HTMLElement-impl").implementation;
const MouseEvent = require("../generated/MouseEvent");
const { closest } = require("../helpers/traversal");
const { domSymbolTree } = require("../helpers/internal-constants");
const { isDisabled } = require("../helpers/form-controls");

function isLabelable(node) {
  // labelable logic defined at: https://html.spec.whatwg.org/multipage/forms.html#category-label
  if (node.nodeType !== 1) {
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
  _activationBehavior() {
    if (this.hasAttribute("for")) {
      const node = this.ownerDocument.getElementById(this.getAttribute("for"));
      if (node && isLabelable(node) && !isDisabled(node)) {
        sendClickToAssociatedNode(node);
      }
    } else {
      for (const descendant of domSymbolTree.treeIterator(this)) {
        if (isLabelable(descendant)) {
          if (!isDisabled(descendant)) {
            sendClickToAssociatedNode(descendant);
          }

          break;
        }
      }
    }
  }

  get form() {
    return closest(this, "form");
  }
}

module.exports = {
  implementation: HTMLLabelElementImpl
};
