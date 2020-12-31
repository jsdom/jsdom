"use strict";
const { Response } = require("node-fetch");

/** An abstract-leak/hack for discriminating between Fetch responses and EventEmitter instances */
function isFetch(response) {
  return response instanceof Response;
}

/** Get the header object from the response */
function getResponseHeaders(response) {
  if (isFetch(response)) {
    return response.headers.raw();
  }
  return response.headers;
}

/** Get the response body as a Readable stream object */
function getResponseBody(response) {
  if (isFetch(response)) {
    return response.body();
  }
  return response;
}

exports.getResponseHeaders = getResponseHeaders;
exports.getResponseBody = getResponseBody;
