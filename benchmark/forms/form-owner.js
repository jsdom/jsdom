"use strict";

const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

const CONTROL_COUNT = 120;

module.exports = () => {
  const bench = new Bench();

  function appendElements(document, parent, count) {
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      fragment.append(document.createElement("div"));
    }
    parent.append(fragment);
  }

  function appendControls(document, parent, formId, count = CONTROL_COUNT) {
    const controls = [];
    const fragment = document.createDocumentFragment();
    for (let i = 0; i < count; i++) {
      const control = document.createElement("input");
      if (formId !== null) {
        control.setAttribute("form", formId);
      }
      fragment.append(control);
      controls.push(control);
    }
    parent.append(fragment);
    return controls;
  }

  function countOwners(controls, form) {
    let owners = 0;
    for (const control of controls) {
      if (control.form === form) {
        owners++;
      }
    }
    return owners;
  }

  function createExplicitOwnerFixture(contentElementCount, {
    formBeforeContent = false,
    controlCount = CONTROL_COUNT
  } = {}) {
    const { document } = (new JSDOM()).window;
    const app = document.body.appendChild(document.createElement("main"));
    const form = document.createElement("form");
    form.id = "settings-form";
    if (formBeforeContent) {
      app.append(form);
    }
    appendElements(document, app, contentElementCount);
    if (!formBeforeContent) {
      app.append(form);
    }
    const controls = appendControls(document, app, form.id, controlCount);
    return { app, controls, form };
  }

  function addExplicitOwnerTask(name, contentElementCount, options) {
    const { controls, form } = createExplicitOwnerFixture(contentElementCount, options);

    bench.add(name, () => {
      return countOwners(controls, form);
    });
  }

  function addElementsTask(name, controlCount) {
    const fixture = createExplicitOwnerFixture(100, { controlCount });
    const { elements } = fixture.form;
    bench.add(name, () => {
      fixture.app.toggleAttribute("data-updated");
      return elements.length;
    });
  }

  const { document } = (new JSDOM()).window;
  const form = document.body.appendChild(document.createElement("form"));
  const controls = appendControls(document, form, null);
  bench.add(`read form owners for ${CONTROL_COUNT} nested controls`, () => {
    return countOwners(controls, form);
  });

  addElementsTask("refresh form.elements after mutation (1 external control)", 1);
  addElementsTask(`refresh form.elements after mutation (${CONTROL_COUNT} external controls)`, CONTROL_COUNT);

  addExplicitOwnerTask(`read form owners for ${CONTROL_COUNT} controls (form after 1,000 elements)`, 1000);
  addExplicitOwnerTask(`read form owners for ${CONTROL_COUNT} controls (form before 1,000 elements)`, 1000, {
    formBeforeContent: true
  });

  return bench;
};
