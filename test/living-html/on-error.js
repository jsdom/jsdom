"use strict";
const jsdom = require("../..").jsdom;
const toFileUrl = require("../util").toFileUrl;
const todo = require("../util").todo;

exports["onerror catches exceptions thrown in addEventListener event handlers"] = function (t) {
  const doc = jsdom("", { url: "http://example.com" });

  const error = new Error("oh no!");
  doc.body.addEventListener("click", function () {
    throw error;
  });

  doc.defaultView.addEventListener("error", function (event) {
    t.equal(event.message, "oh no!");

    todo(t, function (t) { // TODO url parser
      t.ok(event.filename === toFileUrl(__filename), "filename equality");
    });

    t.ok(event.lineno > 0);
    t.ok(event.colno > 0);
    t.equal(event.error, error);
    t.done();
  });

  doc.body.click();
};

exports["onerror property catches exceptions thrown in addEventListener event handlers"] = function (t) {
  const doc = jsdom("", { url: "http://example.com" });

  const error = new Error("oh no!");
  doc.body.addEventListener("click", function () {
    throw error;
  });

  doc.defaultView.onerror = function (message, filename, lineno, colno, error) {
    t.equal(message, "oh no!");

    todo(t, function (t) { // TODO url parser
      t.ok(filename === toFileUrl(__filename), "filename equality");
    });

    t.ok(lineno > 0);
    t.ok(colno > 0);
    t.equal(error, error);
    t.done();
  };

  doc.body.click();
};

exports["onerror catches exceptions thrown in addEventListener event handlers (multiline message)"] = function (t) {
  const doc = jsdom("", { url: "http://example.com" });

  const error = new Error("oh\nno\n!");
  doc.body.addEventListener("click", function () {
    throw error;
  });

  doc.defaultView.addEventListener("error", function (event) {
    todo(t, function (t) { // TODO url parser
      t.ok(event.filename === toFileUrl(__filename), "filename equality");
    });

    t.ok(event.lineno > 0);
    t.ok(event.colno > 0);
    t.equal(event.error, error);
    t.done();
  });

  doc.body.click();
};

exports["onerror catches exceptions thrown in inline event handlers"] = function (t) {
  const doc = jsdom(`<body onclick="throw new Error('oh no!')"></body>`, { url: "http://example.com" });

  doc.defaultView.addEventListener("error", function (event) {
    t.equal(event.message, "oh no!");
    t.equal(event.filename, "http://example.com");
    t.ok(event.lineno > 0, "lineno set");
    t.ok(event.colno > 0, "colno set");
    t.ok(event.error);
    t.done();
  });

  doc.body.click();
};

exports["onerror catches exceptions thrown in inline event handler properties"] = function (t) {
  const doc = jsdom("", { url: "http://example.com" });

  doc.body.onclick = function () {
    throw new Error("oh no!");
  };

  doc.defaultView.addEventListener("error", function (event) {
    t.equal(event.message, "oh no!", "message equality");

    todo(t, function (t) { // TODO url parser
      t.ok(event.filename === toFileUrl(__filename), "filename equality");
    });

    t.ok(event.lineno > 0, "lineno set");
    t.ok(event.colno > 0, "colno set");
    t.ok(event.error);
    t.done();
  });

  doc.body.click();
};

exports["onerror catches exceptions thrown in sync script execution"] = function (t) {
  const doc = jsdom("", { url: "http://example.com" });

  doc.defaultView.addEventListener("error", function (event) {
    t.equal(event.message, "oh no!", "message equality");
    t.equal(event.filename, "http://example.com");
    t.ok(event.lineno > 0, "lineno set");
    t.ok(event.colno > 0, "colno set");
    t.ok(event.error);
    t.done();
  });

  doc.body.innerHTML = `<script>throw new Error("oh no!");</script>`;
};

exports["onerror set during parsing catches exceptions thrown in sync script execution during parsing"] = function (t) {
  const doc = jsdom(`<script>
    onerror = function (message, filename, lineno, colno, error) {
      window.onerrorMessage = message;
      window.onerrorFilename = filename;
      window.onerrorLineno = lineno;
      window.onerrorColno = colno;
      window.onerrorError = error;
    };
    throw new Error("oh no!");
  </script>`, { url: "http://example.com" });

  t.equal(doc.defaultView.onerrorMessage, "oh no!", "message equality");
  t.equal(doc.defaultView.onerrorFilename, "http://example.com");
  t.ok(doc.defaultView.onerrorLineno > 0, "lineno set");
  t.ok(doc.defaultView.onerrorColno > 0, "colno set");
  t.ok(doc.defaultView.onerrorError);
  t.done();
};
