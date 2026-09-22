"use strict";
const documentBench = require("../document-bench");

const RADIO_COUNT = 200;

module.exports = () => {
  const { document, bench } = documentBench();

  function addTask(name, groupName) {
    const form = document.createElement("form");
    const radios = [];

    for (let i = 0; i < RADIO_COUNT; ++i) {
      const radio = document.createElement("input");
      radio.type = "radio";
      radio.name = groupName(i);
      form.append(radio);
      radios.push(radio);
    }

    bench.add(name, () => {
      for (const radio of radios) {
        radio.checked = true;
      }
    });
  }

  addTask("check 200 radios across 100 groups", i => `group-${Math.floor(i / 2)}`);
  addTask("check 200 radios in one group", () => "group");

  for (const external of [false, true]) {
    const fixtureDocument = document.implementation.createHTMLDocument();
    const container = fixtureDocument.createElement("div");
    container.innerHTML = "<div></div>".repeat(1000);
    const form = fixtureDocument.createElement("form");
    form.id = `radio-owner-${external}`;
    container.append(form);
    fixtureDocument.body.append(container);
    const radios = [];
    for (let i = 0; i < RADIO_COUNT; ++i) {
      const radio = fixtureDocument.createElement("input");
      radio.type = "radio";
      radio.name = form.id;
      if (external) {
        radio.setAttribute("form", form.id);
      }
      (external ? container : form).append(radio);
      radios.push(radio);
    }

    bench.add(`check 200 ${external ? "external" : "internal"} radios with 1,000 unrelated elements`, () => {
      for (const radio of radios) {
        radio.checked = true;
      }
    });
  }

  for (const depth of [1, 10]) {
    const forms = [];
    for (let i = 0; i < 2; ++i) {
      let parent = document.createElement("form");
      for (let j = 1; j < depth; ++j) {
        parent = parent.appendChild(document.createElement("form"));
      }
      forms.push(parent);
    }

    const subtree = document.createElement("div");
    subtree.innerHTML = `<label><input type="radio" name="group"></label>`.repeat(RADIO_COUNT);
    subtree.querySelector("input").checked = true;
    forms[0].append(subtree);
    let destination = 1;

    bench.add(`move 200 radios between forms (${depth} form ancestors)`, () => {
      forms[destination].append(subtree);
      destination = 1 - destination;
    });
  }

  return bench;
};
