"use strict";

const ElementImpl = require("./Element-impl").implementation;
const closest = require("../helpers/traversal").closest;
const domSymbolTree = require("../helpers/internal-constants").domSymbolTree;

class SVGElementImpl extends ElementImpl {

  get ownerSVGElement() {
    return closest(this, "svg");
  }

  // TODO: Implement a `closestMultiple` helper
  // elements that establish a new viewport are: svg, symbol, image, foreignObject and iframe
  get viewportElement() {
    var e = this
    while (e) {
      if (e.localName === 'svg' || e.localName === 'symbol') {
        return e;
      }
      e = domSymbolTree.parent(e);
    }

    return null;
  }

}

module.exports = {
  implementation: SVGElementImpl
};
