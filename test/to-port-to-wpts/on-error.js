"use strict";
const { jsdom, createVirtualConsole } = require("../../lib/old-api.js");
const { toFileUrl, todo } = require("../util.js");

exports["onerror catches exceptions thrown in addEventListener event handlers"] = t => {
  const doc = jsdom("", { url: "http://example.com" });

  const error = new Error("oh no!");
  doc.body.addEventListener("click", () => {
    throw error;
  });

  doc.defaultView.addEventListener("error", event => {
    t.equal(event.message, "oh no!");

    todo(t, tt => { // TODO url parser
      tt.ok(event.filename === toFileUrl(__filename), "filename equality");
    });

    t.ok(event.lineno > 0);
    t.ok(event.colno > 0);
    t.equal(event.error, error);
    t.done();
  });

  doc.body.click();
};

exports["onerror property catches exceptions thrown in addEventListener event handlers"] = t => {
  const doc = jsdom("", { url: "http://example.com" });

  const errorThrown = new Error("oh no!");
  doc.body.addEventListener("click", () => {
    throw errorThrown;
  });

  doc.defaultView.onerror = (message, filename, lineno, colno, error) => {
    t.equal(message, "oh no!");

    todo(t, tt => { // TODO url parser
      tt.ok(filename === toFileUrl(__filename), "filename equality");
    });

    t.ok(lineno > 0);
    t.ok(colno > 0);
    t.equal(error, errorThrown);
    t.done();
  };

  doc.body.click();
};

exports["onerror catches exceptions thrown in addEventListener event handlers (multiline message)"] = t => {
  const doc = jsdom("", { url: "http://example.com" });

  const error = new Error("oh\nno\n!");
  doc.body.addEventListener("click", () => {
    throw error;
  });

  doc.defaultView.addEventListener("error", event => {
    todo(t, tt => { // TODO url parser
      tt.ok(event.filename === toFileUrl(__filename), "filename equality");
    });

    t.ok(event.lineno > 0);
    t.ok(event.colno > 0);
    t.equal(event.error, error);
    t.done();
  });

  doc.body.click();
};

exports["onerror catches exceptions thrown in inline event handlers"] = t => {
  const doc = jsdom(`<body onclick="throw new Error('oh no!')"></body>`, { url: "http://example.com" });

  doc.defaultView.addEventListener("error", event => {
    t.equal(event.message, "oh no!");
    t.equal(event.filename, "http://example.com/");
    t.ok(event.lineno > 0, "lineno set");
    t.ok(event.colno > 0, "colno set");
    t.ok(event.error);
    t.done();
  });

  doc.body.click();
};

exports["onerror catches exceptions thrown in inline event handler properties"] = t => {
  const doc = jsdom("", { url: "http://example.com" });

  doc.body.onclick = () => {
    throw new Error("oh no!");
  };

  doc.defaultView.addEventListener("error", event => {
    t.equal(event.message, "oh no!", "message equality");

    todo(t, tt => { // TODO url parser
      tt.ok(event.filename === toFileUrl(__filename), "filename equality");
    });

    t.ok(event.lineno > 0, "lineno set");
    t.ok(event.colno > 0, "colno set");
    t.ok(event.error);
    t.done();
  });

  doc.body.click();
};

exports["onerror catches exceptions thrown in sync script execution"] = t => {
  const doc = jsdom("", { url: "http://example.com" });

  doc.defaultView.addEventListener("error", event => {
    t.equal(event.message, "oh no!", "message equality");
    t.equal(event.filename, "http://example.com/");
    t.ok(event.lineno > 0, "lineno set");
    t.ok(event.colno > 0, "colno set");
    t.ok(event.error);
    t.done();
  });

  doc.body.innerHTML = `<script>throw new Error("oh no!");</script>`;
};

exports["onerror set during parsing catches exceptions thrown in sync script execution during parsing"] = t => {
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

  t.equal(doc.defaultView.onerrorMessage, "oh no!", "message equality");
  t.equal(doc.defaultView.onerrorFilename, "http://example.com/");
  t.ok(doc.defaultView.onerrorLineno > 0, "lineno set");
  t.ok(doc.defaultView.onerrorColno > 0, "colno set");
  t.ok(doc.defaultView.onerrorError);
  t.done();
};

exports["unhandled Errors thrown in sync script excecution during parsing go to the virtual console"] = t => {
  const virtualConsole = createVirtualConsole();
  virtualConsole.on("jsdomError", error => {
    t.ok(error instanceof Error);
    t.ok(error.message === "Uncaught [TypeError: oh no!]");
    t.equal(error.detail.constructor.name, "TypeError");
    t.done();
  });

  jsdom(`<script>throw new TypeError("oh no!")</script>`, { virtualConsole });
};

exports["unhandled non-Error exceptions thrown in sync script excecution during parsing go to the virtual console"] =
t => {
  const virtualConsole = createVirtualConsole();
  virtualConsole.on("jsdomError", error => {
    t.ok(error instanceof Error);
    t.ok(error.message === "Uncaught Object {}" || error.message === "Uncaught {}"); // Browserify hasn't caught up yet
    t.equal(typeof error.detail, "object");
    t.notEqual(error.detail, null);
    t.done();
  });

  jsdom(`<script>throw {}</script>`, { virtualConsole });
};

exports["unhandled exceptions thrown in inline event handlers go to the virtual console"] = t => {
  const virtualConsole = createVirtualConsole();
  virtualConsole.on("jsdomError", error => {
    t.ok(error instanceof Error);
    t.equal(error.message, "Uncaught [Error: oh no!]");
    t.equal(error.detail.constructor.name, "Error");
    t.done();
  });

  const doc = jsdom(`<body onclick="throw new Error('oh no!')"></body>`, { virtualConsole });

  doc.body.click();
};

exports["adding an onerror handler does not prevent errors from going to the virtual console"] = t => {
  const virtualConsole = createVirtualConsole();
  virtualConsole.on("jsdomError", error => {
    t.ok(error instanceof Error);
    t.equal(error.message, "Uncaught [Error: oh no!]");
    t.equal(error.detail.constructor.name, "Error");
    t.done();
  });

  const doc = jsdom(`<body onclick="throw new Error('oh no!')"></body>`, { virtualConsole });

  doc.defaultView.onerror = () => {
    // just a no-op handler to trigger the setter logic
  };

  doc.body.click();
};

exports["adding an onerror handler that returns true *does* prevent errors from going to the virtual console"] = t => {
  const virtualConsole = createVirtualConsole();
  virtualConsole.on("jsdomError", () => {
    t.fail("should not get here");
  });

  const doc = jsdom(`<body onclick="throw new Error('oh no!')"></body>`, { virtualConsole });

  doc.defaultView.onerror = () => true;

  doc.body.click();

  setTimeout(() => {
    t.done();
  }, 30);
};
