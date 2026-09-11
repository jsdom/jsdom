"use strict";

const { domSymbolTree } = require("../helpers/internal-constants");
const { SVG_NS } = require("../helpers/namespaces");
const { mixin } = require("../../utils");
const ElementImpl = require("./Element-impl").implementation;
const ElementCSSInlineStyleImpl = require("../css/ElementCSSInlineStyle-impl").implementation;
const GlobalEventHandlersImpl = require("./GlobalEventHandlers-impl").implementation;
const HTMLOrSVGElementImpl = require("./HTMLOrSVGElement-impl").implementation;

class SVGElementImpl extends ElementImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    this._initHTMLOrSVGElement();
    this._initElementCSSInlineStyle();
    this._initGlobalEvents();
  }

  // Keep in sync with HTMLElement. https://github.com/jsdom/jsdom/issues/2599
  _attributeChangeSteps(localName, oldValue, value, namespace) {
    super._attributeChangeSteps(localName, oldValue, value, namespace);

    if (namespace === null && localName === "style" && value !== oldValue && !this._settingCssText) {
      this._settingCssText = true;
      this.style.cssText = value;
      this._settingCssText = false;
    } else if (namespace === null && localName.startsWith("on")) {
      this._globalEventChanged(localName.substring(2));
    }
  }

  get ownerSVGElement() {
    let e = domSymbolTree.parent(this);
    while (e && e.namespaceURI === SVG_NS) {
      if (e.localName === "svg") {
        return e;
      }
      e = domSymbolTree.parent(e);
    }

    return null;
  }

  get viewportElement() {
    // Get the nearest ancestor that establishes the viewport.
    // https://svgwg.org/svg2-draft/coords.html#EstablishingANewSVGViewport
    let e = domSymbolTree.parent(this);
    while (e && e.namespaceURI === SVG_NS) {
      if (e.localName === "svg" || e.localName === "symbol") {
        return e;
      }
      e = domSymbolTree.parent(e);
    }
    return null;
  }
}

SVGElementImpl.attributeRegistry = new Map();

mixin(SVGElementImpl.prototype, ElementCSSInlineStyleImpl.prototype);
mixin(SVGElementImpl.prototype, GlobalEventHandlersImpl.prototype);
mixin(SVGElementImpl.prototype, HTMLOrSVGElementImpl.prototype);

exports.implementation = SVGElementImpl;
