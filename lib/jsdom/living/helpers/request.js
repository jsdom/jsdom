"use strict";
const http = require("http");
const https = require("https");
const FormData = require("form-data");

// determine which class of requests to use
// consider defing a full factory for the object
exports.requestFactory = function requestFactory(url) {
  if (url.startsWith("https")) {
    return https.request;
  }
  return http.request;
};

function onFormErrorFactory(request) {
  return function onFormError(err) {
    err.message = `form-data: ${err.message}`;
    request.emit("error", err);
    request.destroy();
    // request.emit('abort');
  };
}

exports.setFormData = function setFormData(request, body) {
  const form = new FormData();
  form.on("error", onFormErrorFactory(request));
  for (const entry of body) {
    form.append(entry.name, entry.value, entry.options);
  }
  // set form data???
};
