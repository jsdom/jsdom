"use strict";
const idlUtils = require("../../../generated/idl/utils");

// Window is implemented outside webidl2js, and callers can supply either its wrapper or its EventTarget implementation.
module.exports = value => {
  const impl = idlUtils.tryImplForWrapper(value);
  const wrapper = idlUtils.wrapperForImpl(impl);
  return wrapper !== null && wrapper === wrapper._globalProxy;
};
