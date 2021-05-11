"use strict";
const fs = require("fs");
const { fileURLToPath } = require("url");
const { parseURL } = require("whatwg-url");
const dataURLFromRecord = require("data-urls").fromURLRecord;
const packageVersion = require("../../../../package.json").version;
const agentFactory = require("../../living/helpers/agent-factory");
const Request = require("../../living/helpers/http-request");

const IS_BROWSER = Object.prototype.toString.call(process) !== "[object process]";

module.exports = class ResourceLoader {
  constructor({
    strictSSL = true,
    proxy = undefined,
    userAgent = `Mozilla/5.0 (${process.platform || "unknown OS"}) AppleWebKit/537.36 ` +
                `(KHTML, like Gecko) jsdom/${packageVersion}`
  } = {}) {
    this._strictSSL = strictSSL;
    this._proxy = proxy;
    this._userAgent = userAgent;
  }

  _readDataURL(urlRecord) {
    const dataURL = dataURLFromRecord(urlRecord);
    let timeoutId;
    const promise = new Promise(resolve => {
      timeoutId = setTimeout(resolve, 0, dataURL.body);
    });
    promise.abort = () => {
      if (timeoutId !== undefined) {
        clearTimeout(timeoutId);
      }
    };
    return promise;
  }

  _readFile(filePath) {
    let readableStream, abort; // Native Promises doesn't have an "abort" method.

    // Creating a promise for two reason:
    //   1. fetch always return a promise.
    //   2. We need to add an abort handler.
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

  fetch(urlString, options = {}) {
    const url = parseURL(urlString);

    if (!url) {
      return Promise.reject(new Error(`Tried to fetch invalid URL ${urlString}`));
    }

    switch (url.scheme) {
      case "data": {
        return this._readDataURL(url);
      }

      case "http":
      case "https": {
        const { accept, cookieJar, referrer } = options;
        const agents = agentFactory(this._proxy, this._strictSSL);
        const requestOptions = {
          followRedirects: true,
          cookieJar,
          agents,
          headers: {
            "User-Agent": this._userAgent,
            "Accept-Language": "en",
            "Accept-Encoding": "gzip",
            "Accept": accept || "*/*"
          }
        };
        if (referrer && !IS_BROWSER) {
          requestOptions.headers.Referer = referrer;
        }
        const requestClient = new Request(urlString, requestOptions);
        const promise = new Promise((resolve, reject) => {
          const accumulated = [];
          requestClient.once("response", ({ statusCode }) => {
            if (statusCode === 404) {
              requestClient.abort();
              reject(new Error("404 Not Found"));
            } else if (statusCode >= 500) {
              requestClient.abort();
              reject(new Error("Error encountered"));
            }
          });
          requestClient.on("data", chunk => {
            accumulated.push(chunk);
          });
          requestClient.on("end", () => resolve(Buffer.concat(accumulated)));
          requestClient.on("error", reject);
        });
        requestClient.on("end", () => {
          // The test suite will halt without these properties defined
          promise.response = requestClient.response;
          promise.href = requestClient._currentURL;
        });
        promise.abort = requestClient.abort.bind(requestClient);
        promise.getHeader = name => requestOptions.headers[name] || requestClient.getHeader(name);
        requestClient.end();
        return promise;
      }

      case "file": {
        try {
          return this._readFile(fileURLToPath(urlString));
        } catch (e) {
          return Promise.reject(e);
        }
      }

      default: {
        return Promise.reject(new Error(`Tried to fetch URL ${urlString} with invalid scheme ${url.scheme}`));
      }
    }
  }
};
