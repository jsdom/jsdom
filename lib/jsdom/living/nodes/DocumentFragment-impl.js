"use strict";
const { mixin } = require("../../utils");
const { domSymbolTree } = require("../helpers/internal-constants");
const { querySelector, querySelectorAll } = require("../helpers/selector");
const NODE_TYPE = require("../node-type");
const NodeImpl = require("./Node-impl").implementation;
const NonElementParentNodeImpl = require("./NonElementParentNode-impl").implementation;
const ParentNodeImpl = require("./ParentNode-impl").implementation;
const idlUtils = require("../generated/utils");
const NodeList = require("../generated/NodeList");

function shouldAlwaysSelectNothing(elImpl) {
  // This is true during initialization.
  return elImpl === elImpl._ownerDocument && !elImpl.documentElement;
}

class DocumentFragmentImpl extends NodeImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, {
      ownerDocument: idlUtils.implForWrapper(globalObject._document),
      ...privateData
    });

    const { host } = privateData;
    this._host = host;

    this.nodeType = NODE_TYPE.DOCUMENT_FRAGMENT_NODE;
  }

  // This is implemented separately for Document (which has a _ids cache) and DocumentFragment (which does not).
  getElementById(id) {
    if (id === "") {
      return null;
    }

    for (const descendant of domSymbolTree.treeIterator(this)) {
      if (descendant.nodeType === NODE_TYPE.ELEMENT_NODE && descendant.getAttributeNS(null, "id") === id) {
        return descendant;
      }
    }

    return null;
  }

  querySelector(selectors) {
    if (shouldAlwaysSelectNothing(this)) {
      return null;
    }
    return idlUtils.implForWrapper(querySelector(selectors, idlUtils.wrapperForImpl(this), this._globalObject));
  }

  // Warning for internal users: this returns a NodeList containing IDL wrappers instead of impls
  querySelectorAll(selectors) {
    if (shouldAlwaysSelectNothing(this)) {
      return NodeList.create(this._globalObject, [], { nodes: [] });
    }
    const list = querySelectorAll(selectors, idlUtils.wrapperForImpl(this), this._globalObject);
    return NodeList.create(this._globalObject, [], { nodes: list.map(n => idlUtils.tryImplForWrapper(n)) });
  }
}

mixin(DocumentFragmentImpl.prototype, NonElementParentNodeImpl.prototype);
mixin(DocumentFragmentImpl.prototype, ParentNodeImpl.prototype);

module.exports = {
  implementation: DocumentFragmentImpl
};
