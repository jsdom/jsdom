"use strict";
const fs = require("fs");
const { parseURL } = require("whatwg-url");
const dataURLFromRecord = require("data-urls").fromURLRecord;
const request = require("request-promise-native");
const packageVersion = require("../../../../package.json").version;
const IS_BROWSER = Object.prototype.toString.call(process) !== "[object process]";

module.exports = class ResourceLoader {
  constructor() {
    this._defaultOptions = {
      agentOptions: {
        keepAlive: true,
        keepAliveMsecs: 115 * 1000
      },
      pool: { maxSockets: 6 },
      strictSSL: true,
      userAgent: `Mozilla/5.0 (${process.platform}) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/${packageVersion}`
    };
  }

  _readFile(filePath) {
    let readableStream;
    let abort; // Native Promises doesn't have an "abort" method.

    /*
     * Creating a promise for two reason:
     *   1. fetch always return a promise.
     *   2. We need to add an abort handler.
    */
    const promise = new Promise((resolve, reject) => {
      readableStream = fs.createReadStream(filePath);
      let data = Buffer.alloc(0);

      abort = reject;

      readableStream.on("error", reject);

      readableStream.on("data", chunk => {
        data = Buffer.concat([data, chunk]);
      });

      readableStream.on("end", () => {
        resolve(data);
      });
    });

    promise.abort = () => {
      readableStream.destroy();
      const error = new Error("request canceled by user");
      error.isAbortError = true;
      abort(error);
    };

    return promise;
  }

  /**
   * Returns the options to make the request
   * @param {object} options - Custom options for the request.
   */
  _getRequestOptions(options = {}) {
    const rqOptions = options.requestOptions;
    const requestOptions = {
      agent: rqOptions.agent,
      agentOptions: Object.assign({}, this._defaultOptions.agentOptions, rqOptions.agentOptions),
      agentClass: rqOptions.agentClass,
      encoding: null,
      gzip: true,
      jar: rqOptions.jar,
      pool: Object.assign({}, this._defaultOptions.pool, rqOptions.pool),
      // If strictSSL is not defined, then strictSSL will be true.
      strictSSL: rqOptions.strictSSL !== false,
      headers: {
        "User-Agent": rqOptions.userAgent || this._defaultOptions.userAgent,
        "Accept-Language": "en",
        Accept: rqOptions.accept || "*/*"
      }
    };

    if (rqOptions.referrer && !IS_BROWSER) {
      requestOptions.headers.referer = options.referrer;
    }
    if (rqOptions.proxy) {
      requestOptions.proxy = rqOptions.proxy;
    }

    return requestOptions;
  }

  /**
   * Fetch a resource.
   * @param {string} urlString - Absolute URL (data URLs are supported).
   * @param {object} options - Options to configure fetch.
   */
  fetch(urlString, options = {}) {
    const url = parseURL(urlString);

    if (!url) {
      return Promise.reject(new Error(`Tried to fetch invalid URL ${urlString}`));
    }

    switch (url.scheme) {
      case "data": {
        return Promise.resolve(dataURLFromRecord(url).body);
      }

      case "http":
      case "https": {
        const requestOptions = this._getRequestOptions(options);
        return request(urlString, requestOptions);
      }

      case "file": {
        // TODO: Improve the URL => file algorithm. See https://github.com/jsdom/jsdom/pull/2279#discussion_r199977987
        const filePath = urlString
          .replace(/^file:\/\//, "")
          .replace(/^\/([a-z]):\//i, "$1:/")
          .replace(/%20/g, " ");

        return this._readFile(filePath);
      }

      default: {
        return Promise.reject(new Error(`Tried to fetch URL ${urlString} with invalid scheme ${url.scheme}`));
      }
    }
  }
};
