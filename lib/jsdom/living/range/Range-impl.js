"use strict";

const DOMException = require("../../../generated/idl/DOMException");

const { clone } = require("../node");
const NODE_TYPE = require("../node-type");
const { parseFragment } = require("../../browser/parser/index");

const { HTML_NS } = require("../helpers/namespaces");
const { compareBoundaryPointsPosition } = require("./boundary-point");
const { createElement } = require("../helpers/create-element");

const AbstractRangeImpl = require("./AbstractRange-impl").implementation;

const Range = require("../../../generated/idl/Range");
const CharacterData = require("../../../generated/idl/CharacterData");
const Text = require("../../../generated/idl/Text");
const DocumentFragment = require("../../../generated/idl/DocumentFragment");

const RANGE_COMPARISON_TYPE = {
  START_TO_START: 0,
  START_TO_END: 1,
  END_TO_END: 2,
  END_TO_START: 3
};

class RangeImpl extends AbstractRangeImpl {
  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    // Store a WeakRef to this Range for use in _referencedRanges.
    // This allows Ranges to be garbage collected when no longer referenced by user code,
    // preventing accumulation in long-lived nodes like document.body.
    this._weakRef = new WeakRef(this);

    const defaultBoundaryPoint = {
      node: globalObject._document,
      offset: 0
    };

    const {
      start = defaultBoundaryPoint,
      end = defaultBoundaryPoint
    } = privateData;

