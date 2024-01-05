"use strict";
const assert = require("node:assert/strict");
const { describe, test } = require("node:test");

const { JSDOM } = require("../..");

describe("htmlinputelement", () => {
  test("html input should handle value/defaultValue correctly", () => {
    const input = (new JSDOM("<input>")).window.document.querySelector("input");

    assert.equal(input.value, "", "value should equal empty string if uninitialized");
    assert.equal(input.defaultValue, "", "defaultValue should equal empty string if uninitialized");
    assert.equal(input.getAttribute("value"), null, "value attribute should be null (uninitialized)");

    input.defaultValue = "abc";

    assert.equal(
      input.value,
      "abc",
      "setting the defaultValue should also change the value if \"dirty value\" is false"
    );
    assert.equal(input.defaultValue, "abc", "defaultValue should equal to set string");
    assert.equal(input.getAttribute("value"), "abc", "value attribute should equal to set string");

    input.value = "def";
    // dirtyValue is now true

    assert.equal(input.value, "def", "value should get changed by setter");
    assert.equal(input.defaultValue, "abc", "defaultValue should equal to set string");
    assert.equal(input.getAttribute("value"), "abc", "value attribute should not change");

    input.defaultValue = "abc2";

    assert.equal(input.value, "def", "value should not change by setting defaultValue is dirtyValue is set");
    assert.equal(input.defaultValue, "abc2", "defaultValue should equal to set string");

    input.value = null;

    assert.equal(input.value, "", "setting value to null should result in an empty string");
    assert.equal(input.getAttribute("value"), "abc2", "value attribute should not change");
  });

  test("html input should handle checked/defaultChecked correctly", () => {
    const checked = (new JSDOM()).window.document.createElement("input");

    assert.equal(checked.checked, false, "checkedness is false by default");

    checked.setAttribute("checked", "checked");
    assert.equal(checked.checked, true, "checked property must return the current checkedness");

    checked.removeAttribute("checked");
    assert.equal(
      checked.checked,
      false,
      "dirty checkedness is still false, the checkedness should have been changed"
    );

    checked.checked = false; // sets the element's dirty checkedness flag to true
    assert.equal(
      checked.checked,
      false,
      "on setting, the checked property must set the element's checkedness to the new value"
    );

    checked.setAttribute("checked", "checked");
    assert.equal(
      checked.checked,
      false,
      "checkedness should not have been changed because dirty checkedness is now true"
    );
  });

  test("uncheck other radio buttons in the same group", () => {
    const doc = (new JSDOM()).window.document;
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

    assert.equal(radioA.checked, false, "Setting checked on a radio should uncheck others in the same group");
    assert.equal(radioB.checked, true, "Last radio to be set should be checked");
    assert.equal(checkD.checked, true, "Radio\"s should not affect the checkedness of checkboxes");

    radioA.checked = true;
    form.appendChild(radioA);
    assert.equal(radioA.checked, true, "Just checked this");
    radioB.checked = true;
    form.appendChild(radioB);
    assert.equal(radioB.checked, true, "Just checked this");
    assert.equal(radioA.checked, false, "Changing the form owner should uncheck others");

    form.appendChild(radioC);
    radioC.name = "bar";
    radioA.checked = true;
    radioC.checked = true;
    assert.equal(radioA.checked, true, "Just checked this");
    assert.equal(radioC.checked, true, "Just checked this");
    radioC.name = "foo";
    assert.equal(radioA.checked, false, "Changing the name should uncheck others");
    assert.equal(radioC.checked, true, "Changing the name not uncheck itself");

    form.appendChild(checkD);
    radioC.checked = true;
    checkD.checked = true;
    assert.equal(radioC.checked, true, "Just checked this");
    checkD.type = "radio";
    assert.equal(radioC.checked, false, "Changing the type should uncheck others");
    assert.equal(checkD.checked, true, "Changing the name not uncheck itself");
  });

  test(
    "inputs should default to type text on the property, despite having no attribute",
    () => {
      const doc = (new JSDOM(`<html><head></head><body><input id="input" /></body></html>`)).window.document;
      const inputEl = doc.getElementById("input");

      assert.equal(inputEl.hasAttribute("type"), false);
      assert.equal(inputEl.getAttribute("type"), null);
      assert.equal(inputEl.type, "text");
    }
  );

  test("setting an input's type property should set its type attribute", () => {
    const doc = (new JSDOM(`<html><head></head><body><input id="input" /></body></html>`)).window.document;
    const inputEl = doc.getElementById("input");
    inputEl.type = "checkbox";

    assert.equal(inputEl.getAttribute("type"), "checkbox");
  });

  test(
    "an input's parsed type attribute should be reflected in both its property and attribute",
    () => {
      const doc = (new JSDOM(`<input id="input" type="checkbox" />`)).window.document;
      const inputEl = doc.getElementById("input");

      assert.equal(inputEl.type, "checkbox");
      assert.equal(inputEl.getAttribute("type"), "checkbox");
    }
  );
});
