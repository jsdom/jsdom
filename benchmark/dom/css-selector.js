"use strict";
const suite = require("../document-suite");

exports.matches = function () {
  let box;
  let div;

  return suite({
    setup(document) {
      const x = 32;
      const y = 32;
      const xyFrag = document.createDocumentFragment();
      for (let i = 0; i < x; i++) {
        const xNode = document.createElement("div");
        xNode.id = `box${i}`;
        xNode.classList.add("box");
        xyFrag.appendChild(xNode);
        const yFrag = document.createDocumentFragment();
        for (let j = 0; j < y; j++) {
          const yNode = document.createElement("div");
          yNode.id = `div${i}-${j}`;
          if (j === 0) {
            yFrag.appendChild(yNode);
          } else if (j === y - 1) {
            yNode.classList.add("div");
            yNode.textContent = `${i}-${j}`;
            yFrag.appendChild(yNode);
            xNode.appendChild(yFrag);
          } else {
            const parent = yFrag.getElementById(`div${i}-${j - 1}`);
            parent.appendChild(yNode);
          }
        }
      }
      const container = document.createElement("div");
      container.classList.add("box-container");
      container.appendChild(xyFrag);
      document.body.append(container);
      box = document.getElementById(`box${x - 1}`);
      div = document.getElementById(`div${x - 1}-${y - 1}`);
    },
    fn() {
      const selectors = new Map([
        [".box .div", "div"],
        [".box ~ .box", "box"]
      ]);
      for (const [key, value] of selectors) {
        if (value === "box") {
          box.matches(key);
        } else if (value === "div") {
          div.matches(key);
        }
      }
    }
  });
};

exports.closest = function () {
  let box;
  let div;

  return suite({
    setup(document) {
      const x = 32;
      const y = 32;
      const xyFrag = document.createDocumentFragment();
      for (let i = 0; i < x; i++) {
        const xNode = document.createElement("div");
        xNode.id = `box${i}`;
        xNode.classList.add("box");
        xyFrag.appendChild(xNode);
        const yFrag = document.createDocumentFragment();
        for (let j = 0; j < y; j++) {
          const yNode = document.createElement("div");
          yNode.id = `div${i}-${j}`;
          if (j === 0) {
            yFrag.appendChild(yNode);
          } else if (j === y - 1) {
            yNode.classList.add("div");
            yNode.textContent = `${i}-${j}`;
            yFrag.appendChild(yNode);
            xNode.appendChild(yFrag);
          } else {
            const parent = yFrag.getElementById(`div${i}-${j - 1}`);
            parent.appendChild(yNode);
          }
        }
      }
      const container = document.createElement("div");
      container.classList.add("box-container");
      container.appendChild(xyFrag);
      document.body.append(container);
      box = document.getElementById(`box${x - 1}`);
      div = document.getElementById(`div${x - 1}-${y - 1}`);
    },
    fn() {
      const selectors = new Map([
        [".box .div", "div"],
        [".box ~ .box", "box"]
      ]);
      for (const [key, value] of selectors) {
        if (value === "box") {
          box.matches(key);
        } else if (value === "div") {
          div.matches(key);
        }
      }
    }
  });
};

exports.querySelector = function () {
  let refPoint;

  return suite({
    setup(document) {
      const x = 32;
      const y = 32;
      const xyFrag = document.createDocumentFragment();
      for (let i = 0; i < x; i++) {
        const xNode = document.createElement("div");
        xNode.id = `box${i}`;
        xNode.classList.add("box");
        xyFrag.appendChild(xNode);
        const yFrag = document.createDocumentFragment();
        for (let j = 0; j < y; j++) {
          const yNode = document.createElement("div");
          yNode.id = `div${i}-${j}`;
          if (j === 0) {
            yFrag.appendChild(yNode);
          } else if (j === y - 1) {
            yNode.classList.add("div");
            yNode.textContent = `${i}-${j}`;
            yFrag.appendChild(yNode);
            xNode.appendChild(yFrag);
          } else {
            const parent = yFrag.getElementById(`div${i}-${j - 1}`);
            parent.appendChild(yNode);
          }
        }
      }
      const container = document.createElement("div");
      container.classList.add("box-container");
      container.appendChild(xyFrag);
      document.body.append(container);
      refPoint = document;
    },
    fn() {
      const selectors = [
        ".box .title",
        ".box ~ .box",
      ];
      for (const selector of selectors) {
        refPoint.querySelector(selector);
      }
    }
  });
};

exports.querySelectorAll = function () {
  let refPoint;

  return suite({
    setup(document) {
      const x = 32;
      const y = 32;
      const xyFrag = document.createDocumentFragment();
      for (let i = 0; i < x; i++) {
        const xNode = document.createElement("div");
        xNode.id = `box${i}`;
        xNode.classList.add("box");
        xyFrag.appendChild(xNode);
        const yFrag = document.createDocumentFragment();
        for (let j = 0; j < y; j++) {
          const yNode = document.createElement("div");
          yNode.id = `div${i}-${j}`;
          if (j === 0) {
            yFrag.appendChild(yNode);
          } else if (j === y - 1) {
            yNode.classList.add("div");
            yNode.textContent = `${i}-${j}`;
            yFrag.appendChild(yNode);
            xNode.appendChild(yFrag);
          } else {
            const parent = yFrag.getElementById(`div${i}-${j - 1}`);
            parent.appendChild(yNode);
          }
        }
      }
      const container = document.createElement("div");
      container.classList.add("box-container");
      container.appendChild(xyFrag);
      document.body.append(container);
      refPoint = document;
    },
    fn() {
      const selectors = [
        ".box .title",
        ".box ~ .box",
      ];
      for (const selector of selectors) {
        refPoint.querySelectorAll(selector);
      }
    }
  });
};
