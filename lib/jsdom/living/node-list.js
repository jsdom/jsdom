"use strict";
const lengthFromProperties = require("../utils").lengthFromProperties;

const privates = Symbol("NodeList internal slots");

class NodeList {
  constructor(secret, config) {
    if (secret !== privates) {
      throw new TypeError("Invalid constructor");
    }

    if (config.nodes) {
      this[privates] = {
        isLive:   false,
        length:   config.nodes.length
      };

      for (let i = 0; i < config.nodes.length; ++i) {
        this[i] = config.nodes[i];
      }
    } else {
      this[privates] = {
        isLive: true,
        element: config.element,
        query: config.query,
        snapshot: undefined,
        length: 0,
        version: -1
      };
      updateNodeList(this);
    }
    this[privates].curIndex = -1;
  }

  get length() {
    updateNodeList(this);
    return this[privates].length;
  }

  item(index) {
    updateNodeList(this);
    return this[index] || null;
  }

  // [Symbol.iterator]() {
  //   return this;
  // }

  next() {
    if (++this[privates].curIndex >= this.length) return { done: true };
    return { done: false, value: this.item(this[privates].curIndex) };
  }
}

NodeList.prototype[Symbol.iterator] = function () { return this; };

function updateNodeList(nodeList) {
  if (nodeList[privates].isLive) {
    if (nodeList[privates].version < nodeList[privates].element._version) {
      nodeList[privates].snapshot = nodeList[privates].query();
      resetNodeListTo(nodeList, nodeList[privates].snapshot);
      nodeList[privates].version = nodeList[privates].element._version;
    }
  } else {
    nodeList[privates].length = lengthFromProperties(nodeList);
  }
}

function resetNodeListTo(nodeList, nodes) {
  const startingLength = lengthFromProperties(nodeList);
  for (let i = 0; i < startingLength; ++i) {
    delete nodeList[i];
  }

  for (let i = 0; i < nodes.length; ++i) {
    nodeList[i] = nodes[i];
  }
  nodeList[privates].length = nodes.length;
}

module.exports = function (core) {
  core.NodeList = NodeList;
};

module.exports.createLive = function (element, query) {
  return new NodeList(privates, { element, query });
};

module.exports.createStatic = function (nodes) {
  return new NodeList(privates, { nodes });
};

module.exports.update = updateNodeList;
