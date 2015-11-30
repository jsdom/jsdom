"use strict";
const jsdom = require("../..");

exports["html textarea should handle value correctly"] = t => {
  const doc = jsdom.jsdom();
  const textarea = doc.createElement("textarea");

  t.strictEqual(textarea.defaultValue, "", "defaultValue is empty string when it has no content");
  t.strictEqual(textarea.value, "", "value is empty string when it has no content");

  textarea.textContent = "foo bar";
  t.strictEqual(textarea.defaultValue, "foo bar", "the defaultValue should reflect the textContent");
  t.strictEqual(textarea.value, "foo bar",
    "changing the textContent should change the raw value, and subsequently the api value");

  textarea.appendChild(doc.createTextNode(" baz"));
  t.strictEqual(textarea.defaultValue, "foo bar baz", "the defaultValue should reflect the textContent");
  t.strictEqual(textarea.value, "foo bar baz",
    "changing the textContent should change the raw value, and subsequently the api value");

  textarea.textContent = "foo\r\nbar\rbaz\nqux";
  t.strictEqual(textarea.defaultValue, "foo\r\nbar\rbaz\nqux", "the defaultValue should reflect the textContent");
  t.strictEqual(textarea.value, "foo\nbar\nbaz\nqux", "The value property should normalize CRLF and CR to LF");

  textarea.textContent = "foo";
  textarea.value = "baz"; // sets the element"s dirty value flag to true
  t.strictEqual(textarea.defaultValue, "foo", "setting the value property should not affect the defaultValue");
  t.strictEqual(textarea.textContent, "foo", "setting the value property should not affect the textContent");
  t.strictEqual(textarea.value, "baz",
    "on setting, the value property must set the element's raw & api value to the new value");

  textarea.value = "foo\r\nbar\rbaz\nqux";
  t.strictEqual(textarea.value, "foo\nbar\nbaz\nqux", "The API value should normalize CRLF and CR to LF");

  textarea.value = null;
  t.strictEqual(textarea.value, "", "setting the value property to null should result in an empty string");

  t.done();
};

exports["select() should select the entire contents"] = test => {
  const doc = jsdom.jsdom();
  const element = doc.createElement("textarea");

  element.value = "foo";
  element.select();

  test.strictEqual(element.selectionStart, 0);
  test.strictEqual(element.selectionEnd, 3);
  test.strictEqual(element.selectionDirection, "none");
  test.done();
};

exports["select() should emit a select event"] = test => {
  const doc = jsdom.jsdom();
  const element = doc.createElement("textarea");

  test.expect(1);

  element.value = "foo";

  element.addEventListener("select", event => {
    test.strictEqual(event.target, element);
    test.done();
  });

  element.select();
};

exports["setSelectionRange(start, end) should select a specific character range"] = test => {
  const doc = jsdom.jsdom();
  const element = doc.createElement("textarea");

  element.value = "foo";
  element.setSelectionRange(0, 2);

  test.strictEqual(element.selectionStart, 0);
  test.strictEqual(element.selectionEnd, 2);
  test.strictEqual(element.selectionDirection, "none");
  test.done();
};

exports["setSelectionRange() should emit a select event"] = test => {
  const doc = jsdom.jsdom();
  const element = doc.createElement("textarea");

  test.expect(1);

  element.value = "foo";

  element.addEventListener("select", event => {
    test.strictEqual(event.target, element);
    test.done();
  });

  element.setSelectionRange(0, 2);
};

exports["setRangeText(text) should replace the currently selected text"] = test => {
  const doc = jsdom.jsdom();
  const element = doc.createElement("textarea");

  element.value = "foo";
  element.setSelectionRange(0, 2);
  element.setRangeText("tw");

  test.strictEqual(element.value, "two");
  test.done();
};

exports["setRangeText(text, start, end) should replace text in the given range"] = test => {
  const doc = jsdom.jsdom();
  const element = doc.createElement("textarea");

  element.value = "foobarbaz";
  element.setRangeText("baz", 0, 6);

  test.strictEqual(element.value, "bazbaz");
  test.done();
};

exports["setRangeText(text, start, end, 'select') should create a new selection" +
"using start and end as bounds"] = test => {
  const doc = jsdom.jsdom();
  const element = doc.createElement("textarea");

  element.value = "foobarbaz";
  element.setRangeText("baz", 0, 6, "select");

  test.strictEqual(element.value, "bazbaz");
  test.strictEqual(element.selectionStart, 0);
  test.strictEqual(element.selectionEnd, 6);
  test.done();
};

exports["setRangeText(text, start, end, 'start') should create a new selection, collapsed" +
" to start"] = test => {
  const doc = jsdom.jsdom();
  const element = doc.createElement("textarea");

  element.value = "foobarbaz";
  element.setRangeText("baz", 0, 6, "start");

  test.strictEqual(element.value, "bazbaz");
  test.strictEqual(element.selectionStart, 0);
  test.strictEqual(element.selectionEnd, 0);
  test.done();
};

exports["setRangeText(text, start, end, 'end') should create a new selection, collapsed" +
" to end"] = test => {
  const doc = jsdom.jsdom();
  const element = doc.createElement("textarea");

  element.value = "foobarbaz";
  element.setRangeText("baz", 0, 6, "end");

  test.strictEqual(element.value, "bazbaz");
  test.strictEqual(element.selectionStart, 6);
  test.strictEqual(element.selectionEnd, 6);
  test.done();
};

exports["setRangeText() should emit a select event"] = test => {
  const doc = jsdom.jsdom();
  const element = doc.createElement("textarea");

  test.expect(1);

  element.value = "foo";

  element.addEventListener("select", event => {
    test.strictEqual(event.target, element);
    test.done();
  });

  element.setRangeText("tw", 0, 2);
};

exports["setting value should reset selection indexes back to defaults"] = test => {
  const doc = jsdom.jsdom();
  const element = doc.createElement("textarea");

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
