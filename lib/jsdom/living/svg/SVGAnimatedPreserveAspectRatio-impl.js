"use strict";

const SVGPreserveAspectRatio = require("../generated/SVGPreserveAspectRatio");

class SVGAnimatedPreserveAspectRatioImpl {
  constructor(globalObject, args, privateData) {
    this._sdGlobalObject = globalObject;
    this._element = privateData.element;
  }

  get baseVal() {
    return SVGPreserveAspectRatio.createImpl(this._sdGlobalObject, [], {
      element: this._element
    });
  }

  get animVal() {
    return SVGPreserveAspectRatio.createImpl(this._sdGlobalObject, [], {
      element: this._element
    });
  }
}

exports.implementation = SVGAnimatedPreserveAspectRatioImpl;
