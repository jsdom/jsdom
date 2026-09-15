"use strict";

const DOMException = require("../../../generated/idl/DOMException");

const EventTargetImpl = require("../events/EventTarget-impl").implementation;
const NODE_TYPE = require("../node-type");
const NODE_DOCUMENT_POSITION = require("../node-document-position");
const { clone, locateNamespacePrefix, locateNamespace } = require("../node");
const {
  createHTMLCollectionByClassNames,
  createHTMLCollectionByQualifiedName,
  createHTMLCollectionByNamespaceAndLocalName
} = require("../helpers/html-collections");
const { setAnExistingAttributeValue } = require("../attributes");

const NodeList = require("../../../generated/idl/NodeList");

const treeHelpers = require("../helpers/dom-tree");
const windowProperties = require("../window-properties");
const { queueTreeMutationRecord } = require("../helpers/mutation-observers");
const { enqueueCECallbackReaction, tryUpgradeElement } = require("../helpers/custom-elements");
const { updateRadioButtonGroupsForTreeChange } = require("../helpers/form-controls");
const {
  isShadowRoot, shadowIncludingRoot, assignSlot, assignSlotableForTree, assignSlotable, signalSlotChange, isSlot
} = require("../helpers/shadow-dom");

function nodeEquals(a, b) {
  if (a.nodeType !== b.nodeType) {
    return false;
  }

  switch (a.nodeType) {
    case NODE_TYPE.DOCUMENT_TYPE_NODE:
      if (a.name !== b.name || a.publicId !== b.publicId ||
          a.systemId !== b.systemId) {
        return false;
      }
      break;
    case NODE_TYPE.ELEMENT_NODE:
      if (a._namespaceURI !== b._namespaceURI || a._prefix !== b._prefix || a._localName !== b._localName ||
          a._attributeList.length !== b._attributeList.length) {
        return false;
      }
      break;
    case NODE_TYPE.ATTRIBUTE_NODE:
      if (a._namespace !== b._namespace || a._localName !== b._localName || a._value !== b._value) {
        return false;
      }
      break;
    case NODE_TYPE.PROCESSING_INSTRUCTION_NODE:
      if (a._target !== b._target || a._data !== b._data) {
        return false;
      }
      break;
    case NODE_TYPE.TEXT_NODE:
    case NODE_TYPE.COMMENT_NODE:
      if (a._data !== b._data) {
        return false;
      }
      break;
  }

  if (a.nodeType === NODE_TYPE.ELEMENT_NODE && !attributeListsEqual(a, b)) {
    return false;
  }

  if (a._childCount !== b._childCount) {
    return false;
  }

  for (let childA = a.firstChild, childB = b.firstChild; childA !== null;
    childA = childA.nextSibling, childB = childB.nextSibling) {
    if (!nodeEquals(childA, childB)) {
      return false;
    }
  }

  return true;
}

// Needed by https://dom.spec.whatwg.org/#concept-node-equals
function attributeListsEqual(elementA, elementB) {
  const listA = elementA._attributeList;
  const listB = elementB._attributeList;

  const lengthA = listA.length;
  const lengthB = listB.length;

  if (lengthA !== lengthB) {
    return false;
  }

  for (let i = 0; i < lengthA; ++i) {
    const attrA = listA[i];

    if (!listB.some(attrB => nodeEquals(attrA, attrB))) {
      return false;
    }
  }

  return true;
}

function createMemoizedQueries() {
  // These all derive from a node's subtree and are discarded together after any tree or attribute mutation.
  return {
    collectionsByClassNames: null,
    collectionsByQualifiedName: null,
    collectionsByNamespaceAndLocalName: null,
    labelAssociations: null
  };
}

// https://dom.spec.whatwg.org/#concept-tree-host-including-inclusive-ancestor
function isHostInclusiveAncestor(nodeImplA, nodeImplB) {
  let rootImplB = nodeImplB;
  for (let ancestor = nodeImplB; ancestor !== null; ancestor = ancestor.parentNode) {
    if (ancestor === nodeImplA) {
      return true;
    }
    rootImplB = ancestor;
  }
  if (rootImplB._host) {
    return isHostInclusiveAncestor(nodeImplA, rootImplB._host);
  }

  return false;
}

// Call these helpers before running element-specific steps, so `document.getElementById()` and `window[name]`
// see updated caches for the entire subtree.
function addSubtreeToDocumentCaches(root) {
  const document = root._ownerDocument;
  document._clearNamedPropertyCache();

  for (const node of root._inclusiveDescendants()) {
    node._isInDocumentTree = true;
    if (node.nodeType === NODE_TYPE.ELEMENT_NODE) {
      windowProperties.elementAttached(node);
      const id = node.getAttributeNS(null, "id");
      if (id) {
        document._byIdCache.add(id, node);
      }
    }
  }
}

