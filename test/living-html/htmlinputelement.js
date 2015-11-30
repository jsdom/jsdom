"use strict";
const jsdom = require("../..");

exports["html input should handle value/defaultValue correctly"] = t => {
  const input = jsdom.jsdom("<input>").querySelector("input");

  t.strictEqual(input.value, "", "value should equal empty string if uninitialized");
  t.strictEqual(input.defaultValue, "", "defaultValue should equal empty string if uninitialized");
  t.strictEqual(input.getAttribute("value"), null, "value attribute should be null (uninitialized)");

  input.defaultValue = "abc";

  t.strictEqual(input.value, "abc",
    "setting the defaultValue should also change the value if \"dirty value\" is false");
  t.strictEqual(input.defaultValue, "abc", "defaultValue should equal to set string");
  t.strictEqual(input.getAttribute("value"), "abc", "value attribute should equal to set string");

  input.value = "def";
  // dirtyValue is now true

  t.strictEqual(input.value, "def", "value should get changed by setter");
  t.strictEqual(input.defaultValue, "abc", "defaultValue should equal to set string");
  t.strictEqual(input.getAttribute("value"), "abc", "value attribute should not change");

  input.defaultValue = "abc2";

  t.strictEqual(input.value, "def", "value should not change by setting defaultValue is dirtyValue is set");
  t.strictEqual(input.defaultValue, "abc2", "defaultValue should equal to set string");

  input.value = null;

  t.strictEqual(input.value, "", "setting value to null should result in an empty string");
  t.strictEqual(input.getAttribute("value"), "abc2", "value attribute should not change");


  t.done();
};

exports["html input should handle checked/defaultChecked correctly"] = t => {
  const doc = jsdom.jsdom();
  const checked = doc.createElement("input");

  t.strictEqual(checked.checked, false, "checkedness is false by default");

  checked.setAttribute("checked", "checked");
  t.strictEqual(checked.checked, true, "checked property must return the current checkedness");

  checked.removeAttribute("checked");
  t.strictEqual(checked.checked, false, "dirty checkedness is still false, the checkedness should have been changed");

  checked.checked = false; // sets the element"s dirty checkedness flag to true
  t.strictEqual(checked.checked, false,
    "on setting, the checked property must set the element's checkedness to the new value");

  checked.setAttribute("checked", "checked");
  t.strictEqual(checked.checked, false,
    "checkedness should not have been changed because dirty checkedness is now true");

  t.done();
};

exports["uncheck other radio buttons in the same group"] = t => {
  const doc = jsdom.jsdom();
  const form = doc.createElement("form");
  const div = doc.createElement("div");
  const radioA = doc.createElement("input");
  const radioB = doc.createElement("input");
  const radioC = doc.createElement("input");
  const checkD = doc.createElement("input");
  radioA.type = "radio";
  radioB.type = "radio";
  radioC.type = "radio";
  checkD.type = "checkbox";
  radioA.name = "foo";
  radioB.name = "foo";
  radioC.name = "foo";
  checkD.name = "foo";

  div.appendChild(radioA);
  div.appendChild(radioB);
  // not yet C
  div.appendChild(checkD);

  checkD.checked = true;
  radioA.checked = true;
  radioB.checked = true;

  t.strictEqual(radioA.checked, false, "Setting checked on a radio should uncheck others in the same group");
  t.strictEqual(radioB.checked, true, "Last radio to be set should be checked");
  t.strictEqual(checkD.checked, true, "Radio\"s should not affect the checkedness of checkboxes");

  radioA.checked = true;
  form.appendChild(radioA);
  t.strictEqual(radioA.checked, true, "Just checked this");
  radioB.checked = true;
  form.appendChild(radioB);
  t.strictEqual(radioB.checked, true, "Just checked this");
  t.strictEqual(radioA.checked, false, "Changing the form owner should uncheck others");

  form.appendChild(radioC);
  radioC.name = "bar";
  radioA.checked = true;
  radioC.checked = true;
  t.strictEqual(radioA.checked, true, "Just checked this");
  t.strictEqual(radioC.checked, true, "Just checked this");
  radioC.name = "foo";
  t.strictEqual(radioA.checked, false, "Changing the name should uncheck others");
  t.strictEqual(radioC.checked, true, "Changing the name not uncheck itself");

  form.appendChild(checkD);
  radioC.checked = true;
  checkD.checked = true;
  t.strictEqual(radioC.checked, true, "Just checked this");
  checkD.type = "radio";
  t.strictEqual(radioC.checked, false, "Changing the type should uncheck others");
  t.strictEqual(checkD.checked, true, "Changing the name not uncheck itself");

  t.done();
};

exports["inputs should default to type text on the property, despite having no attribute"] = t => {
  const doc = jsdom.jsdom(`<html><head></head><body><input id="input" /></body></html>`);
  const inputEl = doc.getElementById("input");

  t.equal(inputEl.hasAttribute("type"), false);
  t.equal(inputEl.getAttribute("type"), null);
  t.equal(inputEl.type, "text");

  t.done();
};

exports["setting an input's type property should set its type attribute"] = t => {
  const doc = jsdom.jsdom(`<html><head></head><body><input id="input" /></body></html>`);
  const inputEl = doc.getElementById("input");
  inputEl.type = "checkbox";

  t.equal(inputEl.getAttribute("type"), "checkbox");

  t.done();
};

