"use strict";
const { domSymbolTree } = require("../helpers/internal-constants");
const { filter, FILTER_ACCEPT } = require("./helpers");

exports.implementation = class NodeIteratorImpl {
  constructor(globalObject, args, privateData) {
    this._active = false;
    this.root = privateData.root;
    this.whatToShow = privateData.whatToShow;
    this.filter = privateData.filter;

    this._referenceNode = this.root;
    this._pointerBeforeReferenceNode = true;
    this._candidateReferenceNode = null;
    this._candidatePointerBeforeReferenceNode = false;

    this._globalObject = globalObject;
  }

  get referenceNode() {
    return this._referenceNode;
  }

  get pointerBeforeReferenceNode() {
    return this._pointerBeforeReferenceNode;
  }

  nextNode() {
    return this._traverse("next");
  }

  previousNode() {
    return this._traverse("previous");
  }

  detach() {
    // Intentionally do nothing, per spec.
  }

  // Called by Documents.
  _preRemovingSteps(toBeRemovedNode) {
    [this._referenceNode, this._pointerBeforeReferenceNode] = this._adjustNodePointer(
      this._referenceNode,
      this._pointerBeforeReferenceNode,
      toBeRemovedNode
    );

    if (this._candidateReferenceNode !== null) {
      [this._candidateReferenceNode, this._candidatePointerBeforeReferenceNode] = this._adjustNodePointer(
        this._candidateReferenceNode,
        this._candidatePointerBeforeReferenceNode,
        toBeRemovedNode
      );
    }
  }

  _adjustNodePointer(referenceNode, pointerBeforeReferenceNode, toBeRemovedNode) {
    // Second clause is https://github.com/whatwg/dom/issues/496
    if (!toBeRemovedNode.contains(referenceNode) || toBeRemovedNode === this.root) {
      return [referenceNode, pointerBeforeReferenceNode];
    }

    if (pointerBeforeReferenceNode) {
      let next = null;
      let candidateForNext = domSymbolTree.following(toBeRemovedNode, { skipChildren: true });
      while (candidateForNext !== null) {
        if (this.root.contains(candidateForNext)) {
          next = candidateForNext;
          break;
        }
        candidateForNext = domSymbolTree.following(candidateForNext, { skipChildren: true });
      }

      if (next !== null) {
        return [next, true];
      }
    }

    const { previousSibling } = toBeRemovedNode;
    const newNode = previousSibling === null ?
      toBeRemovedNode.parentNode :
      domSymbolTree.lastInclusiveDescendant(toBeRemovedNode.previousSibling);
    return [newNode, false];
  }

  _traverse(direction) {
    this._candidateReferenceNode = this._referenceNode;
    this._candidatePointerBeforeReferenceNode = this._pointerBeforeReferenceNode;
    let result = null;

    while (true) {
      if (direction === "next") {
        if (!this._candidatePointerBeforeReferenceNode) {
          const following = domSymbolTree.following(this._candidateReferenceNode, { root: this.root });

          if (!following) {
            break;
          }

          this._candidateReferenceNode = following;
        }

        this._candidatePointerBeforeReferenceNode = false;
      } else if (direction === "previous") {
        if (this._candidatePointerBeforeReferenceNode) {
          const preceding = domSymbolTree.preceding(this._candidateReferenceNode, { root: this.root });

          if (!preceding) {
            break;
          }

          this._candidateReferenceNode = preceding;
        }

        this._candidatePointerBeforeReferenceNode = true;
      }

      const node = this._candidateReferenceNode;
      let filterResult;
      try {
        filterResult = filter(this, node);
      } catch (error) {
        this._candidateReferenceNode = null;
        throw error;
      }

      if (filterResult === FILTER_ACCEPT) {
        this._referenceNode = this._candidateReferenceNode;
        this._pointerBeforeReferenceNode = this._candidatePointerBeforeReferenceNode;
        result = node;
        break;
      }
    }

    this._candidateReferenceNode = null;
    return result;
  }
};
