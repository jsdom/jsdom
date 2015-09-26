"use strict";
const jsdom = require("../..");

exports["a button's type should be submit by default"] = t => {
  const doc = jsdom.jsdom();
  const button = doc.createElement("button");

  t.equal(button.type, "submit");
  t.done();
};

exports["a button's type should stay within the range of valid values"] = t => {
  const doc = jsdom.jsdom();
  const button = doc.createElement("button");

  for (const type of ["reset", "button", "menu", "submit"]) {
    button.type = type;
    t.equal(button.type, type);

    button.type = type.toUpperCase();
    t.equal(button.type, type);
  }

  button.type = "reset";
  button.type = "asdfgdsafd";
  t.equal(button.type, "submit");

  button.type = "reset";
  button.type = "";
  t.equal(button.type, "submit");

  t.done();
};

exports["clicking a button with .click() should trigger a submit"] = t => {
  const doc = jsdom.jsdom();
  const form = doc.createElement("form");
  const button = doc.createElement("button");

  form.appendChild(button);
  form.addEventListener("submit", ev => {
    t.equal(ev.target, form);
    t.done();
  });

  button.click();
};

exports["clicking a button by dispatching an event should trigger a submit"] = t => {
  const doc = jsdom.jsdom();
  const form = doc.createElement("form");
  const button = doc.createElement("button");

  form.appendChild(button);
  form.addEventListener("submit", ev => {
    t.equal(ev.target, form);
    t.done();
  });

  const e = new doc.defaultView.MouseEvent("click");
  button.dispatchEvent(e);
};
