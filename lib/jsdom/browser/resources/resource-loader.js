"use strict";
const fsPromises = require("fs/promises");
const { fileURLToPath } = require("url");
const { parseURL } = require("whatwg-url");
const dataURLFromRecord = require("data-urls").fromURLRecord;
const packageVersion = require("../../../../package.json").version;
const agentFactory = require("../../living/helpers/agent-factory");
const Request = require("../../living/helpers/http-request");
const { concatTypedArrays } = require("../../living/helpers/binary-data");

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
    const controller = new AbortController();
    const promise = fsPromises.readFile(filePath, { signal: controller.signal });

    // Ensure the caller never sees Node.js `Buffer` instances.
    const asUint8Array = promise.then(nodeBuffer => {
      return new Uint8Array(nodeBuffer.buffer, nodeBuffer.byteOffset, nodeBuffer.byteLength);
    });

    asUint8Array.abort = () => controller.abort();
    return asUint8Array;
  }

  fetch(urlString, { accept, cookieJar, referrer, allowNon2xx = false } = {}) {
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
        const agents = agentFactory(this._proxy, this._strictSSL);
        const headers = {
          "User-Agent": this._userAgent,
          "Accept-Language": "en",
          "Accept-Encoding": "gzip",
          "Accept": accept || "*/*"
        };
        if (referrer && !IS_BROWSER) {
          headers.Referer = referrer;
        }
        const requestClient = new Request(
          urlString,
          { followRedirects: true, cookieJar, agents },
          { headers }
        );
        const promise = new Promise((resolve, reject) => {
          const accumulated = [];
          requestClient.once("response", res => {
            promise.response = res;
            const { statusCode } = res;
            // TODO This deviates from the spec when it comes to
            // loading resources such as images
            if (!allowNon2xx && (statusCode < 200 || statusCode > 299)) {
              requestClient.abort();
              reject(new Error(`Resource was not loaded. Status: ${statusCode}`));
            }
          });
          requestClient.on("data", chunk => {
            accumulated.push(chunk);
          });
          requestClient.on("end", () => resolve(concatTypedArrays(accumulated)));
          requestClient.on("error", reject);
        });
        // The method fromURL in lib/api.js crashes without the following four
        // properties defined on the Promise instance, causing the test suite to halt
        requestClient.on("end", () => {
          promise.href = requestClient.currentURL;
        });
        promise.abort = requestClient.abort.bind(requestClient);
        promise.getHeader = name => headers[name] || requestClient.getHeader(name);
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