    this._setLiveRangeStart(start.node, start.offset);
    this._setLiveRangeEnd(end.node, end.offset);
  }

  // https://dom.spec.whatwg.org/#dom-range-commonancestorcontainer
  get commonAncestorContainer() {
    const { _start, _end } = this;

    return _start.node._commonAncestorInfo(_end.node).ancestor;
  }

  // https://dom.spec.whatwg.org/#dom-range-setstart
  setStart(node, offset) {
    setBoundaryPointStart(this, node, offset);
  }

  // https://dom.spec.whatwg.org/#dom-range-setend
  setEnd(node, offset) {
    setBoundaryPointEnd(this, node, offset);
  }

  // https://dom.spec.whatwg.org/#dom-range-setstartbefore
  setStartBefore(node) {
    const parent = node.parentNode;

    if (!parent) {
      throw DOMException.create(this._globalObject, ["The given Node has no parent.", "InvalidNodeTypeError"]);
    }

    setBoundaryPointStart(this, parent, node._treeIndex());
  }

  // https://dom.spec.whatwg.org/#dom-range-setstartafter
  setStartAfter(node) {
    const parent = node.parentNode;

    if (!parent) {
      throw DOMException.create(this._globalObject, ["The given Node has no parent.", "InvalidNodeTypeError"]);
    }

    setBoundaryPointStart(this, parent, node._treeIndex() + 1);
  }

  // https://dom.spec.whatwg.org/#dom-range-setendbefore
  setEndBefore(node) {
    const parent = node.parentNode;

    if (!parent) {
      throw DOMException.create(this._globalObject, ["The given Node has no parent.", "InvalidNodeTypeError"]);
    }

    setBoundaryPointEnd(this, parent, node._treeIndex());
  }

  // https://dom.spec.whatwg.org/#dom-range-setendafter
  setEndAfter(node) {
    const parent = node.parentNode;

    if (!parent) {
      throw DOMException.create(this._globalObject, ["The given Node has no parent.", "InvalidNodeTypeError"]);
    }

    setBoundaryPointEnd(this, parent, node._treeIndex() + 1);
  }

  // https://dom.spec.whatwg.org/#dom-range-collapse
  collapse(toStart) {
    if (toStart) {
      this._setLiveRangeEnd(this._start.node, this._start.offset);
    } else {
      this._setLiveRangeStart(this._end.node, this._end.offset);
    }
  }

  // https://dom.spec.whatwg.org/#dom-range-selectnode
  selectNode(node) {
    selectNodeWithinRange(node, this);
  }

  // https://dom.spec.whatwg.org/#dom-range-selectnodecontents
  selectNodeContents(node) {
    if (node.nodeType === NODE_TYPE.DOCUMENT_TYPE_NODE) {
      throw DOMException.create(this._globalObject, [
        "DocumentType Node can't be used as boundary point.",
        "InvalidNodeTypeError"
      ]);
    }

    const length = node._length;

    this._setLiveRangeStart(node, 0);
    this._setLiveRangeEnd(node, length);
  }

  // https://dom.spec.whatwg.org/#dom-range-compareboundarypoints
  compareBoundaryPoints(how, sourceRange) {
    if (
      how !== RANGE_COMPARISON_TYPE.START_TO_START &&
      how !== RANGE_COMPARISON_TYPE.START_TO_END &&
      how !== RANGE_COMPARISON_TYPE.END_TO_END &&
      how !== RANGE_COMPARISON_TYPE.END_TO_START
    ) {
      const message = "The comparison method provided must be one of 'START_TO_START', 'START_TO_END', 'END_TO_END', " +
                      "or 'END_TO_START'.";
      throw DOMException.create(this._globalObject, [message, "NotSupportedError"]);
    }

    if (this._root !== sourceRange._root) {
      throw DOMException.create(this._globalObject, ["The two Ranges are not in the same tree.", "WrongDocumentError"]);
    }

    let thisPoint, otherPoint;
    if (how === RANGE_COMPARISON_TYPE.START_TO_START) {
      thisPoint = this._start;
      otherPoint = sourceRange._start;
    } else if (how === RANGE_COMPARISON_TYPE.START_TO_END) {
      thisPoint = this._end;
      otherPoint = sourceRange._start;
    } else if (how === RANGE_COMPARISON_TYPE.END_TO_END) {
      thisPoint = this._end;
      otherPoint = sourceRange._end;
    } else {
      thisPoint = this._start;
      otherPoint = sourceRange._end;
    }

    return compareBoundaryPointsPosition(thisPoint, otherPoint);
  }

  // https://dom.spec.whatwg.org/#dom-range-deletecontents
  deleteContents() {
    if (this.collapsed) {
      return;
    }

    const { _start: originalStart, _end: originalEnd } = this;

    if (originalStart.node === originalEnd.node && CharacterData.isImpl(originalStart.node)) {
      originalStart.node.replaceData(originalStart.offset, originalEnd.offset - originalStart.offset, "");
      return;
    }

    const nodesToRemove = [];
    let currentNode = nextNodeAfterBoundary(originalStart);
    const endNode = CharacterData.isImpl(originalEnd.node) ? originalEnd.node : nextNodeAfterBoundary(originalEnd);
    while (currentNode && currentNode !== endNode) {
      if (isContained(currentNode, this)) {
        nodesToRemove.push(currentNode);
        // Skipping descendants keeps only the outermost contained nodes.
        currentNode = currentNode._nextAfterSubtree();
      } else {
        currentNode = currentNode._nextInTree();
      }
    }

    const ancestorInfo = originalStart.node._commonAncestorInfo(originalEnd.node);
    const { node: newNode, offset: newOffset } = getCollapsedBoundaryPoint(originalStart, ancestorInfo);

    if (CharacterData.isImpl(originalStart.node)) {
      originalStart.node.replaceData(originalStart.offset, originalStart.node._length - originalStart.offset, "");
    }

    for (const node of nodesToRemove) {
      const parent = node.parentNode;
      parent.removeChild(node);
    }

    if (CharacterData.isImpl(originalEnd.node)) {
      originalEnd.node.replaceData(0, originalEnd.offset, "");
    }

    this._setLiveRangeStart(newNode, newOffset);
    this._setLiveRangeEnd(newNode, newOffset);
  }

  // https://dom.spec.whatwg.org/#dom-range-extractcontents
  extractContents() {
    return extractRange(this);
  }

  // https://dom.spec.whatwg.org/#dom-range-clonecontents
  cloneContents() {
    return cloneRange(this);
  }

  // https://dom.spec.whatwg.org/#dom-range-insertnode
  insertNode(node) {
    insertNodeInRange(node, this);
  }

  // https://dom.spec.whatwg.org/#dom-range-surroundcontents
  surroundContents(newParent) {
    const { leftChild, rightChild } = this._start.node._commonAncestorInfo(this._end.node);
    // Any partially contained non-`Text` node lies on one of these boundary paths.
    // If either path begins with a `Text` node, it cannot contain any other nodes.
    if ((leftChild !== null && !Text.isImpl(leftChild)) || (rightChild !== null && !Text.isImpl(rightChild))) {
      throw DOMException.create(this._globalObject, [
        "The Range partially contains a non-Text node.",
        "InvalidStateError"
      ]);
    }

    if (
      newParent.nodeType === NODE_TYPE.DOCUMENT_NODE ||
      newParent.nodeType === NODE_TYPE.DOCUMENT_TYPE_NODE ||
      newParent.nodeType === NODE_TYPE.DOCUMENT_FRAGMENT_NODE
    ) {
      throw DOMException.create(this._globalObject, ["Invalid element type.", "InvalidNodeTypeError"]);
    }

    const fragment = extractRange(this);

    while (newParent.firstChild) {
      newParent.removeChild(newParent.firstChild);
    }

    insertNodeInRange(newParent, this);

    newParent.appendChild(fragment);

    selectNodeWithinRange(newParent, this);
  }

  // https://dom.spec.whatwg.org/#dom-range-clonerange
  cloneRange() {
    const { _start, _end, _globalObject } = this;

    return Range.createImpl(_globalObject, [], {
      start: { node: _start.node, offset: _start.offset },
      end: { node: _end.node, offset: _end.offset }
    });
  }

  // https://dom.spec.whatwg.org/#dom-range-detach
  detach() {
    // Do nothing by spec!
  }

  // https://dom.spec.whatwg.org/#dom-range-ispointinrange
  isPointInRange(node, offset) {
    if (node.getRootNode() !== this._root) {
      return false;
    }

    validateSetBoundaryPoint(node, offset);

    const bp = { node, offset };

    if (
      compareBoundaryPointsPosition(bp, this._start) === -1 ||
      compareBoundaryPointsPosition(bp, this._end) === 1
    ) {
      return false;
    }

    return true;
  }

  // https://dom.spec.whatwg.org/#dom-range-comparepoint
  comparePoint(node, offset) {
    if (node.getRootNode() !== this._root) {
      throw DOMException.create(this._globalObject, [
        "The given Node and the Range are not in the same tree.",
        "WrongDocumentError"
      ]);
    }

    validateSetBoundaryPoint(node, offset);

    const bp = { node, offset };
    if (compareBoundaryPointsPosition(bp, this._start) === -1) {
      return -1;
    } else if (compareBoundaryPointsPosition(bp, this._end) === 1) {
      return 1;
    }

    return 0;
  }

  // https://dom.spec.whatwg.org/#dom-range-intersectsnode
  intersectsNode(node) {
    if (node.getRootNode() !== this._root) {
      return false;
    }

    const parent = node.parentNode;
    if (!parent) {
      return true;
    }

    const offset = node._treeIndex();

    return (
      compareBoundaryPointsPosition({ node: parent, offset }, this._end) === -1 &&
      compareBoundaryPointsPosition({ node: parent, offset: offset + 1 }, this._start) === 1
    );
  }

  // https://dom.spec.whatwg.org/#dom-range-stringifier
  toString() {
    if (this.collapsed) {
      return "";
    }

    let s = "";
    const { _start, _end } = this;

    if (_start.node === _end.node && CharacterData.isImpl(_start.node)) {
      return Text.isImpl(_start.node) ? _start.node.data.slice(_start.offset, _end.offset) : "";
    }

    if (Text.isImpl(_start.node)) {
      s += _start.node.data.slice(_start.offset);
    }

    let currentNode = nextNodeAfterBoundary(_start);
    const endNode = CharacterData.isImpl(_end.node) ? _end.node : nextNodeAfterBoundary(_end);
    while (currentNode && currentNode !== endNode) {
      if (Text.isImpl(currentNode)) {
        s += currentNode.data;
      }

      currentNode = currentNode._nextInTree();
    }

    if (Text.isImpl(_end.node)) {
      s += _end.node.data.slice(0, _end.offset);
    }

    return s;
  }

  // https://w3c.github.io/DOM-Parsing/#dom-range-createcontextualfragment
  createContextualFragment(fragment) {
    const { node } = this._start;

    let element;
    switch (node.nodeType) {
      case NODE_TYPE.DOCUMENT_NODE:
      case NODE_TYPE.DOCUMENT_FRAGMENT_NODE:
        element = null;
        break;

      case NODE_TYPE.ELEMENT_NODE:
        element = node;
        break;

      case NODE_TYPE.TEXT_NODE:
      case NODE_TYPE.CDATA_SECTION_NODE:
      case NODE_TYPE.COMMENT_NODE:
        element = node.parentElement;
        break;

      default:
        throw new Error("Internal error: Invalid range start node");
    }

    if (
      element === null || (
        element._ownerDocument._parsingMode === "html" &&
        element._localName === "html" &&
        element._namespaceURI === HTML_NS
      )
    ) {
      element = createElement(node._ownerDocument, "body", HTML_NS);
    }

    return parseFragment(fragment, element);
  }

  // https://dom.spec.whatwg.org/#concept-range-root
  get _root() {
    return this._start.node.getRootNode();
  }

  _setLiveRangeStart(node, offset) {
    if (
      this._start &&
      this._start.node !== node &&
      this._start.node !== this._end.node
    ) {
      this._start.node._referencedRanges.delete(this._weakRef);
    }

    if (node._referencedRanges === null) {
      node._referencedRanges = new Set();
    }
    if (!node._referencedRanges.has(this._weakRef)) {
      node._referencedRanges.add(this._weakRef);
    }

    this._start = {
      node,
      offset
    };
  }

  _setLiveRangeEnd(node, offset) {
    if (
      this._end &&
      this._end.node !== node &&
      this._end.node !== this._start.node
    ) {
      this._end.node._referencedRanges.delete(this._weakRef);
    }

    if (node._referencedRanges === null) {
      node._referencedRanges = new Set();
    }
    if (!node._referencedRanges.has(this._weakRef)) {
      node._referencedRanges.add(this._weakRef);
    }

    this._end = {
      node,
      offset
    };
  }
}

