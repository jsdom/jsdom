"use strict";
var defineGetter = require("../utils").defineGetter;

module.exports = function (core) {
  var DOCUMENT_POSITION_DISCONNECTED = core.Node.DOCUMENT_POSITION_DISCONNECTED;
  var DOCUMENT_POSITION_PRECEDING = core.Node.DOCUMENT_POSITION_PRECEDING;
  var DOCUMENT_POSITION_FOLLOWING = core.Node.DOCUMENT_POSITION_FOLLOWING;
  var DOCUMENT_POSITION_CONTAINS = core.Node.DOCUMENT_POSITION_CONTAINS;
  var DOCUMENT_POSITION_CONTAINED_BY = core.Node.DOCUMENT_POSITION_CONTAINED_BY;
  var DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC = core.Node.DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC;

  /**
   * Return true if node is of a type obsoleted by the WHATWG living standard
   * @param  {Node}  node
   * @return {Boolean}
   */
  function isObsoleteNodeType(node) {
    return node.nodeType === core.Node.ENTITY_NODE ||
      node.nodeType === core.Node.ENTITY_REFERENCE_NODE ||
      node.nodeType === core.Node.NOTATION_NODE ||
      node.nodeType === core.Node.CDATA_SECTION_NODE;
  }

  /**
   * Return the parent node of node, whatever its nodeType is
   * @param  {Node} node
   * @return {Node or null}
   */
  function getNodeParent(node) {

    if(!node) {
      return node;
    }

    switch (node.nodeType) {

      case core.Node.DOCUMENT_NODE:
      case core.Node.DOCUMENT_FRAGMENT_NODE:
        return null;

      case core.Node.COMMENT_NODE:
      case core.Node.DOCUMENT_TYPE_NODE:
      case core.Node.ELEMENT_NODE:
      case core.Node.PROCESSING_INSTRUCTION_NODE:
      case core.Node.TEXT_NODE:
        return node.parentNode;

      case core.Node.ATTRIBUTE_NODE:

        return node._parentNode;

      default:
        throw new Error("Unknown node type:" + node.nodeType);
    }
  }

  /**
   * Walk up the node tree and return the nodes root node
   * @param  {Node} node
   * @return {Node}
   */
  function findNodeRoot(node) {
    if (!getNodeParent(node)) {
      return node;
    }

    return findNodeRoot(getNodeParent(node));
  }

  /**
   * Walk up the node tree returning true if otherNode is an ancestor of node
   * @param  {Node}  node
   * @param  {Node}  otherNode
   * @return {Boolean}
   */
  function isAncestor(node, otherNode) {
    var parentNode = node.nodeType === node.ATTRIBUTE_NODE ? node._parentNode : node.parentNode;

    if (!parentNode) {
      return false;
    }

    if(parentNode === otherNode) {
      return true;
    }

    return isAncestor(parentNode, otherNode);
  }

  /**
   * Traverse the node tree starting at current. Return DOCUMENT_POSITION_FOLLOWING if otherNode follows node. Return
   * DOCUMENT_POSITION_PRECEDING if otherNode precedes node
   * @param  {Node} current
   * @param  {Node} node
   * @param  {Node} otherNode
   * @return {Number}
   */
  function followingOrPreceding(current, node, otherNode) {
    if (current === node) {
      return core.Node.DOCUMENT_POSITION_FOLLOWING;
    }

    if (current === otherNode) {
      return core.Node.DOCUMENT_POSITION_PRECEDING;
    }

    var i = 0, len = current._childNodes.length, child, result;

    for(; i < len; i += 1) {

      child = current._childNodes[i];

      if((result = followingOrPreceding(child, node, otherNode)) !== 0) {
        return result;
      }
    }

    return 0;
  }

  /**
   * Returns a bitmask Number composed of DOCUMENT_POSITION constants based upon the rules defined in
   * http://dom.spec.whatwg.org/#dom-node-comparedocumentposition
   * @param  {Node} other
   * @return {Number}
   */
  core.Node.prototype.compareDocumentPosition = function compareDocumentPosition (other) {
    // Let reference be the context object.
    var reference = this;

    if(!(other instanceof core.Node)) {
      throw Error("Comparing position against non-Node values is not allowed");
    }

    if (isObsoleteNodeType(reference) || isObsoleteNodeType(other)) {
      throw new Error("Obsolete node type");
    }

    // If other and reference are the same object, return zero.
    if(reference.isSameNode(other)) {
      return 0;
    }

    // If other and reference are not in the same tree, return the result of adding DOCUMENT_POSITION_DISCONNECTED,
    // DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC, and either DOCUMENT_POSITION_PRECEDING or DOCUMENT_POSITION_FOLLOWING,
    // with the constraint that this is to be consistent, together.
    if(findNodeRoot(reference) !== findNodeRoot(other)) {
      return DOCUMENT_POSITION_DISCONNECTED + DOCUMENT_POSITION_IMPLEMENTATION_SPECIFIC + DOCUMENT_POSITION_FOLLOWING;
    }

    // If other is an ancestor of reference, return the result of adding DOCUMENT_POSITION_CONTAINS to
    // DOCUMENT_POSITION_PRECEDING.
    if(isAncestor(reference, other)) {
      return DOCUMENT_POSITION_CONTAINS + DOCUMENT_POSITION_PRECEDING;
    }

    // If other is a descendant of reference, return the result of adding DOCUMENT_POSITION_CONTAINED_BY to
    // DOCUMENT_POSITION_FOLLOWING.
    if(isAncestor(other, reference)) {
      return DOCUMENT_POSITION_CONTAINED_BY + DOCUMENT_POSITION_FOLLOWING;
    }

    // If other is preceding reference return DOCUMENT_POSITION_PRECEDING, otherwise return DOCUMENT_POSITION_FOLLOWING
    return followingOrPreceding(findNodeRoot(reference), reference, other);
  };

  /**
   * The contains(other) method returns true if other is an inclusive descendant of the context object,
   * and false otherwise (including when other is null).
   * @param  {[Node]} other [the node to test]
   * @return {[boolean]}      [whether other is an inclusive descendant of this]
   */
  core.Node.prototype.contains = function (other) {
    return other instanceof core.Node &&
    (this.isSameNode(other) || !!(this.compareDocumentPosition(other) & DOCUMENT_POSITION_CONTAINED_BY));
  };

  // http://dom.spec.whatwg.org/#dom-node-parentelement
  defineGetter(core.Node.prototype, "parentElement", function () {
    return this._parentNode !== null && this._parentNode.nodeType === core.Node.ELEMENT_NODE ? this._parentNode : null;
  });


  // https://dom.spec.whatwg.org/#concept-element-local-name
  defineGetter(core.Node.prototype, "localName", function() {
    if (this.nodeType !== 1 /* ELEMENT_NODE */) {
      return this._localName || null;
    }

    var nodeName = this._nodeName.split(":")[1] || this._nodeName;
    if (nodeName) { nodeName = nodeName.toLowerCase(); }
    return this._localName || nodeName || null;
  });
};
