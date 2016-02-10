"use strict";
const path = require("path");
const jsdom = require("../lib/jsdom");
const fs = require("fs");
const exceptionTable = require("../lib/jsdom/web-idl/dom-exception-table.json");

function toPathname(dirname, relativePath) {
  let pathname = path.resolve(dirname, relativePath).replace(/\\/g, "/");
  if (pathname[0] !== "/") {
    pathname = "/" + pathname;
  }
  return pathname;
}

function toFileUrl(dirname, relativePath) {
  return "file://" + toPathname(dirname, relativePath);
}

exports.toFileUrl = dirname => {
  return function (relativePath) {
    return toFileUrl(dirname, relativePath);
  };
};

exports.toPathname = dirname => {
  return function (relativePath) {
    return toPathname(dirname, relativePath);
  };
};

exports.load = dirname => {
  const fileCache = Object.create(null);

  return function (name, options) {
    options = options || {};

    const file = path.resolve(dirname, "files/" + name + ".html");

    if (!options.url) {
      options.url = toFileUrl(dirname, file);
    }

    const contents = fileCache[file] || fs.readFileSync(file, "utf8");
    const doc = jsdom.jsdom(null, options);
    const window = doc.defaultView;

    doc.parent = window;
    window.loadComplete = function () {};

    doc.write(contents);
    doc.close();

    fileCache[file] = contents;
    return doc;
  };
};

/**
 * @param {Document} document
 * @param {String} name
 * @return {Function} A function that tests if the given
 *         exception is a `DOMException` of the specified `code`
 *
 * @example t.throws(function () {
 *   // ...
 * }, domExceptionPredicate(doc, "NoModificationAllowedError"));
 */
exports.domExceptionPredicate = (document, name) => {
  return function (error) {
    return error instanceof document.defaultView.DOMException &&
           error.name === name &&
           error.code === exceptionTable[name].legacyCodeValue;
  };
};

exports.todo = (test, fn) => {
  fn({
    ok(value, message) {
      test.ok(!value, "Marked as TODO: " + message);
    }
    // add more as needed
  });
};

exports.injectIFrame = document => {
  return exports.injectIFrameWithScript(document);
};

exports.injectIFrameWithScript = (document, scriptStr) => {
  scriptStr = scriptStr || "";
  const iframe = document.createElement("iframe");
  document.body.appendChild(iframe);

  const scriptTag = iframe.contentWindow.document.createElement("script");
  scriptTag.textContent = scriptStr;
  iframe.contentWindow.document.body.appendChild(scriptTag);

  return iframe;
};
