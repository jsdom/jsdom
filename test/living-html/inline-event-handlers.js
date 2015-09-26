"use strict";
const jsdom = require("../..").jsdom;

exports["inline event handlers have the correct global scope"] = t => {
  const doc = jsdom(`<div onclick="document.foo = 'clicked'"></div>`);
  const div = doc.body.firstElementChild;

  div.click();

  t.equal(doc.foo, "clicked");
  t.done();
};

exports["inline error event handlers have the correct global scope"] = t => {
  const doc = jsdom(`<body onerror="document.foo = 'errored'"></div>`);

  const e = new doc.defaultView.ErrorEvent("error");
  doc.defaultView.dispatchEvent(e);

  t.equal(doc.foo, "errored");
  t.done();
};

exports["inline event handlers have their return values reflected in the corresponding property"] = t => {
  const doc = jsdom(`<div onclick="return 10"></div>`);
  const div = doc.body.firstElementChild;

  t.equal(div.onclick(), 10);
  t.done();
};

exports["inline event handlers have their return values reflected in the corresponding property"] = t => {
  const doc = jsdom(`<body onerror="return 10"></div>`);

  t.equal(doc.defaultView.onerror(), 10);
  t.done();
};

exports["inline event handlers have access to an event argument"] = t => {
  const doc = jsdom(`<div onclick="document.bubbles = event.bubbles"></div>`);
  const div = doc.body.firstElementChild;

  div.click();

  t.equal(doc.bubbles, true);
  t.done();
};

exports["inline error event handlers have access to a lot of arguments"] = t => {
  const doc = jsdom(`<body onerror="document.onerrorEvent = event; document.onerrorSource = source;
    document.onerrorLineno = lineno; document.onerrorColno = colno; document.onerrorError = error;"></div>`);

  const errorObj = { should: "be this object" };
  const e = new doc.defaultView.ErrorEvent("error", {
    message: "message blah",
    filename: "filenameblahblah",
    lineno: 5,
    colno: 10,
    error: errorObj
  });
  doc.defaultView.dispatchEvent(e);

  t.equal(doc.onerrorEvent, "message blah");
  t.equal(doc.onerrorSource, "filenameblahblah");
  t.equal(doc.onerrorLineno, 5);
  t.equal(doc.onerrorColno, 10);
  t.equal(doc.onerrorError, errorObj);
  t.done();
};

exports["inline event handlers set via properties have access to an event argument"] = t => {
  const doc = jsdom(`<div></div>`);
  const div = doc.body.firstElementChild;

  div.onclick = function (event) {
    t.equals(event.constructor, doc.defaultView.MouseEvent);
    t.done();
  };

  div.click();
};

exports["inline error event handlers set via properties have access to lots of arguments"] = t => {
  const doc = jsdom();

  const errorObj = { should: "be this object" };

  doc.defaultView.onerror = function (event, source, lineno, colno, error) {
    t.equal(event, "message blah");
    t.equal(source, "filenameblahblah");
    t.equal(lineno, 5);
    t.equal(colno, 10);
    t.equal(error, errorObj);
    t.done();
  };

  const e = new doc.defaultView.ErrorEvent("error", {
    message: "message blah",
    filename: "filenameblahblah",
    lineno: 5,
    colno: 10,
    error: errorObj
  });
  doc.defaultView.dispatchEvent(e);
};

exports["returning false from a click inline event handler cancels the event"] = t => {
  const doc = jsdom(`<div onclick="return false"></div>`);
  const div = doc.body.firstElementChild;

  const e = new doc.defaultView.MouseEvent("click", { bubbles: true, cancelable: true });
  t.equals(e.defaultPrevented, false);

  div.dispatchEvent(e);

  t.equal(e.defaultPrevented, true);
  t.done();
};

exports["returning false from a click inline event handler property cancels the event"] = t => {
  const doc = jsdom(`<div></div>`);
  const div = doc.body.firstElementChild;
  div.onclick = () => false;

  const e = new doc.defaultView.MouseEvent("click", { bubbles: true, cancelable: true });
  t.equals(e.defaultPrevented, false);

  div.dispatchEvent(e);

  t.equal(e.defaultPrevented, true);
  t.done();
};

exports["returning true from a click inline event handler does nothing to the event"] = t => {
  const doc = jsdom(`<div onclick="return true"></div>`);
  const div = doc.body.firstElementChild;

  const e = new doc.defaultView.MouseEvent("click", { bubbles: true, cancelable: true });
  t.equals(e.defaultPrevented, false);

  div.dispatchEvent(e);

  t.equal(e.defaultPrevented, false);
  t.done();
};

exports["returning true from a click inline event handler property does nothing to the event"] = t => {
  const doc = jsdom(`<div></div>`);
  const div = doc.body.firstElementChild;
  div.onclick = () => true;

  const e = new doc.defaultView.MouseEvent("click", { bubbles: true, cancelable: true });
  t.equals(e.defaultPrevented, false);

  div.dispatchEvent(e);

  t.equal(e.defaultPrevented, false);
  t.done();
};