function removeSubtreeFromDocumentCaches(root) {
  const document = root._ownerDocument;
  document._clearNamedPropertyCache();

  for (const node of root._inclusiveDescendants()) {
    node._isInDocumentTree = false;
    if (node.nodeType === NODE_TYPE.ELEMENT_NODE) {
      windowProperties.elementDetached(node);
      const id = node.getAttributeNS(null, "id");
      if (id) {
        document._byIdCache.delete(id, node);
      }
    }
  }
}

class NodeImpl extends EventTargetImpl {
  #memoizedQueries = null;

  constructor(globalObject, args, privateData) {
    super(globalObject, args, privateData);

    this._links = null;

    this._ownerDocument = privateData.ownerDocument;

    this._childNodesList = null;
    this._childrenList = null;
    this._version = 0;
    this._cachedRoot = null;
    // This cached flag deliberately excludes shadow trees. Use `isConnected` for shadow-including connectedness.
    this._isInDocumentTree = false;
    // Most nodes are never observed, so allocate their registration lists lazily.
    this._registeredObserverList = null;
    this._referencedRanges = null; // Lazily-created Set of WeakRef<Range>
  }

  // Generator that yields live Range objects from _referencedRanges,
  // cleaning up any dead WeakRefs encountered during iteration.
  * _liveRanges() {
    if (this._referencedRanges === null) {
      return;
    }

    for (const weakRef of this._referencedRanges) {
      const range = weakRef.deref();
      if (range) {
        yield range;
      } else {
        // Range was garbage collected - remove the dead WeakRef
        this._referencedRanges.delete(weakRef);
      }
    }
  }

  _getMemoizedQueries() {
    if (this.#memoizedQueries === null) {
      this.#memoizedQueries = createMemoizedQueries();
    }
    return this.#memoizedQueries;
  }

  _clearMemoizedQueries() {
    this.#memoizedQueries = null;
  }

  getElementsByClassName(classNames) {
    const memoizedQueries = this._getMemoizedQueries();
    let collections = memoizedQueries.collectionsByClassNames;
    if (collections === null) {
      collections = new Map();
      memoizedQueries.collectionsByClassNames = collections;
    }

    let collection = collections.get(classNames);
    if (collection === undefined) {
      collection = createHTMLCollectionByClassNames(classNames, this);
      collections.set(classNames, collection);
    }
    return collection;
  }

  getElementsByTagName(qualifiedName) {
    const memoizedQueries = this._getMemoizedQueries();
    let collections = memoizedQueries.collectionsByQualifiedName;
    if (collections === null) {
      collections = new Map();
      memoizedQueries.collectionsByQualifiedName = collections;
    }

    let collection = collections.get(qualifiedName);
    if (collection === undefined) {
      collection = createHTMLCollectionByQualifiedName(qualifiedName, this);
      collections.set(qualifiedName, collection);
    }
    return collection;
  }

  getElementsByTagNameNS(namespace, localName) {
    if (namespace === "") {
      namespace = null;
    }

    const memoizedQueries = this._getMemoizedQueries();
    let collectionsByNamespace = memoizedQueries.collectionsByNamespaceAndLocalName;
    if (collectionsByNamespace === null) {
      collectionsByNamespace = new Map();
      memoizedQueries.collectionsByNamespaceAndLocalName = collectionsByNamespace;
    }

    let collectionsByLocalName = collectionsByNamespace.get(namespace);
    if (collectionsByLocalName === undefined) {
      collectionsByLocalName = new Map();
      collectionsByNamespace.set(namespace, collectionsByLocalName);
    }

    let collection = collectionsByLocalName.get(localName);
    if (collection === undefined) {
      collection = createHTMLCollectionByNamespaceAndLocalName(namespace, localName, this);
      collectionsByLocalName.set(localName, collection);
    }
    return collection;
  }

  _getTheParent() {
    if (this._assignedSlot) {
      return this._assignedSlot;
    }

    return this.parentNode;
  }

  get parentNode() {
    return this._links?.parent ?? null;
  }

  _treeIndex() {
    return treeHelpers.treeIndex(this);
  }

  // https://dom.spec.whatwg.org/#concept-node-length
  // Overridden by `CharacterDataImpl` to return the data's UTF-16 length instead of the child count.
  get _length() {
    return this._childCount;
  }

  get _childCount() {
    return this._links?.childCount ?? 0;
  }

  _children() {
    return new treeHelpers.ChildrenIterator(this.firstChild);
  }

  _descendants() {
    return new treeHelpers.DescendantsIterator(this, this.firstChild);
  }

  _inclusiveDescendants() {
    return new treeHelpers.DescendantsIterator(this, this);
  }

  _childrenToArray(filter) {
    return treeHelpers.childrenToArray(this, filter);
  }

  _descendantsToArray(filter) {
    return treeHelpers.descendantsToArray(this, this.firstChild, filter);
  }

  _inclusiveDescendantsToArray(filter) {
    return treeHelpers.descendantsToArray(this, this, filter);
  }

  _shadowIncludingDescendants() {
    const iterator = this._shadowIncludingInclusiveDescendants();
    iterator.next();
    return iterator;
  }