exports["an input's parsed type attribute should be reflected in both its property and attribute"] = t => {
  const doc = jsdom.jsdom(`<html><head></head><body><input id="input" type="checkbox" /></body></html>`);
  const inputEl = doc.getElementById("input");

  t.equal(inputEl.type, "checkbox");
  t.equal(inputEl.getAttribute("type"), "checkbox");

  t.done();
};

/*
  specific input types supporting selection are handled in the web platform test:
  https://github.com/w3c/web-platform-tests/blob/master/html/semantics/forms/the-input-element/input-textselection-01.html
 */

exports["select() should select the entire contents"] = test => {
  const doc = jsdom.jsdom(`<html><body><input id="input" type="text" /></body></html>`);
  const element = doc.getElementById("input");

  element.value = "foo";
  element.select();

  test.strictEqual(element.selectionStart, 0);
  test.strictEqual(element.selectionEnd, 3);
  test.strictEqual(element.selectionDirection, "none");
  test.done();
};

exports["select() should emit a select event"] = test => {
  const doc = jsdom.jsdom(`<html><body><input id="input" type="text" /></body></html>`);
  const element = doc.getElementById("input");

  test.expect(1);

  element.value = "foo";

  element.addEventListener("select", event => {
    test.strictEqual(event.target, element);
    test.done();
  });

  element.select();
};

exports["setSelectionRange(start, end) should select a specific character range"] = test => {
  const doc = jsdom.jsdom(`<html><body><input id="input" type="text" /></body></html>`);
  const element = doc.getElementById("input");

  element.value = "foo";
  element.setSelectionRange(0, 2);

  test.strictEqual(element.selectionStart, 0);
  test.strictEqual(element.selectionEnd, 2);
  test.strictEqual(element.selectionDirection, "none");
  test.done();
};

exports["setSelectionRange() should emit a select event"] = test => {
  const doc = jsdom.jsdom(`<html><body><input id="input" type="text" /></body></html>`);
  const element = doc.getElementById("input");

  test.expect(1);

  element.value = "foo";

  element.addEventListener("select", event => {
    test.strictEqual(event.target, element);
    test.done();
  });

  element.setSelectionRange(0, 2);
};

exports["setRangeText(text) should replace the currently selected text"] = test => {
  const doc = jsdom.jsdom(`<html><body><input id="input" type="text" /></body></html>`);
  const element = doc.getElementById("input");

  element.value = "foo";
  element.setSelectionRange(0, 2);
  element.setRangeText("tw");

  test.strictEqual(element.value, "two");
  test.done();
};

exports["setRangeText(text, start, end) should replace text in the given range"] = test => {
  const doc = jsdom.jsdom(`<html><body><input id="input" type="text" /></body></html>`);
  const element = doc.getElementById("input");

  element.value = "foobarbaz";
  element.setRangeText("baz", 0, 6);

  test.strictEqual(element.value, "bazbaz");
  test.done();
};

exports["setRangeText(text, start, end, 'select') should create a new selection using" +
"start and end as bounds"] = test => {
  const doc = jsdom.jsdom(`<html><body><input id="input" type="text" /></body></html>`);
  const element = doc.getElementById("input");

  element.value = "foobarbaz";
  element.setRangeText("baz", 0, 6, "select");

  test.strictEqual(element.value, "bazbaz");
  test.strictEqual(element.selectionStart, 0);
  test.strictEqual(element.selectionEnd, 6);
  test.done();
};

exports["setRangeText(text, start, end, 'start') should create a new selection, collapsed" +
" to start"] = test => {
  const doc = jsdom.jsdom(`<html><body><input id="input" type="text" /></body></html>`);
  const element = doc.getElementById("input");

  element.value = "foobarbaz";
  element.setRangeText("baz", 0, 6, "start");

  test.strictEqual(element.value, "bazbaz");
  test.strictEqual(element.selectionStart, 0);
  test.strictEqual(element.selectionEnd, 0);
  test.done();
};

exports["setRangeText(text, start, end, 'end') should create a new selection, collapsed to" +
" end"] = test => {
  const doc = jsdom.jsdom(`<html><body><input id="input" type="text" /></body></html>`);
  const element = doc.getElementById("input");

  element.value = "foobarbaz";
  element.setRangeText("baz", 0, 6, "end");

  test.strictEqual(element.value, "bazbaz");
  test.strictEqual(element.selectionStart, 6);
  test.strictEqual(element.selectionEnd, 6);
  test.done();
};

exports["setRangeText() should emit a select event"] = test => {
  const doc = jsdom.jsdom(`<html><body><input id="input" type="text" /></body></html>`);
  const element = doc.getElementById("input");

  test.expect(1);

  element.value = "foo";

  element.addEventListener("select", event => {
    test.strictEqual(event.target, element);
    test.done();
  });

  element.setRangeText("tw", 0, 2);
};

exports["setting value should reset selection indexes back to defaults"] = test => {
  const doc = jsdom.jsdom(`<html><body><input id="input" type="text" /></body></html>`);
  const element = doc.getElementById("input");

  element.value = "foo";
  element.select();

  test.strictEqual(element.selectionStart, 0);
  test.strictEqual(element.selectionEnd, 3);
  test.strictEqual(element.selectionDirection, "none");

  element.value = "bar";

  test.strictEqual(element.selectionStart, 0);
  test.strictEqual(element.selectionEnd, 0);
  test.strictEqual(element.selectionDirection, "none");

  test.done();
};
