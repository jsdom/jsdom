"use strict";

const { createRuleContents } = require("./utils/cssom.js");
const values = require("./values/value.js");
const serialize = require("./serialize.js");
const CSSFunctionDeclarations = require("../../../generated/idl/CSSFunctionDeclarations.js");
const CSSGroupingRule = require("./CSSGroupingRule-impl.js");
// https://drafts.csswg.org/css-mixins-1/#cssfunctionrule
class CSSFunctionRuleImpl extends CSSGroupingRule.implementation {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);
    const { parentStyleSheet } = this;
    const {
      definition,
      prelude: [{ name, value: parameters }, returnType],
    } = privateData;
    const contents = createRuleContents(privateData.block, this);
    const rules = contents.map((rule) => {
      if (Array.isArray(rule)) {
        return CSSFunctionDeclarations.createImpl(globalObject, undefined, {
          declarations: rule,
          definition: definition.value.rules[0],
          parentRule: this,
          parentStyleSheet,
        });
      }
      return rule;
    });
    this._parameters = values.isOmitted(parameters) ? values.list() : parameters;
    this._returnType = returnType;
    this.name = name;
    this._rules = rules;
  }

  // https://drafts.csswg.org/cssom-1/#dom-cssrule-csstext
  _serialize() {
    const { _parameters, _returnType, _rules, returnType, name } = this;
    const rules = _rules.map((rule) => rule.cssText).join(" ");
    let string =
      `@function ${serialize.serializeIdentifierFromPrimitive(name)}` +
      `(${serialize.serializeComponentValue(_parameters)}) `;
    if (returnType !== "*") {
      string += `returns ${serialize.serializeComponentValue(_returnType[1])} `;
    }
    string += rules ? `{ ${rules} }` : "{ }";
    return string;
  }

  // https://drafts.csswg.org/css-mixins-1/#dom-cssfunctionrule-returntype
  get returnType() {
    const { _returnType } = this;
    if (values.isOmitted(_returnType)) {
      return "*";
    }
    const type = _returnType[1];
    return serialize.serializeComponentValue(values.isFunction(type) ? type.value : type);
  }

  // https://drafts.csswg.org/css-mixins-1/#dom-cssfunctionrule-getparameters
  getParameters() {
    const parameters = [];
    this._parameters.forEach(([name, type, defaultValue]) => {
      name = name.value;
      if (values.isOmitted(type)) {
        type = "*";
      } else if (values.isFunction(type)) {
        type = serialize.serializeComponentValue(type.value);
      } else {
        type = serialize.serializeComponentValue(type);
      }
      const parameter = { name, type };
      if (!values.isOmitted(defaultValue)) {
        parameter.defaultValue = serialize.serializeComponentValue(defaultValue[1]);
      }
      parameters.push(parameter);
    });
    return parameters;
  }
}
exports.implementation = CSSFunctionRuleImpl;