  _shadowIncludingInclusiveDescendants() {
    return new treeHelpers.ShadowIncludingIterator(this);
  }

  _nextInTree(root = null) {
    return treeHelpers.nextInTree(this, root);
  }

  _nextAfterSubtree(root = null) {
    return treeHelpers.nextAfterSubtree(this, root);
  }

  _previousInTree(root = null) {
    return treeHelpers.previousInTree(this, root);
  }

  _lastInclusiveDescendant() {
    return treeHelpers.lastInclusiveDescendant(this);
  }

  _compareTreePosition(other) {
    return treeHelpers.compareTreePosition(this, other);
  }

  _commonAncestorInfo(other) {
    return treeHelpers.commonAncestorInfo(this, other);
  }

  getRootNode(options) {
    if (options?.composed) {
      return shadowIncludingRoot(this);
    }

    if (this._cachedRoot !== null) {
      return this._cachedRoot;
    }

    // Stop at the root or at an ancestor whose root is already cached.
    let root = this;
    let parent;
    while (root._cachedRoot === null && (parent = root.parentNode) !== null) {
      root = parent;
    }
    root = root._cachedRoot ?? root;

    // Cache only Document roots: `_remove()` invalidates descendant caches when the old parent is connected.
    // Detached trees do not receive that invalidation, so their roots must not be cached. Stop filling the path
    // once it reaches a node already cached, so later reads anywhere along this path are constant-time.
    if (root.nodeType === NODE_TYPE.DOCUMENT_NODE) {
      root._cachedRoot = root;
      for (let current = this; current._cachedRoot !== root; current = current.parentNode) {
        current._cachedRoot = root;
      }
    }

    return root;
  }

  get nodeName() {
    switch (this.nodeType) {
      case NODE_TYPE.ELEMENT_NODE:
        return this.tagName;
      case NODE_TYPE.ATTRIBUTE_NODE:
        return this._qualifiedName;
      case NODE_TYPE.TEXT_NODE:
        return "#text";
      case NODE_TYPE.CDATA_SECTION_NODE:
        return "#cdata-section";
      case NODE_TYPE.PROCESSING_INSTRUCTION_NODE:
        return this.target;
      case NODE_TYPE.COMMENT_NODE:
        return "#comment";
      case NODE_TYPE.DOCUMENT_NODE:
        return "#document";
      case NODE_TYPE.DOCUMENT_TYPE_NODE:
        return this.name;
      case NODE_TYPE.DOCUMENT_FRAGMENT_NODE:
        return "#document-fragment";
    }

    // should never happen
    return null;
  }

  get firstChild() {
    return this._links?.firstChild ?? null;
  }

  // https://dom.spec.whatwg.org/#connected
  // https://dom.spec.whatwg.org/#dom-node-isconnected
  get isConnected() {
    const root = shadowIncludingRoot(this);
    return root && root.nodeType === NODE_TYPE.DOCUMENT_NODE;
  }

  get ownerDocument() {
    return this.nodeType === NODE_TYPE.DOCUMENT_NODE ? null : this._ownerDocument;
  }

  get lastChild() {
    return this._links?.lastChild ?? null;
  }

  get childNodes() {
    if (!this._childNodesList) {
      this._childNodesList = NodeList.createImpl(this._globalObject, [], {
        element: this,
        query: () => this._childrenToArray()
      });
    } else {
      this._childNodesList._update();
    }

    return this._childNodesList;
  }

  get nextSibling() {
    return this._links?.nextSibling ?? null;
  }

  get previousSibling() {
    return this._links?.previousSibling ?? null;
  }

  // Call this before running element-specific steps, so collection and style reads reflect the mutation.
  _invalidateCaches() {
    this._version++;
    this.#memoizedQueries = null;
    for (let ancestor = this; ancestor !== null; ancestor = ancestor.parentNode) {
      ancestor._version++;
      ancestor.#memoizedQueries = null;
    }

    this._childrenList?._invalidate();
    this._childNodesList?._invalidate();
    if (this.isConnected) {
      this._ownerDocument._clearStyleCache();
    }
  }

  // Lifecycle hook overrides must chain to any inherited implementation, in the order documented on that hook.
  // Hooks without shared work, such as `_insertionSteps`, `_postConnectionSteps`, and `_cloningSteps`, have no base
  // implementation; callers check for their presence. In particular, insertion collects only nodes with actual
  // post-connection work.

  // Overrides call `super` first to invalidate styles before doing element-specific work.
  _childrenChangedSteps() {
    if (this.isConnected) {
      this._ownerDocument._clearStyleCache();
    }
  }

  // https://dom.spec.whatwg.org/#concept-node-children-inserted-ext, introduced in
  // https://github.com/whatwg/dom/pull/1460. Insert runs these in place of the children changed
  // steps when a subclass defines them, so the default is to run the children changed steps.
  // Overrides call `super` first to preserve those steps before doing insertion-only work.
  _childrenInsertedSteps() {
    this._childrenChangedSteps();
  }

