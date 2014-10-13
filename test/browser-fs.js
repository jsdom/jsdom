"use strict";

exports.readFile = function (file, opts, cb) {
  if (opts !== "utf8" && opts !== "utf-8") throw new Error("fs without utf8 encoding is not supported!");

  var xhr = new XMLHttpRequest();
  xhr.open("GET", file, true);
  xhr.send(null);

  xhr.onreadystatechange = function () {
    if (xhr.readyState === 4) {
      if (xhr.status === 200) {
        cb(null, xhr.responseText);
      } else {
        var e = new Error("File not found!");
        e.code = "ENOENT";
        cb(e);
      }
    }
  }
};

exports.readFileSync = function (file, opts) {
  if (opts !== "utf8" && opts !== "utf-8") throw new Error("fs without utf8 encoding is not supported!");

  var xhr = new XMLHttpRequest();
  xhr.open("GET", file, false);
  xhr.send(null);

  return xhr.responseText;
};
