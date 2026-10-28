"use strict";

const { createRuleContents } = require("./utils/cssom.js");
const serialize = require("./serialize.js");
const CSSRuleImpl = require("./CSSRule-impl.js");
const propertyDefinitions = require("../../../generated/css-descriptor-definitions.js");
const strings = require("./utils/string.js");
const { resolveURLs } = require("./utils/url.js");
const descriptorEntries = Object.entries(propertyDefinitions["@property"]);

// https://drafts.css-houdini.org/css-properties-values-api-1/#csspropertyrule
class CSSPropertyRuleImpl extends CSSRuleImpl.implementation {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    const { prelude } = privateData;
    const contents = createRuleContents(privateData.block, this);
    const declarations = contents[0] ?? [];
    const { registration } = privateData;
    this._registration = registration;
    if (
      registration.syntax !== "*" &&
      registration.initialValue !== undefined &&
      registration.initialValue !== null
    ) {
      this._registration = {
        ...registration,
        initialValue: resolveURLs(
          registration.initialValue,
          this.parentStyleSheet?._baseURL ?? globalObject._document.baseURLSerialized(),
        ),
      };
    }
    // Expose decoded names, matching existing CSSOM behavior.
    // https://github.com/w3c/csswg-drafts/issues/12258
    this.names = prelude.map((name) => name.value);
    this.name = this.names.length === 1 ? this.names[0] : "";
    descriptorEntries.forEach(([name, descriptor]) => {
      const declaration = declarations.find((candidate) => candidate.name === name);
      const value = declaration
        ? serialize.serializeDeclarationValue(declaration)
        : descriptor.initial;
      name = strings.toIDLAttribute(name);
      switch (name) {
        case "syntax":
          this.syntax = declaration ? serialize.serializeComponentValue(declaration.value) : "*";
          break;
        case "inherits":
          this[name] = value === "true";
          break;
        case "initialValue":
          if (declaration) {
            this[`_${name}`] = value;
          }
          break;
        default:
          this[name] = value;
          break;
      }
    });
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  // https://drafts.css-houdini.org/css-properties-values-api-1/#serialize-a-csspropertyrule
  _serialize() {
    const { inherits, _initialValue, syntax } = this;
    const serializedSyntax = serialize.serializeStringFromPrimitive(syntax);
    const names = this.names.map(serialize.serializeIdentifierFromPrimitive).join(", ");
    let text = `@property ${names} { syntax: ${serializedSyntax}; inherits: ${inherits}; `;
    if (_initialValue !== undefined) {
      text += `initial-value: ${_initialValue}; `;
    }
    text += "}";
    return text;
  }

  // https://drafts.css-houdini.org/css-properties-values-api-1/#dom-csspropertyrule-initialvalue
  get initialValue() {
    return this._initialValue ?? null;
  }
}
exports.implementation = CSSPropertyRuleImpl;
