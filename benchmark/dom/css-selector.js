"use strict";
const suite = require("../document-suite");

exports.matches = function () {
  const DEPTH = 10;
  const JUNK_CHILDREN = 10;
  const sel = "evenodd".repeat(100);
  const selector = `:first-child + div.even :not(.${sel}) > :nth-child(2n+1) ~ .odd`;
  let parent, deepest;

  return suite({
    setup(document) {
      parent = document.createDocumentFragment();
      deepest = parent;

      for (let i = 0; i < DEPTH; ++i) {
        const newNode = document.createElement("div");
        newNode.classList.add(i % 2 === 1 ? "even" : "odd");
        for (let j = 0; j < JUNK_CHILDREN; ++j) {
          const childNode = document.createElement("div");
          childNode.classList.add(j % 2 === 1 ? "even" : "odd");
          newNode.appendChild(childNode);
        }

        deepest.appendChild(newNode);
        deepest = newNode;
      }
    },
    fn() {
      deepest.matches(selector.trim());
    }
  });
};

exports.closest = function () {
  const DEPTH = 10;
  const JUNK_CHILDREN = 10;
  const sel = "evenodd".repeat(100);
  const selector = `:first-child + div.even :not(.${sel}) > :nth-child(2n+1) ~ .odd`;
  let parent, deepest;

  return suite({
    setup(document) {
      parent = document.createDocumentFragment();
      deepest = parent;

      for (let i = 0; i < DEPTH; ++i) {
        const newNode = document.createElement("div");
        newNode.classList.add(i % 2 === 1 ? "odd" : "even");
        for (let j = 0; j < JUNK_CHILDREN; ++j) {
          const childNode = document.createElement("div");
          childNode.classList.add(j % 2 === 1 ? "odd" : "even");
          newNode.appendChild(childNode);
        }

        deepest.appendChild(newNode);
        deepest = newNode;
      }
    },
    fn() {
      deepest.closest(selector.trim());
    }
  });
};

exports.querySelector = function () {
  const DEPTH = 10;
  const JUNK_CHILDREN = 10;
  const sel = "evenodd".repeat(100);
  const selector = `:first-child + div.even :not(.${sel}) > :nth-child(2n+1) ~ .odd`;
  let parent, deepest;

  return suite({
    setup(document) {
      parent = document.createDocumentFragment();
      deepest = parent;

      for (let i = 0; i < DEPTH; ++i) {
        const newNode = document.createElement("div");
        newNode.classList.add(i % 2 === 1 ? "odd" : "even");
        for (let j = 0; j < JUNK_CHILDREN; ++j) {
          const childNode = document.createElement("div");
          childNode.classList.add(j % 2 === 1 ? "odd" : "even");
          newNode.appendChild(childNode);
        }

        deepest.appendChild(newNode);
        deepest = newNode;
      }
    },
    fn() {
      parent.querySelector(selector.trim());
    }
  });
};

exports.querySelectorAll = function () {
  const DEPTH = 10;
  const JUNK_CHILDREN = 10;
  const sel = "evenodd".repeat(100);
  const selector = `:first-child + div.even :not(.${sel}) > :nth-child(2n+1) ~ .odd`;
  let parent, deepest;

  return suite({
    setup(document) {
      parent = document.createDocumentFragment();
      deepest = parent;

      for (let i = 0; i < DEPTH; ++i) {
        const newNode = document.createElement("div");
        newNode.classList.add(i % 2 === 1 ? "odd" : "even");
        for (let j = 0; j < JUNK_CHILDREN; ++j) {
          const childNode = document.createElement("div");
          childNode.classList.add(j % 2 === 1 ? "odd" : "even");
          newNode.appendChild(childNode);
        }

        deepest.appendChild(newNode);
        deepest = newNode;
      }
    },
    fn() {
      parent.querySelectorAll(selector.trim());
    }
  });
};
