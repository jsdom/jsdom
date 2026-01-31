"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");
const { delay } = require("../util.js");
const canvas = require("../../lib/jsdom/utils.js").Canvas;

const { JSDOM, VirtualConsole, requestInterceptor } = require("../..");

const {
  pngBytes,
  resourceServer,
  imageServer,
  htmlServer,
  threeRequestServer,
  createWebSocketServer,
  setUpLoadingAsserts,
  assertLoaded,
  assertError,
  resourceLoadingErrorRecordingVC
} = require("./helpers/resources.js");

describe("API: resources interceptors option", () => {
  describe("passing through requests", () => {
    it("should be called for JSDOM.fromURL()'s initial request", async () => {
      const url = await htmlServer("Hello");
      let capturedElement;

      const dom = await JSDOM.fromURL(url, {
        resources: {
          interceptors: [
            requestInterceptor((request, { element }) => {
              capturedElement = element;
              return undefined; // Pass through
            })
          ]
        }
      });
      assert.equal(capturedElement, null, "Element must be null for fromURL requests");
      assert.equal(dom.window.document.body.textContent, "Hello");
    });

    it("should be called for script requests", async () => {
      const sourceString = `window.x = 5;`;
      const url = await resourceServer(
        { "Content-Type": "text/javascript", "Content-Length": sourceString.length },
        sourceString
      );
      let capturedElement;

      const virtualConsole = resourceLoadingErrorRecordingVC();
      const dom = new JSDOM(``, {
        runScripts: "dangerously",
        virtualConsole,
        resources: {
          interceptors: [
            requestInterceptor((request, { element }) => {
              capturedElement = element;
              return undefined;
            })
          ]
        }
      });

      const element = dom.window.document.createElement("script");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      await assertLoaded(element, virtualConsole);
      assert.equal(capturedElement, element, "Element context must be the correct element");
      assert.equal(dom.window.x, 5);
    });

    it("should be called for stylesheet requests", async () => {
      const sourceString = `body { color: blue; }`;
      const url = await resourceServer(
        { "Content-Type": "text/css", "Content-Length": sourceString.length },
        sourceString
      );
      let capturedElement;

      const virtualConsole = resourceLoadingErrorRecordingVC();
      const dom = new JSDOM(``, {
        resources: {
          interceptors: [
            requestInterceptor((request, { element }) => {
              capturedElement = element;
              return undefined;
            })
          ]
        },
        virtualConsole
      });

      const element = dom.window.document.createElement("link");
      setUpLoadingAsserts(element);
      element.rel = "stylesheet";
      element.href = url;
      dom.window.document.body.appendChild(element);

      await assertLoaded(element, virtualConsole);
      assert.equal(capturedElement, element, "Element context must be the correct element");
      assert.equal(dom.window.getComputedStyle(dom.window.document.body).color, "rgb(0, 0, 255)");
    });

    if (canvas) {
      it("should be called for image requests [canvas is installed]", async () => {
        const url = await imageServer();
        let capturedElement;

        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(``, {
          resources: {
            interceptors: [
              requestInterceptor((request, { element }) => {
                capturedElement = element;
                return undefined;
              })
            ]
          },
          virtualConsole
        });

        const element = dom.window.document.createElement("img");
        setUpLoadingAsserts(element);
        element.src = url;
        dom.window.document.body.appendChild(element);

        await assertLoaded(element, virtualConsole);
        assert.equal(capturedElement, element, "Element context must be the correct element");
      });
    }

    it("should be called for iframe requests", async () => {
      const url = await htmlServer("Hello");
      let capturedElement;

      const virtualConsole = resourceLoadingErrorRecordingVC();
      const dom = new JSDOM(``, {
        resources: {
          interceptors: [
            requestInterceptor((request, { element }) => {
              capturedElement = element;
              return undefined;
            })
          ]
        },
        virtualConsole
      });

      const element = dom.window.document.createElement("iframe");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      await assertLoaded(element, virtualConsole);
      assert.equal(capturedElement, element, "Element context must be the correct element");
      assert.equal(dom.window.frames[0].document.body.textContent, "Hello");
    });

    it("should be called for frame requests", async () => {
      const url = await htmlServer("Hello");
      let capturedElement;

      const virtualConsole = resourceLoadingErrorRecordingVC();
      const dom = new JSDOM(`<frameset></frameset>`, {
        resources: {
          interceptors: [
            requestInterceptor((request, { element }) => {
              capturedElement = element;
              return undefined;
            })
          ]
        },
        virtualConsole
      });

      const element = dom.window.document.createElement("frame");
      setUpLoadingAsserts(element);
      element.src = url;
      dom.window.document.body.appendChild(element);

      await assertLoaded(element, virtualConsole);
      assert.equal(capturedElement, element, "Element context must be the correct element");
      assert.equal(dom.window.frames[0].document.body.textContent, "Hello");
    });

    it("should be called for WebSocket connection requests", async () => {
      const wsServer = await createWebSocketServer();
      let capturedElement, capturedURL;

      const dom = new JSDOM(``, {
        url: "http://example.com/",
        resources: {
          interceptors: [
            requestInterceptor((request, { element }) => {
              capturedElement = element;
              capturedURL = request.url;
              return undefined;
            })
          ]
        }
      });

      const ws = new dom.window.WebSocket(wsServer.wsURL);
      const openPromise = new Promise((resolve, reject) => {
        ws.onopen = resolve;
        ws.onerror = reject;
      });

      await openPromise;
      ws.close();
      wsServer.destroy();

      assert.equal(capturedElement, null, "Element must be null for WebSocket requests");
      // WebSocket URLs are converted to http:// for the upgrade request
      const expectedHttpURL = wsServer.wsURL.replace("ws://", "http://");
      assert.equal(capturedURL, expectedHttpURL, "WebSocket URL must be captured (as http://)");
    });

    it("should allow logging multiple request types without modifying them", async () => {
      const requestedURLs = [];
      const [mainServer, mainHost] = await threeRequestServer();

      const options = {
        runScripts: "dangerously",
        resources: {
          interceptors: [
            requestInterceptor(request => {
              requestedURLs.push(request.url);
              return undefined; // Pass through
            })
          ]
        }
      };
      const dom = await JSDOM.fromURL(mainHost + "/html", options);

      await new Promise(resolve => {
        dom.window.done = resolve;
      });

      assert.equal(requestedURLs.length, 3);
      assert.ok(requestedURLs.some(url => url.endsWith("/html")), "Should have requested /html");
      assert.ok(requestedURLs.some(url => url.endsWith("/js")), "Should have requested /js");
      assert.ok(requestedURLs.some(url => url.endsWith("/xhr")), "Should have requested /xhr");

      mainServer.destroy();
    });
  });

  describe("synthetic responses", () => {
    function toStream(data) {
      const bytes = typeof data === "string" ? new TextEncoder().encode(data) : data;
      return new ReadableStream({
        async start(controller) {
          // Split into small chunks to test streaming
          const chunkSize = Math.ceil(bytes.length / 3);
          for (let i = 0; i < bytes.length; i += chunkSize) {
            await delay(1);
            controller.enqueue(bytes.slice(i, i + chunkSize));
          }
          controller.close();
        }
      });
    }

    describe("string bodies", () => {
      it("should work for JSDOM.fromURL()'s initial request", async () => {
        let capturedElement;

        const dom = await JSDOM.fromURL("http://example.com/test", {
          resources: {
            interceptors: [
              requestInterceptor((request, { element }) => {
                capturedElement = element;
                return new Response("<html><body>Mocked content</body></html>", {
                  headers: { "Content-Type": "text/html" }
                });
              })
            ]
          }
        });
        assert.equal(capturedElement, null, "Element must be null for fromURL requests");
        assert.equal(dom.window.document.body.textContent, "Mocked content");
      });

      it("should work for script requests", async () => {
        let scriptRanResolve;
        const scriptRanPromise = new Promise(resolve => {
          scriptRanResolve = resolve;
        });
        let capturedElement = null;

        const dom = new JSDOM(`<script src="/test.js"></script>`, {
          url: "http://example.com/",
          runScripts: "dangerously",
          resources: {
            interceptors: [
              requestInterceptor((request, { element }) => {
                if (request.url.endsWith("/test.js")) {
                  capturedElement = element;
                  return new Response("window.mocked = true; window.scriptDone();", {
                    headers: { "Content-Type": "application/javascript" }
                  });
                }
                return undefined;
              })
            ]
          }
        });

        dom.window.scriptDone = scriptRanResolve;
        await scriptRanPromise;
        assert.equal(dom.window.mocked, true, "The mocked script must have run");
        assert.equal(
          capturedElement,
          dom.window.document.querySelector("script"),
          "Element context must be the correct element"
        );
      });

      it("should work for stylesheet requests", async () => {
        let capturedElement = null;
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(``, {
          url: "http://example.com/",
          resources: {
            interceptors: [
              requestInterceptor((request, { element }) => {
                if (request.url.endsWith("/test.css")) {
                  capturedElement = element;
                  return new Response("body { color: blue; }", {
                    headers: { "Content-Type": "text/css" }
                  });
                }
                return undefined;
              })
            ]
          },
          virtualConsole
        });

        const element = dom.window.document.createElement("link");
        setUpLoadingAsserts(element);
        element.rel = "stylesheet";
        element.href = "/test.css";
        dom.window.document.body.appendChild(element);

        await assertLoaded(element, virtualConsole);
        assert.equal(dom.window.getComputedStyle(dom.window.document.body).color, "rgb(0, 0, 255)");
        assert.equal(capturedElement, element, "Element context must be the correct element");
      });

      if (canvas) {
        it("should work for image requests [canvas is installed]", async () => {
          let capturedElement = null;
          const virtualConsole = resourceLoadingErrorRecordingVC();
          const dom = new JSDOM(``, {
            url: "http://example.com/",
            resources: {
              interceptors: [
                requestInterceptor((request, { element }) => {
                  if (request.url.endsWith("/test.png")) {
                    capturedElement = element;
                    return new Response(pngBytes, {
                      headers: { "Content-Type": "image/png" }
                    });
                  }
                  return undefined;
                })
              ]
            },
            virtualConsole
          });

          const element = dom.window.document.createElement("img");
          setUpLoadingAsserts(element);
          element.src = "/test.png";
          dom.window.document.body.appendChild(element);

          await assertLoaded(element, virtualConsole);
          assert.equal(capturedElement, element, "Element context must be the correct element");
        });
      }

      it("should work for iframe requests", async () => {
        let capturedElement = null;
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(``, {
          url: "http://example.com/",
          resources: {
            interceptors: [
              requestInterceptor((request, { element }) => {
                if (request.url.endsWith("/frame.html")) {
                  capturedElement = element;
                  return new Response("<html><body>Mocked iframe</body></html>", {
                    headers: { "Content-Type": "text/html" }
                  });
                }
                return undefined;
              })
            ]
          },
          virtualConsole
        });

        const element = dom.window.document.createElement("iframe");
        setUpLoadingAsserts(element);
        element.src = "/frame.html";
        dom.window.document.body.appendChild(element);

        await assertLoaded(element, virtualConsole);
        assert.equal(dom.window.frames[0].document.body.textContent, "Mocked iframe");
        assert.equal(capturedElement, element, "Element context must be the correct element");
      });

      it("should work for frame requests", async () => {
        let capturedElement = null;
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(`<frameset></frameset>`, {
          url: "http://example.com/",
          resources: {
            interceptors: [
              requestInterceptor((request, { element }) => {
                if (request.url.endsWith("/frame.html")) {
                  capturedElement = element;
                  return new Response("<html><body>Mocked frame</body></html>", {
                    headers: { "Content-Type": "text/html" }
                  });
                }
                return undefined;
              })
            ]
          },
          virtualConsole
        });

        const element = dom.window.document.createElement("frame");
        setUpLoadingAsserts(element);
        element.src = "/frame.html";
        dom.window.document.body.appendChild(element);

        await assertLoaded(element, virtualConsole);
        assert.equal(dom.window.frames[0].document.body.textContent, "Mocked frame");
        assert.equal(capturedElement, element, "Element context must be the correct element");
      });

      it("should work for XHR requests", async () => {
        let capturedElement;

        const dom = new JSDOM(``, {
          url: "http://example.com/",
          resources: {
            interceptors: [
              requestInterceptor((request, { element }) => {
                if (request.url.endsWith("/api/data")) {
                  capturedElement = element;
                  return new Response('{"mocked": true}', {
                    headers: { "Content-Type": "application/json" }
                  });
                }
                return undefined;
              })
            ]
          }
        });

        const xhr = new dom.window.XMLHttpRequest();
        const loadPromise = new Promise(resolve => {
          xhr.onload = resolve;
        });
        xhr.open("GET", "/api/data");
        xhr.send();

        await loadPromise;
        assert.equal(capturedElement, null, "Element must be null for XHR requests");
        assert.equal(xhr.responseText, '{"mocked": true}');
      });

      it("should cause WebSocket connection to fail", async () => {
        const dom = new JSDOM(``, {
          url: "http://example.com/",
          resources: {
            interceptors: [
              requestInterceptor(() => {
                return new Response("Not a WebSocket upgrade", {
                  status: 200,
                  headers: { "Content-Type": "text/plain" }
                });
              })
            ]
          }
        });

        const ws = new dom.window.WebSocket("ws://example.com/socket");
        const errorPromise = new Promise(resolve => {
          ws.onerror = resolve;
        });

        await errorPromise;
        assert.equal(ws.readyState, dom.window.WebSocket.CLOSED);
      });
    });

    describe("ReadableStream bodies", () => {
      it("should work for JSDOM.fromURL()'s initial request", async () => {
        let capturedElement;

        const dom = await JSDOM.fromURL("http://example.com/test", {
          resources: {
            interceptors: [
              requestInterceptor((request, { element }) => {
                capturedElement = element;
                return new Response(toStream("<html><body>Mocked content</body></html>"), {
                  headers: { "Content-Type": "text/html" }
                });
              })
            ]
          }
        });
        assert.equal(capturedElement, null, "Element must be null for fromURL requests");
        assert.equal(dom.window.document.body.textContent, "Mocked content");
      });

      it("should work for script requests", async () => {
        let scriptRanResolve;
        const scriptRanPromise = new Promise(resolve => {
          scriptRanResolve = resolve;
        });
        let capturedElement = null;

        const dom = new JSDOM(`<script src="/test.js"></script>`, {
          url: "http://example.com/",
          runScripts: "dangerously",
          resources: {
            interceptors: [
              requestInterceptor((request, { element }) => {
                if (request.url.endsWith("/test.js")) {
                  capturedElement = element;
                  return new Response(toStream("window.mocked = true; window.scriptDone();"), {
                    headers: { "Content-Type": "application/javascript" }
                  });
                }
                return undefined;
              })
            ]
          }
        });

        dom.window.scriptDone = scriptRanResolve;
        await scriptRanPromise;
        assert.equal(dom.window.mocked, true, "The mocked script must have run");
        assert.equal(
          capturedElement,
          dom.window.document.querySelector("script"),
          "Element context must be the correct element"
        );
      });

      it("should work for stylesheet requests", async () => {
        let capturedElement = null;
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(``, {
          url: "http://example.com/",
          resources: {
            interceptors: [
              requestInterceptor((request, { element }) => {
                if (request.url.endsWith("/test.css")) {
                  capturedElement = element;
                  return new Response(toStream("body { color: blue; }"), {
                    headers: { "Content-Type": "text/css" }
                  });
                }
                return undefined;
              })
            ]
          },
          virtualConsole
        });

        const element = dom.window.document.createElement("link");
        setUpLoadingAsserts(element);
        element.rel = "stylesheet";
        element.href = "/test.css";
        dom.window.document.body.appendChild(element);

        await assertLoaded(element, virtualConsole);
        assert.equal(dom.window.getComputedStyle(dom.window.document.body).color, "rgb(0, 0, 255)");
        assert.equal(capturedElement, element, "Element context must be the correct element");
      });

      if (canvas) {
        it("should work for image requests [canvas is installed]", async () => {
          let capturedElement = null;
          const virtualConsole = resourceLoadingErrorRecordingVC();
          const dom = new JSDOM(``, {
            url: "http://example.com/",
            resources: {
              interceptors: [
                requestInterceptor((request, { element }) => {
                  if (request.url.endsWith("/test.png")) {
                    capturedElement = element;
                    return new Response(toStream(pngBytes), {
                      headers: { "Content-Type": "image/png" }
                    });
                  }
                  return undefined;
                })
              ]
            },
            virtualConsole
          });

          const element = dom.window.document.createElement("img");
          setUpLoadingAsserts(element);
          element.src = "/test.png";
          dom.window.document.body.appendChild(element);

          await assertLoaded(element, virtualConsole);
          assert.equal(capturedElement, element, "Element context must be the correct element");
        });
      }

      it("should work for iframe requests", async () => {
        let capturedElement = null;
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(``, {
          url: "http://example.com/",
          resources: {
            interceptors: [
              requestInterceptor((request, { element }) => {
                if (request.url.endsWith("/frame.html")) {
                  capturedElement = element;
                  return new Response(toStream("<html><body>Mocked iframe</body></html>"), {
                    headers: { "Content-Type": "text/html" }
                  });
                }
                return undefined;
              })
            ]
          },
          virtualConsole
        });

        const element = dom.window.document.createElement("iframe");
        setUpLoadingAsserts(element);
        element.src = "/frame.html";
        dom.window.document.body.appendChild(element);

        await assertLoaded(element, virtualConsole);
        assert.equal(dom.window.frames[0].document.body.textContent, "Mocked iframe");
        assert.equal(capturedElement, element, "Element context must be the correct element");
      });

      it("should work for frame requests", async () => {
        let capturedElement = null;
        const virtualConsole = resourceLoadingErrorRecordingVC();
        const dom = new JSDOM(`<frameset></frameset>`, {
          url: "http://example.com/",
          resources: {
            interceptors: [
              requestInterceptor((request, { element }) => {
                if (request.url.endsWith("/frame.html")) {
                  capturedElement = element;
                  return new Response(toStream("<html><body>Mocked frame</body></html>"), {
                    headers: { "Content-Type": "text/html" }
                  });
                }
                return undefined;
              })
            ]
          },
          virtualConsole
        });

        const element = dom.window.document.createElement("frame");
        setUpLoadingAsserts(element);
        element.src = "/frame.html";
        dom.window.document.body.appendChild(element);

        await assertLoaded(element, virtualConsole);
        assert.equal(dom.window.frames[0].document.body.textContent, "Mocked frame");
        assert.equal(capturedElement, element, "Element context must be the correct element");
      });

      it("should work for XHR requests", async () => {
        let capturedElement;

        const dom = new JSDOM(``, {
          url: "http://example.com/",
          resources: {
            interceptors: [
              requestInterceptor((request, { element }) => {
                if (request.url.endsWith("/api/data")) {
                  capturedElement = element;
                  return new Response(toStream('{"mocked": true}'), {
                    headers: { "Content-Type": "application/json" }
                  });
                }
                return undefined;
              })
            ]
          }
        });

        const xhr = new dom.window.XMLHttpRequest();
        const loadPromise = new Promise(resolve => {
          xhr.onload = resolve;
        });
        xhr.open("GET", "/api/data");
        xhr.send();

        await loadPromise;
        assert.equal(capturedElement, null, "Element must be null for XHR requests");
        assert.equal(xhr.responseText, '{"mocked": true}');
      });
    });

    describe("null bodies", () => {
      it("should work for JSDOM.fromURL()'s initial request", async () => {
        const dom = await JSDOM.fromURL("http://example.com/test", {
          resources: {
            interceptors: [
              requestInterceptor(() => {
                return new Response(null, {
                  headers: { "Content-Type": "text/html" }
                });
              })
            ]
          }
        });
        assert.equal(dom.window.document.body.textContent, "");
      });

      it("should work for script requests", async () => {
        const virtualConsole = resourceLoadingErrorRecordingVC();

        const dom = new JSDOM(``, {
          url: "http://example.com/",
          runScripts: "dangerously",
          virtualConsole,
          resources: {
            interceptors: [
              requestInterceptor(request => {
                if (request.url.endsWith("/test.js")) {
                  return new Response(null, {
                    headers: { "Content-Type": "application/javascript" }
                  });
                }
                return undefined;
              })
            ]
          }
        });

        dom.window.x = "unchanged";
        const element = dom.window.document.createElement("script");
        setUpLoadingAsserts(element);
        element.src = "/test.js";
        dom.window.document.body.appendChild(element);

        await assertLoaded(element, virtualConsole);
        assert.equal(dom.window.x, "unchanged", "Empty script should not change anything");
      });
    });

    describe("multiple Set-Cookie headers", () => {
      it("should preserve all Set-Cookie headers for JSDOM.fromURL()", async () => {
        const headers = new Headers([
          ["Content-Type", "text/html"],
          ["Set-Cookie", "a=1"],
          ["Set-Cookie", "b=2"],
          ["Set-Cookie", "c=3"]
        ]);

        const dom = await JSDOM.fromURL("http://example.com/test", {
          resources: {
            interceptors: [
              requestInterceptor(() => {
                return new Response("<html><body>Hello</body></html>", { headers });
              })
            ]
          }
        });

        assert.equal(dom.window.document.cookie, "a=1; b=2; c=3");
      });
    });
  });

  describe("async interceptors", () => {
    it("should support async interceptors that return a Response", async () => {
      const dom = await JSDOM.fromURL("http://example.com/test", {
        resources: {
          interceptors: [
            requestInterceptor(async () => {
              await delay(1);
              return new Response("<html><body>Async mocked</body></html>", {
                headers: { "Content-Type": "text/html" }
              });
            })
          ]
        }
      });
      assert.equal(dom.window.document.body.textContent, "Async mocked");
    });

    it("should support async interceptors that pass through", async () => {
      const url = await htmlServer("Hello from server");
      let called = false;

      const dom = await JSDOM.fromURL(url, {
        resources: {
          interceptors: [
            requestInterceptor(async () => {
              await delay(1);
              called = true;
              return undefined; // Pass through
            })
          ]
        }
      });
      assert.equal(called, true);
      assert.equal(dom.window.document.body.textContent, "Hello from server");
    });

    it("should maintain script execution order regardless of interceptor timing", async () => {
      // Script1 uses async delay, script2 returns immediately
      // Script1 should execute before script2 even though script2's response is ready first
      let script1Resolve, allDoneResolve;
      const script1Promise = new Promise(resolve => {
        script1Resolve = resolve;
      });
      const allDonePromise = new Promise(resolve => {
        allDoneResolve = resolve;
      });

      const dom = new JSDOM(
        `<script src="/script1.js"></script><script src="/script2.js"></script>`,
        {
          url: "http://example.com/",
          runScripts: "dangerously",
          resources: {
            interceptors: [
              requestInterceptor(async request => {
                if (request.url.endsWith("/script1.js")) {
                  // Wait for signal before returning - simulates async file read
                  await script1Promise;
                  return new Response("window.order = (window.order || '') + '1';", {
                    headers: { "Content-Type": "application/javascript" }
                  });
                }
                if (request.url.endsWith("/script2.js")) {
                  // Sync response - ready immediately
                  return new Response("window.order = (window.order || '') + '2'; window.allDone();", {
                    headers: { "Content-Type": "application/javascript" }
                  });
                }
                return undefined;
              })
            ]
          }
        }
      );

      dom.window.allDone = allDoneResolve;

      // Release script1's interceptor after a microtask, so script2's response is "ready" first
      Promise.resolve().then(() => script1Resolve());

      await allDonePromise;
      assert.equal(dom.window.order, "12", "Scripts must run in document order (1 before 2)");
    });
  });

  describe("composition", () => {
    describe("with requestInterceptor helper", () => {
      it("should call both interceptors in order when both pass through", async () => {
        const url = await htmlServer("Hello from server");
        const callOrder = [];

        const dom = await JSDOM.fromURL(url, {
          resources: {
            interceptors: [
              requestInterceptor(() => {
                callOrder.push("first");
                return undefined;
              }),
              requestInterceptor(() => {
                callOrder.push("second");
                return undefined;
              })
            ]
          }
        });

        assert.deepEqual(callOrder, ["first", "second"], "Interceptors must run in order");
        assert.equal(dom.window.document.body.textContent, "Hello from server");
      });

      it("should use second interceptor's response when first passes through", async () => {
        const url = await htmlServer("Hello from server");
        const callOrder = [];

        const dom = await JSDOM.fromURL(url, {
          resources: {
            interceptors: [
              requestInterceptor(() => {
                callOrder.push("first");
                return undefined;
              }),
              requestInterceptor(() => {
                callOrder.push("second");
                return new Response("<html><body>From second</body></html>", {
                  headers: { "Content-Type": "text/html" }
                });
              })
            ]
          }
        });

        assert.deepEqual(callOrder, ["first", "second"], "Both interceptors must run");
        assert.equal(dom.window.document.body.textContent, "From second");
      });

      it("should use first interceptor's response and skip second when first returns synthetic", async () => {
        const callOrder = [];

        const dom = await JSDOM.fromURL("http://example.com/test", {
          resources: {
            interceptors: [
              requestInterceptor(() => {
                callOrder.push("first");
                return new Response("<html><body>From first</body></html>", {
                  headers: { "Content-Type": "text/html" }
                });
              }),
              requestInterceptor(() => {
                callOrder.push("second");
                return undefined;
              })
            ]
          }
        });

        assert.deepEqual(callOrder, ["first"], "Only first interceptor must run");
        assert.equal(dom.window.document.body.textContent, "From first");
      });

      it("should use first interceptor's response and skip second when both return synthetic", async () => {
        const callOrder = [];

        const dom = await JSDOM.fromURL("http://example.com/test", {
          resources: {
            interceptors: [
              requestInterceptor(() => {
                callOrder.push("first");
                return new Response("<html><body>From first</body></html>", {
                  headers: { "Content-Type": "text/html" }
                });
              }),
              requestInterceptor(() => {
                callOrder.push("second");
                return new Response("<html><body>From second</body></html>", {
                  headers: { "Content-Type": "text/html" }
                });
              })
            ]
          }
        });

        assert.deepEqual(callOrder, ["first"], "Only first interceptor must run");
        assert.equal(dom.window.document.body.textContent, "From first");
      });

      it("should call both interceptors for WebSocket requests", async () => {
        const wsServer = await createWebSocketServer();
        const callOrder = [];

        const dom = new JSDOM(``, {
          url: "http://example.com/",
          resources: {
            interceptors: [
              requestInterceptor(() => {
                callOrder.push("first");
                return undefined;
              }),
              requestInterceptor(() => {
                callOrder.push("second");
                return undefined;
              })
            ]
          }
        });

        const ws = new dom.window.WebSocket(wsServer.wsURL);
        const openPromise = new Promise((resolve, reject) => {
          ws.onopen = resolve;
          ws.onerror = reject;
        });

        await openPromise;
        ws.close();
        wsServer.destroy();

        assert.deepEqual(callOrder, ["first", "second"], "Both interceptors must run for WebSocket");
      });
    });

    describe("with raw undici interceptors", () => {
      it("should call both interceptors in order", async () => {
        const url = await htmlServer("Hello from server");
        const callOrder = [];

        function firstInterceptor(dispatch) {
          return function (opts, handler) {
            callOrder.push("first");
            return dispatch(opts, handler);
          };
        }

        function secondInterceptor(dispatch) {
          return function (opts, handler) {
            callOrder.push("second");
            return dispatch(opts, handler);
          };
        }

        const dom = await JSDOM.fromURL(url, {
          resources: {
            interceptors: [firstInterceptor, secondInterceptor]
          }
        });

        assert.deepEqual(callOrder, ["first", "second"], "Interceptors must run in order");
        assert.equal(dom.window.document.body.textContent, "Hello from server");
      });

      it("should allow interceptors to modify opts.opaque", async () => {
        const url = await htmlServer("Hello from server");
        let secondSawCustomData = false;

        function firstInterceptor(dispatch) {
          return function (opts, handler) {
            opts.opaque = { ...opts.opaque, customData: "from first interceptor" };
            return dispatch(opts, handler);
          };
        }

        function secondInterceptor(dispatch) {
          return function (opts, handler) {
            secondSawCustomData = opts.opaque?.customData === "from first interceptor";
            return dispatch(opts, handler);
          };
        }

        const dom = await JSDOM.fromURL(url, {
          resources: {
            interceptors: [firstInterceptor, secondInterceptor]
          }
        });

        assert.equal(secondSawCustomData, true, "Second interceptor must see data added by first");
        assert.equal(dom.window.document.body.textContent, "Hello from server");
      });

      it("should work when mixed with requestInterceptor helpers", async () => {
        const url = await htmlServer("Hello from server");
        const callOrder = [];

        function rawInterceptor(dispatch) {
          return function (opts, handler) {
            callOrder.push("raw");
            return dispatch(opts, handler);
          };
        }

        const dom = await JSDOM.fromURL(url, {
          resources: {
            interceptors: [
              rawInterceptor,
              requestInterceptor(() => {
                callOrder.push("helper");
                return undefined;
              })
            ]
          }
        });

        assert.deepEqual(callOrder, ["raw", "helper"], "Both interceptor types must work together");
        assert.equal(dom.window.document.body.textContent, "Hello from server");
      });

      it("should call both interceptors for WebSocket requests", async () => {
        const wsServer = await createWebSocketServer();
        const callOrder = [];

        function firstInterceptor(dispatch) {
          return function (opts, handler) {
            callOrder.push("first");
            return dispatch(opts, handler);
          };
        }

        function secondInterceptor(dispatch) {
          return function (opts, handler) {
            callOrder.push("second");
            return dispatch(opts, handler);
          };
        }

        const dom = new JSDOM(``, {
          url: "http://example.com/",
          resources: {
            interceptors: [firstInterceptor, secondInterceptor]
          }
        });

        const ws = new dom.window.WebSocket(wsServer.wsURL);
        const openPromise = new Promise((resolve, reject) => {
          ws.onopen = resolve;
          ws.onerror = reject;
        });

        await openPromise;
        ws.close();
        wsServer.destroy();

        assert.deepEqual(callOrder, ["first", "second"], "Both interceptors must run for WebSocket");
      });
    });
  });

  describe("canceling requests", () => {
    it("should abort the request signal synchronously when window.close() is called", async () => {
      let interceptorCalledResolve, interceptorCalledReject, capturedWindow;
      const interceptorCalledPromise = new Promise((resolve, reject) => {
        interceptorCalledResolve = resolve;
        interceptorCalledReject = reject;
      });

      const dom = new JSDOM(``, {
        url: "http://example.com/",
        runScripts: "dangerously",
        resources: {
          interceptors: [
            requestInterceptor(request => {
              try {
                const { signal } = request;

                // Signal should not be aborted before window.close()
                assert.equal(signal.aborted, false, "Signal must not be aborted before window.close()");

                // Call window.close() synchronously within the interceptor
                capturedWindow.close();

                // The signal should be aborted synchronously
                assert.equal(signal.aborted, true, "Signal must be aborted synchronously after window.close()");
                assert(
                  signal.reason instanceof globalThis.DOMException,
                  "Signal reason must be a DOMException"
                );
                assert.equal(signal.reason.name, "AbortError", "Signal reason must be an AbortError");

                interceptorCalledResolve();
              } catch (e) {
                interceptorCalledReject(e);
              }

              // Return a synthetic response to complete the request
              return new Response("", { headers: { "Content-Type": "application/javascript" } });
            })
          ]
        }
      });

      capturedWindow = dom.window;

      const element = dom.window.document.createElement("script");
      element.src = "/test.js";
      dom.window.document.body.appendChild(element);

      await interceptorCalledPromise;
    });
  });

  describe("error handling", () => {
    describe("invalid return values", () => {
      it("should cause a jsdomError if interceptor returns null for a script", async () => {
        const virtualConsole = new VirtualConsole();
        const jsdomErrorPromise = new Promise(resolve => {
          virtualConsole.on("jsdomError", resolve);
        });

        // eslint-disable-next-line no-new
        new JSDOM(`<script src="/test.js"></script>`, {
          url: "http://example.com/",
          runScripts: "dangerously",
          virtualConsole,
          resources: {
            interceptors: [requestInterceptor(() => null)]
          }
        });

        const jsdomError = await jsdomErrorPromise;

        assert(jsdomError.cause instanceof TypeError, "The cause should be a TypeError");
        assert(
          jsdomError.cause.message.includes("must return undefined or a Response"),
          `Error message should mention valid return types, got: ${jsdomError.cause.message}`
        );
      });

      it("should cause a jsdomError if interceptor returns a random object for a script", async () => {
        const virtualConsole = new VirtualConsole();
        const jsdomErrorPromise = new Promise(resolve => {
          virtualConsole.on("jsdomError", resolve);
        });

        // eslint-disable-next-line no-new
        new JSDOM(`<script src="/test.js"></script>`, {
          url: "http://example.com/",
          runScripts: "dangerously",
          virtualConsole,
          resources: {
            interceptors: [requestInterceptor(() => ({ status: 200, body: "fake" }))]
          }
        });

        const jsdomError = await jsdomErrorPromise;

        assert(jsdomError.cause instanceof TypeError, "The cause should be a TypeError");
        assert(
          jsdomError.cause.message.includes("must return undefined or a Response"),
          `Error message should mention valid return types, got: ${jsdomError.cause.message}`
        );
      });

      it("should reject fromURL() if interceptor returns null", async () => {
        await assert.rejects(
          () => JSDOM.fromURL("http://example.com/", {
            resources: {
              interceptors: [requestInterceptor(() => null)]
            }
          }),
          err => {
            assert(err instanceof TypeError, "Should reject with TypeError");
            assert(
              err.message.includes("must return undefined or a Response"),
              `Error message should mention valid return types, got: ${err.message}`
            );
            return true;
          }
        );
      });

      it("should reject fromURL() if interceptor returns a random object", async () => {
        await assert.rejects(
          () => JSDOM.fromURL("http://example.com/", {
            resources: {
              interceptors: [requestInterceptor(() => ({ status: 200, body: "fake" }))]
            }
          }),
          err => {
            assert(err instanceof TypeError, "Should reject with TypeError");
            assert(
              err.message.includes("must return undefined or a Response"),
              `Error message should mention valid return types, got: ${err.message}`
            );
            return true;
          }
        );
      });
    });

    describe("interceptor throws", () => {
      it("should reject fromURL() when interceptor throws synchronously", async () => {
        const expectedError = new Error("Interceptor sync error");

        await assert.rejects(
          () => JSDOM.fromURL("http://example.com/", {
            resources: {
              interceptors: [
                requestInterceptor(() => {
                  throw expectedError;
                })
              ]
            }
          }),
          expectedError
        );
      });

      it("should fire script.onerror when interceptor throws synchronously", async () => {
        const expectedError = new Error("Interceptor sync error for script");
        const virtualConsole = resourceLoadingErrorRecordingVC();

        const dom = new JSDOM(``, {
          url: "http://example.com/",
          runScripts: "dangerously",
          virtualConsole,
          resources: {
            interceptors: [
              requestInterceptor(() => {
                throw expectedError;
              })
            ]
          }
        });

        const element = dom.window.document.createElement("script");
        setUpLoadingAsserts(element);
        element.src = "/test.js";
        dom.window.document.body.appendChild(element);

        await assertError(element, virtualConsole);
        assert.equal(virtualConsole.resourceLoadingErrors[0].cause, expectedError);
      });
    });

    describe("streaming errors", () => {
      it("should reject fromURL() when ReadableStream errors mid-stream", async () => {
        const streamError = new Error("Stream failed mid-way");

        await assert.rejects(
          () => JSDOM.fromURL("http://example.com/test", {
            resources: {
              interceptors: [
                requestInterceptor(() => {
                  const stream = new ReadableStream({
                    async start(controller) {
                      controller.enqueue(new TextEncoder().encode("<html><body>"));
                      await delay(1);
                      controller.error(streamError);
                    }
                  });
                  return new Response(stream, {
                    headers: { "Content-Type": "text/html" }
                  });
                })
              ]
            }
          }),
          streamError
        );
      });

      it("should fire script.onerror when ReadableStream errors mid-stream", async () => {
        const streamError = new Error("Stream failed mid-way for script");
        const virtualConsole = resourceLoadingErrorRecordingVC();

        const dom = new JSDOM(``, {
          url: "http://example.com/",
          runScripts: "dangerously",
          virtualConsole,
          resources: {
            interceptors: [
              requestInterceptor(request => {
                if (request.url.endsWith("/test.js")) {
                  const stream = new ReadableStream({
                    async start(controller) {
                      controller.enqueue(new TextEncoder().encode("window.x = "));
                      await delay(1);
                      controller.error(streamError);
                    }
                  });
                  return new Response(stream, {
                    headers: { "Content-Type": "application/javascript" }
                  });
                }
                return undefined;
              })
            ]
          }
        });

        const element = dom.window.document.createElement("script");
        setUpLoadingAsserts(element);
        element.src = "/test.js";
        dom.window.document.body.appendChild(element);

        await assertError(element, virtualConsole);
        assert.equal(virtualConsole.resourceLoadingErrors[0].cause, streamError);
      });
    });
  });
});
