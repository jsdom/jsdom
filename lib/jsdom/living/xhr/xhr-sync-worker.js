"use strict";
const util = require("util");
const { JSDOM } = require("../../../..");
const idlUtils = require("../generated/utils");
const tough = require("tough-cookie");
const { serializeURL } = require("whatwg-url");

const dom = new JSDOM();
const xhr = new dom.window.XMLHttpRequest();
const xhrImpl = idlUtils.implForWrapper(xhr);

const chunks = [];
process.stdin.on("data", chunk => {
  chunks.push(chunk);
});

process.stdin.on("end", () => {
  const buffer = Buffer.concat(chunks);
  const payload = JSON.parse(buffer.toString());

  if (payload.body && payload.body.type === "Uint8Array" && payload.body.data) {
    payload.body = new Uint8Array(payload.body.data);
  }

  if (payload.cookieJar) {
    payload.cookieJar = tough.CookieJar.fromJSON(payload.cookieJar);
    dom.window.document._cookieJar = payload.cookieJar;
    xhrImpl._cookieJar = payload.cookieJar;
  }

  if (payload.origin) {
    dom.window._origin = payload.origin;
    xhrImpl._origin = payload.origin;
  }

  if (payload.userAgent) {
    xhrImpl._userAgent = payload.userAgent;
  }

  if (payload.referrer) {
    xhrImpl._referrer = payload.referrer;
  }

  function serializeResponse() {
    const response = xhrImpl._response;
    let url = null;
    if (response.url) {
      if (typeof response.url === "string") {
        url = response.url;
      } else if (response.url.href) {
        url = response.url.href;
      } else {
        url = serializeURL(response.url);
      }
    }
    return {
      type: response.type,
      status: response.status,
      statusMessage: response.statusMessage,
      headerList: response.headerList,
      url,
      aborted: response.aborted
    };
  }

  function writeResultAndExit(error) {
    const output = {
      response: serializeResponse(),
      receivedBytes: xhrImpl._receivedBytes ?
        { type: "Uint8Array", data: Array.from(xhrImpl._receivedBytes) } : null,
      error: error ? (error.stack || util.inspect(error)) : null
    };

    process.stdout.write(JSON.stringify(output), () => {
      dom.window.close();
      setTimeout(() => process.exit(0), 50);
    });
  }

  xhr.addEventListener("loadend", () => writeResultAndExit(null));

  try {
    xhr.open(payload.method, payload.url, true);
    if (payload.responseType) {
      xhr.responseType = payload.responseType;
    }
    if (payload.timeout) {
      xhr.timeout = payload.timeout;
    }
    xhr.withCredentials = !!payload.withCredentials;
    if (payload.overrideMimeType) {
      xhr.overrideMimeType(payload.overrideMimeType);
    }

    if (payload.headers) {
      for (const header of payload.headers) {
        xhr.setRequestHeader(header.name, header.value);
      }
    }

    xhr.send(payload.body || null);
  } catch (error) {
    writeResultAndExit(error);
  }
});
