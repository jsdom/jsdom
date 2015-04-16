"use strict";
var validateNames = require("./helpers/validate-names");
var defineGetter = require("../utils").defineGetter;
var defineSetter = require("../utils").defineSetter;

module.exports = function (core) {
  core.Document.prototype.createProcessingInstruction = function (target, data) {
    target = String(target);
    data = String(data);

    validateNames.name(target, core);

    if (data.indexOf("?>") !== -1) {
      throw new core.DOMException(core.DOMException.INVALID_CHARACTER_ERR,
        "Processing instruction data cannot contain the string \"?>\"");
    }

    return new core.ProcessingInstruction(this._ownerDocument, target, data);
  };

  core.Document.prototype.createTextNode = function (data) {
    return new core.Text(this, String(data));
  };

  core.Document.prototype.createComment = function (data) {
    return new core.Comment(this, String(data));
  };

  // https://html.spec.whatwg.org/multipage/dom.html#dom-document-cookie
  defineGetter(core.Document.prototype, "cookie", function () {
    return this._cookieJar.getCookieStringSync(this._URL, { http: false });
  });

  defineSetter(core.Document.prototype, "cookie", function (cookieStr) {
    cookieStr = String(cookieStr);
    this._cookieJar.setCookieSync(cookieStr, this._URL, {
      http: false,
      ignoreError: true
    });
  });
};
