"use strict";
const assert = require("node:assert/strict");
const { describe, it } = require("mocha-sugar-free");
const { delay } = require("../util.js");

const { JSDOM, VirtualConsole } = require("../..");
const jsGlobals = Object.keys(require("../../lib/jsdom/browser/js-globals.json"));

describe("API: runScripts constructor option", () => {
  describe("<script>s and eval()", () => {
    it("should not execute any scripts by default", () => {
      const dom = new JSDOM(`<body>
        <script>document.body.appendChild(document.createElement("hr"));</script>
      </body>`);

      assert.equal(dom.window.document.body.children.length, 1);
    });

    it("should not execute any scripts, even in iframes, by default (GH-1821)", () => {
      const dom = new JSDOM(`<iframe></iframe>`);
      const frameWindow = dom.window.document.querySelector("iframe").contentWindow;

      frameWindow.document.open();
      frameWindow.document.write(`<script>parent.prop = "i was executed";</script>`);
      frameWindow.document.close();

      assert.equal(dom.window.prop, undefined);
    });

    it("should execute <script>s and eval when set to \"dangerously\"", () => {
      const dom = new JSDOM(`<body>
        <script>document.body.appendChild(document.createElement("hr"));</script>
      </body>`, { runScripts: "dangerously" });
      dom.window.eval(`document.body.appendChild(document.createElement("p"));`);

      assert.equal(dom.window.document.body.children.length, 3);
    });

    it("should make window instanceof Window true from inside scripts (GH-2740)", () => {
      const dom = new JSDOM(`<body>
        <script>window.__windowInstanceofWindow = window instanceof Window;</script>
      </body>`, { runScripts: "dangerously" });
      assert.strictEqual(dom.window.__windowInstanceofWindow, true, "window instanceof Window must be true in browsers");
    });

    it("should throw when DOM methods are called through a Proxy (GH-2265)", () => {
      const dom = new JSDOM("<body></body>");
      const document = dom.window.document;
      document.body.innerHTML = "<span></span>";
      const span = document.querySelector("span");
      const proxy = new Proxy(span, {});
      assert.throws(
        () => { proxy.innerHTML = "miami"; },
        /not a valid instance of Element|Illegal invocation/
      );
    });

    it("should execute <script>s with correct location when set to \"dangerously\" and includeNodeLocations", () => {
      const virtualConsole = new VirtualConsole();
      const promise = new Promise((resolve, reject) => {
        virtualConsole.on("jsdomError", err => {
          try {
            assert.equal(err.type, "unhandled-exception");
            assert.equal(err.cause.stack.includes("at about:blank:2"), true);
            resolve();
          } catch (actualErr) {
            reject(actualErr);
          }
        });
      });

      // eslint-disable-next-line no-new
      new JSDOM(`<body>
        <script>throw new Error();</script>
      </body>`, { runScripts: "dangerously", includeNodeLocations: true, virtualConsole });

      return promise;
    });

    it("should only run eval when set to \"outside-only\"", () => {
      const dom = new JSDOM(`<body>
        <script>document.body.appendChild(document.createElement("hr"));</script>
      </body>`, { runScripts: "outside-only" });
      dom.window.eval(`document.body.appendChild(document.createElement("p"));`);

      assert.equal(dom.window.document.body.children.length, 2);
    });

    it("should ensure eval exists on iframes when set to \"outside-only\"", () => {
      const dom = new JSDOM(`<iframe></iframe>`, { runScripts: "outside-only" });
      const frameWindow = dom.window.document.querySelector("iframe").contentWindow;

      frameWindow.eval(`document.body.appendChild(document.createElement("p"));`);

      assert.equal(frameWindow.document.body.children.length, 1);
    });

    it("should execute <script>s in iframes when set to \"dangerously\"", () => {
      const dom = new JSDOM(`<iframe></iframe>`, { runScripts: "dangerously" });
      const frameWindow = dom.window.document.querySelector("iframe").contentWindow;

      frameWindow.document.open();
      frameWindow.document.write(`<script>parent.prop = "i was executed";</script>`);
      frameWindow.document.close();

      assert.equal(dom.window.prop, "i was executed");
    });
  });

  describe("<noscript> children", () => {
    it("should be considered text when runScripts is set to \"dangerously\"", () => {
      const { document } = new JSDOM(
        `<body><noscript><div></div></noscript></body>`,
        { runScripts: "dangerously" }
      ).window;

      assert.equal(document.querySelector("noscript").children.length, 0);
      assert.equal(document.querySelector("noscript").textContent, "<div></div>");
    });
    it("should be considered nodes when runScripts is set to \"outside-only\"", () => {
      const dom = new JSDOM(
        `<body><noscript><div></div></noscript></body>`,
        { runScripts: "outside-only" }
      );
      const { document } = dom.window;

      assert.equal(document.querySelector("noscript").children.length, 1);
      assert(document.querySelector("noscript").children[0] instanceof dom.window.HTMLDivElement);
    });
    it("should be considered nodes when runScripts is left undefined", () => {
      const dom = new JSDOM(`<body><noscript><div></div></noscript></body>`).window;
      const { document } = dom.window;

      assert.equal(document.querySelector("noscript").children.length, 1);
      assert(document.querySelector("noscript").children[0] instanceof dom.window.HTMLDivElement);
    });
  });

  describe("JS spec globals", () => {
    it("should include aliased globals by default", () => {
      // Sanity check that our global-generation process hasn't broken.
      assert(jsGlobals.includes("TypeError"));
      assert(jsGlobals.includes("Math"));
      assert(jsGlobals.includes("Function"));

      const dom = new JSDOM();
      for (const globalName of jsGlobals) {
        assertAliasedGlobal(dom.window, globalName);
      }
    });

    for (const optionValue of ["outside-only", "dangerously"]) {
      it(`should include fresh globals when set to "${optionValue}"`, () => {
        const dom = new JSDOM(undefined, { runScripts: optionValue });
        for (const globalName of jsGlobals) {
          assertFreshGlobal(dom.window, globalName);
        }
      });
    }
  });

  describe("event handlers", () => {
    for (const optionValue of [undefined, "outside-only"]) {
      describe(`when set to ${formatOptionValue(optionValue)}`, () => {
        function createJSDOM() {
          return new JSDOM(`<div>`, { runScripts: optionValue });
        }
        function createJSDOMWithParsedHandlers() {
          return new JSDOM(
            `<body onload="document.body.onloadRan = true;" onhashchange="document.body.onhashchangeRan = true;">
             <div onclick="document.body.onclickRan = true;"></div>`,
            { runScripts: optionValue, url: "https://example.com/" } // url set for hashchange tests
          );
        }

        describe("body onload handler set during parsing", () => {
          it("should not evaluate the handler (GH-1848)", () => {
            const dom = createJSDOMWithParsedHandlers();

            assert.equal(dom.window.document.body.onloadRan, undefined);

            return delay().then(() => {
              assert.equal(dom.window.document.body.onloadRan, undefined);
            });
          });

          it("should not generate the body or Window property", () => {
            const dom = createJSDOMWithParsedHandlers();

            assert.equal(dom.window.document.body.onload, null);
            assert.equal(dom.window.onload, null);
          });

          it("should still parse the handler as an attribute", () => {
            const { body } = createJSDOMWithParsedHandlers().window.document;

            assert.equal(body.getAttribute("onload"), "document.body.onloadRan = true;");
          });
        });

        describe("body onhashchange handler set during parsing", () => {
          it("should not evaluate the handler", () => {
            const dom = createJSDOMWithParsedHandlers();

            dom.window.location.href = "#foo";
            return delay().then(() => {
              assert.equal(dom.window.document.body.onhashchangeRan, undefined);
            });
          });

          it("should not generate the body or Window property", () => {
            const dom = createJSDOMWithParsedHandlers();

            assert.equal(dom.window.document.body.onhashchange, null);
            assert.equal(dom.window.onhashchange, null);
          });

          it("should still parse the handler as an attribute", () => {
            const { body } = createJSDOMWithParsedHandlers().window.document;

            assert.equal(body.getAttribute("onhashchange"), "document.body.onhashchangeRan = true;");
          });
        });

        describe("body onhashchange handler set via setAttribute", () => {
          it("should not evaluate the handler", () => {
            const dom = createJSDOM();
            dom.window.document.body.setAttribute("onhashchange", "document.body.onhashchangeRan = true;");

            dom.window.location.href = "#foo";
            return delay().then(() => {
              assert.equal(dom.window.document.body.onhashchangeRan, undefined);
            });
          });

          it("should not generate the body or Window property", () => {
            const dom = createJSDOM();
            dom.window.document.body.setAttribute("onhashchange", "document.body.onhashchangeRan = true;");

            assert.equal(dom.window.document.body.onhashchange, null);
            assert.equal(dom.window.onhashchange, null);
          });

          it("should still parse the handler as an attribute", () => {
            const { body } = createJSDOM().window.document;
            body.setAttribute("onhashchange", "document.body.onhashchangeRan = true;");

            assert.equal(body.getAttribute("onhashchange"), "document.body.onhashchangeRan = true;");
          });
        });

        describe("div onclick handler set during parsing", () => {
          it("should not evaluate the handler", () => {
            const dom = createJSDOMWithParsedHandlers();

            dom.window.document.querySelector("div").click();

            return delay().then(() => {
              assert.equal(dom.window.document.body.onclickRan, undefined);
            });
          });

          it("should not generate the property", () => {
            const dom = createJSDOMWithParsedHandlers();

            assert.equal(dom.window.document.querySelector("div").onclick, null);
          });

          it("should still parse the handler as an attribute", () => {
            const dom = createJSDOMWithParsedHandlers();
            const div = dom.window.document.querySelector("div");

            assert.equal(div.getAttribute("onclick"), "document.body.onclickRan = true;");
          });
        });

        describe("div onclick handler set via setAttribute", () => {
          it("should not evaluate the handler", () => {
            const dom = createJSDOM();
            const div = dom.window.document.body.querySelector("div");
            div.setAttribute("onclick", "document.body.onclickRan = true;");

            div.click();

            assert.equal(dom.window.document.body.onclickRan, undefined);
          });

          it("should not generate the property", () => {
            const dom = createJSDOM();
            const div = dom.window.document.body.querySelector("div");
            div.setAttribute("onclick", "document.body.onclickRan = true;");

            assert.equal(div.onclick, null);
          });

          it("should still parse the handler as an attribute", () => {
            const dom = createJSDOM();
            const div = dom.window.document.body.querySelector("div");
            div.setAttribute("onclick", "document.body.onclickRan = true;");

            assert.equal(div.getAttribute("onclick"), "document.body.onclickRan = true;");
          });
        });

        testEventHandlersFromTheOutside(optionValue);
      });
    }

    describe("when set to \"dangerously\"", () => {
      function createJSDOM() {
        return new JSDOM(`<div>`, { runScripts: "dangerously" });
      }
      function createJSDOMWithParsedHandlers() {
        return new JSDOM(
          `<body onload="document.body.onloadRan = true;" onhashchange="document.body.onhashchangeRan = true;">
            <div onclick="document.body.onclickRan = true;"></div>`,
          { runScripts: "dangerously", url: "https://example.com/" } // url set for hashchange tests
        );
      }

      describe("body onload handler set during parsing", () => {
        it("should evaluate the handler", () => {
          const dom = createJSDOMWithParsedHandlers();

          return delay().then(() => {
            assert.equal(dom.window.document.body.onloadRan, true);
          });
        });

        it("should generate the body and Window property", () => {
          const dom = createJSDOMWithParsedHandlers();

          assert.equal(typeof dom.window.document.body.onload, "function");
          assert.equal(typeof dom.window.onload, "function");
          assert.equal(dom.window.document.body.onload, dom.window.onload);
        });

        it("should parse the handler as an attribute", () => {
          const { body } = createJSDOMWithParsedHandlers().window.document;

          assert.equal(body.getAttribute("onload"), "document.body.onloadRan = true;");
        });
      });

      describe("body onhashchange handler set during parsing", () => {
        it("should not evaluate the handler", () => {
          const dom = createJSDOMWithParsedHandlers();

          dom.window.location.href = "#foo";
          return delay().then(() => {
            assert.equal(dom.window.document.body.onhashchangeRan, true);
          });
        });

        it("should not generate the body or Window property", () => {
          const dom = createJSDOMWithParsedHandlers();

          assert.equal(typeof dom.window.document.body.onhashchange, "function");
          assert.equal(typeof dom.window.onhashchange, "function");
          assert.equal(dom.window.document.body.onhashchange, dom.window.onhashchange);
        });

        it("should parse the handler as an attribute", () => {
          const { body } = createJSDOMWithParsedHandlers().window.document;

          assert.equal(body.getAttribute("onhashchange"), "document.body.onhashchangeRan = true;");
        });
      });

      describe("body onhashchange handler set via setAttribute", () => {
        it("should evaluate the handler", () => {
          const dom = createJSDOM();
          dom.window.document.body.setAttribute("onhashchange", "document.body.onhashchangeRan = true;");

          dom.window.location.href = "#foo";
          return delay().then(() => {
            assert.equal(dom.window.document.body.onhashchangeRan, true);
          });
        });

        it("should generate the body and Window property", () => {
          const dom = createJSDOM();
          dom.window.document.body.setAttribute("onhashchange", "document.body.onhashchangeRan = true;");

          assert.equal(typeof dom.window.document.body.onhashchange, "function");
          assert.equal(typeof dom.window.onhashchange, "function");
          assert.equal(dom.window.document.body.onhashchange, dom.window.onhashchange);
        });

        it("should parse the handler as an attribute", () => {
          const { body } = createJSDOM().window.document;
          body.setAttribute("onhashchange", "document.body.onhashchangeRan = true;");

          assert.equal(body.getAttribute("onhashchange"), "document.body.onhashchangeRan = true;");
        });
      });

      describe("div onclick handler set during parsing", () => {
        it("should not evaluate the handler", () => {
          const dom = createJSDOMWithParsedHandlers();

          dom.window.document.querySelector("div").click();

          assert.equal(dom.window.document.body.onclickRan, true);
        });

        it("should generate the property", () => {
          const dom = createJSDOMWithParsedHandlers();

          assert.equal(typeof dom.window.document.querySelector("div").onclick, "function");
        });

        it("should parse the handler as an attribute", () => {
          const dom = createJSDOMWithParsedHandlers();
          const div = dom.window.document.querySelector("div");

          assert.equal(div.getAttribute("onclick"), "document.body.onclickRan = true;");
        });
      });

      describe("div onclick handler set via setAttribute", () => {
        it("should evaluate the handler", () => {
          const dom = createJSDOM();
          const div = dom.window.document.body.querySelector("div");
          div.setAttribute("onclick", "document.body.onclickRan = true;");

          div.click();

          assert.equal(dom.window.document.body.onclickRan, true);
        });

        it("should generate the property", () => {
          const dom = createJSDOM();
          const div = dom.window.document.body.querySelector("div");
          div.setAttribute("onclick", "document.body.onclickRan = true;");

          assert.equal(typeof div.onclick, "function");
        });

        it("should parse the handler as an attribute", () => {
          const dom = createJSDOM();
          const div = dom.window.document.body.querySelector("div");
          div.setAttribute("onclick", "document.body.onclickRan = true;");

          assert.equal(div.getAttribute("onclick"), "document.body.onclickRan = true;");
        });
      });

      testEventHandlersFromTheOutside("dangerously");
    });
  });

  it("should disallow other values", () => {
    assert.throws(() => new JSDOM(``, { runScripts: null }), RangeError);
    assert.throws(() => new JSDOM(``, { runScripts: "asdf" }), RangeError);
    assert.throws(() => new JSDOM(``, { runScripts: true }), RangeError);
    assert.throws(() => new JSDOM(``, { runScripts: false }), RangeError);
  });
});