// https://dom.spec.whatwg.org/#concept-range-bp-set
function validateSetBoundaryPoint(node, offset) {
  if (node.nodeType === NODE_TYPE.DOCUMENT_TYPE_NODE) {
    throw DOMException.create(node._globalObject, [
      "DocumentType Node can't be used as boundary point.",
      "InvalidNodeTypeError"
    ]);
  }

  if (offset > node._length) {
    throw DOMException.create(node._globalObject, ["Offset out of bound.", "IndexSizeError"]);
  }
}
function setBoundaryPointStart(range, node, offset) {
  validateSetBoundaryPoint(node, offset);

  const bp = { node, offset };
  if (
    node.getRootNode() !== range._root ||
    compareBoundaryPointsPosition(bp, range._end) === 1
  ) {
    range._setLiveRangeEnd(node, offset);
  }

  range._setLiveRangeStart(node, offset);
}
function setBoundaryPointEnd(range, node, offset) {
  validateSetBoundaryPoint(node, offset);

  const bp = { node, offset };
  if (
    node.getRootNode() !== range._root ||
    compareBoundaryPointsPosition(bp, range._start) === -1
  ) {
    range._setLiveRangeStart(node, offset);
  }

  range._setLiveRangeEnd(node, offset);
}

// https://dom.spec.whatwg.org/#concept-range-select
function selectNodeWithinRange(node, range) {
  const parent = node.parentNode;

  if (!parent) {
    throw DOMException.create(node._globalObject, ["The given Node has no parent.", "InvalidNodeTypeError"]);
  }

  const index = node._treeIndex();

  range._setLiveRangeStart(parent, index);
  range._setLiveRangeEnd(parent, index + 1);
}

