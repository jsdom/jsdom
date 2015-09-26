"use strict";
const jsdom = require("../..");

exports["html form should implement the reset() method"] = t => {
  const doc = jsdom.jsdom();
  const form = doc.createElement("form");
  const text = doc.createElement("input");
  text.type = "text";
  const checkbox = doc.createElement("input");
  checkbox.type = "checkbox";
  const select = doc.createElement("select");
  select.multiple = true;
  const option = doc.createElement("option");
  option.value = "option";
  const textarea = doc.createElement("textarea");

  form.appendChild(text);
  form.appendChild(checkbox);
  form.appendChild(textarea);
  form.appendChild(select);
  select.appendChild(option);

  text.defaultValue = "text default";
  checkbox.defaultChecked = true;
  option.defaultSelected = true;
  textarea.defaultValue = "textarea default";

  text.value = "text new value";
  checkbox.checked = false;
  option.selected = false;
  textarea.value = "textarea new value";

  form.reset();

  t.strictEqual(text.value, "text default", "input should reset value to default");
  t.strictEqual(checkbox.checked, true, "input should reset checkedness to default");
  t.strictEqual(option.selected, true, "second option should reset selectedness to default");
  t.strictEqual(select.selectedIndex, 0, "second option should reset selectedness to default");
  t.strictEqual(textarea.value, "textarea default", "textarea should reset api value to default");

  text.defaultValue = "text new default";
  checkbox.defaultChecked = false;
  option.defaultSelected = false;
  textarea.defaultValue = "textarea new default";

  t.strictEqual(text.value, "text new default", "input should reset dirty value to false");
  t.strictEqual(checkbox.checked, false, "input should reset dirty checkedness to false");
  t.strictEqual(option.selected, false, "option should reset dirtyness to false");
  t.strictEqual(select.selectedIndex, -1, "option should reset dirtyness to false");
  t.strictEqual(textarea.value, "textarea new default", "textarea should reset dirty value to false");

  t.done();
};
