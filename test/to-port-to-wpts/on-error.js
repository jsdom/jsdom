"use strict";
const assert = require("node:assert/strict");
const { describe, test } = require("node:test");

const { JSDOM, VirtualConsole } = require("../..");
const { toFileUrl, todo } = require("../util.js");

describe("on-error", () => {
  test("onerror catches exceptions thrown in addEventListener event handlers", (t, done) => {
    const doc = docForTests();

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
      done();
    });

    doc.body.click();
  });

  test("onerror property catches exceptions thrown in addEventListener event handlers", (t, done) => {
    const doc = docForTests();

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
      done();
    };

    doc.body.click();
  });

  test("onerror catches exceptions thrown in addEventListener event handlers (multiline message)", (t, done) => {
    const doc = docForTests();

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
      done();
    });

    doc.body.click();
  });

  test("onerror catches exceptions thrown in inline event handlers", (t, done) => {
    const doc = docForTests(`<body onclick="throw new Error('oh no!')"></body>`, { runScripts: "dangerously" });

    doc.defaultView.addEventListener("error", event => {
      assert.equal(event.message, "oh no!");
      assert.equal(event.filename, "http://example.com/");
      assert.ok(event.lineno > 0, "lineno set");
      assert.ok(event.colno > 0, "colno set");
      assert.ok(event.error);
      done();
    });

    doc.body.click();
  });

  test("onerror catches exceptions thrown in inline event handler properties", (t, done) => {
    const doc = docForTests();

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
      done();
    });

    doc.body.click();
  });

  test("onerror catches exceptions thrown in sync script execution", (t, done) => {
    const doc = docForTests(``, { runScripts: "dangerously" });

    doc.defaultView.addEventListener("error", event => {
      assert.equal(event.message, "oh no!", "message equality");
      assert.equal(event.filename, "http://example.com/");
      assert.ok(event.lineno > 0, "lineno set");
      assert.ok(event.colno > 0, "colno set");
      assert.ok(event.error);
      done();
    });

    doc.onload = () => {
      doc.write(`<script>throw new Error("oh no!");</script>`);
    };
  });

  test("onerror set during parsing catches exceptions thrown in sync script execution during parsing", () => {
    const doc = docForTests(`<script>
      onerror = (message, filename, lineno, colno, error) => {
        window.onerrorMessage = message;
        window.onerrorFilename = filename;
        window.onerrorLineno = lineno;
        window.onerrorColno = colno;
        window.onerrorError = error;
      };
      throw new Error("oh no!");
    </script>`, { runScripts: "dangerously" });

    assert.equal(doc.defaultView.onerrorMessage, "oh no!", "message equality");
    assert.equal(doc.defaultView.onerrorFilename, "http://example.com/");
    assert.ok(doc.defaultView.onerrorLineno > 0, "lineno set");
    assert.ok(doc.defaultView.onerrorColno > 0, "colno set");
    assert.ok(doc.defaultView.onerrorError);
  });

  test("unhandled Errors thrown in sync script excecution during parsing go to the virtual console", (t, done) => {
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("jsdomError", error => {
      assert.ok(error instanceof Error);
      assert.ok(error.message === "Uncaught [TypeError: oh no!]");
      assert.equal(error.detail.constructor.name, "TypeError");
      done();
    });

    // eslint-disable-next-line no-new
    new JSDOM(`<script>throw new TypeError("oh no!")</script>`, { virtualConsole, runScripts: "dangerously" });
  });

  test(
    "unhandled non-Error exceptions thrown in sync script excecution during parsing go to the virtual console",
    (t, done) => {
      const virtualConsole = new VirtualConsole();
      virtualConsole.on("jsdomError", error => {
        assert.ok(error instanceof Error);
        // Browserify hasn't caught up yet
        assert.ok(error.message === "Uncaught Object {}" || error.message === "Uncaught {}");
        assert.equal(typeof error.detail, "object");
        assert.notEqual(error.detail, null);
        done();
      });

      // eslint-disable-next-line no-new
      new JSDOM(`<script>throw {}</script>`, { virtualConsole, runScripts: "dangerously" });
    }
  );

  test("unhandled exceptions thrown in inline event handlers go to the virtual console", (t, done) => {
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("jsdomError", error => {
      assert.ok(error instanceof Error);
      assert.equal(error.message, "Uncaught [Error: oh no!]");
      assert.equal(error.detail.constructor.name, "Error");
      done();
    });

    const html = `<body onclick="throw new Error('oh no!')"></body>`;
    const doc = (new JSDOM(html, { virtualConsole, runScripts: "dangerously" })).window.document;

    doc.body.click();
  });

  test("adding an onerror handler does not prevent errors from going to the virtual console", (t, done) => {
    const virtualConsole = new VirtualConsole();
    virtualConsole.on("jsdomError", error => {
      assert.ok(error instanceof Error);
      assert.equal(error.message, "Uncaught [Error: oh no!]");
      assert.equal(error.detail.constructor.name, "Error");
      done();
    });

    const html = `<body onclick="throw new Error('oh no!')"></body>`;
    const doc = (new JSDOM(html, { virtualConsole, runScripts: "dangerously" })).window.document;

    doc.defaultView.onerror = () => {
      // just a no-op handler to trigger the setter logic
    };

    doc.body.click();
  });

  test(
    "adding an onerror handler that returns true *does* prevent errors from going to the virtual console",
    (t, done) => {
      const virtualConsole = new VirtualConsole();
      virtualConsole.on("jsdomError", () => {
        assert.fail("should not get here");
      });

      const html = `<body onclick="throw new Error('oh no!')"></body>`;
      const doc = (new JSDOM(html, { virtualConsole, runScripts: "dangerously" })).window.document;

      doc.defaultView.onerror = () => true;

      doc.body.click();

      setTimeout(() => {
        done();
      }, 30);
    }
  );
});

function docForTests(html = ``, options = {}) {
  // Purposefully not sent to the real console since we're expecting jsdomErrors
  const virtualConsole = new VirtualConsole();

  return (new JSDOM(html, { virtualConsole, url: "http://example.com", ...options })).window.document;
}