// https://dom.spec.whatwg.org/#contained
function isContained(node, range) {
  const { _start, _end } = range;
  return (
    compareBoundaryPointsPosition({ node, offset: 0 }, _start) === 1 &&
    compareBoundaryPointsPosition({ node, offset: node._length }, _end) === -1
  );
}

// CharacterData boundary nodes are handled separately. For other containers,
// start at the child at the boundary offset, skipping earlier subtrees entirely.
function nextNodeAfterBoundary({ node, offset }) {
  if (!CharacterData.isImpl(node)) {
    let child = node.firstChild;
    for (let i = 0; i < offset; ++i) {
      child = child.nextSibling;
    }
    if (child !== null) {
      return child;
    }
  }
  return node._nextAfterSubtree();
}

// Capture the children to process before cloning or extraction can mutate the tree.
// The ancestor search already identifies both partial children. Fully contained children
// lie between those children, or between the offsets when an endpoint is the ancestor.
function getRangeContents(range) {
  const { _start: start, _end: end } = range;
  const { ancestor, leftChild, rightChild } = start.node._commonAncestorInfo(end.node);
  const startIndex = leftChild === null ? start.offset : leftChild._treeIndex() + 1;
  const endIndex = rightChild === null ? end.offset : rightChild._treeIndex();

  let child = leftChild === null ? ancestor.firstChild : leftChild.nextSibling;
  if (leftChild === null) {
    for (let i = 0; i < startIndex; ++i) {
      child = child.nextSibling;
    }
  }

  const containedChildren = [];
  for (let i = startIndex; i < endIndex; ++i, child = child.nextSibling) {
    if (child.nodeType === NODE_TYPE.DOCUMENT_TYPE_NODE) {
      throw DOMException.create(range._globalObject, ["Invalid document type element.", "HierarchyRequestError"]);
    }
    containedChildren.push(child);
  }

  return { ancestor, leftChild, rightChild, containedChildren };
}

