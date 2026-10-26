"use strict";

const serialize = require("./serialize.js");
const CSSRule = require("./CSSRule-impl.js");
const definitions = require("./rules/definitions.js");
const parser = require("./parse/parser.js");
const values = require("./values/value.js");
const features = definitions.value.rules.find(rule => rule.name === "@font-feature-values").value.rules;

// https://drafts.csswg.org/css-fonts-4/#cssfontfeaturevaluesrule
class CSSFontFeatureValuesRuleImpl extends CSSRule.implementation {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    this._fontFamily = serialize.serializeComponentValues(privateData.prelude);
    this._featureValues = new Map(features.map(({ name }) => [name, new Map()]));
    for (const content of privateData.block) {
      if (Array.isArray(content)) {
        for (const declaration of content) {
          if (declaration.name === "font-display") {
            this._fontDisplay = serialize.serializeDeclarationValue(declaration);
          }
        }
      } else {
        const entries = this._featureValues.get(content.definition.name);
        for (const declaration of content.block[0] ?? []) {
          const value = values.isList(declaration.value) ?
            declaration.value.map(component => component.value) :
            [declaration.value.value];
          entries.set(declaration.name, value);
        }
      }
    }
  }

  get fontFamily() {
    return this._fontFamily;
  }

  set fontFamily(value) {
    const families = parser.parseGrammar(value, "<font-family-name>#", this);
    if (!values.isFailure(families)) {
      this._fontFamily = serialize.serializeComponentValues(families);
    }
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    const statements = [];
    if (this._fontDisplay) {
      statements.push(`font-display: ${this._fontDisplay};`);
    }
    for (const [name, entries] of this._featureValues) {
      if (entries.size > 0) {
        const declarations = [];
        for (const [key, value] of entries) {
          declarations.push(`${serialize.serializeIdentifierFromPrimitive(key)}: ${value.join(" ")}`);
        }
        statements.push(`${name} { ${declarations.join("; ")}; }`);
      }
    }
    const body = statements.length ? ` ${statements.join(" ")} ` : " ";
    return `@font-feature-values ${this.fontFamily} {${body}}`;
  }
}
exports.implementation = CSSFontFeatureValuesRuleImpl;
