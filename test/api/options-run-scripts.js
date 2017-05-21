"use strict";
const { assert } = require("chai");
const { describe, it } = require("mocha-sugar-free");
const { delay } = require("../util.js");

const { JSDOM } = require("../..");

describe("API: runScripts constructor option", () => {
  describe("<script>s and eval()", () => {
    it("should not execute any scripts by default", () => {
      const dom = new JSDOM(`<body>
        <script>document.body.appendChild(document.createElement("hr"));</script>
      </body>`);

      assert.strictEqual(dom.window.document.body.children.length, 1);
      assert.strictEqual(dom.window.eval, undefined);
    });

    it("should not execute any scripts, even in iframes, by default (GH-1821)", () => {
      const dom = new JSDOM(`<iframe></iframe>`);
      const frameWindow = dom.window.document.querySelector("iframe").contentWindow;

      frameWindow.document.open();
      frameWindow.document.write(`<script>parent.prop = "i was executed";</script>`);
      frameWindow.document.close();

      assert.strictEqual(dom.window.prop, undefined);
      assert.strictEqual(frameWindow.eval, undefined);
    });

    it("should execute <script>s and eval when set to \"dangerously\"", () => {
      const dom = new JSDOM(`<body>
        <script>document.body.appendChild(document.createElement("hr"));</script>
      </body>`, { runScripts: "dangerously" });
      dom.window.eval(`document.body.appendChild(document.createElement("p"));`);

      assert.strictEqual(dom.window.document.body.children.length, 3);
    });

    it("should only run eval when set to \"outside-only\"", () => {
      const dom = new JSDOM(`<body>
        <script>document.body.appendChild(document.createElement("hr"));</script>
      </body>`, { runScripts: "outside-only" });
      dom.window.eval(`document.body.appendChild(document.createElement("p"));`);

      assert.strictEqual(dom.window.document.body.children.length, 2);
    });

    it("should ensure eval exists on iframes when set to \"outside-only\"", () => {
      const dom = new JSDOM(`<iframe></iframe>`, { runScripts: "outside-only" });
      const frameWindow = dom.window.document.querySelector("iframe").contentWindow;

      frameWindow.eval(`document.body.appendChild(document.createElement("p"));`);

      assert.strictEqual(frameWindow.document.body.children.length, 1);
    });

    it("should execute <script>s in iframes when set to \"dangerously\"", () => {
      const dom = new JSDOM(`<iframe></iframe>`, { runScripts: "dangerously" });
      const frameWindow = dom.window.document.querySelector("iframe").contentWindow;

      frameWindow.document.open();
      frameWindow.document.write(`<script>parent.prop = "i was executed";</script>`);
      frameWindow.document.close();

      assert.strictEqual(dom.window.prop, "i was executed");
    });
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

            assert.isUndefined(dom.window.document.body.onloadRan);

            return delay().then(() => {
              assert.isUndefined(dom.window.document.body.onloadRan);
            });
          });

          it("should not generate the body or Window property", () => {
            const dom = createJSDOMWithParsedHandlers();

            assert.isNull(dom.window.document.body.onload);
            assert.isNull(dom.window.onload);
          });

          it("should still parse the handler as an attribute", () => {
            const dom = createJSDOMWithParsedHandlers();
            const body = dom.window.document.body;

            assert.strictEqual(body.getAttribute("onload"), "document.body.onloadRan = true;");
          });
        });

        describe("body onhashchange handler set during parsing", () => {
          it("should not evaluate the handler", () => {
            const dom = createJSDOMWithParsedHandlers();

            dom.window.location.href = "#foo";
            return delay().then(() => {
              assert.isUndefined(dom.window.document.body.onhashchangeRan);
            });
          });

          it("should not generate the body or Window property", () => {
            const dom = createJSDOMWithParsedHandlers();

            assert.isNull(dom.window.document.body.onhashchange);
            assert.isNull(dom.window.onhashchange);
          });

          it("should still parse the handler as an attribute", () => {
            const dom = createJSDOMWithParsedHandlers();
            const body = dom.window.document.body;

            assert.strictEqual(body.getAttribute("onhashchange"), "document.body.onhashchangeRan = true;");
          });
        });

        describe("body onhashchange handler set via setAttribute", () => {
          it("should not evaluate the handler", () => {
            const dom = createJSDOM();
            dom.window.document.body.setAttribute("onhashchange", "document.body.onhashchangeRan = true;");

            dom.window.location.href = "#foo";
            return delay().then(() => {
              assert.isUndefined(dom.window.document.body.onhashchangeRan);
            });
          });

          it("should not generate the body or Window property", () => {
            const dom = createJSDOM();
            dom.window.document.body.setAttribute("onhashchange", "document.body.onhashchangeRan = true;");

            assert.isNull(dom.window.document.body.onhashchange);
            assert.isNull(dom.window.onhashchange);
          });

          it("should still parse the handler as an attribute", () => {
            const dom = createJSDOM();
            const body = dom.window.document.body;
            body.setAttribute("onhashchange", "document.body.onhashchangeRan = true;");

            assert.strictEqual(body.getAttribute("onhashchange"), "document.body.onhashchangeRan = true;");
          });
        });

        describe("div onclick handler set during parsing", () => {
          it("should not evaluate the handler", () => {
            const dom = createJSDOMWithParsedHandlers();

            dom.window.document.querySelector("div").click();

            return delay().then(() => {
              assert.isUndefined(dom.window.document.body.onclickRan);
            });
          });

          it("should not generate the property", () => {
            const dom = createJSDOMWithParsedHandlers();

            assert.isNull(dom.window.document.querySelector("div").onclick);
          });

          it("should still parse the handler as an attribute", () => {
            const dom = createJSDOMWithParsedHandlers();
            const div = dom.window.document.querySelector("div");

            assert.strictEqual(div.getAttribute("onclick"), "document.body.onclickRan = true;");
          });
        });

        describe("div onclick handler set via setAttribute", () => {
          it("should not evaluate the handler", () => {
            const dom = createJSDOM();
            const div = dom.window.document.body.querySelector("div");
            div.setAttribute("onclick", "document.body.onclickRan = true;");

            div.click();

            assert.isUndefined(dom.window.document.body.onclickRan);
          });

          it("should not generate the property", () => {
            const dom = createJSDOM();
            const div = dom.window.document.body.querySelector("div");
            div.setAttribute("onclick", "document.body.onclickRan = true;");

            assert.isNull(div.onclick);
          });

          it("should still parse the handler as an attribute", () => {
            const dom = createJSDOM();
            const div = dom.window.document.body.querySelector("div");
            div.setAttribute("onclick", "document.body.onclickRan = true;");

            assert.strictEqual(div.getAttribute("onclick"), "document.body.onclickRan = true;");
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
            assert.isTrue(dom.window.document.body.onloadRan);
          });
        });

        it("should generate the body and Window property", () => {
          const dom = createJSDOMWithParsedHandlers();

          assert.isFunction(dom.window.document.body.onload);
          assert.isFunction(dom.window.onload);
          assert.strictEqual(dom.window.document.body.onload, dom.window.onload);
        });

        it("should parse the handler as an attribute", () => {
          const dom = createJSDOMWithParsedHandlers();
          const body = dom.window.document.body;

          assert.strictEqual(body.getAttribute("onload"), "document.body.onloadRan = true;");
        });
      });

      describe("body onhashchange handler set during parsing", () => {
        it("should not evaluate the handler", () => {
          const dom = createJSDOMWithParsedHandlers();

          dom.window.location.href = "#foo";
          return delay().then(() => {
            assert.isTrue(dom.window.document.body.onhashchangeRan);
          });
        });

        it("should not generate the body or Window property", () => {
          const dom = createJSDOMWithParsedHandlers();

          assert.isFunction(dom.window.document.body.onhashchange);
          assert.isFunction(dom.window.onhashchange);
          assert.strictEqual(dom.window.document.body.onhashchange, dom.window.onhashchange);
        });

        it("should parse the handler as an attribute", () => {
          const dom = createJSDOMWithParsedHandlers();
          const body = dom.window.document.body;

          assert.strictEqual(body.getAttribute("onhashchange"), "document.body.onhashchangeRan = true;");
        });
      });

      describe("body onhashchange handler set via setAttribute", () => {
        it("should evaluate the handler", () => {
          const dom = createJSDOM();
          dom.window.document.body.setAttribute("onhashchange", "document.body.onhashchangeRan = true;");

          dom.window.location.href = "#foo";
          return delay().then(() => {
            assert.isTrue(dom.window.document.body.onhashchangeRan);
          });
        });

        it("should generate the body and Window property", () => {
          const dom = createJSDOM();
          dom.window.document.body.setAttribute("onhashchange", "document.body.onhashchangeRan = true;");

          assert.isFunction(dom.window.document.body.onhashchange);
          assert.isFunction(dom.window.onhashchange);
          assert.strictEqual(dom.window.document.body.onhashchange, dom.window.onhashchange);
        });

        it("should parse the handler as an attribute", () => {
          const dom = createJSDOM();
          const body = dom.window.document.body;
          body.setAttribute("onhashchange", "document.body.onhashchangeRan = true;");

          assert.strictEqual(body.getAttribute("onhashchange"), "document.body.onhashchangeRan = true;");
        });
      });

      describe("div onclick handler set during parsing", () => {
        it("should not evaluate the handler", () => {
          const dom = createJSDOMWithParsedHandlers();

          dom.window.document.querySelector("div").click();

          assert.isTrue(dom.window.document.body.onclickRan);
        });

        it("should generate the property", () => {
          const dom = createJSDOMWithParsedHandlers();

          assert.isFunction(dom.window.document.querySelector("div").onclick);
        });

        it("should parse the handler as an attribute", () => {
          const dom = createJSDOMWithParsedHandlers();
          const div = dom.window.document.querySelector("div");

          assert.strictEqual(div.getAttribute("onclick"), "document.body.onclickRan = true;");
        });
      });

      describe("div onclick handler set via setAttribute", () => {
        it("should evaluate the handler", () => {
          const dom = createJSDOM();
          const div = dom.window.document.body.querySelector("div");
          div.setAttribute("onclick", "document.body.onclickRan = true;");

          div.click();

          assert.isTrue(dom.window.document.body.onclickRan);
        });

        it("should generate the property", () => {
          const dom = createJSDOM();
          const div = dom.window.document.body.querySelector("div");
          div.setAttribute("onclick", "document.body.onclickRan = true;");

          assert.isFunction(div.onclick);
        });

        it("should parse the handler as an attribute", () => {
          const dom = createJSDOM();
          const div = dom.window.document.body.querySelector("div");
          div.setAttribute("onclick", "document.body.onclickRan = true;");

          assert.strictEqual(div.getAttribute("onclick"), "document.body.onclickRan = true;");
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
        assert.isTrue(ran);
      });
    });

    it("should return the handler from both Window and the body", () => {
      const dom = new JSDOM(``, { runScripts: runScriptsOptionValue });
      function handler() {}

      dom.window.document.body.onhashchange = handler;

      assert.strictEqual(dom.window.document.body.onhashchange, handler);
      assert.strictEqual(dom.window.onhashchange, handler);
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
        assert.isTrue(ran);
      });
    });

    it("should return the handler from both Window and the body", () => {
      const dom = new JSDOM(``, { runScripts: runScriptsOptionValue });
      function handler() {}

      dom.window.onhashchange = handler;

      assert.strictEqual(dom.window.onhashchange, handler);
      assert.strictEqual(dom.window.document.body.onhashchange, handler);
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

      assert.isTrue(ran);
    });

    it("should return the handler that was set", () => {
      const dom = new JSDOM(`<div>`, { runScripts: runScriptsOptionValue });
      const div = dom.window.document.querySelector("div");
      function handler() {}

      div.onclick = handler;

      assert.strictEqual(div.onclick, handler);
    });
  });
}

function formatOptionValue(optionValue) {
  return typeof optionValue === "string" ? `"${optionValue}"` : optionValue;
}
