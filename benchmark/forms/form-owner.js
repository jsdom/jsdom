"use strict";

const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

const CONTROL_COUNT = 120;
const FORM_CONTROL_COUNTS = [1, 100];
const OUTSIDE_ELEMENT_COUNTS = [0, 1000, 10000];

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
      control.name = `field-${i}`;
      control.value = "value";
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

  function createFormOperationsFixture(controlCount, outsideElementCount, external) {
    const { window } = new JSDOM();
    const { document } = window;
    appendElements(document, document.body, outsideElementCount);

    const form = document.createElement("form");
    if (external) {
      form.id = "settings-form";
    }
    document.body.append(form);
    appendControls(document, external ? document.body : form, external ? form.id : null, controlCount);

    return { body: document.body, FormData: window.FormData, form };
  }

  function addFormOperationsTasks(controlCount, outsideElementCount, external) {
    const { body, FormData, form } = createFormOperationsFixture(controlCount, outsideElementCount, external);
    const association = external ? "external" : "nested";
    const controls = `${controlCount} ${association} control${controlCount === 1 ? "" : "s"}`;
    const fixture = `${external ? "identified" : "unidentified"} form, ${controls}, ` +
      `${outsideElementCount} unrelated elements`;
    const { elements } = form;

    bench.add(`refresh form.elements (${fixture})`, () => {
      body.toggleAttribute("data-updated");
      return elements.length;
    });
    bench.add(`checkValidity() (${fixture})`, () => {
      body.toggleAttribute("data-updated");
      return form.checkValidity();
    });
    bench.add(`new FormData(form) (${fixture})`, () => {
      return new FormData(form).get("field-0");
    });
  }

  const { document } = (new JSDOM()).window;
  const form = document.body.appendChild(document.createElement("form"));
  const controls = appendControls(document, form, null);
  bench.add(`read form owners for ${CONTROL_COUNT} nested controls`, () => {
    return countOwners(controls, form);
  });

  addExplicitOwnerTask(`read form owners for ${CONTROL_COUNT} controls (form after 1,000 elements)`, 1000);
  addExplicitOwnerTask(`read form owners for ${CONTROL_COUNT} controls (form before 1,000 elements)`, 1000, {
    formBeforeContent: true
  });

  for (const controlCount of FORM_CONTROL_COUNTS) {
    for (const outsideElementCount of OUTSIDE_ELEMENT_COUNTS) {
      addFormOperationsTasks(controlCount, outsideElementCount, false);
      addFormOperationsTasks(controlCount, outsideElementCount, true);
    }
  }

  return bench;
};
