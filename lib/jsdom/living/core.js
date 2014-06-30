var core = require("../level3/core");
var defineGetter = require('../utils').defineGetter;
require("./node");

// http://dom.spec.whatwg.org/#dom-node-parentelement
defineGetter(core.dom.level3.core.Node.prototype, 'parentElement', function() {
  return this._parentNode !== null && this._parentNode instanceof core.dom.level3.core.Element ? this._parentNode: null;
});

exports.dom = { living: { core: core } };
