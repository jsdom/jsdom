"use strict";

const { createRuleContents } = require("./utils/cssom.js");
const serialize = require("./serialize.js");
const CSSRule = require("./CSSRule-impl.js");
const values = require("./values/value.js");
// https://drafts.csswg.org/css-view-transitions-2/#cssviewtransitionrule
class CSSViewTransitionRuleImpl extends CSSRule.implementation {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    const contents = createRuleContents(privateData.block, this);
    const declarations = contents[0] ?? [];
    const navigation = declarations.find((declaration) => declaration.name === "navigation");
    const types = declarations.find((declaration) => declaration.name === "types");
    this.navigation = navigation ? serialize.serializeDeclarationValue(navigation) : "";
    this._typesText = types ? serialize.serializeDeclarationValue(types) : "";
    this.types = Object.freeze(
      values.isList(types?.value) ? types.value.map((type) => type.value) : [],
    );
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    const { navigation, _typesText } = this;
    const declarations = [];
    if (navigation) {
      declarations.push(`navigation: ${navigation}`);
    }
    if (_typesText) {
      declarations.push(`types: ${_typesText}`);
    }
    return declarations.length > 0
      ? `@view-transition { ${declarations.join("; ")}; }`
      : "@view-transition { }";
  }
}
exports.implementation = CSSViewTransitionRuleImpl;
