"use strict";

const DOMException = require("domexception");

module.exports = (chai, util) => {
  const { assert, Assertion } = chai;
  const { flag } = util;

  assert.throwsDomException = (fn, document, name, message) => {
    const assertErr = new Assertion(fn, message).to.throwDomException(document, name);
    return flag(assertErr, "object");
  };

  Assertion.addMethod("throwDomException", function (document, name, message) {
    if (message) {
      flag(this, "message", message);
    }
    const fn = flag(this, "object");
    const expectedCode = new DOMException("", name).code;

    new Assertion(fn, message).is.a("function");

    let thrownError = null;

    try {
      fn();
    } catch (error) {
      thrownError = error;
    }

    this.assert(
      thrownError &&
      thrownError instanceof document.defaultView.DOMException &&
      thrownError.name === name &&
      thrownError.code === expectedCode,
      `expected #{this} to throw a window.DOMException with name '${name}' and code '${expectedCode}' but ` +
      (thrownError ?
        `#{act} was thrown with name '${thrownError.name}' and code '${thrownError.code}'` :
        `nothing was thrown`)
      ,
      `expected #{this} to not throw a window.DOMException with name '${name}' and code '${expectedCode}'`,
      "window.DOMException",
      thrownError instanceof Error ? thrownError.toString() : thrownError
    );

    // for chaining
    flag(this, "object", thrownError);
  });

  assert.isRejected = (promise, errorType) => {
    return promise.then(
      () => "expected promise to reject, not fulfill",
      reason => {
        if (errorType) {
          assert.strictEqual(reason.name, errorType.name);
        }
      }
    );
  };
};
