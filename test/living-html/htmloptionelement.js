"use strict";
const jsdom = require("../..");

exports["html option should handle selected/defaultSelected correctly"] = t => {
  const doc = jsdom.jsdom();
  const option = doc.createElement("option");

  t.strictEqual(option.selected, false, "selectedness is false by default");

  option.setAttribute("selected", "selected");
  t.strictEqual(option.selected, true, "selected property must return the current selectedness");

  option.removeAttribute("selected");
  t.strictEqual(option.selected, false, "dirtiness is still false, the selectedness should have been changed");

  option.selected = false; // sets the element's dirtiness flag to true
  t.strictEqual(option.selected, false,
    "on setting, the selected property must set the element's selectedness to the new value");

  option.setAttribute("selected", "selected");
  t.strictEqual(option.selected, false, "selectedness should not have been changed because dirtiness is now true");

  t.done();
};

exports["html option should ask-for-a-reset correctly"] = t => {
  const doc = jsdom.jsdom();
  const select = doc.createElement("select");
  select.multiple = false;
  select.size = 1;
  const optionA = doc.createElement("option");
  const optionB = doc.createElement("option");
  const optionC = doc.createElement("option");
  const optgroupA = doc.createElement("optgroup");
  const optionAA = doc.createElement("option");
  const optionAB = doc.createElement("option");
  const optionAC = doc.createElement("option");
  select.appendChild(optionA);
  select.appendChild(optionB);
  select.appendChild(optionC);
  optgroupA.appendChild(optionAA);
  optgroupA.appendChild(optionAB);
  optgroupA.appendChild(optionAC);
  // (optgroupA not yet appended)

  // (these assertion messages assume multiline=false and size=1)
  t.strictEqual(optionA.selected, true, "If 0 options are selected in an ask-for-a-reset, select the first option");
  t.strictEqual(optionB.selected, false, "If 0 options are selected in an ask-for-a-reset, select the first option");
  t.strictEqual(optionC.selected, false, "If 0 options are selected in an ask-for-a-reset, select the first option");

  optionB.defaultSelected = true;
  optionA.defaultSelected = true;
  t.strictEqual(optionA.selected, true, "Setting defaultSelected should reset others");
  t.strictEqual(optionB.selected, false, "Setting defaultSelected should reset others");
  t.strictEqual(optionC.selected, false, "Setting defaultSelected should reset others");

  optionB.defaultSelected = true;
  t.strictEqual(optionA.selected, false, "Setting defaultSelected should reset others without setting dirtyness");
  t.strictEqual(optionB.selected, true, "Setting defaultSelected should reset others without setting dirtyness");
  t.strictEqual(optionC.selected, false, "Setting defaultSelected should reset others without setting dirtyness");

  optionA.disabled = true;
  optionA.defaultSelected = false;
  optionB.defaultSelected = false;
  t.strictEqual(optionA.selected, false,
    "If 0 options are selected in an ask-for-a-reset, select the first non disabled option");
  t.strictEqual(optionB.selected, true,
    "If 0 options are selected in an ask-for-a-reset, select the first non disabled option");
  t.strictEqual(optionC.selected, false,
    "If 0 options are selected in an ask-for-a-reset, select the first non disabled option");
  optionA.disabled = false;

  optionAA.selected = true;
  optionAB.selected = true;
  optionAC.selected = true;
  t.strictEqual(optionAA.selected, true, "options in a distached optgroup should not affect each other");
  t.strictEqual(optionAB.selected, true, "options in a distached optgroup should not affect each other");
  t.strictEqual(optionAC.selected, true, "options in a distached optgroup should not affect each other");

  select.appendChild(optgroupA);
  t.strictEqual(optionA.selected, false,
    "If 2 or more options are selected in an ask-for-a-reset, select the last option");
  t.strictEqual(optionB.selected, false,
    "If 2 or more options are selected in an ask-for-a-reset, select the last option");
  t.strictEqual(optionC.selected, false,
    "If 2 or more options are selected in an ask-for-a-reset, select the last option");
  t.strictEqual(optionAA.selected, false,
    "If 2 or more options are selected in an ask-for-a-reset, select the last option");
  t.strictEqual(optionAB.selected, false,
    "If 2 or more options are selected in an ask-for-a-reset, select the last option");
  t.strictEqual(optionAC.selected, true,
    "If 2 or more options are selected in an ask-for-a-reset, select the last option");

  select.removeChild(optgroupA);
  t.strictEqual(optionA.selected, true, "If 0 options are selected in an ask-for-a-reset, select the first option");
  t.strictEqual(optionB.selected, false, "If 0 options are selected in an ask-for-a-reset, select the first option");
  t.strictEqual(optionC.selected, false, "If 0 options are selected in an ask-for-a-reset, select the first option");

  optionA.disabled = true;
  t.strictEqual(optionA.selected, true, "setting disabled on an selected option should not change the selection");
  t.strictEqual(optionB.selected, false, "setting disabled on an selected option should not change the selection");
  t.strictEqual(optionC.selected, false, "setting disabled on an selected option should not change the selection");


  select.multiple = true;
  optionA.disabled = true;
  optionA.selected = true;
  optionB.selected = true;
  optionC.selected = true;
  select.multiple = false;
  t.strictEqual(optionA.selected, false,
    "If 2 or more options are selected in an ask-for-a-reset, select the last option");
  t.strictEqual(optionB.selected, false,
    "If 2 or more options are selected in an ask-for-a-reset, select the last option");
  t.strictEqual(optionC.selected, true,
    "If 2 or more options are selected in an ask-for-a-reset, select the last option");

  select.size = 3;
  optionA.disabled = true;
  optionA.selected = false;
  optionB.selected = false;
  optionC.selected = false;
  select.size = 1;
  t.strictEqual(optionA.selected, false,
    "If 0 options are selected in an ask-for-a-reset, select the first non disabled option");
  t.strictEqual(optionB.selected, true,
    "If 0 options are selected in an ask-for-a-reset, select the first non disabled option");
  t.strictEqual(optionC.selected, false,
    "If 0 options are selected in an ask-for-a-reset, select the first non disabled option");

  t.done();
};
