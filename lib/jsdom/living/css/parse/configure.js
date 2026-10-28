"use strict";

const parseContext = require("./context.js");
// https://drafts.csswg.org/css-cascade-5/#typedef-layer-name
// https://drafts.csswg.org/css-page-3/#syntax-page-selector
// https://drafts.csswg.org/css-syntax-3/#urange-syntax
// https://drafts.csswg.org/css-values-5/#typedef-attr-name
// https://drafts.csswg.org/css-values-5/#typedef-syntax
// https://drafts.csswg.org/css-view-transitions-2/#typedef-pt-name-and-class-selector
// https://drafts.csswg.org/mediaqueries-5/#mq-syntax
// https://drafts.csswg.org/selectors-4/#white-space
//
// It disables consuming a whitespace before parsing a component value.
function disableWhiteSpace({ context, ...props }) {
  return {
    ...props,
    context: {
      ...context,
      separator: "",
    },
  };
}

function enterStyleRule(node) {
  const { context, ...props } = node;
  if (node.definition.name === "<declaration>" && context.definition.name !== "supports") {
    return node;
  }
  const style = parseContext.enterVirtualContext(node, "@style");
  if (node.definition.name !== "<style-feature>") {
    style.randomEvaluation = undefined;
  }
  return {
    context: style,
    ...props,
  };
}

function setStrictParsing({ context, ...props }) {
  return {
    ...props,
    context: {
      ...context,
      strict: true,
    },
  };
}
module.exports = {
  "<attr-matcher>": disableWhiteSpace,
  "<attr-name>": disableWhiteSpace,
  "<combinator>": disableWhiteSpace,
  "<compound-selector>": disableWhiteSpace,
  "<declaration>": enterStyleRule,
  "<layer-name>": disableWhiteSpace,
  "<mf-comparison>": disableWhiteSpace,
  "<mf-gt>": disableWhiteSpace,
  "<mf-lt>": disableWhiteSpace,
  "<pt-name-and-class-selector>": disableWhiteSpace,
  "<style-feature>": enterStyleRule,
  "<supports-decl>": enterStyleRule,
  "<supports-feature>": setStrictParsing,
  "<syntax-component>": disableWhiteSpace,
  "<urange>": disableWhiteSpace,
  "<wq-name>": disableWhiteSpace,
};