function testEventHandlersFromTheOutside(runScriptsOptionValue) {
  describe("body onhashchange handler set from the outside", () => {
    it("should evaluate the handler", () => {
      const dom = new JSDOM(``, { runScripts: runScriptsOptionValue });
      let ran = false;
      dom.window.document.body.onhashchange = () => {
        ran = true;
      };

      dom.window.location.href = "#foo";
      return delay().then(() => {
        assert.equal(ran, true);
      });
    });

    it("should return the handler from both Window and the body", () => {
      const dom = new JSDOM(``, { runScripts: runScriptsOptionValue });
      function handler() {}

      dom.window.document.body.onhashchange = handler;

      assert.equal(dom.window.document.body.onhashchange, handler);
      assert.equal(dom.window.onhashchange, handler);
    });
  });

  describe("Window onhashchange handler set from the outside", () => {
    it("should evaluate the handler", () => {
      const dom = new JSDOM(``, { runScripts: runScriptsOptionValue });
      let ran = false;
      dom.window.onhashchange = () => {
        ran = true;
      };

      dom.window.location.href = "#foo";
      return delay().then(() => {
        assert.equal(ran, true);
      });
    });

    it("should return the handler from both Window and the body", () => {
      const dom = new JSDOM(``, { runScripts: runScriptsOptionValue });
      function handler() {}

      dom.window.onhashchange = handler;

      assert.equal(dom.window.onhashchange, handler);
      assert.equal(dom.window.document.body.onhashchange, handler);
    });
  });

  describe("div onclick handler set from the outside", () => {
    it("should evaluate the handler", () => {
      const dom = new JSDOM(`<div>`, { runScripts: runScriptsOptionValue });
      const div = dom.window.document.querySelector("div");
      let ran = false;
      div.onclick = () => {
        ran = true;
      };

      div.click();

      assert.equal(ran, true);
    });

    it("should return the handler that was set", () => {
      const dom = new JSDOM(`<div>`, { runScripts: runScriptsOptionValue });
      const div = dom.window.document.querySelector("div");
      function handler() {}

      div.onclick = handler;

      assert.equal(div.onclick, handler);
    });
  });
}

