"use strict";

const CSSRuleImpl = require("./CSSRule-impl.js").implementation;
const { CSSStyleDeclaration } = require("./CSSStyleDeclaration.js");
const { wrapperForImpl } = require("../../../generated/idl/utils.js");

class CSSNestedDeclarationsImpl extends CSSRuleImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    this._style = new CSSStyleDeclaration(globalObject, [], {
      context: wrapperForImpl(this)
    });
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
    return this._style.cssText;
  }
}

exports.implementation = CSSNestedDeclarationsImpl;
