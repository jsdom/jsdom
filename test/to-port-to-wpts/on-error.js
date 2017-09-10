"use strict";

const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { jsdom, createVirtualConsole } = require("../../lib/old-api.js");
const { toFileUrl, todo } = require("../util.js");

describe("on-error", () => {
  specify(
    "onerror catches exceptions thrown in addEventListener event handlers",
    t => {
      const doc = jsdom("", { url: "http://example.com" });

      const error = new Error("oh no!");
      doc.body.addEventListener("click", () => {
        throw error;
      });

      doc.defaultView.addEventListener("error", event => {
        assert.equal(event.message, "oh no!");

        todo(assert, tt => { // TODO url parser
          tt.ok(event.filename === toFileUrl(__filename), "filename equality");
        });

        assert.ok(event.lineno > 0);
        assert.ok(event.colno > 0);
        assert.equal(event.error, error);
        t.done();
      });

      doc.body.click();
    },
    {
      async: true
    }
  );

  specify(
    "onerror property catches exceptions thrown in addEventListener event handlers",
    t => {
      const doc = jsdom("", { url: "http://example.com" });

      const errorThrown = new Error("oh no!");
      doc.body.addEventListener("click", () => {
        throw errorThrown;
      });

      doc.defaultView.onerror = (message, filename, lineno, colno, error) => {
        assert.equal(message, "oh no!");

        todo(assert, tt => { // TODO url parser
          tt.ok(filename === toFileUrl(__filename), "filename equality");
        });

        assert.ok(lineno > 0);
        assert.ok(colno > 0);
        assert.equal(error, errorThrown);
        t.done();
      };

      doc.body.click();
    },
    {
      async: true
    }
  );

  specify(
    "onerror catches exceptions thrown in addEventListener event handlers (multiline message)",
    t => {
      const doc = jsdom("", { url: "http://example.com" });

      const error = new Error("oh\nno\n!");
      doc.body.addEventListener("click", () => {
        throw error;
      });

      doc.defaultView.addEventListener("error", event => {
        todo(assert, tt => { // TODO url parser
          tt.ok(event.filename === toFileUrl(__filename), "filename equality");
        });

        assert.ok(event.lineno > 0);
        assert.ok(event.colno > 0);
        assert.equal(event.error, error);
        t.done();
      });

      doc.body.click();
    },
    {
      async: true
    }
  );

  specify("onerror catches exceptions thrown in inline event handlers", t => {
    const doc = jsdom(`<body onclick="throw new Error('oh no!')"></body>`, { url: "http://example.com" });

    doc.defaultView.addEventListener("error", event => {
      assert.equal(event.message, "oh no!");
      assert.equal(event.filename, "http://example.com/");
      assert.ok(event.lineno > 0, "lineno set");
      assert.ok(event.colno > 0, "colno set");
      assert.ok(event.error);
      t.done();
    });

    doc.body.click();
  }, {
    async: true
  });

  specify(
    "onerror catches exceptions thrown in inline event handler properties",
    t => {
      const doc = jsdom("", { url: "http://example.com" });

      doc.body.onclick = () => {
        throw new Error("oh no!");
      };

      doc.defaultView.addEventListener("error", event => {
        assert.equal(event.message, "oh no!", "message equality");

        todo(assert, tt => { // TODO url parser
          tt.ok(event.filename === toFileUrl(__filename), "filename equality");
        });

        assert.ok(event.lineno > 0, "lineno set");
        assert.ok(event.colno > 0, "colno set");
        assert.ok(event.error);
        t.done();
      });

      doc.body.click();
    },
    {
      async: true
    }
  );

  specify("onerror catches exceptions thrown in sync script execution", t => {
    const doc = jsdom("", { url: "http://example.com" });

    doc.defaultView.addEventListener("error", event => {
      assert.equal(event.message, "oh no!", "message equality");
      assert.equal(event.filename, "http://example.com/");
      assert.ok(event.lineno > 0, "lineno set");
      assert.ok(event.colno > 0, "colno set");
      assert.ok(event.error);
      t.done();
    });

    doc.body.innerHTML = `<script>throw new Error("oh no!");</script>`;
  }, {
    async: true
  });

  specify(
    "onerror set during parsing catches exceptions thrown in sync script execution during parsing",
    () => {
      const doc = jsdom(`<script>
        onerror = (message, filename, lineno, colno, error) => {
          window.onerrorMessage = message;
          window.onerrorFilename = filename;
          window.onerrorLineno = lineno;
          window.onerrorColno = colno;
          window.onerrorError = error;
        };
        throw new Error("oh no!");
      </script>`, { url: "http://example.com" });

      assert.equal(doc.defaultView.onerrorMessage, "oh no!", "message equality");
      assert.equal(doc.defaultView.onerrorFilename, "http://example.com/");
      assert.ok(doc.defaultView.onerrorLineno > 0, "lineno set");
      assert.ok(doc.defaultView.onerrorColno > 0, "colno set");
      assert.ok(doc.defaultView.onerrorError);
    }
  );

  specify(
    "unhandled Errors thrown in sync script excecution during parsing go to the virtual console",
    t => {
      const virtualConsole = createVirtualConsole();
      virtualConsole.on("jsdomError", error => {
        assert.ok(error instanceof Error);
        assert.ok(error.message === "Uncaught [TypeError: oh no!]");
        assert.equal(error.detail.constructor.name, "TypeError");
        t.done();
      });

      jsdom(`<script>throw new TypeError("oh no!")</script>`, { virtualConsole });
    },
    {
      async: true
    }
  );

  specify(
    "unhandled non-Error exceptions thrown in sync script excecution during parsing go to the virtual console",
    t => {
      const virtualConsole = createVirtualConsole();
      virtualConsole.on("jsdomError", error => {
        assert.ok(error instanceof Error);
        // Browserify hasn't caught up yet
        assert.ok(error.message === "Uncaught Object {}" || error.message === "Uncaught {}");
        assert.equal(typeof error.detail, "object");
        assert.notEqual(error.detail, null);
        t.done();
      });

      jsdom(`<script>throw {}</script>`, { virtualConsole });
    },
    {
      async: true
    }
  );

  specify(
    "unhandled exceptions thrown in inline event handlers go to the virtual console",
    t => {
      const virtualConsole = createVirtualConsole();
      virtualConsole.on("jsdomError", error => {
        assert.ok(error instanceof Error);
        assert.equal(error.message, "Uncaught [Error: oh no!]");
        assert.equal(error.detail.constructor.name, "Error");
        t.done();
      });

      const doc = jsdom(`<body onclick="throw new Error('oh no!')"></body>`, { virtualConsole });

      doc.body.click();
    },
    {
      async: true
    }
  );

  specify(
    "adding an onerror handler does not prevent errors from going to the virtual console",
    t => {
      const virtualConsole = createVirtualConsole();
      virtualConsole.on("jsdomError", error => {
        assert.ok(error instanceof Error);
        assert.equal(error.message, "Uncaught [Error: oh no!]");
        assert.equal(error.detail.constructor.name, "Error");
        t.done();
      });

      const doc = jsdom(`<body onclick="throw new Error('oh no!')"></body>`, { virtualConsole });

      doc.defaultView.onerror = () => {
        // just a no-op handler to trigger the setter logic
      };

      doc.body.click();
    },
    {
      async: true
    }
  );

  specify(
    "adding an onerror handler that returns true *does* prevent errors from going to the virtual console",
    t => {
      const virtualConsole = createVirtualConsole();
      virtualConsole.on("jsdomError", () => {
        assert.fail("should not get here");
      });

      const doc = jsdom(`<body onclick="throw new Error('oh no!')"></body>`, { virtualConsole });

      doc.defaultView.onerror = () => true;

      doc.body.click();

      setTimeout(() => {
        t.done();
      }, 30);
    },
    {
      async: true
    }
  );
});
