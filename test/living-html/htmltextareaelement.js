"use strict";

var jsdom = require("../..");

exports['html textarea should handle value correctly'] = function (t) {
  var doc = jsdom.jsdom('<html><head></head><body></body></html>');
  var textarea = doc.createElement('textarea');

  t.strictEqual(textarea.defaultValue, '',
    'defaultValue is empty string when it has no content');
  t.strictEqual(textarea.value, '',
    'value is empty string when it has no content');

  textarea.textContent = 'foo bar';
  t.strictEqual(textarea.defaultValue, 'foo bar',
    'the defaultValue should reflect the textContent');
  t.strictEqual(textarea.value, 'foo bar',
    'changing the textContent should change the raw value, and subsequently the api value');

  textarea.appendChild(doc.createTextNode(' baz'));
  t.strictEqual(textarea.defaultValue, 'foo bar baz',
    'the defaultValue should reflect the textContent');
  t.strictEqual(textarea.value, 'foo bar baz',
    'changing the textContent should change the raw value, and subsequently the api value');

  textarea.textContent = 'foo\r\nbar\rbaz\nqux';
  t.strictEqual(textarea.defaultValue, 'foo\r\nbar\rbaz\nqux',
    'the defaultValue should reflect the textContent');
  t.strictEqual(textarea.value, 'foo\nbar\nbaz\nqux',
    'The API value should normalize CRLF and CR to LF');

  textarea.textContent = 'foo';
  textarea.value = 'baz'; // sets the element's dirty value flag to true
  t.strictEqual(textarea.defaultValue, 'foo',
    'setting the value IDL should not affect the defaultValue');
  t.strictEqual(textarea.textContent, 'foo',
    'setting the value IDL should not affect the textContent');
  t.strictEqual(textarea.value, 'baz',
    'on setting, the value IDL must set the element\'s raw & api value to the new value');

  textarea.value = 'foo\r\nbar\rbaz\nqux';
  t.strictEqual(textarea.value, 'foo\nbar\nbaz\nqux',
    'The API value should normalize CRLF and CR to LF');

  textarea.value = null;
  t.strictEqual(textarea.value, '',
    'setting the idl value to null should result in an empty string');

  t.done();
};
