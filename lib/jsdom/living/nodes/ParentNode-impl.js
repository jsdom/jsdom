"use strict";

const idlUtils = require("../generated/utils");
const { addNwmatcher } = require("../helpers/selectors");
const DOMException = require("../../web-idl/DOMException");
const domSymbolTree = require("../helpers/internal-constants").domSymbolTree;
const NODE_TYPE = require("../node-type");
const createHTMLCollection = require("../html-collection").create;
const updateHTMLCollection = require("../html-collection").update;
const memoizeQuery = require("../../utils").memoizeQuery;
const createStaticNodeList = require("../node-list").createStatic;

class ParentNodeImpl {
  get children() {
    if (!this._childrenList) {
      this._childrenList = createHTMLCollection(this, () => {
        return domSymbolTree.childrenToArray(this, { filter(node) {
          return node.nodeType === NODE_TYPE.ELEMENT_NODE;
        } });
      });
    } else {
      updateHTMLCollection(this._childrenList);
    }
    return this._childrenList;
  }

  get firstElementChild() {
    for (const child of domSymbolTree.childrenIterator(this)) {
      if (child.nodeType === NODE_TYPE.ELEMENT_NODE) {
        return child;
      }
    }

    return null;
  }

  get lastElementChild() {
    for (const child of domSymbolTree.childrenIterator(this, { reverse: true })) {
      if (child.nodeType === NODE_TYPE.ELEMENT_NODE) {
        return child;
      }
    }

    return null;
  }

  get childElementCount() {
    return this.children.length;
  }
}

ParentNodeImpl.prototype.querySelector = memoizeQuery(function (selectors) {
  if (shouldAlwaysSelectNothing(this)) {
    return null;
  }
  const matcher = addNwmatcher(this);

  try {
    return idlUtils.implForWrapper(matcher.first(selectors, idlUtils.wrapperForImpl(this)));
  } catch (e) {
    throw new DOMException(DOMException.SYNTAX_ERR, e.message);
  }
});

// WARNING: this returns a NodeList containing IDL wrappers instead of impls
ParentNodeImpl.prototype.querySelectorAll = memoizeQuery(function (selectors) {
  if (shouldAlwaysSelectNothing(this)) {
    return createStaticNodeList([]);
  }
  const matcher = addNwmatcher(this);

  let list;
  try {
    list = matcher.select(selectors, idlUtils.wrapperForImpl(this));
  } catch (e) {
    throw new DOMException(DOMException.SYNTAX_ERR, e.message);
  }

  return createStaticNodeList(list);
});

function shouldAlwaysSelectNothing(elImpl) {
  // The latter clause is true during initialization.
  return !domSymbolTree.hasChildren(elImpl) || (elImpl === elImpl._ownerDocument && !elImpl.documentElement);
}

module.exports = {
  implementation: ParentNodeImpl
};
