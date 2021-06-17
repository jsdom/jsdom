"use strict";
const assert = require("assert");

exports.rethrowAssertionErrorRejection = e => {
  // Used throughout the reference implementation, as `.catch(rethrowAssertionErrorRejection)`, to ensure any errors
  // get shown. There are places in the spec where we do promise transformations and purposefully ignore or don't
  // expect any errors, but assertion errors are always problematic.
  if (e && e instanceof assert.AssertionError) {
    setTimeout(() => {
      throw e;
    }, 0);
  }
};