  // https://html.spec.whatwg.org/multipage/infrastructure.html#dom-trees:concept-node-remove-ext
  // Overrides call `super` first: focus fixup precedes HTML element removing steps.
  _removingSteps() {
    if (this._ownerDocument._lastFocusedElement === this) {
      // Represent the viewport with the Document so that activeElement resolves to the body (or document element)
      // while hasFocus() remains true. Removal does not run unfocusing steps or fire blur/change events.
      this._ownerDocument._lastFocusedElement = this._ownerDocument;
    }
  }

  hasChildNodes() {
    return this.firstChild !== null;
  }

  // https://dom.spec.whatwg.org/#dom-node-normalize
  normalize() {
    // Snapshot the subtree before merging and removing text nodes.
    for (const node of this._descendantsToArray()) {
      const { parentNode } = node;
      if (parentNode === null || node.nodeType !== NODE_TYPE.TEXT_NODE) {
        continue;
      }

      let length = node._length;

      if (length === 0) {
        parentNode._remove(node);
        continue;
      }

      const continuousExclusiveTextNodes = [];

      for (let currentNode = node.previousSibling; currentNode !== null; currentNode = currentNode.previousSibling) {
        if (currentNode.nodeType !== NODE_TYPE.TEXT_NODE) {
          break;
        }

        continuousExclusiveTextNodes.unshift(currentNode);
      }
      for (let currentNode = node.nextSibling; currentNode !== null; currentNode = currentNode.nextSibling) {
        if (currentNode.nodeType !== NODE_TYPE.TEXT_NODE) {
          break;
        }

        continuousExclusiveTextNodes.push(currentNode);
      }

      const data = continuousExclusiveTextNodes.reduce((d, n) => d + n._data, "");
      node.replaceData(length, 0, data);

      let currentNode = node.nextSibling;
      while (currentNode && currentNode.nodeType === NODE_TYPE.TEXT_NODE) {
        const currentNodeIndex = currentNode._treeIndex();

        for (const range of node._liveRanges()) {
          const { _start, _end } = range;

          if (_start.node === currentNode) {
            range._setLiveRangeStart(node, _start.offset + length);
          }
          if (_end.node === currentNode) {
            range._setLiveRangeEnd(node, _end.offset + length);
          }
        }

        for (const range of parentNode._liveRanges()) {
          const { _start, _end } = range;

          if (_start.node === parentNode && _start.offset === currentNodeIndex) {
            range._setLiveRangeStart(node, length);
          }
          if (_end.node === parentNode && _end.offset === currentNodeIndex) {
            range._setLiveRangeEnd(node, length);
          }
        }

        length += currentNode._length;
        currentNode = currentNode.nextSibling;
      }

      for (const continuousExclusiveTextNode of continuousExclusiveTextNodes) {
        parentNode._remove(continuousExclusiveTextNode);
      }
    }
  }

  get parentElement() {
    const { parentNode } = this;
    return parentNode !== null && parentNode.nodeType === NODE_TYPE.ELEMENT_NODE ? parentNode : null;
  }

  get baseURI() {
    return this._ownerDocument.baseURLSerialized();
  }

  compareDocumentPosition(other) {
    // Let node1 be other and node2 be the context object.
    let node1 = other;
    let node2 = this;

    let attr1 = null;
    let attr2;

    if (node1.nodeType === NODE_TYPE.ATTRIBUTE_NODE) {
      attr1 = node1;
      node1 = attr1._element;
    }

    if (node2.nodeType === NODE_TYPE.ATTRIBUTE_NODE) {
      attr2 = node2;
      node2 = attr2._element;

      if (attr1 !== null && node1 !== null && node2 === node1) {
        for (const attr of node2._attributeList) {
          if (nodeEquals(attr, attr1)) {
            return NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC |
              NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_PRECEDING;
          }

          if (nodeEquals(attr, attr2)) {
            return NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC |
              NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_FOLLOWING;
          }
        }
      }
    }

    const result = treeHelpers.compareTreePosition(node2, node1);

    // “If other and reference are not in the same tree, return the result of adding DOCUMENT_POSITION_DISCONNECTED,
    //  DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC, and either DOCUMENT_POSITION_PRECEDING or
    // DOCUMENT_POSITION_FOLLOWING, with the constraint that this is to be consistent, together.”
    if (result === NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_DISCONNECTED) {
      // Disconnected tree positions need these additional bits required by the spec:
      return NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_DISCONNECTED |
        NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC |
        NODE_DOCUMENT_POSITION.DOCUMENT_POSITION_FOLLOWING;
    }

    return result;
  }

