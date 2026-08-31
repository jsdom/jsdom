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

  return bench;
};
