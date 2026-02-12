"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");
const toughCookie = require("tough-cookie");
const { JSDOMDispatcher } = require("../../lib/jsdom/browser/resources/jsdom-dispatcher.js");

// Technically not an API test.
describe("JSDOMDispatcher unit tests", () => {
  // DispatchOptions from undici (per undici/types/dispatcher.d.ts):
  // - origin, path, method, body, headers, query, idempotent, blocking,
  //   upgrade, headersTimeout, bodyTimeout, reset, throwOnError, expectContinue

  it("should pass through method, body, and other DispatchOptions unchanged", async () => {
    const { dispatcher, getCapturedOpts } = createCapturingDispatcher();
    const body = Buffer.from("test body");
    await dispatchAndWait(dispatcher, {
      origin: "http://localhost",
      path: "/test",
      method: "POST",
      headers: {},
      body,
      opaque: { url: "http://localhost/test" },
      idempotent: true,
      blocking: false,
      headersTimeout: 10000,
      bodyTimeout: 5000,
      reset: true,
      throwOnError: false,
      expectContinue: true
    });
    const opts = getCapturedOpts();
    assert.equal(opts.method, "POST");
    assert.equal(opts.body, body);
    assert.equal(opts.idempotent, true);
    assert.equal(opts.blocking, false);
    assert.equal(opts.headersTimeout, 10000);
    assert.equal(opts.bodyTimeout, 5000);
    assert.equal(opts.reset, true);
    assert.equal(opts.throwOnError, false);
    assert.equal(opts.expectContinue, true);
  });

  it("should pass through upgrade (requires special handler)", async () => {
    let capturedOpts;
    const mockBaseDispatcher = {
      dispatch(opts, handler) {
        capturedOpts = opts;
        // Handlers arriving here have been converted to old-style by JSDOMDispatcher.
        handler.onConnect(() => {});
        handler.onUpgrade(101, [], { on() {}, removeListener() {} });
        return true;
      },
      close() {},
      destroy() {},
      closed: false,
      destroyed: false
    };
    const cookieJar = new toughCookie.CookieJar();
    const dispatcher = new JSDOMDispatcher({
      baseDispatcher: mockBaseDispatcher,
      cookieJar
    });

    await new Promise((resolve, reject) => {
      dispatcher.dispatch({
        origin: "http://localhost",
        path: "/test",
        method: "GET",
        headers: {},
        upgrade: "websocket",
        opaque: { url: "http://localhost/test" }
      }, {
        onRequestStart() {},
        onRequestUpgrade: resolve,
        onResponseError: reject
      });
    });
    assert.equal(capturedOpts.upgrade, "websocket");
  });

  it("should derive origin and path from opaque.url, ignoring caller values", async () => {
    const { dispatcher, getCapturedOpts } = createCapturingDispatcher();
    await dispatchAndWait(dispatcher, {
      origin: "http://ignored-origin.com",
      path: "/ignored-path",
      method: "GET",
      headers: {},
      opaque: { url: "http://actual-origin.com/actual-path?query=value" }
    });
    assert.equal(getCapturedOpts().origin, "http://actual-origin.com");
    assert.equal(getCapturedOpts().path, "/actual-path?query=value");
  });

  it("should add default headers to passed headers", async () => {
    const { dispatcher, getCapturedOpts } = createCapturingDispatcher();
    await dispatchAndWait(dispatcher, {
      origin: "http://localhost",
      path: "/test",
      method: "GET",
      headers: { "X-Custom": "value" },
      opaque: { url: "http://localhost/test" }
    });
    const { headers } = getCapturedOpts();
    assert.equal(headers["X-Custom"], "value");
    assert.ok(headers["User-Agent"], "Should have User-Agent");
    assert.ok(headers.Accept, "Should have Accept");
    assert.ok(headers["Accept-Language"], "Should have Accept-Language");
    assert.ok(headers["Accept-Encoding"], "Should have Accept-Encoding");
  });

  it("should null out query option since path is derived from opaque.url", async () => {
    const { dispatcher, getCapturedOpts } = createCapturingDispatcher();
    await dispatchAndWait(dispatcher, {
      origin: "http://localhost",
      path: "/ignored",
      method: "GET",
      headers: {},
      query: { extra: "param" },
      opaque: { url: "http://localhost/test?existing=query" }
    });
    // query is nulled out to avoid conflicts with path derived from URL
    assert.equal(getCapturedOpts().query, null);
    assert.equal(getCapturedOpts().path, "/test?existing=query");
  });

  it("should pass through origin, path, and query unchanged if opaque.url is not provided", async () => {
    const { dispatcher, getCapturedOpts } = createCapturingDispatcher();
    await dispatchAndWait(dispatcher, {
      origin: "http://localhost",
      path: "/test?foo=bar",
      method: "GET",
      headers: {},
      query: { extra: "param" },
      opaque: { element: null }
    });
    assert.equal(getCapturedOpts().origin, "http://localhost");
    assert.equal(getCapturedOpts().path, "/test?foo=bar");
    assert.deepEqual(getCapturedOpts().query, { extra: "param" });
  });

  it("should preserve custom opaque values beyond jsdom-documented ones", async () => {
    const { dispatcher, getCapturedOpts } = createCapturingDispatcher();
    const customData = { foo: "bar", nested: { a: 1 } };
    await dispatchAndWait(dispatcher, {
      origin: "http://localhost",
      path: "/test",
      method: "GET",
      headers: {},
      opaque: {
        url: "http://localhost/test",
        element: null,
        customField: "custom-value",
        customData
      }
    });
    const { opaque } = getCapturedOpts();
    assert.equal(opaque.customField, "custom-value");
    assert.equal(opaque.customData, customData);
  });

  it("should work with an old-style-only base dispatcher (undici v6 compat)", async () => {
    const responseBody = Buffer.from("hello from v6");
    const mockBaseDispatcher = {
      dispatch(opts, handler) {
        // Validate old-style handler contract, like undici v6's assertRequestHandler does.
        // v6 does NOT check for onRequestStart; it requires old-style methods.
        if (typeof handler.onConnect !== "function") {
          throw new Error("invalid onConnect method");
        }
        if (typeof handler.onError !== "function") {
          throw new Error("invalid onError method");
        }
        if (typeof handler.onHeaders !== "function") {
          throw new Error("invalid onHeaders method");
        }
        if (typeof handler.onData !== "function") {
          throw new Error("invalid onData method");
        }
        if (typeof handler.onComplete !== "function") {
          throw new Error("invalid onComplete method");
        }

        // Simulate a v6-style response with raw Buffer headers
        handler.onConnect(() => {});
        handler.onHeaders(
          200,
          [Buffer.from("content-type"), Buffer.from("text/plain"), Buffer.from("x-test"), Buffer.from("works")],
          () => {},
          "OK"
        );
        handler.onData(responseBody);
        handler.onComplete([]);
        return true;
      },
      close() {},
      destroy() {},
      closed: false,
      destroyed: false
    };
    const cookieJar = new toughCookie.CookieJar();
    const dispatcher = new JSDOMDispatcher({
      baseDispatcher: mockBaseDispatcher,
      cookieJar
    });

    const result = await new Promise((resolve, reject) => {
      const chunks = [];
      dispatcher.dispatch({
        origin: "http://localhost",
        path: "/test",
        method: "GET",
        headers: {},
        opaque: { url: "http://localhost/test" }
      }, {
        onRequestStart() {},
        onResponseStart(controller, statusCode, headers, statusText) {
          this._status = statusCode;
          this._headers = headers;
          this._statusText = statusText;
        },
        onResponseData(controller, chunk) {
          chunks.push(chunk);
        },
        onResponseEnd() {
          resolve({
            status: this._status,
            headers: this._headers,
            statusText: this._statusText,
            body: Buffer.concat(chunks)
          });
        },
        onResponseError(controller, err) {
          reject(err);
        }
      });
    });

    assert.equal(result.status, 200);
    assert.equal(result.statusText, "OK");
    assert.equal(result.headers["content-type"], "text/plain");
    assert.equal(result.headers["x-test"], "works");
    assert.deepEqual(result.body, responseBody);
  });
});

function createCapturingDispatcher() {
  let capturedOpts;
  const mockBaseDispatcher = {
    dispatch(opts, handler) {
      capturedOpts = opts;
      // Handlers arriving here have been converted to old-style by JSDOMDispatcher.
      handler.onConnect(() => {});
      handler.onHeaders(200, [], () => {}, "OK");
      handler.onComplete([]);
      return true;
    },
    close() {},
    destroy() {},
    closed: false,
    destroyed: false
  };
  const cookieJar = new toughCookie.CookieJar();
  const dispatcher = new JSDOMDispatcher({
    baseDispatcher: mockBaseDispatcher,
    cookieJar
  });
  return { dispatcher, getCapturedOpts: () => capturedOpts };
}

function dispatchAndWait(dispatcher, opts) {
  return new Promise((resolve, reject) => {
    dispatcher.dispatch(opts, {
      onRequestStart() {},
      onResponseStart() {},
      onResponseEnd: resolve,
      onResponseError: reject
    });
  });
}
