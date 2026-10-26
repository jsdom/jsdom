"use strict";

module.exports = match;
const values = require("../values/value.js");
// https://drafts.csswg.org/css-conditional-3/#typedef-supports-condition
// https://drafts.csswg.org/css-conditional-4/#typedef-supports-feature
// https://drafts.csswg.org/css-conditional-5/#typedef-supports-feature
function match(condition, globalObject) {
  if (values.isList(condition)) {
    if (condition.types.includes("<any-value>")) {
      return false;
    }
    const [head, tail] = condition;
    if (head.value === "not") {
      return !match(tail, globalObject);
    }
    if (tail.length > 0) {
      if (tail[0][0].value === "and") {
        return match(head, globalObject) && tail.every(([, child]) => match(child, globalObject));
      }
      return match(head, globalObject) || tail.some(([, child]) => match(child, globalObject));
    }
    return match(head, globalObject);
  }
  const {
    types,
    value
  } = condition;
  for (const type of types) {
    switch (type) {
      case "<block>":
      case "<function>":
        continue;
      case "<declaration>":
      case "<supports-at-rule-fn>":
      case "<supports-font-format-fn>":
      case "<supports-font-tech-fn>":
      case "<supports-selector-fn>":
        return true;
      case "<supports-named-feature-fn>":
        // Both defined named features require layout, which jsdom does not perform.
        return false;
      case "<supports-decl>":
      case "<supports-in-parens>":
        return match(value, globalObject);
      case "<supports-env-fn>":
        return !value.value.startsWith("--");
      default:
        return false;
    }
  }
  return false;
}
