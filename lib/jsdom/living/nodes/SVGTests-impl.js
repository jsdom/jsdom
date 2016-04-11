"use strict";

const SVGStringListImpl = require("./SVGStringList-impl").implementation;

class SVGTestsImpl {

  get requiredExtensions() {
    var features = this.getAttribute("requiredExtensions");
    var list = new SVGStringListImpl();

    // not defined on the element
    if(features == null) {
      return true;
    }

    // empty string
    if(!features.trim()) {
      return false;
    }

    features = features.split(/\s/);

    for (let feature of features) {
      list.appendItem(feature);
    }

    return list;
  }

  // TODO: implement correct behavior
  //get systemLanguage() {
  //  return new SVGStringListImpl();
  //}

}

module.exports = {
  implementation: SVGTestsImpl
};
