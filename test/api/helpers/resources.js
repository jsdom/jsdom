"use strict";
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const http = require("http");
const assert = require("node:assert/strict");
const { delay, createServer } = require("../../util.js");
const { VirtualConsole } = require("../../..");
const enableDestroy = require("server-destroy");

const pngBytes = fs.readFileSync(path.resolve(__dirname, "../fixtures/resources/transparent.png"));

async function resourceServer(headers, body, { statusCode = 200 } = {}) {
  const server = await createServer((req, res) => {
    res.writeHead(statusCode, headers);
    res.end(body);
    server.destroy();
  });

  return `http://127.0.0.1:${server.address().port}/`;
}

function resourceServer404() {
  const notFoundText = "Not found";

  return resourceServer(
    { "Content-Type": "text/html", "Content-Length": notFoundText.length },
    notFoundText,
    { statusCode: 404 }
  );
}

function resourceServer503() {
  const serverErrorText = "Internal server error";

  return resourceServer(
    { "Content-Type": "text/html", "Content-Length": serverErrorText.length },
    serverErrorText,
    { statusCode: 503 }
  );
}

async function neverRequestedServer() {
  let resolveReturnedPromise, rejectReturnedPromise;
  const returnedPromise = new Promise((resolve, reject) => {
    resolveReturnedPromise = resolve;
    rejectReturnedPromise = reject;
  });

  let destroyed = false;

  const server = await createServer(req => {
    rejectReturnedPromise(new Error(`${req.url} was requested, but should not have been`));
    server.destroy();
    destroyed = true;
  });

  setTimeout(() => {
    if (!destroyed) {
      server.destroy();
      resolveReturnedPromise();
    }
  }, 30);

  return [`http://127.0.0.1:${server.address().port}/`, returnedPromise];
}

function imageServer({ statusCode = 200 } = {}) {
  return resourceServer(
    { "Content-Type": "image/png", "Content-Length": pngBytes.byteLength },
    pngBytes,
    { statusCode }
  );
}

function htmlServer(sourceString) {
  return resourceServer(
    { "Content-Type": "text/html", "Content-Length": sourceString.length },
    sourceString
  );
}

function threeRequestServer() {
  const routes = {
    "/html": `<!DOCTYPE html><script src="/js"></script>`,
    "/js": `const xhr = new window.XMLHttpRequest();
            xhr.open("GET", "/xhr");
            xhr.onload = () => {
              window.done();
            };
            xhr.send();`,
    "/xhr": "test"
  };

  return createServer((req, res) => {
    res.writeHead(200, { "Content-Length": routes[req.url].length });
    res.end(routes[req.url]);
  }).then(s => {
    s.numberOfConnections = 0;
    s.on("connection", () => {
      ++s.numberOfConnections;
    });

    return [s, `http://127.0.0.1:${s.address().port}`];
  });
}

function setUpLoadingAsserts(loadable) {
  loadable.loadFired = false;
  loadable.errorFired = false;
  loadable.abortFired = false;

  loadable.loadPromise = new Promise(resolve => {
    loadable.addEventListener("load", () => {
      loadable.loadFired = true;
      resolve();
    });
    loadable.addEventListener("error", () => {
      loadable.errorFired = true;
      resolve();
    });
    loadable.addEventListener("abort", () => {
      loadable.abortFired = true;
    });
  });
}

function assertNotLoaded(loadable) {
  return delay(30).then(() => {
    assert.equal(loadable.loadFired, false, "The load event must not fire");
    assert.equal(loadable.errorFired, false, "The error event must not fire");
  });
}

async function assertLoaded(loadable, virtualConsole) {
  await loadable.loadPromise;

  assert.equal(loadable.loadFired, true, "The load event must fire");
  assert.equal(loadable.errorFired, false, "The error event must not fire");

  assert.equal(virtualConsole.resourceLoadingErrors.length, 0);
}

async function assertError(loadable, virtualConsole, { isXHR = false } = {}) {
  await loadable.loadPromise;

  assert.equal(loadable.loadFired, false, "The load event must not fire");
  assert.equal(loadable.errorFired, true, "The error event must fire");

  // XHR doesn't emit jsdomError events, as it's expected that XHRs often fail.
  // This is similar to how browsers have, somewhat recently, stopped showing XHR failures in the console.
  if (isXHR) {
    assert.equal(virtualConsole.resourceLoadingErrors.length, 0);
  } else {
    assert.equal(virtualConsole.resourceLoadingErrors.length, 1);

    const error = virtualConsole.resourceLoadingErrors[0];
    assert(error instanceof Error);
    assert.equal(error.type, "resource-loading");
    assert.equal(error.url, loadable.src || loadable.href);
    assert(error.cause instanceof Error);
  }
}

function resourceLoadingErrorRecordingVC() {
  const virtualConsole = new VirtualConsole();
  virtualConsole.resourceLoadingErrors = [];

  virtualConsole.forwardTo(console, { jsdomErrors: "none" });
  virtualConsole.on("jsdomError", err => {
    if (err.type === "resource-loading") {
      virtualConsole.resourceLoadingErrors.push(err);
    } else {
      // eslint-disable-next-line no-console
      console.error(err.stack);
    }
  });

  return virtualConsole;
}

// WebSocket GUID for handshake
const WS_GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

function createWebSocketServer() {
  return new Promise(resolve => {
    const server = http.createServer();
    enableDestroy(server);

    server.on("upgrade", (req, socket) => {
      const key = req.headers["sec-websocket-key"];
      const acceptKey = crypto
        .createHash("sha1")
        .update(key + WS_GUID)
        .digest("base64");

      socket.write(
        "HTTP/1.1 101 Switching Protocols\r\n" +
        "Upgrade: websocket\r\n" +
        "Connection: Upgrade\r\n" +
        `Sec-WebSocket-Accept: ${acceptKey}\r\n` +
        "\r\n"
      );

      // Keep the connection open (simple server)
      socket.on("data", () => {
        // For simplicity, just keep the connection open
      });
    });

    server.listen(() => {
      const { port } = server.address();
      server.wsURL = `ws://127.0.0.1:${port}/`;
      resolve(server);
    });
  });
}

module.exports = {
  pngBytes,
  resourceServer,
  resourceServer404,
  resourceServer503,
  neverRequestedServer,
  imageServer,
  htmlServer,
  threeRequestServer,
  createWebSocketServer,
  setUpLoadingAsserts,
  assertNotLoaded,
  assertLoaded,
  assertError,
  resourceLoadingErrorRecordingVC
};
