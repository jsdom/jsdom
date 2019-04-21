"use strict";

const { parseURL, serializeURL } = require("whatwg-url");

const Response = require("../generated/Response");
const Headers = require("../generated/Headers");

const NULL_BODY_STATUS = new Set([101, 204, 205, 304]);
const REDIRECT_STATUS = new Set([301, 302, 303, 307, 308]);

class ResponseImpl {
  constructor([body, init = {}]) {
    if (init.status < 200 || init.status > 599) {
      throw new RangeError("Invalid status code");
    }
    if (init.statusText && init.statusText.match(/[^\t \x21-\x7E\x80-\xFF]/)) {
      throw new TypeError("Invalid reason phrase");
    }
    this.type = "default";
    this.abortedFlag = false;
    this.urlList = [];
    this.body = null;
    this.trailerFailedFlag = false;
    this.cacheState = "";
    this.httpsState = "none";

    this.headers = Headers.createImpl([]);
    this.headers.guard = "response";
    this.status = init.status || 200;
    this.statusText = init.statusText || "";
    if (init.headers) {
      this.headers._fill(init.headers);
    }
    if (body !== null) {
      if (NULL_BODY_STATUS.has(init.status)) {
        throw new TypeError("Status code does not allow a body");
      }
      const contentType = null;
      // TODO: Extract body
      if (contentType !== null && !this.headers.has("content-type")) {
        this.headers._append("Content-Type", contentType);
      }
    }
    this.trailer = new Promise((resolve, reject) => {
      this.trailerDeferred = { resolve, reject };
    });
  }

  static error() {
    const r = Response.createImpl([]);
    r.type = "error";
    r.status = 0;
    r.headers.guard = "immutable";
    return r;
  }

  static redirect(urlStr, status) {
    const url = parseURL(urlStr);
    if (url === null) {
      // if we're not given a full URL, we also throw because we don't have the
      // associated window
      throw new TypeError("Non-absolute URLs are unsupported");
    }
    if (!REDIRECT_STATUS.has(status)) {
      throw new RangeError("status is not a redirect status");
    }
    const r = Response.createImpl([]);
    r.headers.guard = "immutable";
    r.status = status;
    r.headers.headersList.append("Location", serializeURL(url));
    return r;
  }

  get redirected() {
    return this.urlList.length > 1;
  }

  get ok() {
    return this.status >= 200 && this.status < 300;
  }

  get url() {
    if (this.urlList.length === 0) {
      return "";
    }
    return serializeURL(this.urlList[this.urlList.length - 1], true);
  }
}

exports.implementation = ResponseImpl;