exports["returning false from a mouseover inline event handler does nothing to the event"] = t => {
  const doc = jsdom(`<div onmouseover="return false"></div>`);
  const div = doc.body.firstElementChild;

  const e = new doc.defaultView.MouseEvent("mouseover", { bubbles: true, cancelable: true });
  t.equals(e.defaultPrevented, false);

  div.dispatchEvent(e);

  t.equal(e.defaultPrevented, false);
  t.done();
};

exports["returning false from a mouseover inline event handler property does nothing to the event"] = t => {
  const doc = jsdom(`<div></div>`);
  const div = doc.body.firstElementChild;
  div.onmouseover = () => false;

  const e = new doc.defaultView.MouseEvent("mouseover", { bubbles: true, cancelable: true });
  t.equals(e.defaultPrevented, false);

  div.dispatchEvent(e);

  t.equal(e.defaultPrevented, false);
  t.done();
};

exports["returning true from a mouseover inline event handler cancels the event"] = t => {
  const doc = jsdom(`<div onmouseover="return true"></div>`);
  const div = doc.body.firstElementChild;

  const e = new doc.defaultView.MouseEvent("mouseover", { bubbles: true, cancelable: true });
  t.equals(e.defaultPrevented, false);

  div.dispatchEvent(e);

  t.equal(e.defaultPrevented, true);
  t.done();
};

exports["returning true from a mouseover inline event handler property cancels the event"] = t => {
  const doc = jsdom(`<div></div>`);
  const div = doc.body.firstElementChild;
  div.onmouseover = () => true;

  const e = new doc.defaultView.MouseEvent("mouseover", { bubbles: true, cancelable: true });
  t.equals(e.defaultPrevented, false);

  div.dispatchEvent(e);

  t.equal(e.defaultPrevented, true);
  t.done();
};

exports["returning false from an error inline event handler does nothing to the event"] = t => {
  const doc = jsdom(`<body onerror="return false"></div>`);

  const e = new doc.defaultView.ErrorEvent("error", { bubbles: true, cancelable: true });
  t.equals(e.defaultPrevented, false);

  doc.defaultView.dispatchEvent(e);

  t.equal(e.defaultPrevented, false);
  t.done();
};

exports["returning false from an error inline event handler property does nothing to the event"] = t => {
  const doc = jsdom();
  doc.defaultView.onerror = () => false;

  const e = new doc.defaultView.ErrorEvent("error", { bubbles: true, cancelable: true });
  t.equals(e.defaultPrevented, false);

  doc.defaultView.dispatchEvent(e);

  t.equal(e.defaultPrevented, false);
  t.done();
};

exports["returning true from an error inline event handler cancels the event"] = t => {
  const doc = jsdom(`<body onerror="return true"></div>`);

  const e = new doc.defaultView.ErrorEvent("error", { bubbles: true, cancelable: true });
  t.equals(e.defaultPrevented, false);

  doc.defaultView.dispatchEvent(e);

  t.equal(e.defaultPrevented, true);
  t.done();
};

exports["returning true from an error inline event handler property cancels the event"] = t => {
  const doc = jsdom();
  doc.defaultView.onerror = () => true;

  const e = new doc.defaultView.ErrorEvent("error", { bubbles: true, cancelable: true });
  t.equals(e.defaultPrevented, false);

  doc.defaultView.dispatchEvent(e);

  t.equal(e.defaultPrevented, true);
  t.done();
};

const proxied = ["onblur", "onerror", "onfocus", "onload", "onresize", "onscroll", "onafterprint",
  "onbeforeprint", "onbeforeunload", "onhashchange", "onlanguagechange", "onmessage", "onoffline", "ononline",
  "onpagehide", "onpageshow", "onpopstate", "onstorage", "onunload"];

exports["proxied body/window event handlers: setting on body as properties reflects on window"] = t => {
  const doc = jsdom();

  for (const name of proxied) {
    function handler() { }

    doc.body[name] = handler;
    t.equal(doc.body[name], handler, `${name} should be set on the body correctly`);
    t.equal(doc.defaultView[name], handler, `${name} should be set on the window correctly`);

    doc.body[name] = null;
    t.equal(doc.body[name], null, `${name} should be unset on the body correctly`);
    t.equal(doc.defaultView[name], null, `${name} should be unset on the window correctly`);
  }

  t.done();
};

exports["proxied body/window event handlers: setting on body as attributes reflects on window"] = t => {
  const doc = jsdom();

  for (const name of proxied) {
    doc.body.setAttribute(name, "return 5;");
    t.equal(doc.body[name](), 5, `${name} should be set on the body correctly`);
    t.equal(doc.defaultView[name](), 5, `${name} should be set on the window correctly`);

    doc.body.removeAttribute(name);
    t.equal(doc.body[name], null, `${name} should be unset on the body correctly`);
    t.equal(doc.defaultView[name], null, `${name} should be unset on the window correctly`);
  }

  t.done();
};
