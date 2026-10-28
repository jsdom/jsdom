"use strict";

const { createRuleContents } = require("./utils/cssom.js");
const counterStyles = require("./values/counter-style.js");
const values = require("./values/value.js");
const parser = require("./parse/parser.js");
const serialize = require("./serialize.js");
const strings = require("./utils/string.js");
const CSSRule = require("./CSSRule-impl.js");
const definitions = require("../../../generated/css-descriptor-definitions.js");
const descriptorNames = Object.keys(definitions["@counter-style"]);

// https://drafts.csswg.org/css-counter-styles-3/#csscounterstylerule
class CSSCounterStyleRuleImpl extends CSSRule.implementation {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    const { prelude } = privateData;
    const contents = createRuleContents(privateData.block, this);
    const declarations = contents[0] ?? [];
    this._name = serialize.serializeComponentValue(prelude);
    for (const { name, value } of declarations) {
      this[`_${strings.toIDLAttribute(name)}`] = value;
    }
  }

  // https://drafts.csswg.org/css-counter-styles-3/#dom-csscounterstylerule-additivesymbols
  get additiveSymbols() {
    const { _additiveSymbols } = this;
    return _additiveSymbols
      ? serialize.serializeDeclarationValue({
          name: "additive-symbols",
          value: _additiveSymbols,
        })
      : "";
  }
  set additiveSymbols(value) {
    if (this.system !== "additive") {
      return;
    }
    value = parser.parseDeclarationValue(value, "additive-symbols", this);
    if (!values.isFailure(value)) {
      this._additiveSymbols = value;
    }
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    const declarations = [];
    descriptorNames.forEach((name) => {
      const value = this[strings.toIDLAttribute(name)];
      if (value) {
        declarations.push(`${name}: ${value}`);
      }
    });
    const body = declarations.length ? ` ${declarations.join("; ")}; ` : " ";
    return `@counter-style ${this.name} {${body}}`;
  }

  // https://drafts.csswg.org/css-counter-styles-3/#dom-csscounterstylerule-fallback
  get fallback() {
    const { _fallback } = this;
    return _fallback
      ? serialize.serializeDeclarationValue({
          name: "fallback",
          value: _fallback,
        })
      : "";
  }
  set fallback(value) {
    value = parser.parseDeclarationValue(value, "fallback", this);
    if (!values.isFailure(value)) {
      this._fallback = value;
    }
  }

  // https://drafts.csswg.org/css-counter-styles-3/#dom-csscounterstylerule-name
  get name() {
    return this._name;
  }
  set name(name) {
    const lowercase = strings.toLowerCase(name);
    if (lowercase === "none" || counterStyles.nonOverridable.includes(lowercase)) {
      return;
    }
    this._name = serialize.serializeIdentifierFromPrimitive(
      counterStyles.predefined.includes(lowercase) ? lowercase : name,
    );
  }

  // https://drafts.csswg.org/css-counter-styles-3/#dom-csscounterstylerule-negative
  get negative() {
    const { _negative } = this;
    return _negative
      ? serialize.serializeDeclarationValue({
          name: "negative",
          value: _negative,
        })
      : "";
  }
  set negative(value) {
    value = parser.parseDeclarationValue(value, "negative", this);
    if (!values.isFailure(value)) {
      this._negative = value;
    }
  }

  // https://drafts.csswg.org/css-counter-styles-3/#dom-csscounterstylerule-pad
  get pad() {
    const { _pad } = this;
    return _pad
      ? serialize.serializeDeclarationValue({
          name: "pad",
          value: _pad,
        })
      : "";
  }
  set pad(value) {
    value = parser.parseDeclarationValue(value, "pad", this);
    if (!values.isFailure(value)) {
      this._pad = value;
    }
  }

  // https://drafts.csswg.org/css-counter-styles-3/#dom-csscounterstylerule-prefix
  get prefix() {
    const { _prefix } = this;
    return _prefix
      ? serialize.serializeDeclarationValue({
          name: "prefix",
          value: _prefix,
        })
      : "";
  }
  set prefix(value) {
    value = parser.parseDeclarationValue(value, "prefix", this);
    if (!values.isFailure(value)) {
      this._prefix = value;
    }
  }

  // https://drafts.csswg.org/css-counter-styles-3/#dom-csscounterstylerule-range
  get range() {
    const { _range } = this;
    return _range
      ? serialize.serializeDeclarationValue({
          name: "range",
          value: _range,
        })
      : "";
  }
  set range(value) {
    value = parser.parseDeclarationValue(value, "range", this);
    if (!values.isFailure(value)) {
      this._range = value;
    }
  }

  // https://drafts.csswg.org/css-counter-styles-3/#dom-csscounterstylerule-speakas
  get speakAs() {
    const { _speakAs } = this;
    return _speakAs
      ? serialize.serializeDeclarationValue({
          name: "speak-as",
          value: _speakAs,
        })
      : "";
  }
  set speakAs(value) {
    value = parser.parseDeclarationValue(value, "speak-as", this);
    if (!values.isFailure(value)) {
      this._speakAs = value;
    }
  }

  // https://drafts.csswg.org/css-counter-styles-3/#dom-csscounterstylerule-suffix
  get suffix() {
    const { _suffix } = this;
    return _suffix
      ? serialize.serializeDeclarationValue({
          name: "suffix",
          value: _suffix,
        })
      : "";
  }
  set suffix(value) {
    value = parser.parseDeclarationValue(value, "suffix", this);
    if (!values.isFailure(value)) {
      this._suffix = value;
    }
  }

  // https://drafts.csswg.org/css-counter-styles-3/#dom-csscounterstylerule-symbols
  get symbols() {
    const { _symbols } = this;
    return _symbols
      ? serialize.serializeDeclarationValue({
          name: "symbols",
          value: _symbols,
        })
      : "";
  }
  set symbols(value) {
    const { system } = this;
    if (system === "additive" || system.startsWith("extends")) {
      return;
    }
    value = parser.parseDeclarationValue(value, "symbols", this);
    if (
      !values.isFailure(value) &&
      (value.length > 1 || (system !== "alphabetic" && system !== "numeric"))
    ) {
      this._symbols = value;
    }
  }

  // https://drafts.csswg.org/css-counter-styles-3/#dom-csscounterstylerule-system
  get system() {
    const { _system } = this;
    return _system
      ? serialize.serializeDeclarationValue({
          name: "system",
          value: _system,
        })
      : "";
  }
  set system(value) {
    const { _system } = this;
    if (!_system) {
      // Explicit defaut system
      value = parser.parseDeclarationValue(value, "system", this);
      if (!values.isFailure(value) && value.value === "symbolic") {
        this._system = value;
      }
    } else if (values.isList(_system)) {
      // Fixed <integer>? or extends <counter-style-name>
      value = parser.parseDeclarationValue(value, "system", this);
      if (!values.isFailure(value) && value[0]?.value === _system[0]?.value) {
        this._system = value;
      }
    }
  }
}
exports.implementation = CSSCounterStyleRuleImpl;