function getCollapsedBoundaryPoint(start, { ancestor, leftChild }) {
  return ancestor === start.node ? start : { node: ancestor, offset: leftChild._treeIndex() + 1 };
}

// https://dom.spec.whatwg.org/#concept-range-insert
function insertNodeInRange(node, range) {
  const { node: startNode, offset: startOffset } = range._start;

  if (
    startNode.nodeType === NODE_TYPE.PROCESSING_INSTRUCTION_NODE ||
    startNode.nodeType === NODE_TYPE.COMMENT_NODE ||
    (Text.isImpl(startNode) && !startNode.parentNode) ||
    node === startNode
  ) {
    throw DOMException.create(node._globalObject, ["Invalid start node.", "HierarchyRequestError"]);
  }

  let referenceNode = startNode;
  if (!Text.isImpl(startNode)) {
    referenceNode = startNode.firstChild;
    for (let i = 0; i < startOffset; ++i) {
      referenceNode = referenceNode.nextSibling;
    }
  }

  const parent = !referenceNode ?
    startNode :
    referenceNode.parentNode;

  parent._preInsertValidity(node, referenceNode);

  if (Text.isImpl(startNode)) {
    referenceNode = startNode.splitText(startOffset);
  }

  if (node === referenceNode) {
    referenceNode = referenceNode.nextSibling;
  }

  const nodeParent = node.parentNode;
  if (nodeParent) {
    nodeParent.removeChild(node);
  }

  let newOffset = !referenceNode ? parent._length : referenceNode._treeIndex();
  newOffset += node.nodeType === NODE_TYPE.DOCUMENT_FRAGMENT_NODE ? node._length : 1;

  parent.insertBefore(node, referenceNode);

  if (range.collapsed) {
    range._setLiveRangeEnd(parent, newOffset);
  }
}

