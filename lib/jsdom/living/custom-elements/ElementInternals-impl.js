"use strict";

// TODO: when to use generated and when to use impl directly?
const NodeList = require("../generated/NodeList");
const DOMException = require("../generated/DOMException");

class ElementInternalsImpl {
  constructor(globalObject, args, { targetElement }) {
    this._targetElement = targetElement;
  }

  get shadowRoot() {
    const shadow = this._targetElement._shadowRoot;

    if (!shadow || !shadow._availableToElementInternals) {
      return null;
    }

    return shadow;
  }

  get labels() {
    if (!this._targetElement._ceDefinition.formAssociated) {
      throw DOMException.create(this._targetElement._globalObject, [
        "ElementInternals.labels is only supported for form-associated custom elements",
        "NotSupportedError"
      ]);
    }
    return NodeList.create(this._targetElement._globalObject, [], {
      element: this._targetElement,
      query: () => {
        // TODO: why doesn't .id work? What about attrs that don't reflect idl -> content?
        const id = this._targetElement.getAttributeNS(null, "id");
        const forNodes = id === null ?
          [] :
          Array.from(
            this._targetElement._ownerDocument.querySelectorAll(`[for=${id}]`)
          );
        const labelParent = this._targetElement.closest("label");

        return labelParent === null || forNodes.includes(labelParent) ? forNodes : forNodes.concat(labelParent);
      }
    });
  }

  // https://html.spec.whatwg.org/#reflecting-content-attributes-in-idl-attributes
  _reflectGetTheElement() {
    return this._targetElement;
  }

  _reflectGetTheContentAttribute(reflectedContentAttributeName) {
    return this._targetElement._internalContentAttributeMap.get(reflectedContentAttributeName) ?? null;
  }

  _reflectSetTheContentAttribute(reflectedContentAttributeName, value) {
    this._targetElement._internalContentAttributeMap.set(reflectedContentAttributeName, value);
  }

  _reflectDeleteTheContentAttribute(reflectedContentAttributeName) {
    this._targetElement._internalContentAttributeMap.delete(reflectedContentAttributeName);
  }
}

module.exports = {
  implementation: ElementInternalsImpl
};
