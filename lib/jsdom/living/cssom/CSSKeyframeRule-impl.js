"use strict";

const CSSRuleImpl = require("./CSSRule-impl.js").implementation;
const { CSSStyleDeclaration } = require("./CSSStyleDeclaration.js");
const { wrapperForImpl } = require("../../../generated/idl/utils.js");

class CSSKeyframeRuleImpl extends CSSRuleImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    this._keyText = privateData.keyText || "";
    this._style = new CSSStyleDeclaration(globalObject, [], {
      context: wrapperForImpl(this)
    });
  }

  get type() {
    return 8; // KEYFRAME_RULE
  }

  get keyText() {
    return this._keyText;
  }

  set keyText(value) {
    this._keyText = value;
  }

  get style() {
    return this._style;
  }

  // TODO: delete this setter when CSSStyleDeclaration is converted to webidl2js
  // (then [PutForwards=cssText] on the WebIDL attribute will handle it)
  set style(value) {
    this._style.cssText = value;
  }

  get cssText() {
    return `${this._keyText} { ${this._style.cssText} }`;
  }
}

exports.implementation = CSSKeyframeRuleImpl;
