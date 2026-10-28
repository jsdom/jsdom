"use strict";

const {
  compileRegistrationSyntax,
  isValidUniversalInitialValue,
} = require("./parse/registration.js");
const { invalidateStyle } = require("./utils/style.js");
const DOMException = require("../../../generated/idl/DOMException.js");
const values = require("./values/value.js");
const parser = require("./parse/parser.js");
const serialize = require("./serialize.js");
const contexts = require("./parse/context.js");
const supportsModule = require("./match/support.js");
const cssState = require("./state.js");
const { resolveURLs } = require("./utils/url.js");

// https://drafts.csswg.org/css-conditional-3/#dom-css-supports
function supportsValue(globalObject, property, value) {
  const context = contexts.createVirtualContext(globalObject, "@style");
  return !values.isFailure(parser.parseDeclarationValue(value, property, context));
}

// https://drafts.csswg.org/css-conditional-3/#dom-css-supports-conditiontext
function supportsCondition(globalObject, conditionText) {
  const condition = parser.parseGrammar(`(${conditionText})`, "<supports-condition>", globalObject);
  return !values.isFailure(condition) && supportsModule(condition, globalObject);
}

class CSSImpl {
  // https://drafts.csswg.org/cssom-1/#dom-css-escape
  static escape(identifier) {
    return serialize.serializeIdentifierFromPrimitive(identifier);
  }

  // https://drafts.css-houdini.org/css-properties-values-api-1/#dom-css-registerproperty
  static registerProperty(globalObject, { name, inherits, initialValue, syntax }) {
    const context = contexts.createVirtualContext(globalObject, "@property");
    if (!name.startsWith("--") || name === "--") {
      throw DOMException.create(globalObject, [
        `Custom property name "${name}" must start with "--" and contain at least one more character.`,
        "SyntaxError",
      ]);
    }
    const { customProperties } = cssState.getCSSState(globalObject);
    if (customProperties.has(name)) {
      throw DOMException.create(globalObject, [
        `Custom property "${name}" is already registered.`,
        "InvalidModificationError",
      ]);
    }
    syntax = parser.parseDeclarationValue(
      serialize.serializeStringFromPrimitive(syntax),
      "syntax",
      context,
    );
    if (values.isFailure(syntax)) {
      throw DOMException.create(globalObject, [
        `Invalid syntax descriptor for custom property "${name}".`,
        "SyntaxError",
      ]);
    }
    const grammar = compileRegistrationSyntax(syntax);
    syntax = serialize.serializeComponentValue(syntax);
    if (initialValue === undefined) {
      customProperties.set(name, {
        inherits,
        syntax,
        grammar,
      });
      invalidateStyle(globalObject);
      return;
    }
    if (syntax === "*") {
      initialValue = parser.parseDeclarationValue(initialValue, "initial-value", context);
      if (!values.isFailure(initialValue) && isValidUniversalInitialValue(initialValue)) {
        customProperties.set(name, {
          inherits,
          initialValue,
          syntax,
          grammar,
        });
        invalidateStyle(globalObject);
        return;
      }
      throw DOMException.create(globalObject, [
        `Invalid initial value for custom property "${name}" with universal syntax.`,
        "SyntaxError",
      ]);
    }
    initialValue = parser.parseGrammar(initialValue, grammar, context);
    if (!values.isFailure(initialValue) && values.isComputationallyIndependent(initialValue)) {
      customProperties.set(name, {
        inherits,
        initialValue: resolveURLs(initialValue, globalObject._document.baseURLSerialized()),
        syntax,
        grammar,
      });
      invalidateStyle(globalObject);
      return;
    }
    throw DOMException.create(globalObject, [
      `The initial value for custom property "${name}" must match its syntax and be computationally independent.`,
      "SyntaxError",
    ]);
  }

  // https://drafts.csswg.org/css-conditional-3/#dom-css-supports
  // https://drafts.csswg.org/css-conditional-3/#dom-css-supports-conditiontext
  static supports(globalObject, propertyOrConditionText, value) {
    return value === undefined
      ? supportsCondition(globalObject, propertyOrConditionText)
      : supportsValue(globalObject, propertyOrConditionText, value);
  }
}
exports.implementation = CSSImpl;
