"use strict";

const CSSRuleImpl = require("./CSSRule-impl.js").implementation;

const descriptorNames = [
  "system", "symbols", "additiveSymbols", "negative",
  "prefix", "suffix", "range", "pad", "speakAs", "fallback"
];

class CSSCounterStyleRuleImpl extends CSSRuleImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    this.name = privateData.name;
    this._descriptors = Object.create(null);
    for (const desc of descriptorNames) {
      this._descriptors[desc] = "";
    }
  }

  get type() {
    return 11; // COUNTER_STYLE_RULE
  }

  get system() {
    return this._descriptors.system;
  }

  set system(value) {
    this._descriptors.system = value;
  }

  get symbols() {
    return this._descriptors.symbols;
  }

  set symbols(value) {
    this._descriptors.symbols = value;
  }

  get additiveSymbols() {
    return this._descriptors.additiveSymbols;
  }

  set additiveSymbols(value) {
    this._descriptors.additiveSymbols = value;
  }

  get negative() {
    return this._descriptors.negative;
  }

  set negative(value) {
    this._descriptors.negative = value;
  }

  get prefix() {
    return this._descriptors.prefix;
  }

  set prefix(value) {
    this._descriptors.prefix = value;
  }

  get suffix() {
    return this._descriptors.suffix;
  }

  set suffix(value) {
    this._descriptors.suffix = value;
  }

  get range() {
    return this._descriptors.range;
  }

  set range(value) {
    this._descriptors.range = value;
  }

  get pad() {
    return this._descriptors.pad;
  }

  set pad(value) {
    this._descriptors.pad = value;
  }

  get speakAs() {
    return this._descriptors.speakAs;
  }

  set speakAs(value) {
    this._descriptors.speakAs = value;
  }

  get fallback() {
    return this._descriptors.fallback;
  }

  set fallback(value) {
    this._descriptors.fallback = value;
  }

  get cssText() {
    const parts = [];
    for (const desc of descriptorNames) {
      if (this._descriptors[desc]) {
        // Convert camelCase to kebab-case for CSS property names
        const cssName = desc.replace(/[A-Z]/g, m => `-${m.toLowerCase()}`);
        parts.push(`${cssName}: ${this._descriptors[desc]};`);
      }
    }
    return `@counter-style ${this.name} { ${parts.join(" ")} }`;
  }
}

exports.implementation = CSSCounterStyleRuleImpl;
