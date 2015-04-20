"use strict";

/**
 * Find the preceding node (A) of the given node (B).
 * An object A is preceding an object B if A and B are in the same tree
 * and A comes before B in tree order.
 * @param {!Node} node
 * @param {?Node} root If set, `root` is always an inclusive ancestor
 *        of the return value (or else null is returned). This check assumes
 *        that `root` is also an inclusive ancestor of the given `node`
 * @returns {?Node}
 */
exports.precedingNode = function (node, root) {
  if (node === root) {
    return null;
  }

  if (node.previousSibling) {
    node = node.previousSibling;

    while (node.lastChild) {
      node = node.lastChild;
    }
    return node;
  }

  if (node.parentNode) {
    return node.parentNode;
  }

  return null;
};

/**
 * Find the following node (A) of the given node (B).
 * An object A is following an object B if A and B are in the same tree
 * and A comes after B in tree order.
 * @param {!Node} node
 * @param {?Node} root If set, root is always an inclusive ancestor
 *        of the return value (or else null is returned). This check assumes
 *        that `root` is also an inclusive ancestor of the given `node`
 * @returns {?Node}
 */
exports.followingNode = function (node, root) {
  if (node.firstChild) {
    return node.firstChild;
  }

  do {
    if (node === root) {
      return null;
    }

    if (node.nextSibling) {
      return node.nextSibling;
    }

    node = node.parentNode;
  } while (node);

  return null;
};

/**
 * Find the following node (A) of the given node (B), but skip over any children of B.
 * An object A is following an object B if A and B are in the same tree
 * and A comes after B in tree order.
 * @param {!Node} node
 * @param {?Node} root If set, root is always an inclusive ancestor
 *        of the return value (or else null is returned). This check assumes
 *        that `root` is also an inclusive ancestor of the given `node`
 * @returns {?Node}
 */
exports.followingNodeSkipChildren = function (node, root) {
  do {
    if (node === root) {
      return null;
    }

    if (node.nextSibling) {
      return node.nextSibling;
    }

    node = node.parentNode;
  } while (node);

  return null;
};

/** Find the last inclusive descendant in tree order of `node`
 *
 * @param {!Node} node
 * @returns {?Node}
 */
exports.lastInclusiveDescendant = function (node) {
  while (node.lastChild) {
    node = node.lastChild;
  }
  return node;
};
