"use strict";

exports.readFileSync = function (file, opts) {
  if (opts !== "utf8" && opts !== "utf-8") throw new Error("fs without utf8 encoding is not supported!");

  var xhr = new XMLHttpRequest();
  xhr.open("GET", file, false);
  xhr.send(null);

  return xhr.responseText;
};