  lookupPrefix(namespace) {
    if (namespace === null || namespace === "") {
      return null;
    }

    switch (this.nodeType) {
      case NODE_TYPE.ELEMENT_NODE: {
        return locateNamespacePrefix(this, namespace);
      }
      case NODE_TYPE.DOCUMENT_NODE: {
        return this.documentElement !== null ? locateNamespacePrefix(this.documentElement, namespace) : null;
      }
      case NODE_TYPE.DOCUMENT_TYPE_NODE:
      case NODE_TYPE.DOCUMENT_FRAGMENT_NODE: {
        return null;
      }
      case NODE_TYPE.ATTRIBUTE_NODE: {
        return this._element !== null ? locateNamespacePrefix(this._element, namespace) : null;
      }
      default: {
        return this.parentElement !== null ? locateNamespacePrefix(this.parentElement, namespace) : null;
      }
    }
  }

  lookupNamespaceURI(prefix) {
    if (prefix === "") {
      prefix = null;
    }

    return locateNamespace(this, prefix);
  }

  isDefaultNamespace(namespace) {
    if (namespace === "") {
      namespace = null;
    }

    const defaultNamespace = locateNamespace(this, null);
    return defaultNamespace === namespace;
  }

  contains(other) {
    while (other !== null) {
      if (this === other) {
        return true;
      }
      other = other.parentNode;
    }
    return false;
  }

  isEqualNode(node) {
    if (node === null) {
      return false;
    }

    // Fast-path, not in the spec
    if (this === node) {
      return true;
    }

    return nodeEquals(this, node);
  }

  isSameNode(node) {
    if (this === node) {
      return true;
    }

    return false;
  }

  cloneNode(deep) {
    if (isShadowRoot(this)) {
      throw DOMException.create(this._globalObject, ["ShadowRoot nodes are not clonable.", "NotSupportedError"]);
    }

    deep = Boolean(deep);

    return clone(this, undefined, deep);
  }

  get nodeValue() {
    switch (this.nodeType) {
      case NODE_TYPE.ATTRIBUTE_NODE: {
        return this._value;
      }
      case NODE_TYPE.TEXT_NODE:
      case NODE_TYPE.CDATA_SECTION_NODE: // CDATASection is a subclass of Text
      case NODE_TYPE.PROCESSING_INSTRUCTION_NODE:
      case NODE_TYPE.COMMENT_NODE: {
        return this._data;
      }
      default: {
        return null;
      }
    }
  }

  set nodeValue(value) {
    if (value === null) {
      value = "";
    }

    switch (this.nodeType) {
      case NODE_TYPE.ATTRIBUTE_NODE: {
        setAnExistingAttributeValue(this, value);
        break;
      }
      case NODE_TYPE.TEXT_NODE:
      case NODE_TYPE.CDATA_SECTION_NODE: // CDATASection is a subclass of Text
      case NODE_TYPE.PROCESSING_INSTRUCTION_NODE:
      case NODE_TYPE.COMMENT_NODE: {
        this.replaceData(0, this.length, value);
        break;
      }
    }
  }

  // https://dom.spec.whatwg.org/#dom-node-textcontent
  get textContent() {
    switch (this.nodeType) {
      case NODE_TYPE.DOCUMENT_FRAGMENT_NODE:
      case NODE_TYPE.ELEMENT_NODE: {
        let text = "";
        for (const child of this._descendants()) {
          if (child.nodeType === NODE_TYPE.TEXT_NODE || child.nodeType === NODE_TYPE.CDATA_SECTION_NODE) {
            text += child.nodeValue;
          }
        }
        return text;
      }

      case NODE_TYPE.ATTRIBUTE_NODE: {
        return this._value;
      }

      case NODE_TYPE.TEXT_NODE:
      case NODE_TYPE.CDATA_SECTION_NODE: // CDATASection is a subclass of Text
      case NODE_TYPE.PROCESSING_INSTRUCTION_NODE:
      case NODE_TYPE.COMMENT_NODE: {
        return this._data;
      }

      default: {
        return null;
      }
    }
  }
  set textContent(value) {
    if (value === null) {
      value = "";
    }

    switch (this.nodeType) {
      case NODE_TYPE.DOCUMENT_FRAGMENT_NODE:
      case NODE_TYPE.ELEMENT_NODE: {
        // https://dom.spec.whatwg.org/#string-replace-all
        let nodeImpl = null;

        if (value !== "") {
          nodeImpl = this._ownerDocument.createTextNode(value);
        }

        this._replaceAll(nodeImpl);
        break;
      }

      case NODE_TYPE.ATTRIBUTE_NODE: {
        setAnExistingAttributeValue(this, value);
        break;
      }

      case NODE_TYPE.TEXT_NODE:
      case NODE_TYPE.CDATA_SECTION_NODE: // CDATASection is a subclass of Text
      case NODE_TYPE.PROCESSING_INSTRUCTION_NODE:
      case NODE_TYPE.COMMENT_NODE: {
        this.replaceData(0, this.length, value);
        break;
      }
    }
  }

  // https://dom.spec.whatwg.org/#dom-node-insertbefore
  insertBefore(nodeImpl, childImpl) {
    return this._preInsert(nodeImpl, childImpl);
  }

  // https://dom.spec.whatwg.org/#dom-node-appendchild
  appendChild(nodeImpl) {
    return this._append(nodeImpl);
  }

