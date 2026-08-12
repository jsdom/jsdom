"use strict";
const assert = require("node:assert/strict");
const { describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../..");

// https://github.com/jsdom/jsdom/issues/4234
describe("named access on the Window object", () => {
  specify("elements of the window's associated document are exposed", () => {
    const { window } = new JSDOM("<main id=\"mainContent\"></main>");

    assert.equal(window.mainContent, window.document.getElementById("mainContent"));
  });

  specify("elements of other documents sharing the window are not exposed", () => {
    const { window } = new JSDOM();
    const sideDocument = window.document.implementation.createHTMLDocument("");
    const element = sideDocument.createElement("div");
    element.setAttribute("id", "sideElement");
    sideDocument.body.appendChild(element);

    assert.equal(window.sideElement, undefined);
  });

  specify("ids assigned inside other documents after insertion are not exposed", () => {
    const { window } = new JSDOM();
    const sideDocument = window.document.implementation.createHTMLDocument("");
    const element = sideDocument.createElement("div");
    sideDocument.body.appendChild(element);
    element.setAttribute("id", "lateSideElement");

    assert.equal(window.lateSideElement, undefined);
  });

  specify("elements adopted into the associated document become exposed", () => {
    const { window } = new JSDOM();
    const sideDocument = window.document.implementation.createHTMLDocument("");
    const element = sideDocument.createElement("div");
    element.setAttribute("id", "adoptedElement");
    sideDocument.body.appendChild(element);

    window.document.body.appendChild(window.document.adoptNode(element));

    assert.equal(window.adoptedElement, element);
  });
});
