"use strict";
const path = require("path");
const fs = require("fs");
const crypto = require("crypto");
const http = require("http");
const { after } = require("mocha-sugar-free");
const enableDestroy = require("server-destroy");

const pngBytes = fs.readFileSync(path.resolve(__dirname, "../fixtures/resources/transparent.png"));

// Track all created servers for cleanup.
const activeServers = new Set();

/** Returns the base URL (without trailing slash) for a running server. */
function serverURL(server, { host = "127.0.0.1", scheme = "http" } = {}) {
  return scheme + "://" + host + ":" + server.address().port;
}

/**
 * Creates an HTTP server that is tracked for automatic cleanup at the end of the test suite.
 * Callers should call server.destroy() when done; any still-alive servers are force-destroyed
 * by the mocha `after()` hook.
 */
function createServer(handler) {
  return new Promise(resolve => {
    const server = http.createServer(handler);
    enablePromisifiedServerDestroy(server);
    activeServers.add(server);
    server.listen(() => resolve(server));
  });
}

// Clean up any servers that weren't explicitly destroyed (e.g., due to test timeout).
// This runs once at the very end of all tests.
after(async () => {
  const serversToDestroy = [...activeServers];
  activeServers.clear();
  await Promise.all(serversToDestroy.map(server => server.destroy().catch(() => {})));
});

function enablePromisifiedServerDestroy(server) {
  enableDestroy(server);
  const originalDestroy = server.destroy;
  server.destroy = function () {
    activeServers.delete(this);
    return new Promise((resolve, reject) => {
      originalDestroy.call(this, err => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  };
}

/**
 * Creates a one-shot server that responds with an empty body. Useful for testing error handling
 * where only the status code matters.
 * @returns {Promise<string>} The server URL.
 */
function emptyServer({ status = 200 } = {}) {
  return resourceServer(undefined, undefined, { status });
}

/**
 * Creates a one-shot server that responds with the given headers and body.
 * @returns {Promise<string>} The server URL.
 */
async function resourceServer(headers, body, { status = 200 } = {}) {
  const server = await createServer((req, res) => {
    res.writeHead(status, headers);
    res.end(body);
    server.destroy();
  });

  return serverURL(server) + "/";
}

/**
 * Creates a server that should never receive a request. If a request arrives, the returned
 * promise rejects. After 30 ms with no requests, the server self-destructs and the promise
 * resolves.
 * @returns {Promise<[string, Promise<void>]>} [url, assertionPromise]
 */
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

  return [serverURL(server) + "/", returnedPromise];
}

/**
 * Creates a one-shot server that responds with a transparent PNG image.
 * @returns {Promise<string>} The server URL.
 */
function imageServer({ status = 200 } = {}) {
  return resourceServer(
    { "Content-Type": "image/png", "Content-Length": pngBytes.byteLength },
    pngBytes,
    { status }
  );
}

/**
 * Creates a one-shot server that responds with the given string as text/html.
 * @returns {Promise<string>} The server URL.
 */
function htmlServer(sourceString = "Hello world") {
  return resourceServer(
    { "Content-Type": "text/html", "Content-Length": sourceString.length },
    sourceString
  );
}

/**
 * Creates a server with three routes (/html, /js, /xhr) that exercise a full page load:
 * the HTML loads a script, which makes an XHR request. The server tracks its number of
 * TCP connections. Callers must destroy the server manually.
 * @returns {Promise<[http.Server, string]>} [server, baseURL]
 */
async function threeRequestServer() {
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

  const server = await createServer((req, res) => {
    res.writeHead(200, { "Content-Length": routes[req.url].length });
    res.end(routes[req.url]);
  });

  server.numberOfConnections = 0;
  server.on("connection", () => {
    ++server.numberOfConnections;
  });

  return [server, serverURL(server)];
}

// WebSocket GUID for handshake
const WS_GUID = "258EAFA5-E914-47DA-95CA-C5AB0DC85B11";

/**
 * Creates a minimal WebSocket server that completes the handshake and keeps connections open.
 * Callers must destroy the server manually.
 * @returns {Promise<[http.Server, string]>} [server, wsURL]
 */
async function webSocketServer() {
  const server = await createServer();

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

    socket.on("data", () => {
      // For simplicity, just keep the connection open
    });
  });

  return [server, serverURL(server, { scheme: "ws" }) + "/"];
}

/**
 * Creates a server that streams a response slowly, allowing tests to abort mid-stream.
 * Callers must call serverState.destroy() when done.
 * @returns {Promise<[string, Object]>} [url, serverState] where serverState has
 *   headersReceived, aborted (both Promises), and destroy().
 */
async function streamingServer() {
  let headersReceivedResolve, abortedResolve;
  const headersReceived = new Promise(resolve => {
    headersReceivedResolve = resolve;
  });

  const aborted = new Promise(resolve => {
    abortedResolve = resolve;
  });

  const server = await createServer((req, res) => {
    res.writeHead(200, { "Content-Type": "text/plain" });
    res.write("start");
    headersReceivedResolve();

    // Stream slowly - write a chunk every 50ms
    const interval = setInterval(() => {
      res.write(".");
    }, 50);

    req.on("close", () => {
      clearInterval(interval);
      abortedResolve();
    });

    req.on("error", () => {
      clearInterval(interval);
    });
  });

  return [
    serverURL(server) + "/",
    {
      headersReceived,
      aborted,
      destroy: () => server.destroy()
    }
  ];
}

/**
 * Creates a one-shot server that passes the incoming request to a callback before responding.
 * Useful for asserting on request headers.
 * @returns {Promise<string>} The server URL.
 */
async function recordingServer(recorder) {
  const server = await createServer((req, res) => {
    recorder(req);

    res.writeHead(200, { "Content-Type": "text/html" });
    res.end("<p>Hello</p>");
    server.destroy();
  });

  return serverURL(server) + "/";
}

/**
 * Creates a server that 301-redirects from /1 to /2, then responds with the given body.
 * If onRedirectTarget is provided, it is called with the request to /2 before responding.
 * @returns {Promise<[string, string]>} [requestURL, responseURL]
 */
async function redirectServer(body, extraInitialResponseHeaders, ultimateResponseHeaders, onRedirectTarget) {
  const server = await createServer((req, res) => {
    if (req.url.endsWith("/1")) {
      res.writeHead(301, { Location: "/2", ...extraInitialResponseHeaders });
      res.end();
    } else if (req.url.endsWith("/2")) {
      if (onRedirectTarget) {
        onRedirectTarget(req);
      }
      res.writeHead(200, ultimateResponseHeaders);
      res.end(body);
      server.destroy();
    } else {
      throw new Error("Unexpected route hit in redirect test server");
    }
  });

  const base = serverURL(server) + "/";

  return [base + "1", base + "2"];
}

module.exports = {
  createServer,
  serverURL,
  pngBytes,
  emptyServer,
  resourceServer,
  neverRequestedServer,
  streamingServer,
  imageServer,
  htmlServer,
  threeRequestServer,
  webSocketServer,
  recordingServer,
  redirectServer
};