// https://dom.spec.whatwg.org/#concept-range-clone
function cloneRange(range) {
  const { _start: originalStart, _end: originalEnd, _globalObject } = range;

  const fragment = DocumentFragment.createImpl(_globalObject, [], {
    ownerDocument: originalStart.node._ownerDocument
  });

  if (range.collapsed) {
    return fragment;
  }

  if (originalStart.node === originalEnd.node && CharacterData.isImpl(originalStart.node)) {
    const cloned = clone(originalStart.node);
    cloned._data = cloned.substringData(originalStart.offset, originalEnd.offset - originalStart.offset);

    fragment.appendChild(cloned);

    return fragment;
  }

  const { leftChild: firstPartialContainedChild, rightChild: lastPartiallyContainedChild, containedChildren } =
    getRangeContents(range);

  if (CharacterData.isImpl(firstPartialContainedChild)) {
    const cloned = clone(originalStart.node);
    cloned._data = cloned.substringData(originalStart.offset, originalStart.node._length - originalStart.offset);

    fragment.appendChild(cloned);
  } else if (firstPartialContainedChild !== null) {
    const cloned = clone(firstPartialContainedChild);
    fragment.appendChild(cloned);

    const subrange = Range.createImpl(_globalObject, [], {
      start: { node: originalStart.node, offset: originalStart.offset },
      end: { node: firstPartialContainedChild, offset: firstPartialContainedChild._length }
    });

    const subfragment = cloneRange(subrange);
    cloned.appendChild(subfragment);
  }

  for (const containedChild of containedChildren) {
    const cloned = clone(containedChild, undefined, true);
    fragment.appendChild(cloned);
  }

  if (CharacterData.isImpl(lastPartiallyContainedChild)) {
    const cloned = clone(originalEnd.node);
    cloned._data = cloned.substringData(0, originalEnd.offset);

    fragment.appendChild(cloned);
  } else if (lastPartiallyContainedChild !== null) {
    const cloned = clone(lastPartiallyContainedChild);
    fragment.appendChild(cloned);

    const subrange = Range.createImpl(_globalObject, [], {
      start: { node: lastPartiallyContainedChild, offset: 0 },
      end: { node: originalEnd.node, offset: originalEnd.offset }
    });

    const subfragment = cloneRange(subrange);
    cloned.appendChild(subfragment);
  }

  return fragment;
}

// https://dom.spec.whatwg.org/#concept-range-extract
function extractRange(range) {
  const { _start: originalStart, _end: originalEnd, _globalObject } = range;

  const fragment = DocumentFragment.createImpl(_globalObject, [], {
    ownerDocument: originalStart.node._ownerDocument
  });

  if (range.collapsed) {
    return fragment;
  }

  if (originalStart.node === originalEnd.node && CharacterData.isImpl(originalStart.node)) {
    const cloned = clone(originalStart.node);
    cloned._data = cloned.substringData(originalStart.offset, originalEnd.offset - originalStart.offset);

    fragment.appendChild(cloned);
    originalStart.node.replaceData(originalStart.offset, originalEnd.offset - originalStart.offset, "");

    return fragment;
  }

  const contents = getRangeContents(range);
  const { leftChild: firstPartialContainedChild, rightChild: lastPartiallyContainedChild, containedChildren } =
    contents;
  const { node: newNode, offset: newOffset } = getCollapsedBoundaryPoint(originalStart, contents);

  if (CharacterData.isImpl(firstPartialContainedChild)) {
    const cloned = clone(originalStart.node);
    cloned._data = cloned.substringData(originalStart.offset, originalStart.node._length - originalStart.offset);

    fragment.appendChild(cloned);

    originalStart.node.replaceData(originalStart.offset, originalStart.node._length - originalStart.offset, "");
  } else if (firstPartialContainedChild !== null) {
    const cloned = clone(firstPartialContainedChild);
    fragment.appendChild(cloned);

    const subrange = Range.createImpl(_globalObject, [], {
      start: { node: originalStart.node, offset: originalStart.offset },
      end: { node: firstPartialContainedChild, offset: firstPartialContainedChild._length }
    });

    const subfragment = extractRange(subrange);
    cloned.appendChild(subfragment);
  }

  for (const containedChild of containedChildren) {
    fragment.appendChild(containedChild);
  }

  if (CharacterData.isImpl(lastPartiallyContainedChild)) {
    const cloned = clone(originalEnd.node);
    cloned._data = cloned.substringData(0, originalEnd.offset);

    fragment.appendChild(cloned);

    originalEnd.node.replaceData(0, originalEnd.offset, "");
  } else if (lastPartiallyContainedChild !== null) {
    const cloned = clone(lastPartiallyContainedChild);
    fragment.appendChild(cloned);

    const subrange = Range.createImpl(_globalObject, [], {
      start: { node: lastPartiallyContainedChild, offset: 0 },
      end: { node: originalEnd.node, offset: originalEnd.offset }
    });

    const subfragment = extractRange(subrange);
    cloned.appendChild(subfragment);
  }

  range._setLiveRangeStart(newNode, newOffset);
  range._setLiveRangeEnd(newNode, newOffset);

  return fragment;
}

module.exports = {
  implementation: RangeImpl,

  setBoundaryPointStart,
  setBoundaryPointEnd
};
