"use strict";

const ElementImpl = require("./Element-impl").implementation;
const closest = require("../helpers/traversal");

class SVGElementImpl extends ElementImpl {

  get ownerSVGElement() {
    return closest.closest(this.parentNode, "svg");
  }

  // elements that establish a new viewport are: svg, symbol, image, foreignObject and iframe
  get viewportElement() {
    return closest.closestMultiple(this.parentNode, ["svg", "symbol"]);
  }

}

module.exports = {
  implementation: SVGElementImpl
};
