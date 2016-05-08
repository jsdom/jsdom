"use strict";

const idlUtils = require("../generated/utils");

const XPathExpression = require("../generated/XPathExpression");

const DOMException = require("../../web-idl/DOMException");

class XPathEvaluatorImpl {
  createExpression(expression, resolver) {
    return XPathExpression.create([expression, resolver]);
  }

  evaluate(expression, contextNode, resolver, type, result) {
    try {
      const expr = XPathExpression.create([expression, resolver]);
      const wrapper = idlUtils.wrapperForImpl(contextNode);
      return expr.evaluate(wrapper, type, result);
    } catch (e) {
      if (e.message.startsWith("Namespace prefix not declared:")) {
        throw new DOMException(DOMException.NAMESPACE_ERR, e.message);
      } else {
        throw new DOMException(DOMException.SYNTAX_ERR, e.message);
      }
    }
  }
}

module.exports = {
  implementation: XPathEvaluatorImpl
};
