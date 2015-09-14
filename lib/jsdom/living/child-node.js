"use strict";

module.exports = function(core) {
  // https://dom.spec.whatwg.org/#interface-childnode
  // NoInterfaceObject

  function ensureNodeArguments(doc, args) {
    var nodes = [];
    for(var i=0; args.length > i; i++) {
      var arg = args[i];
      if(typeof arg == "string") {
        arg = doc.createTextNode(arg);
      }

      nodes.push(arg);
    }

    return nodes;
  }

  var ChildNodeInterface = {

    // Inserts nodes just before node, while replacing strings in nodes with equivalent Text nodes.
    // https://dom.spec.whatwg.org/#dom-childnode-before
    before: function() {
      if(this.parentNode !== null) {

        var nodes = ensureNodeArguments(this._ownerDocument, arguments);

        for(var i=0; nodes.length > i; i++) {
          var node = nodes[i];
          this.parentNode.insertBefore(node, this);
        }
      }
    },

    // Inserts nodes just after node, while replacing strings in nodes with equivalent Text nodes.
    // https://dom.spec.whatwg.org/#dom-childnode-after
    after: function() {
      if(this.parentNode !== null) {

        var nodes = ensureNodeArguments(this._ownerDocument, arguments);
        var beforeTarget = this.nextSibling;
        var i=0;

        if(beforeTarget === null) {
          beforeTarget = nodes[0];
          this.parentNode.appendChild(beforeTarget);
          i=1;
        }
        for(; nodes.length > i; i++) {
          var node = nodes[i];
          this.parentNode.insertBefore(node, beforeTarget);
          beforeTarget = node;
        }
      }
    },

    // Replaces node with nodes, while replacing strings in nodes with equivalent Text nodes.
    // https://dom.spec.whatwg.org/#dom-childnode-replacewith
    replaceWith: function() {
      if(this.parentNode !== null) {

        var nodes = ensureNodeArguments(this._ownerDocument, arguments);

        for(var i=0; nodes.length > i; i++) {
          var node = nodes[i];
          this.parentNode.insertBefore(node, this);
        }

        this.parentNode.removeChild(this);
      }
    },

    // Removes node.
    // https://dom.spec.whatwg.org/#dom-childnode-remove
    remove: function() {
      if(this.parentNode !== null) {
        this.parentNode.removeChild(this);
      }
    }
  };

  const implementers = [core.DocumentType, core.Element, core.CharacterData];

  implementers.forEach(function(Constructor) {
    for(var funcName in ChildNodeInterface) {
      Constructor.prototype[funcName] = ChildNodeInterface[funcName];
    }
  });
}
