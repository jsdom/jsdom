"use strict";
const fs = require("fs");
const { parse } = require("url");
const { parseURL } = require("whatwg-url");
const dataURLFromRecord = require("data-urls").fromURLRecord;
const packageVersion = require("../../../../package.json").version;
const fetch = require("node-fetch");
const fetchCookie = require("fetch-cookie/node-fetch");
const https = require("https");
const http = require("http");
const AbortController = require("abort-controller");
const HttpProxyAgent = require("http-proxy-agent");
const HttpsProxyAgent = require("https-proxy-agent");

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
   *
   * @param {string} protocol "http:" or "https:"
   */
  _getAgent(protocol) {
    const isHttps = protocol === "https:";
    const agentOpts = { keepAlive: true, rejectUnauthorized: this._strictSSL };
    if (this._proxy) {
      agentOpts.rejectUnauthorized = this._strictSSL;
      const proxyOpts = { ...parse(this._proxy), ...agentOpts };
      return isHttps ? new HttpsProxyAgent(proxyOpts) : new HttpProxyAgent(proxyOpts);
    }
    return isHttps ? new https.Agent(agentOpts) : new http.Agent(agentOpts);
  }

  _getFetchOptions({ accept = "*/*" }) {
    /** @type RequestInit */
    const fetchOptions = {};

    fetchOptions.headers = {
      "User-Agent": this._userAgent,
      "Accept-Language": "en",
      "Accept-Encoding": "gzip",
      Accept: accept
    };

    if (!IS_BROWSER) {
      fetchOptions.agent = uri => this._getAgent(uri.protocol);
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
        const { cookieJar } = options;
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
          };
        }

        let lastUrl = options.referrer;
        let lastOpts = null;

        const targetFetch = fetchCookie(
          (uri, opts) => {
            if (lastUrl && !IS_BROWSER) {
              opts.headers.referer = lastUrl;
            }
            lastUrl = uri;
            lastOpts = opts;
            return fetch(uri, opts);
          },
          cookieJar
        );
        const fetchOptions = this._getFetchOptions(options);
        const abortController = new AbortController();
        fetchOptions.signal = abortController.signal;
        const fetchPromise = targetFetch(urlString, fetchOptions);

        let aborted = false;
        let result;

        /* eslint-disable consistent-return */
        /* eslint-disable func-style */
        const then = async function then(onfulfilled, onrejected) {
          try {
            const resolvedFetch = await fetchPromise;
            const { ok, status, headers: fetchedHeaders } = resolvedFetch;
            if (!ok) {
              throw new Error(`Unexpected status=${status} for ${urlString}`);
            }
            const headers = {};
            for (const [key, value] of fetchedHeaders) {
              headers[key] = value;
            }
            result.response = { status, headers };
            result.href = lastUrl;
            const arrBuf = await resolvedFetch.arrayBuffer();
            const buf = typeof Buffer === "undefined" ? arrBuf : Buffer.from(arrBuf);
            if (!aborted) {
              return onfulfilled(buf);
            }
          } catch (error) {
            if (!aborted) {
              if (onrejected) {
                return onrejected(error);
              }
              throw error;
            }
          }
        };
        /* eslint-enable consistent-return */
        /* eslint-enable func-style */
        result = {
          response: null,
          abort: () => {
            aborted = true;
            abortController.abort();
          },
          href: null,
          then,
          catch: onrejected => then(undefined, onrejected),
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
