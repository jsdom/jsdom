"use strict";
const fs = require("fs");
const { fileURLToPath } = require("url");
const { parseURL } = require("whatwg-url");
const dataURLFromRecord = require("data-urls").fromURLRecord;
const packageVersion = require("../../../../package.json").version;
const fetch = require("node-fetch");
const fetchCookie = require("fetch-cookie/node-fetch");
const AbortController = require("abort-controller");
const agentFactory = require("../../living/helpers/agent-factory");

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
        const { cookieJar } = options;
        let lastURL = options.referrer;
        const targetFetch = fetchCookie(
          (fetchedURL, opts) => {
            if (lastURL && !IS_BROWSER) {
              opts.headers.referer = lastURL;
            }
            lastURL = fetchedURL;
            return fetch(fetchedURL, opts);
          },
          cookieJar
        );
        const fetchOptions = {
          headers: {
            "User-Agent": this._userAgent,
            "Accept-Language": "en",
            "Accept-Encoding": "gzip",
            "Accept": options.accept || "*/*"
          }
        };
        if (!IS_BROWSER) {
          fetchOptions.agent = ({ protocol }) => {
            const isHTTPS = protocol === "https:";
            const agents = agentFactory(this._proxy, this._strictSSL);
            if (isHTTPS) {
              return agents.https;
            }
            return agents.http;
          };
        }
        const abortController = new AbortController();
        function abort() {
          if (abortController.signal.aborted) {
            return false;
          }
          abortController.abort();
          return true;
        }
        fetchOptions.signal = abortController.signal;
        const fetchPromise = targetFetch(urlString, fetchOptions);

        let result;

        function then(onFulfilled, onRejected) {
          return fetchPromise
            .then(resolvedFetch => {
              const { ok, status, headers: fetchedHeaders } = resolvedFetch;
              if (!ok) {
                throw new Error(`Unexpected status=${status} for ${urlString}`);
              }
              const headers = {};
              for (const [key, value] of fetchedHeaders) {
                headers[key] = value;
              }
              result.response = { status, headers };
              result.href = lastURL;
              return resolvedFetch.buffer();
            })
            .then(buf => {
              if (abortController.signal.aborted) {
                return null;
              }
              return onFulfilled(buf);
            })
            .catch(error => {
              if (!abortController.signal.aborted) {
                if (onRejected) {
                  return onRejected(error);
                }
                throw error;
              }
              return null;
            });
        }

        result = {
          response: null,
          abort,
          href: null,
          then,
          catch: onRejected => then(undefined, onRejected),
          getHeader(name) {
            return fetchOptions.headers[name];
          }
        };
        return result;
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
