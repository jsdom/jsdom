"use strict";

module.exports = function (core) {
  // https://dom.spec.whatwg.org/#interface-childnode
  // NoInterfaceObject

  function ensureNode(doc, node) {
    if (typeof node === "string") {
      node = doc.createTextNode(node);
    } else
    if (node instanceof doc.defaultView.CharacterData) {
      node = doc.createTextNode(node.data);
    } else
    if (!(node instanceof doc.defaultView.Node)) {
      node = null;
    }

    return node;
  }

  function ensureNodeArguments(doc, args) {
    let node = null;

    if (args.length === 1) {
      node = ensureNode(doc, args[0]);
    } else {
      node = doc.createDocumentFragment();
      for (let i = 0; args.length > i; i++) {
        node.appendChild(ensureNode(doc, args[i]));
      }
    }

    return node;
  }

  var ChildNodeInterface = {
    // Inserts nodes just before node, while replacing strings in nodes with equivalent Text nodes.
    // https://dom.spec.whatwg.org/#dom-childnode-before
    before() {
      const parent = this.parentNode;
      if (arguments.length === 0 || parent === null) {
        return;
      }

      const node = ensureNodeArguments(this._ownerDocument, arguments);
      parent.insertBefore(node, this);
    },

    // Inserts nodes just after node, while replacing strings in nodes with equivalent Text nodes.
    // https://dom.spec.whatwg.org/#dom-childnode-after
    after() {
      const parent = this.parentNode;
      if (arguments.length === 0 || parent === null) {
        return;
      }

      const node = ensureNodeArguments(this._ownerDocument, arguments);
      const nextSibling = this.nextSibling;

      if (nextSibling === null) {
        parent.appendChild(node);
      } else {
        parent.insertBefore(node, nextSibling);
      }
    },

    // Replaces node with nodes, while replacing strings in nodes with equivalent Text nodes.
    // https://dom.spec.whatwg.org/#dom-childnode-replacewith
    replaceWith() {
      const parent = this.parentNode;
      if (arguments.length === 0 || parent === null) {
        return;
      }

      //const viableNextSibling = getViableNextSibling(this, arguments);
      //const node = ensureNodeArguments(this._ownerDocument, arguments);

      // TODO: Implement spec compliant replaceWith()
      throw Error("ChildNode.replaceWith() is not implemented yet.");
    },

    // Removes node.
    // https://dom.spec.whatwg.org/#dom-childnode-remove
    remove() {
      const parent = this.parentNode;
      if (parent === null) {
        return;
      }

      parent.removeChild(this);
    }
  };

  const implementers = [core.DocumentType, core.Element, core.CharacterData];

  implementers.forEach(function (Constructor) {
    for (var funcName in ChildNodeInterface) {
      Constructor.prototype[funcName] = ChildNodeInterface[funcName];
    }
  });
};
