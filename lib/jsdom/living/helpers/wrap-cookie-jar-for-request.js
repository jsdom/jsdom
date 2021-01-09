"use strict";
const RequestJar = require("./request/RequestJar");

function wrapForRequest(cookieJar) {
  const jarWrapper = new RequestJar();
  jarWrapper._jar = cookieJar;
  return jarWrapper;
}

module.exports = wrapForRequest;
