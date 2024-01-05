"use strict";
const assert = require("node:assert/strict");
const { describe, test } = require("node:test");

const { JSDOM } = require("../..");

describe("inline-event-handlers", () => {
  test("inline event handlers have the correct global scope", () => {
    const html = `<div onclick="document.foo = 'clicked'"></div>`;
    const doc = (new JSDOM(html, { runScripts: "dangerously" })).window.document;
    const div = doc.body.firstElementChild;

    div.click();

    assert.equal(doc.foo, "clicked");
  });

  test("inline error event handlers have the correct global scope", () => {
    const html = `<body onerror="document.foo = 'errored'"></div>`;
    const doc = (new JSDOM(html, { runScripts: "dangerously" })).window.document;

    const e = new doc.defaultView.ErrorEvent("error");
    doc.defaultView.dispatchEvent(e);

    assert.equal(doc.foo, "errored");
  });

  test(
    "inline event handlers have their return values reflected in the corresponding property",
    () => {
      const doc = (new JSDOM(`<div onclick="return 10"></div>`, { runScripts: "dangerously" })).window.document;
      const div = doc.body.firstElementChild;

      assert.equal(div.onclick(), 10);
    }
  );

  test(
    "inline event handlers have their return values reflected in the corresponding property",
    () => {
      const doc = (new JSDOM(`<body onerror="return 10"></div>`, { runScripts: "dangerously" })).window.document;

      assert.equal(doc.defaultView.onerror(), 10);
    }
  );

  test("inline event handlers have access to an event argument", () => {
    const html = `<div onclick="document.bubbles = event.bubbles"></div>`;
    const doc = (new JSDOM(html, { runScripts: "dangerously" })).window.document;
    const div = doc.body.firstElementChild;

    div.click();

    assert.equal(doc.bubbles, true);
  });

  test("inline error event handlers have access to a lot of arguments", () => {
    const html = `<body onerror="
      document.onerrorEvent = event;
      document.onerrorSource = source;
      document.onerrorLineno = lineno;
      document.onerrorColno = colno;
      document.onerrorError = error;"></div>`;
    const doc = (new JSDOM(html, { runScripts: "dangerously" })).window.document;

    const errorObj = { should: "be this object" };
    const e = new doc.defaultView.ErrorEvent("error", {
      message: "message blah",
      filename: "filenameblahblah",
      lineno: 5,
      colno: 10,
      error: errorObj
    });
    doc.defaultView.dispatchEvent(e);

    assert.equal(doc.onerrorEvent, "message blah");
    assert.equal(doc.onerrorSource, "filenameblahblah");
    assert.equal(doc.onerrorLineno, 5);
    assert.equal(doc.onerrorColno, 10);
    assert.equal(doc.onerrorError, errorObj);
  });

  test(
    "inline event handlers set via properties have access to an event argument",
    (t, done) => {
      const doc = (new JSDOM(`<div></div>`)).window.document;
      const div = doc.body.firstElementChild;

      div.onclick = function (event) {
        assert.equal(event.constructor, doc.defaultView.MouseEvent);
        done();
      };

      div.click();
    }
  );

  test(
    "inline error event handlers set via properties have access to lots of arguments",
    (t, done) => {
      const doc = (new JSDOM()).window.document;

      const errorObj = { should: "be this object" };

      doc.defaultView.onerror = function (event, source, lineno, colno, error) {
        assert.equal(event, "message blah");
        assert.equal(source, "filenameblahblah");
        assert.equal(lineno, 5);
        assert.equal(colno, 10);
        assert.equal(error, errorObj);
        done();
      };

      const e = new doc.defaultView.ErrorEvent("error", {
        message: "message blah",
        filename: "filenameblahblah",
        lineno: 5,
        colno: 10,
        error: errorObj
      });
      doc.defaultView.dispatchEvent(e);
    }
  );

  const proxied = [
    "onblur", "onerror", "onfocus", "onload", "onresize", "onscroll", "onafterprint",
    "onbeforeprint", "onbeforeunload", "onhashchange", "onlanguagechange", "onmessage", "onoffline", "ononline",
    "onpagehide", "onpageshow", "onpopstate", "onstorage", "onunload"
  ];

  test(
    "proxied body/window event handlers: setting on body as properties reflects on window",
    () => {
      const doc = (new JSDOM()).window.document;

      for (const name of proxied) {
        function handler() {
          // doesn't matter for this test
        }

        doc.body[name] = handler;
        assert.equal(doc.body[name], handler, `${name} should be set on the body correctly`);
        assert.equal(doc.defaultView[name], handler, `${name} should be set on the window correctly`);

        doc.body[name] = null;
        assert.equal(doc.body[name], null, `${name} should be unset on the body correctly`);
        assert.equal(doc.defaultView[name], null, `${name} should be unset on the window correctly`);
      }
    }
  );

  test(
    "proxied body/window event handlers: setting on body as attributes reflects on window",
    () => {
      const doc = (new JSDOM(``, { runScripts: "dangerously" })).window.document;

      for (const name of proxied) {
        doc.body.setAttribute(name, "return 5;");
        assert.equal(doc.body[name](), 5, `${name} should be set on the body correctly`);
        assert.equal(doc.defaultView[name](), 5, `${name} should be set on the window correctly`);

        doc.body.removeAttribute(name);
        assert.equal(doc.body[name], null, `${name} should be unset on the body correctly`);
        assert.equal(doc.defaultView[name], null, `${name} should be unset on the window correctly`);
      }
    }
  );

  test(
    "proxied body/window event handlers: setting on body as attributes should not throw without a window",
    () => {
      const doc = (new JSDOM(``, { runScripts: "dangerously" })).window.document.implementation.createHTMLDocument();

      for (const name of proxied) {
        doc.body.setAttribute(name, "return 5;");
        assert.equal(doc.body[name], null, `${name} should be be null`);
        doc.body.removeAttribute(name);
      }
    }
  );
});
