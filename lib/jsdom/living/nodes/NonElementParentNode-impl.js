"use strict";

// https://dom.spec.whatwg.org/#interface-nonelementparentnode
class NonElementParentNodeImpl {
  getElementById(id) {
    // return the first element
    return this._ids[id] && this._ids[id].length > 0 ? this._ids[id][0] : null;
  }
}

module.exports = {
  implementation: NonElementParentNodeImpl
};
