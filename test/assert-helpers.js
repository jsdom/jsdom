"use strict";
const assert = require("node:assert/strict");

exports.assertThrowsDOMException = (fn, document, name) => {
  let thrownError;

  try {
    fn();
  } catch (e) {
    thrownError = e;
  }

  const expectedCode = new DOMException("", name).code;

  assert(
    thrownError &&
    thrownError instanceof document.defaultView.DOMException &&
    thrownError.name === name &&
    thrownError.code === expectedCode,
    `expected #{this} to throw a window.DOMException with name '${name}' and code '${expectedCode}' but ` +
    (thrownError ?
      `#{act} was thrown with name '${thrownError.name}' and code '${thrownError.code}'` :
      `nothing was thrown`)
    ,
    `expected #{this} to not throw a window.DOMException with name '${name}' and code '${expectedCode}'`
  );
};
