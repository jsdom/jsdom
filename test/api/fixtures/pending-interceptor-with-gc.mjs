import assert from "node:assert/strict";
import { setImmediate } from "node:timers/promises";
import jsdom from "../../../lib/api.js";

const { JSDOM, requestInterceptor } = jsdom;
const pendingResponse = Promise.withResolvers();
const lateResponse = Promise.withResolvers();
const bodyCanceled = Promise.withResolvers();
const bodyCleanup = Promise.withResolvers();

function createAndClose(interceptor, useXHR = false) {
  const { window } = new JSDOM(useXHR ? "" : '<script src="https://example.test/pending.js"></script>', {
    url: "https://example.test/",
    runScripts: "dangerously",
    resources: { interceptors: [interceptor] }
  });
  if (useXHR) {
    const xhr = new window.XMLHttpRequest();
    xhr.open("GET", "/pending.txt");
    xhr.send();
  }
  const reference = new WeakRef(window);
  window.close();
  return reference;
}

const references = new Map([
  ["pending callback", createAndClose(requestInterceptor(() => pendingResponse.promise))],
  ["pending XHR callback", createAndClose(requestInterceptor(() => pendingResponse.promise), true)],
  ["pending body cleanup", createAndClose(requestInterceptor(() => lateResponse.promise))]
]);

lateResponse.resolve(new Response(new ReadableStream({
  pull() {
    assert.fail("A canceled response must not be read");
  },
  cancel() {
    bodyCanceled.resolve();
    return bodyCleanup.promise;
  }
}, { highWaterMark: 0 })));
await bodyCanceled.promise;

let retained;
for (let i = 0; i < 10; ++i) {
  await setImmediate();
  global.gc();
  retained = [...references].filter(([, reference]) => reference.deref() !== undefined);
  if (retained.length === 0) {
    break;
  }
}

assert.deepEqual(retained.map(([name]) => name), []);

// Keep both promises reachable until after checking collection, and settle them afterward.
pendingResponse.resolve(new Response(null));
bodyCleanup.resolve();
await pendingResponse.promise;
await bodyCleanup.promise;
console.log("collected");
