"use strict";
const suite = require("../document-suite");

exports.matches = () => {
  let node;

  return suite({
    setup(document) {
      const x = 5;
      const y = 5;
      const z = 5;
      const xFrag = document.createDocumentFragment();
      for (let i = 0; i < x; i++) {
        const xNode = document.createElement("div");
        xNode.id = `box${i}`;
        xNode.classList.add("box", "container");
        const yFrag = document.createDocumentFragment();
        for (let j = 0; j < y; j++) {
          const yNode = document.createElement("div");
          yNode.id = `div${i}-${j}`;
          yNode.classList.add("block", "outer");
          for (let k = 0; k < z; k++) {
            const zNode = document.createElement("div");
            zNode.id = `div${i}-${j}-${k}`;
            zNode.classList.add("block", "inner");
            const p = document.createElement("p");
            p.id = `p${i}-${j}-${k}`;
            p.classList.add("content");
            p.textContent = `${i}-${j}-${k}`;
            zNode.append(p);
            yNode.append(zNode);
          }
          yFrag.append(yNode);
        }
        xNode.append(yFrag);
        xFrag.append(xNode);
      }
      const container = document.createElement("div");
      container.setAttribute("id", "container");
      container.classList.add("container");
      container.append(xFrag);
      document.body.append(container);
      node = document.getElementById(`p${x - 1}-${y - 1}-${z - 1}`);
    },
    fn() {
      const selector = ".box:first-child ~ .box:nth-of-type(4n) + .box .block.inner > .content";
      node.matches(selector);
    }
  });
};

exports.closest = function () {
  let node;

  return suite({
    setup(document) {
      const x = 5;
      const y = 5;
      const z = 5;
      const xFrag = document.createDocumentFragment();
      for (let i = 0; i < x; i++) {
        const xNode = document.createElement("div");
        xNode.id = `box${i}`;
        xNode.classList.add("box", "container");
        const yFrag = document.createDocumentFragment();
        for (let j = 0; j < y; j++) {
          const yNode = document.createElement("div");
          yNode.id = `div${i}-${j}`;
          yNode.classList.add("block", "outer");
          for (let k = 0; k < z; k++) {
            const zNode = document.createElement("div");
            zNode.id = `div${i}-${j}-${k}`;
            zNode.classList.add("block", "inner");
            const p = document.createElement("p");
            p.id = `p${i}-${j}-${k}`;
            p.classList.add("content");
            p.textContent = `${i}-${j}-${k}`;
            zNode.append(p);
            yNode.append(zNode);
          }
          yFrag.append(yNode);
        }
        xNode.append(yFrag);
        xFrag.append(xNode);
      }
      const container = document.createElement("div");
      container.setAttribute("id", "container");
      container.classList.add("container");
      container.append(xFrag);
      document.body.append(container);
      node = document.getElementById(`p${x - 1}-${y - 1}-${z - 1}`);
    },
    fn() {
      const selector = ".box:first-child ~ .box:nth-of-type(4n) + .box .block.inner > .content";
      node.closest(selector);
    }
  });
};

exports.querySelector = () => {
  let node;

  return suite({
    setup(document) {
      const x = 5;
      const y = 5;
      const z = 5;
      const xFrag = document.createDocumentFragment();
      for (let i = 0; i < x; i++) {
        const xNode = document.createElement("div");
        xNode.id = `box${i}`;
        xNode.classList.add("box", "container");
        const yFrag = document.createDocumentFragment();
        for (let j = 0; j < y; j++) {
          const yNode = document.createElement("div");
          yNode.id = `div${i}-${j}`;
          yNode.classList.add("block", "outer");
          for (let k = 0; k < z; k++) {
            const zNode = document.createElement("div");
            zNode.id = `div${i}-${j}-${k}`;
            zNode.classList.add("block", "inner");
            const p = document.createElement("p");
            p.id = `p${i}-${j}-${k}`;
            p.classList.add("content");
            p.textContent = `${i}-${j}-${k}`;
            zNode.append(p);
            yNode.append(zNode);
          }
          yFrag.append(yNode);
        }
        xNode.append(yFrag);
        xFrag.append(xNode);
      }
      const container = document.createElement("div");
      container.setAttribute("id", "container");
      container.classList.add("container");
      container.append(xFrag);
      document.body.append(container);
      node = document;
    },
    fn() {
      const selector = ".box:first-child ~ .box:nth-of-type(4n) + .box .block.inner > .content";
      node.querySelector(selector);
    }
  });
};

exports.querySelectorAll = function () {
  let node;

  return suite({
    setup(document) {
      const x = 5;
      const y = 5;
      const z = 5;
      const xFrag = document.createDocumentFragment();
      for (let i = 0; i < x; i++) {
        const xNode = document.createElement("div");
        xNode.id = `box${i}`;
        xNode.classList.add("box", "container");
        const yFrag = document.createDocumentFragment();
        for (let j = 0; j < y; j++) {
          const yNode = document.createElement("div");
          yNode.id = `div${i}-${j}`;
          yNode.classList.add("block", "outer");
          for (let k = 0; k < z; k++) {
            const zNode = document.createElement("div");
            zNode.id = `div${i}-${j}-${k}`;
            zNode.classList.add("block", "inner");
            const p = document.createElement("p");
            p.id = `p${i}-${j}-${k}`;
            p.classList.add("content");
            p.textContent = `${i}-${j}-${k}`;
            zNode.append(p);
            yNode.append(zNode);
          }
          yFrag.append(yNode);
        }
        xNode.append(yFrag);
        xFrag.append(xNode);
      }
      const container = document.createElement("div");
      container.setAttribute("id", "container");
      container.classList.add("container");
      container.append(xFrag);
      document.body.append(container);
      node = document;
    },
    fn() {
      const selector = ".box:first-child ~ .box:nth-of-type(4n) + .box .block.inner > .content";
      node.querySelectorAll(selector);
    }
  });
};