  // https://dom.spec.whatwg.org/#dom-node-replacechild
  replaceChild(nodeImpl, childImpl) {
    return this._replace(nodeImpl, childImpl);
  }

  // https://dom.spec.whatwg.org/#dom-node-removechild
  removeChild(oldChildImpl) {
    return this._preRemove(oldChildImpl);
  }

  // https://dom.spec.whatwg.org/#concept-node-ensure-pre-insertion-validity
  _preInsertValidity(nodeImpl, childImpl, childrenToExclude = new Set()) {
    const { nodeType } = nodeImpl;
    const parentType = this.nodeType;

    if (
      parentType !== NODE_TYPE.DOCUMENT_NODE &&
      parentType !== NODE_TYPE.DOCUMENT_FRAGMENT_NODE &&
      parentType !== NODE_TYPE.ELEMENT_NODE
    ) {
      throw DOMException.create(this._globalObject, [
        `Node can't be inserted in a ${this.nodeName} parent.`,
        "HierarchyRequestError"
      ]);
    }

    if (isHostInclusiveAncestor(nodeImpl, this)) {
      throw DOMException.create(this._globalObject, [
        "The operation would yield an incorrect node tree.",
        "HierarchyRequestError"
      ]);
    }

    if (childImpl && childImpl.parentNode !== this) {
      throw DOMException.create(this._globalObject, [
        "The child can not be found in the parent.",
        "NotFoundError"
      ]);
    }

    if (
      nodeType !== NODE_TYPE.DOCUMENT_FRAGMENT_NODE &&
      nodeType !== NODE_TYPE.DOCUMENT_TYPE_NODE &&
      nodeType !== NODE_TYPE.ELEMENT_NODE &&
      nodeType !== NODE_TYPE.TEXT_NODE &&
      nodeType !== NODE_TYPE.CDATA_SECTION_NODE && // CData section extends from Text
      nodeType !== NODE_TYPE.PROCESSING_INSTRUCTION_NODE &&
      nodeType !== NODE_TYPE.COMMENT_NODE
    ) {
      throw DOMException.create(this._globalObject, [
        `${nodeImpl.nodeName} node can't be inserted in parent node.`,
        "HierarchyRequestError"
      ]);
    }

    if (parentType !== NODE_TYPE.DOCUMENT_NODE) {
      if (nodeType === NODE_TYPE.DOCUMENT_TYPE_NODE) {
        throw DOMException.create(this._globalObject, [
          `${nodeImpl.nodeName} node can't be inserted in ${this.nodeName} parent.`,
          "HierarchyRequestError"
        ]);
      }

      return;
    }

    if (nodeType === NODE_TYPE.TEXT_NODE || nodeType === NODE_TYPE.CDATA_SECTION_NODE) {
      throw DOMException.create(this._globalObject, [
        `${nodeImpl.nodeName} node can't be inserted in ${this.nodeName} parent.`,
        "HierarchyRequestError"
      ]);
    }

    if (
      nodeType === NODE_TYPE.PROCESSING_INSTRUCTION_NODE ||
      nodeType === NODE_TYPE.COMMENT_NODE
    ) {
      return;
    }

    if (nodeType === NODE_TYPE.DOCUMENT_FRAGMENT_NODE) {
      let hasElementChild = false;

      for (const child of nodeImpl._children()) {
        if (
          (hasElementChild && child.nodeType === NODE_TYPE.ELEMENT_NODE) ||
          child.nodeType === NODE_TYPE.TEXT_NODE ||
          child.nodeType === NODE_TYPE.CDATA_SECTION_NODE
        ) {
          throw DOMException.create(this._globalObject, [
            `Invalid insertion of ${nodeImpl.nodeName} node in ${this.nodeName} node.`,
            "HierarchyRequestError"
          ]);
        }

        if (child.nodeType === NODE_TYPE.ELEMENT_NODE) {
          hasElementChild = true;
        }
      }

      if (!hasElementChild) {
        return;
      }
    }

    if (nodeType === NODE_TYPE.DOCUMENT_FRAGMENT_NODE || nodeType === NODE_TYPE.ELEMENT_NODE) {
      let isFollowingChild = false;

      for (const child of this._children()) {
        const isChild = child === childImpl;

        if (
          (child.nodeType === NODE_TYPE.ELEMENT_NODE && !childrenToExclude.has(child)) ||
          (
            child.nodeType === NODE_TYPE.DOCUMENT_TYPE_NODE &&
            (isFollowingChild || (isChild && !childrenToExclude.has(child)))
          )
        ) {
          throw DOMException.create(this._globalObject, [
            `Invalid insertion of ${nodeImpl.nodeName} node in ${this.nodeName} node.`,
            "HierarchyRequestError"
          ]);
        }

        if (isChild) {
          isFollowingChild = true;
        }
      }

      return;
    }

    let isPrecedingChild = childImpl !== null;

    for (const child of this._children()) {
      if (child === childImpl) {
        isPrecedingChild = false;
      }

      if (
        (child.nodeType === NODE_TYPE.DOCUMENT_TYPE_NODE && !childrenToExclude.has(child)) ||
        (
          child.nodeType === NODE_TYPE.ELEMENT_NODE &&
          (isPrecedingChild || (childImpl === null && !childrenToExclude.has(child)))
        )
      ) {
        throw DOMException.create(this._globalObject, [
          `Invalid insertion of ${nodeImpl.nodeName} node in ${this.nodeName} node.`,
          "HierarchyRequestError"
        ]);
      }
    }
  }

