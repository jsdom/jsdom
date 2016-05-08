"use strict";

const idlUtils = require("../generated/utils");

const XPathExpression = require("wicked-good-xpath").XPathExpression;
const XPathResult = require("../generated/XPathResult");

class XPathExpressionImpl {
  constructor(args) {
    this._expression = new XPathExpression(args[0], args[1]);
  }

  evaluate(contextNode, type, inResult) {
    const wrapper = idlUtils.wrapperForImpl(contextNode);
    const res = this._expression.evaluate(wrapper, type, inResult);
    return XPathResult.create([res]);
  }
}

module.exports = {
  implementation: XPathExpressionImpl
};
