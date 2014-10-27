var core = require("../level3/core");
var defineGetter = require("../utils").defineGetter;
require("./node");


// https://dom.spec.whatwg.org/#concept-element-local-name
defineGetter(core.Node.prototype, "localName", function() {
  if (this.nodeType !== 1 /* ELEMENT_NODE */) {
    return this._localName || null;
  }

  var nodeName = this._nodeName.split(":")[1] || this._nodeName;
  if (nodeName) { nodeName = nodeName.toLowerCase(); }
  return this._localName || nodeName || null;
});
exports.dom = { living: { core: core } };
