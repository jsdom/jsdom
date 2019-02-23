"use strict";

const hookSuperInvocation = require("./rules/hook-super-invocation");

module.exports = {
  rules: {
    "hook-super-invocation": hookSuperInvocation
  }
};
