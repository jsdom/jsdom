"use strict";
const fs = require("fs");
const { parseURL } = require("whatwg-url");
const dataURLFromRecord = require("data-urls").fromURLRecord;
const packageVersion = require("../../../../package.json").version;
const fetch = require("node-fetch");
const fetchCookie = require('fetch-cookie/node-fetch');
const https = require("https");
const http = require("http");
const IS_BROWSER = Object.prototype.toString.call(process) !== "[object process]";
const AbortController = require("abort-controller");

const request = require("request-promise-native");
const wrapCookieJarForRequest = require("../../living/helpers/wrap-cookie-jar-for-request");

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

  _getRequestOptions({ cookieJar, referrer, accept = "*/*" }) {
    const requestOptions = {
      encoding: null,
      gzip: true,
      jar: wrapCookieJarForRequest(cookieJar),
      strictSSL: this._strictSSL,
      proxy: this._proxy,
      forever: true,
      headers: {
        "User-Agent": this._userAgent,
        "Accept-Language": "en",
        Accept: accept
      }
    };

    if (referrer && !IS_BROWSER) {
      requestOptions.headers.referer = referrer;
    }

    return requestOptions;
  }

  _getFetchOptions({ accept = "*/*" }) {
    /** @type RequestInit */
    const fetchOptions = {};

    // I don't know what these variables hold exactly - let's log them!
    if (this._proxy) {
      console.log("this._proxy", this._proxy);
    }

    fetchOptions.headers = {
      "User-Agent": this._userAgent,
      "Accept-Language": "en",
      "Accept-Encoding": "gzip",
      Accept: accept,
    };

    if (!IS_BROWSER) {
      const httpAgent = new http.Agent({ keepAlive: true });
      const httpsAgent = new https.Agent({ keepAlive: true, rejectUnauthorized: this._strictSSL });
      fetchOptions.agent = (url) => url.protocol == 'http:' ? httpAgent : httpsAgent;
    }

    return fetchOptions;
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
        const cookieJar = options.cookieJar;
        if (!cookieJar.__setCookie) {
          cookieJar.__setCookie = cookieJar.setCookie;
          cookieJar.setCookie = (...args) => {
            if (args.length === 3) {
              args.splice(2, 0, {});
            }
            if (args.length === 4) {
              args[2].ignoreError = true;
            }
            return cookieJar.__setCookie(...args);
          }
        }

        let lastUrl = options.referrer;
        let lastOpts = null;

        const myFetch = (url, opts) => {
          if (lastUrl && !IS_BROWSER) {
            opts.headers.referer = lastUrl;
          }
          lastUrl = url;
          lastOpts = opts;
          return fetch(url, opts);
        };

        const targetFetch = fetchCookie(myFetch, cookieJar);
        const fetchOptions = this._getFetchOptions(options);
        const abortController = new AbortController();
        fetchOptions.signal = abortController.signal;
        const fetchPromise = targetFetch(urlString, fetchOptions);

        let aborted = false;
        let result;
        const then = function(onfulfilled, onrejected) {
          return fetchPromise.then((response) => {
            const { ok, status } = response;
            if (!ok) {
              throw new Error(`Unexpected status=${status} for ${urlString}`);
            }
            const headers = {};
            for (const [ key, value ] of response.headers) {
              headers[key] = value;
            }

            result.response = {
              status,
              headers,
            };
            result.href = lastUrl;
            return response.arrayBuffer();
          })
          .then((arrayBuffer) => typeof Buffer === "undefined" ? arrayBuffer : Buffer.from(arrayBuffer))
          .then((result) => { if (!aborted) return onfulfilled(result); })
          .catch((error) => {
            if (!aborted) {
              if (onrejected) {
                return onrejected(error);
              } else {
                throw error;
              }
            }
          });
        };

        result = {
          response: null,
          abort: function() {
            aborted = true;
            abortController.abort();
          },
          href: null,
          then,
          catch: function(onrejected) {
            return then(undefined, onrejected)
          },
          getHeader(name) {
            return lastOpts.headers[name];
          }
        };

        return result;
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