  // https://dom.spec.whatwg.org/#concept-node-pre-insert
  _preInsert(nodeImpl, childImpl) {
    this._preInsertValidity(nodeImpl, childImpl);

    let referenceChildImpl = childImpl;
    if (referenceChildImpl === nodeImpl) {
      referenceChildImpl = nodeImpl.nextSibling;
    }

    this._insert(nodeImpl, referenceChildImpl);

    return nodeImpl;
  }

  // https://dom.spec.whatwg.org/#concept-node-insert
  _insert(nodeImpl, childImpl, suppressObservers = false) {
    let nodesImpl, postConnectionNodes;

    if (nodeImpl.nodeType === NODE_TYPE.DOCUMENT_FRAGMENT_NODE) {
      nodesImpl = [];

      for (const child of nodeImpl._children()) {
        nodesImpl.push(child);
        nodeImpl._remove(child, true);
      }

      if (nodesImpl.length === 0) {
        return nodesImpl;
      }

      queueTreeMutationRecord(nodeImpl, [], nodesImpl, null, null);
    } else {
      nodesImpl = [nodeImpl];
    }

    const count = nodesImpl.length;

    if (childImpl !== null) {
      let childIndex;

      for (const range of this._liveRanges()) {
        childIndex ??= childImpl._treeIndex();
        const { _start, _end } = range;

        if (_start.node === this && _start.offset > childIndex) {
          range._setLiveRangeStart(this, _start.offset + count);
        }

        if (_end.node === this && _end.offset > childIndex) {
          range._setLiveRangeEnd(this, _end.offset + count);
        }
      }
    }

    const previousChildImpl = childImpl ?
      childImpl.previousSibling :
      this.lastChild;

    for (const node of nodesImpl) {
      this._ownerDocument._adoptNode(node);

      if (childImpl === null) {
        treeHelpers.appendChild(this, node);
      } else {
        treeHelpers.insertBefore(childImpl, node);
      }

      if (
        (this.nodeType === NODE_TYPE.ELEMENT_NODE && this._shadowRoot !== null) &&
        (node.nodeType === NODE_TYPE.ELEMENT_NODE || node.nodeType === NODE_TYPE.TEXT_NODE)
      ) {
        assignSlot(node);
      }

      this._invalidateCaches();

      if (isSlot(this) && this._assignedNodes.length === 0 && isShadowRoot(this.getRootNode())) {
        signalSlotChange(this);
      }

      const root = node.getRootNode();
      if (isShadowRoot(root)) {
        assignSlotableForTree(root);
      }

      if (this._isInDocumentTree) {
        addSubtreeToDocumentCaches(node);
      }

      updateRadioButtonGroupsForTreeChange(node, this);

      for (const inclusiveDescendant of node._shadowIncludingInclusiveDescendants()) {
        if (inclusiveDescendant._insertionSteps) {
          inclusiveDescendant._insertionSteps();
        }

        if (inclusiveDescendant.nodeType === NODE_TYPE.ELEMENT_NODE && inclusiveDescendant.isConnected) {
          if (inclusiveDescendant._ceState === "custom") {
            enqueueCECallbackReaction(inclusiveDescendant, "connectedCallback", []);
          } else {
            tryUpgradeElement(inclusiveDescendant);
          }
        }
      }
    }

    if (!suppressObservers) {
      queueTreeMutationRecord(this, nodesImpl, [], previousChildImpl, childImpl);
    }

    this._childrenInsertedSteps();

    for (const node of nodesImpl) {
      for (const inclusiveDescendant of node._shadowIncludingInclusiveDescendants()) {
        if (inclusiveDescendant._postConnectionSteps) {
          postConnectionNodes ||= [];
          postConnectionNodes.push(inclusiveDescendant);
        }
      }
    }

    if (postConnectionNodes) {
      for (const node of postConnectionNodes) {
        if (node.isConnected) {
          node._postConnectionSteps();
        }
      }
    }

    return nodesImpl;
  }

  // https://dom.spec.whatwg.org/#concept-node-append
  _append(nodeImpl) {
    return this._preInsert(nodeImpl, null);
  }

