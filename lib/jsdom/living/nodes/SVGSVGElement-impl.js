"use strict";

const { mixin } = require("../../utils");
const SVGNumber = require("../generated/SVGNumber");
const SVGGraphicsElementImpl = require("./SVGGraphicsElement-impl").implementation;
const WindowEventHandlersImpl = require("./WindowEventHandlers-impl").implementation;
const notImplemented = require("../../browser/not-implemented");
const { domSymbolTree } = require("../helpers/internal-constants");
const { ELEMENT_NODE } = require("../node-type");

class SVGSVGElementImpl extends SVGGraphicsElementImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    this._proxyWindowEventsToWindow();
  }

  createSVGNumber() {
    return SVGNumber.createImpl(this._globalObject, [], {});
  }

  createSVGLength() {
    notImplemented("SVGSVGElement.prototype.createSVGLength", this._ownerDocument._defaultView);
  }

  createSVGAngle() {
    notImplemented("SVGSVGElement.prototype.createSVGAngle", this._ownerDocument._defaultView);
  }

  createSVGPoint() {
    notImplemented("SVGSVGElement.prototype.createSVGPoint", this._ownerDocument._defaultView);
  }

  createSVGMatrix() {
    notImplemented("SVGSVGElement.prototype.createSVGMatrix", this._ownerDocument._defaultView);
  }

  createSVGRect() {
    notImplemented("SVGSVGElement.prototype.createSVGRect", this._ownerDocument._defaultView);
  }

  createSVGTransform() {
    notImplemented("SVGSVGElement.prototype.createSVGTransform", this._ownerDocument._defaultView);
  }

  createSVGTransformFromMatrix() {
    notImplemented("SVGSVGElement.prototype.createSVGTransformFromMatrix", this._ownerDocument._defaultView);
  }

  getElementById(elementId) {
    // TODO: optimize with _ids caching trick; see Document class.
    for (const node of domSymbolTree.treeIterator(this)) {
      if (node.nodeType === ELEMENT_NODE && node.getAttributeNS(null, "id") === elementId) {
        return node;
      }
    }
    return null;
  }

  suspendRedraw() {
    return 1;
  }
  unsuspendRedraw() {}
  unsuspendRedrawAll() {}
  forceRedraw() {}
}

mixin(SVGSVGElementImpl.prototype, WindowEventHandlersImpl.prototype);

module.exports = {
  implementation: SVGSVGElementImpl
};
