"use strict";

const { createRuleContents } = require("./utils/cssom.js");
const serialize = require("./serialize.js");
const CSSRule = require("./CSSRule-impl.js");
const definitions = require("../../../generated/css-descriptor-definitions.js");
const strings = require("./utils/string.js");
const descriptorNames = Object.keys(definitions["@font-palette-values"]);

// https://drafts.csswg.org/css-fonts-4/#cssfontpalettevaluesrule
class CSSFontPaletteValuesRuleImpl extends CSSRule.implementation {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    const { prelude } = privateData;
    const contents = createRuleContents(privateData.block, this);
    const declarations = contents[0] ?? [];
    this.name = serialize.serializeComponentValue(prelude);
    descriptorNames.forEach(name => {
      const declaration = declarations.find(candidate => candidate.name === name);
      this[strings.toIDLAttribute(name)] = declaration ? serialize.serializeDeclarationValue(declaration) : "";
    });
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    const declarations = [];
    descriptorNames.forEach(name => {
      const value = this[strings.toIDLAttribute(name)];
      if (value) {
        declarations.push(`${name}: ${value}`);
      }
    });
    const body = declarations.length ? ` ${declarations.join("; ")}; ` : " ";
    return `@font-palette-values ${this.name} {${body}}`;
  }
}
exports.implementation = CSSFontPaletteValuesRuleImpl;
