"use strict";
// Persistent worker thread for handling synchronous XHR requests.
//
// This worker runs in a separate thread and performs async HTTP requests on behalf of the main
// thread, which blocks on Atomics.wait() until we signal completion. A single JSDOM instance is
// created at startup and reused across requests to avoid the ~400ms initialization cost each time.
//
// The signaling protocol (shared with sendSyncWorkerRequest in XMLHttpRequest-impl.js):
// 1. Main thread sends us a SharedArrayBuffer, a MessagePort, and the serialized request config.
// 2. We perform the XHR asynchronously.
// 3. When done, we post the serialized response to the MessagePort, then signal the main thread
//    by writing 1 to the SharedArrayBuffer with Atomics.store() and waking it with Atomics.notify().

const { parentPort } = require("node:worker_threads");
const { inspect } = require("util");
const { JSDOM } = require("../../../..");
const idlUtils = require("../../../generated/idl/utils");

const dom = new JSDOM();
const IDLE_TIMEOUT_MS = 5000;
const SYNC_XHR_DIAGNOSTIC_PREFIX = "[jsdom][sync-xhr-worker]";

function emitSyncXhrWorkerDiagnostic(event, details = {}) {
  // eslint-disable-next-line no-console
  console.error(`${SYNC_XHR_DIAGNOSTIC_PREFIX} ${event} ${inspect(details, { depth: 4, breakLength: Infinity })}`);
}

let idleTimer = setTimeout(() => process.exit(0), IDLE_TIMEOUT_MS);
idleTimer.unref();

parentPort.on("message", ({ sharedBuffer, responsePort, config, requestId }) => {
  clearTimeout(idleTimer);

  const int32 = new Int32Array(sharedBuffer);

  const xhr = new dom.window.XMLHttpRequest();
  const xhrImpl = idlUtils.implForWrapper(xhr);
  xhrImpl._adoptSerializedRequest(config);

  function done() {
    try {
      const response = xhrImpl._serializeResponse();
      response.requestId = requestId;

      const transfer = response.responseBytes ? [response.responseBytes.buffer] : [];
      responsePort.postMessage(response, transfer);
      Atomics.store(int32, 0, 1);
      Atomics.notify(int32, 0);

      idleTimer = setTimeout(() => process.exit(0), IDLE_TIMEOUT_MS);
      idleTimer.unref();
    } catch (error) {
      emitSyncXhrWorkerDiagnostic("done-failed", {
        requestId,
        method: config.method,
        url: config.url,
        readyState: xhr.readyState,
        error
      });
      throw error;
    }
  }

  try {
    xhr.addEventListener("error", () => {
      emitSyncXhrWorkerDiagnostic("xhr-error-event", {
        requestId,
        method: config.method,
        url: config.url,
        status: xhr.status,
        readyState: xhr.readyState
      });
    });

    xhr.addEventListener("abort", () => {
      emitSyncXhrWorkerDiagnostic("xhr-abort-event", {
        requestId,
        method: config.method,
        url: config.url,
        readyState: xhr.readyState
      });
    });

    xhr.addEventListener("timeout", () => {
      emitSyncXhrWorkerDiagnostic("xhr-timeout-event", {
        requestId,
        method: config.method,
        url: config.url,
        readyState: xhr.readyState
      });
    });

    xhr.addEventListener("loadend", done, false);
    xhr.send(xhrImpl._body);
  } catch (error) {
    emitSyncXhrWorkerDiagnostic("xhr-send-threw", {
      requestId,
      method: config.method,
      url: config.url,
      error
    });
    xhrImpl._error = error;
    done();
  }
});
