"use strict";

const assert = require("node:assert/strict");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM, VirtualConsole } = require("../..");
const { toFileUrl, todo } = require("../util.js");

describe("on-error", () => {
  specify(
    "onerror catches exceptions thrown in addEventListener event handlers",
    t => {
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
        t.done();
      });

      doc.body.click();
    },
    {
      async: true
    }
  );

  specify("onerror catches exceptions thrown in inline event handlers", t => {
    const doc = docForTests(`<body onclick="throw new Error('oh no!')"></body>`, { runScripts: "dangerously" });

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
        t.done();
      });

      doc.body.click();
    },
    {
      async: true
    }
  );

  specify("onerror catches exceptions thrown in sync script execution", t => {
    const doc = docForTests(``, { runScripts: "dangerously" });

    doc.defaultView.addEventListener("error", event => {
      assert.equal(event.message, "oh no!", "message equality");
      assert.equal(event.filename, "http://example.com/");
      assert.ok(event.lineno > 0, "lineno set");
      assert.ok(event.colno > 0, "colno set");
      assert.ok(event.error);
      t.done();
    });

    doc.onload = () => {
      doc.write(`<script>throw new Error("oh no!");</script>`);
    };
  }, {
    async: true
  });

  specify(
    "onerror set during parsing catches exceptions thrown in sync script execution during parsing",
    () => {
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
    }
  );
});

function docForTests(html = ``, options = {}) {
  // Purposefully not sent to the real console since we're expecting jsdomErrors
  const virtualConsole = new VirtualConsole();

  return (new JSDOM(html, { virtualConsole, url: "http://example.com", ...options })).window.document;
}
