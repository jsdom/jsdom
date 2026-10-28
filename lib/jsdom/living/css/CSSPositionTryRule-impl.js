"use strict";

const { createRuleContents } = require("./utils/cssom.js");
const CSSPositionTryDescriptors = require("../../../generated/idl/CSSPositionTryDescriptors.js");
const CSSRule = require("./CSSRule-impl.js");
const serialize = require("./serialize.js");
// https://drafts.csswg.org/css-anchor-position-1/#csspositiontryrule
class CSSPositionTryRuleImpl extends CSSRule.implementation {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    const { prelude } = privateData;
    const contents = createRuleContents(privateData.block, this);
    const declarations = contents[0] ?? [];
    this.name = serialize.serializeComponentValue(prelude);
    this.style = CSSPositionTryDescriptors.createImpl(globalObject, undefined, {
      declarations,
      parentRule: this,
    });
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    const {
      name,
      style: { cssText: declarations },
    } = this;
    return declarations ? `@position-try ${name} { ${declarations} }` : `@position-try ${name} { }`;
  }
}
exports.implementation = CSSPositionTryRuleImpl;