function formatOptionValue(optionValue) {
  return typeof optionValue === "string" ? `"${optionValue}"` : optionValue;
}

function isObject(value) {
  return typeof value === "function" || (typeof value === "object" && value !== null);
}

function assertAliasedGlobal(window, globalName) {
  const windowPropDesc = Object.getOwnPropertyDescriptor(window);
  const globalPropDesc = Object.getOwnPropertyDescriptor(global);

  assert.equal(Object.is(windowPropDesc.value, globalPropDesc.value), true, `${globalName} value`);
  assert.equal(windowPropDesc.configurable, globalPropDesc.configurable, `${globalName} configurable`);
  assert.equal(windowPropDesc.enumerable, globalPropDesc.enumerable, `${globalName} enumerable`);
  assert.equal(windowPropDesc.writable, globalPropDesc.writable, `${globalName} writable`);
}

function assertFreshGlobal(window, globalName) {
  const windowPropDesc = Object.getOwnPropertyDescriptor(window);
  const globalPropDesc = Object.getOwnPropertyDescriptor(global);

  if (isObject(globalPropDesc.value)) {
    assert.equal(Object.is(windowPropDesc.value, globalPropDesc.value), false, `${globalName} value inequality`);
  } else {
    assert.equal(Object.is(windowPropDesc.value, globalPropDesc.value), true, `${globalName} value equality`);
  }
  assert.equal(windowPropDesc.configurable, globalPropDesc.configurable, `${globalName} configurable`);
  assert.equal(windowPropDesc.enumerable, globalPropDesc.enumerable, `${globalName} enumerable`);
  assert.equal(windowPropDesc.writable, globalPropDesc.writable, `${globalName} writable`);
}
