"use strict";
const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

describe("browser/index", () => {
  specify("notfound_getelementsbyclassname", () => {
    const doc = (new JSDOM()).window.document;
    const { body } = doc;

    const p = doc.createElement("p");
    p.className = "unknown";
    body.appendChild(p);
    const elements = doc.getElementsByClassName("first-p");
    assert.equal(elements.length, 0, "no results");
  });

  specify("basic_getelementsbyclassname", () => {
    const doc = (new JSDOM()).window.document;
    const { body } = doc;

    const p = doc.createElement("p");
    p.className = "first-p";
    body.appendChild(p);
    const elements = doc.getElementsByClassName("first-p");
    assert.equal(elements.item(0), p, "p and first-p");
  });

  specify("multiple_getelementsbyclassname", () => {
    const doc = (new JSDOM()).window.document;
    const { body } = doc;

    const p = doc.createElement("p");
    p.className = "first-p second third";
    body.appendChild(p);
    const first = doc.getElementsByClassName("first-p").item(0);
    const second = doc.getElementsByClassName("second").item(0);
    const third = doc.getElementsByClassName("third").item(0);
    assert.equal(first, p, "p and first-p");
    assert.equal(second, p, "p and second");
    assert.equal(third, p, "p and third");
  });

  specify("testclassnameworksasexpected", () => {
    const doc = (new JSDOM()).window.document;

    const p = doc.createElement("p");
    p.setAttribute("class", "first-p");
    assert.equal(p.className, "first-p", "class attribute is same as className");
    p.className += " second";
    assert.equal(p.className, "first-p second", "className getter/setter");
  });

  specify("basic_getelementbyid", () => {
    const doc = (new JSDOM()).window.document;
    const { body } = doc;

    const p = doc.createElement("p");
    p.id = "theid";
    body.appendChild(p);
    const element = doc.getElementById("theid");
    assert.equal(element, p, "p and #theid");
  });

  specify("nonexistant_getelementbyid", () => {
    const doc = (new JSDOM()).window.document;
    const { body } = doc;

    const p = doc.createElement("p");
    p.id = "theid";
    body.appendChild(p);
    const element = doc.getElementById("non-existant-id");
    assert.equal(element, null, "p and #theid");
  });

  specify("remove_nonexistantattribute", () => {
    const doc = (new JSDOM()).window.document;
    const { body } = doc;

    assert.doesNotThrow(() => body.removeAttribute("non-existant"), "setValue_throws_NO_MODIFICATION_ERR");
  });

  specify("render_singletag", () => {
    const doc = (new JSDOM()).window.document;

    const p = doc.createElement("p");
    const img = doc.createElement("img");
    p.appendChild(img);
    const out = p.outerHTML;
    assert.equal(out.match(/<\/img>/), null, "end tag not included in output");
  });

  specify("render_specialchars", () => {
    const doc = (new JSDOM()).window.document;

    const p = doc.createElement("p");
    const specials = "\"<>&\xA0";
    const escapedSpecials = "\"&lt;&gt;&amp;&nbsp;";
    p.setAttribute("specials", specials);
    p.innerHTML = escapedSpecials;
    const pp = doc.createElement("p");
    pp.appendChild(p);
    assert.equal(pp.innerHTML, `<p specials="&quot;<>&amp;&nbsp;">"&lt;&gt;&amp;&nbsp;</p>`);
  });

  specify("parse_scripttags", () => {
    const doc = (new JSDOM()).window.document;
    const { head } = doc;

    const scriptHtml = `<script>alert("hello world")</script>`;
    head.innerHTML = scriptHtml;
    assert.equal(scriptHtml, head.innerHTML, "original and processed");
  });

  specify("parse_styletags", () => {
    const doc = (new JSDOM()).window.document;
    const { head } = doc;
    const styleHtml = `<style>body: {color: #fff;}</style>`;
    head.innerHTML = styleHtml;
    assert.equal(styleHtml, head.innerHTML, "original and processed");
  });

  specify("parse_doublespacetags", () => {
    const doc = (new JSDOM()).window.document;
    const html = `<html><body  class="testing" /></html>`;
    assert.doesNotThrow(() => doc.write(html), "setValue_throws_INVALID_CHARACTER_ERR");
  });

  specify("serialize_styleattribute", () => {
    const doc = (new JSDOM()).window.document;

    doc.documentElement.style.color = "black";
    doc.documentElement.style.backgroundColor = "white";
    assert.equal(
      doc.documentElement.outerHTML,
      `<html style="color: black; background-color: white;"><head></head><body></body></html>`
    );
  });

  specify("innerhtml_removeallchildren", () => {
    const doc = (new JSDOM()).window.document;
    const { body } = doc;

    body.appendChild(doc.createElement("p"));
    body.innerHTML = "";
    assert.equal(body.childNodes.length, 0, "still has children");
  });

  specify("innerhtml_null", () => {
    const doc = (new JSDOM()).window.document;
    const { body } = doc;

    body.appendChild(doc.createElement("p"));
    body.innerHTML = null;
    assert.equal(body.childNodes.length, 0, "still has children");
  });

  specify("parse_doctype_containing_newline", () => {
    const html = `<!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"\n
             "http://www.w3.org/TR/xhtml1/DTD/xhtml1-strict.dtd">\n<html></html>`;

    const doc = (new JSDOM(html)).window.document;

    assert.ok(doc.doctype, "doctype should not be falsy");
  });

  specify("basic_nodelist_indexOf", () => {
    const doc = (new JSDOM()).window.document;
    const { body } = doc;

    const p = doc.createElement("p");
    body.appendChild(p);
    const div = doc.createElement("div");
    body.appendChild(div);
    const span = doc.createElement("span");
    body.appendChild(span);
    const index = Array.prototype.indexOf.call(body.childNodes, span);
    assert.equal(index, 2, "indexOf 'span' in childNodes");
  });

  specify("nonexistant_nodelist_indexOf", () => {
    const doc = (new JSDOM()).window.document;
    const { body } = doc;

    const p = doc.createElement("p");
    body.appendChild(p);
    const div = doc.createElement("div");
    p.appendChild(div);
    const index = Array.prototype.indexOf.call(body.childNodes, div);
    assert.equal(index, -1, "indexOf 'div' in childNodes");
  });

  specify("input_fires_click_event", () => {
    const doc = (new JSDOM(`
      <html><head></head><body>
        <input type="checkbox" id="check" value="check" />
      </body>
    `)).window.document;

    const checkbox = doc.getElementById("check");

    checkbox.addEventListener("click", event => {
      assert.equal(event.type, "click", "event type");
      assert.equal(event.target, checkbox, "event type");
    });

    checkbox.click();
  });

  specify("basic_radio_selected", () => {
    const doc = (new JSDOM(`<html><head></head><body>
        <input type="radio" id="rad0" value="rad0" name="radioGroup0" />
        <input type="radio" id="rad1" value="rad1" name="radioGroup0" checked="checked" />
        <input type="radio" id="rad2" value="rad2" name="radioGroup1" />
      </body>
    `)).window.document;

    const radio0 = doc.getElementById("rad0");
    const radio1 = doc.getElementById("rad1");
    const radio2 = doc.getElementById("rad2");

    assert.ok(!radio0.checked, "radio not checked");
    assert.ok(radio1.checked, "radio checked");
    assert.ok(!radio2.checked, "radio not checked");

    radio2.click();
    radio0.click();
    assert.ok(radio0.checked, "radio checked");
    assert.ok(!radio1.checked, "radio not checked");
    assert.ok(radio2.checked, "radio checked");

    radio1.click();
    assert.ok(!radio0.checked, "radio not checked");
    assert.ok(radio1.checked, "radio checked");
    assert.ok(radio2.checked, "radio checked");
  });

  specify("radio_no_click_deselected", () => {
    const doc = (new JSDOM(`
      <html><head></head><body>
        <input type="radio" id="rad0" value="rad0" name="radioGroup0" />
      </body>
    `)).window.document;

    const radio0 = doc.getElementById("rad0");

    radio0.click();
    assert.ok(radio0.checked, "radio checked");

    radio0.click();
    assert.ok(radio0.checked, "radio checked");
  });

  specify("select_set_value_updates_value", () => {
    const doc = (new JSDOM()).window.document;
    const { body } = doc;

    body.innerHTML = `
      <select id="selectElement">
        <option value="x">x</option><option value="y">y</option>
      </select>
    `;

    const select = doc.getElementById("selectElement");

    select.value = "x";
    assert.equal(select.value, "x", "select element value");

    select.value = "y";
    assert.equal(select.value, "y", "select element selectedIndex");
  });

  specify("select_set_value_updates_selectedIndex", () => {
    const doc = (new JSDOM()).window.document;
    const { body } = doc;

    body.innerHTML = `
      <select id="selectElement"> +
        <option value="x">x</option><option value="y">y</option>
      </select>
    `;

    const select = doc.getElementById("selectElement");

    select.value = "x";
    assert.equal(select.selectedIndex, 0, "select element selectedIndex");

    select.value = "y";
    assert.equal(select.selectedIndex, 1, "select element selectedIndex");
  });

  specify("select_set_value_updates_option_selected", () => {
    const doc = (new JSDOM()).window.document;
    const { body } = doc;

    body.innerHTML = `
      <select id="selectElement">
        <option id="optX" value="x">x</option><option id="optY" value="y">y</option>
      </select>
    `;

    const select = doc.getElementById("selectElement");
    const option0 = doc.getElementById("optX");
    const option1 = doc.getElementById("optY");

    select.value = "x";
    assert.ok(option0.selected, "option element selected");

    select.value = "y";
    assert.ok(option1.selected, "option element selected");
  });

  specify("select_set_selectedIndex_updates_value", () => {
    const doc = (new JSDOM()).window.document;
    const { body } = doc;

    body.innerHTML = `
      <select id="selectElement">
        <option value="x">x</option><option value="y">y</option>
      </select>
    `;

    const select = doc.getElementById("selectElement");

    select.selectedIndex = 0;
    assert.equal(select.value, "x", "select element selectedIndex");

    select.selectedIndex = 1;
    assert.equal(select.value, "y", "select element selectedIndex");
  });

  specify("select_set_selectedIndex_updates_selectedIndex", () => {
    const doc = (new JSDOM()).window.document;
    const { body } = doc;

    body.innerHTML = `
      <select id="selectElement">
        <option value="x">x</option><option value="y">y</option>
      </select>
    `;

    const select = doc.getElementById("selectElement");

    select.selectedIndex = 0;
    assert.equal(select.selectedIndex, 0, "select element selectedIndex");

    select.selectedIndex = 1;
    assert.equal(select.selectedIndex, 1, "select element selectedIndex");
  });

  specify("select_set_selectedIndex_updates_option_selected", () => {
    const doc = (new JSDOM()).window.document;
    const { body } = doc;

    body.innerHTML = `
      <select id="selectElement">
        <option id="optX" value="x">x</option><option id="optY" value="y">y</option>
      </select>
    `;

    const select = doc.getElementById("selectElement");
    const option0 = doc.getElementById("optX");
    const option1 = doc.getElementById("optY");

    select.selectedIndex = 0;
    assert.ok(option0.selected, "option element selected");
    assert.ok(!option1.selected, "option element selected");

    select.selectedIndex = 1;
    assert.ok(option1.selected, "option element selected");
    assert.ok(!option0.selected, "option element selected");
  });

  specify("select_set_option_selected_updates_value", () => {
    const doc = (new JSDOM()).window.document;
    const { body } = doc;

    body.innerHTML = `
      <select id="selectElement">
        <option id="optX" value="x">x</option><option id="optY" value="y">y</option>
      </select>
    `;

    const select = doc.getElementById("selectElement");
    const option0 = doc.getElementById("optX");
    const option1 = doc.getElementById("optY");

    select.selectedIndex = 0;
    option0.selected = true;
    assert.equal(select.value, "x", "select element value");

    option1.selected = true;
    assert.equal(select.value, "y", "select element value");
  });

  specify("select_set_option_selected_updates_selectedIndex", () => {
    const doc = (new JSDOM()).window.document;
    const { body } = doc;

    body.innerHTML = `
      <select id="selectElement">
        <option id="optX" value="x">x</option><option id="optY" value="y">y</option>
      </select>
    `;

    const select = doc.getElementById("selectElement");
    const option0 = doc.getElementById("optX");
    const option1 = doc.getElementById("optY");

    option0.selected = true;
    assert.equal(select.selectedIndex, 0, "select element selectedIndex");

    option1.selected = true;
    assert.equal(select.selectedIndex, 1, "select element selectedIndex");
  });

  specify("select_set_option_selected_updates_option_selected", () => {
    const doc = (new JSDOM()).window.document;
    const { body } = doc;

    body.innerHTML = `
      <select id="selectElement">
        <option id="optX" value="x">x</option><option id="optY" value="y">y</option>
      </select>
    `;

    const option0 = doc.getElementById("optX");
    const option1 = doc.getElementById("optY");

    option0.selected = true;
    assert.ok(option0.selected, "option element selected");
    assert.ok(!option1.selected, "option element selected");

    option1.selected = true;
    assert.ok(option1.selected, "option element selected");
    assert.ok(!option0.selected, "option element selected");
  });
});
