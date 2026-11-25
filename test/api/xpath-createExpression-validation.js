"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

const INVALID_EXPRESSION_ERR = 51;

function makeDocument() {
  return new JSDOM(`<div class="x"><a/></div>`).window.document;
}

// createExpression() must reject anything it cannot evaluate, and it must reject it as an
// XPathException — not as a bare Error, and not three calls later from evaluate().
function assertCreateThrows(expression) {
  return () => assert.throws(() => makeDocument().createExpression(expression, null));
}

describe("document.createExpression() argument validation", () => {
  describe("unknown functions", () => {
    // https://github.com/jsdom/jsdom/issues/3371 — an XPath 3.1 expression used to be accepted
    // here and only blow up on the first evaluate() call.
    it("rejects an XPath 3.1 function", () => {
      const document = makeDocument();
      assert.throws(
        () => document.createExpression(`.//*[contains-token(@class, "byline__name")]//a`, null),
        err => {
          assert.equal(err.name, "XPathException");
          assert.match(err.message, /Unknown function: contains-token/);
          return true;
        }
      );
    });

    it("rejects an unknown unprefixed function", () => {
      const document = makeDocument();
      assert.throws(
        () => document.createExpression("totallyUnknownFn(1)", null),
        err => {
          assert.equal(err.name, "XPathException");
          assert.match(err.message, /Unknown function: totallyUnknownFn/);
          return true;
        }
      );
    });

    it("rejects an unknown namespaced function", () => {
      const document = makeDocument();
      assert.throws(
        () => document.createExpression("fn:nope()", null),
        err => {
          assert.equal(err.name, "XPathException");
          assert.match(err.message, /Unknown function: fn:nope/);
          return true;
        }
      );
    });
  });

  describe("syntax errors", () => {
    // The empty-expression branch used to start with a bare `throw new Error` statement, so the
    // XPathException on the next line was dead code and every one of these escaped as an Error
    // with an empty message.
    const brokenExpressions = [
      ["unclosed predicate", "//div["],
      ["unclosed function call", "count("],
      ["dangling operator", "1 +"],
      ["unclosed wildcard predicate", "//*["],
      ["bare predicate", "[1]"],
      ["empty string", ""]
    ];

    for (const [label, expression] of brokenExpressions) {
      it(`rejects a ${label} with an XPathException`, () => {
        const document = makeDocument();
        assert.throws(() => document.createExpression(expression, null), err => {
          assert.equal(err.name, "XPathException", `expected XPathException, got ${err.name}: ${err.message}`);
          assert.equal(err.code, INVALID_EXPRESSION_ERR);
          assert.ok(err.message.length > 0, "the exception should carry a message");
          return true;
        });
      });
    }
  });

  describe("valid expressions", () => {
    // The added validation must not reject anything that used to work.
    const validExpressions = [
      "//div",
      "count(//div)",
      "string(//a)",
      "//@class",
      ".. | //a",
      "boolean(//div[1])",
      "substring('abcdef', 2, 3)",
      "normalize-space( ' a  b ' )",
      "//div[position() = 1]"
    ];

    for (const expression of validExpressions) {
      it(`still accepts ${JSON.stringify(expression)}`, () => {
        const document = makeDocument();
        const compiled = document.createExpression(expression, null);
        assert.ok(compiled, "createExpression should return an object");
        // and it must still be evaluable
        compiled.evaluate(document);
      });
    }
  });
});
