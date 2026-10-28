"use strict";

const { createRuleContents } = require("./utils/cssom.js");
const DOMException = require("../../../generated/idl/DOMException.js");
const CSSStyleProperties = require("../../../generated/idl/CSSStyleProperties.js");
const CSSRule = require("./CSSRule-impl.js");
const values = require("./values/value.js");
const parser = require("./parse/parser.js");
const serialize = require("./serialize.js");
// https://drafts.csswg.org/css-animations-1/#csskeyframerule
class CSSKeyframeRuleImpl extends CSSRule.implementation {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    const { prelude } = privateData;
    const contents = createRuleContents(privateData.block, this);
    const declarations = contents[0] ?? [];
    this._keyText = prelude;
    this.style = CSSStyleProperties.createImpl(globalObject, undefined, {
      declarations,
      parentRule: this,
    });
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    const {
      keyText,
      style: { cssText },
    } = this;
    return cssText ? `${keyText} { ${cssText} }` : `${keyText} { }`;
  }

  // https://drafts.csswg.org/css-animations-1/#dom-csskeyframerule-keytext
  get keyText() {
    return serialize.serializeComponentValues(this._keyText);
  }

  // https://drafts.csswg.org/css-animations-1/#dom-csskeyframerule-keytext
  set keyText(selector) {
    selector = parser.parseGrammar(selector, "<keyframe-selector>#", this);
    if (values.isFailure(selector)) {
      throw DOMException.create(this._globalObject, [
        "Cannot set keyText to an invalid keyframe selector.",
        "SyntaxError",
      ]);
    }
    this._keyText = selector;
  }
}
exports.implementation = CSSKeyframeRuleImpl;
