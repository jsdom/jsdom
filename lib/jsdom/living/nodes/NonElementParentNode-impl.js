"use strict";

const domSymbolTree = require("../helpers/internal-constants").domSymbolTree;

const createHTMLCollection = require("../html-collection").create;
const updateHTMLCollection = require("../html-collection").update;

class NonElementParentNodeImpl {

}

module.exports = {
  implementation: NonElementParentNodeImpl
};
