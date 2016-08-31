"use strict";

const SVGElementImpl = require("./SVGElement-impl").implementation;
// const SVGAnimatedLengtImpl  = require("./SVGAnimatedLength-impl").implementation;

class SVGSVGElementImpl extends SVGElementImpl {

  //get x() {
  //  return conversions["SVGAnimatedLength"](this.getAttribute('x'))
  //}
  //get y() {
  //  return conversions["SVGAnimatedLength"](this.getAttribute('y'))
  //}
  //get width() {
  //  return conversions["SVGAnimatedLength"](this.getAttribute('width'))
  //}
  //get height() {
  //  return conversions["SVGAnimatedLength"](this.getAttribute('height'))
  //}

}

module.exports = {
  implementation: SVGSVGElementImpl
};