  // https://dom.spec.whatwg.org/#concept-node-replace
  _replace(nodeImpl, childImpl) {
    this._preInsertValidity(nodeImpl, childImpl, new Set([childImpl]));

    let referenceChildImpl = childImpl.nextSibling;
    if (referenceChildImpl === nodeImpl) {
      referenceChildImpl = nodeImpl.nextSibling;
    }

    const previousSiblingImpl = childImpl.previousSibling;

    let removedNodesImpl = [];

    this._ownerDocument._adoptNode(nodeImpl);

    if (childImpl.parentNode) {
      removedNodesImpl = [childImpl];
      this._remove(childImpl, true);
    }

    const nodesImpl = this._insert(nodeImpl, referenceChildImpl, true);

    queueTreeMutationRecord(this, nodesImpl, removedNodesImpl, previousSiblingImpl, referenceChildImpl);

    return childImpl;
  }

  // https://dom.spec.whatwg.org/#concept-node-replace-all
  _replaceAll(nodeImpl) {
    const removedNodesImpl = this._childrenToArray();

    let addedNodesImpl;
    if (nodeImpl === null) {
      addedNodesImpl = [];
    } else if (nodeImpl.nodeType === NODE_TYPE.DOCUMENT_FRAGMENT_NODE) {
      addedNodesImpl = nodeImpl._childrenToArray();
    } else {
      addedNodesImpl = [nodeImpl];
    }

    for (const childImpl of removedNodesImpl) {
      this._remove(childImpl, true);
    }

    if (nodeImpl !== null) {
      this._insert(nodeImpl, null, true);
    }

    if (addedNodesImpl.length > 0 || removedNodesImpl.length > 0) {
      queueTreeMutationRecord(this, addedNodesImpl, removedNodesImpl, null, null);
    }
  }

  // https://dom.spec.whatwg.org/#concept-node-pre-remove
  _preRemove(childImpl) {
    if (childImpl.parentNode !== this) {
      throw DOMException.create(this._globalObject, [
        "The node to be removed is not a child of this node.",
        "NotFoundError"
      ]);
    }

    this._remove(childImpl);

    return childImpl;
  }

  // https://dom.spec.whatwg.org/#concept-node-remove
  _remove(nodeImpl, suppressObservers) {
    const wasParentConnected = this.isConnected;
    let index;
    let hasSlotDescendant = false;

    for (const descendant of nodeImpl._inclusiveDescendants()) {
      if (!hasSlotDescendant && isSlot(descendant)) {
        hasSlotDescendant = true;
      }

      for (const range of descendant._liveRanges()) {
        index ??= nodeImpl._treeIndex();
        const { _start, _end } = range;

        if (_start.node === descendant) {
          range._setLiveRangeStart(this, index);
        }

        if (_end.node === descendant) {
          range._setLiveRangeEnd(this, index);
        }
      }
    }

    for (const range of this._liveRanges()) {
      index ??= nodeImpl._treeIndex();
      const { _start, _end } = range;

      if (_start.node === this && _start.offset > index) {
        range._setLiveRangeStart(this, _start.offset - 1);
      }

      if (_end.node === this && _end.offset > index) {
        range._setLiveRangeEnd(this, _end.offset - 1);
      }
    }

    for (const iterator of this._ownerDocument._workingNodeIterators) {
      iterator._preRemoveSteps(nodeImpl);
    }

    const oldPreviousSiblingImpl = nodeImpl.previousSibling;
    const oldNextSiblingImpl = nodeImpl.nextSibling;

    treeHelpers.remove(nodeImpl);
    nodeImpl._cachedRoot = null;
    if (wasParentConnected) {
      for (const descendantImpl of nodeImpl._shadowIncludingDescendants()) {
        descendantImpl._cachedRoot = null;
      }
    }

    if (nodeImpl._assignedSlot) {
      assignSlotable(nodeImpl._assignedSlot);
    }

    if (isSlot(this) && this._assignedNodes.length === 0 && isShadowRoot(this.getRootNode())) {
      signalSlotChange(this);
    }

    if (hasSlotDescendant) {
      assignSlotableForTree(this.getRootNode());
      assignSlotableForTree(nodeImpl);
    }

    this._invalidateCaches();
    if (nodeImpl._isInDocumentTree) {
      removeSubtreeFromDocumentCaches(nodeImpl);
    }

    nodeImpl._removingSteps(true, this);
    const isParentConnected = this.isConnected;
    if (nodeImpl._ceState === "custom" && isParentConnected) {
      enqueueCECallbackReaction(nodeImpl, "disconnectedCallback", []);
    }

    for (const descendantImpl of nodeImpl._shadowIncludingDescendants()) {
      descendantImpl._removingSteps(false, this);
      if (descendantImpl._ceState === "custom" && isParentConnected) {
        enqueueCECallbackReaction(descendantImpl, "disconnectedCallback", []);
      }
    }

    updateRadioButtonGroupsForTreeChange(nodeImpl, this);

    if (!suppressObservers) {
      queueTreeMutationRecord(this, [], [nodeImpl], oldPreviousSiblingImpl, oldNextSiblingImpl);
    }

    this._childrenChangedSteps();
  }
}

module.exports = {
  implementation: NodeImpl
};
