"use strict";

const idlUtils = require("../generated/utils");
const EventInit = require("../generated/EventInit");

class EventImpl {
  constructor(args, privateData) {
    const [type, eventInitDict = this.constructor.defaultInit] = args;

    this.type = type;

    this.bubbles = false;
    this.cancelable = false;
    for (const key in eventInitDict) {
      if (key in this.constructor.defaultInit) {
        this[key] = eventInitDict[key];
      }
    }
    for (const key in this.constructor.defaultInit) {
      if (!(key in this)) {
        this[key] = this.constructor.defaultInit[key];
      }
    }

    this.target = null;
    this.currentTarget = null;
    this.eventPhase = 0;

    this._initializedFlag = true;
    this._stopPropagationFlag = false;
    this._stopImmediatePropagationFlag = false;
    this._canceledFlag = false;
    this._dispatchFlag = false;
    this._path = [];

    this.isTrusted = privateData.isTrusted || false;
    this.timeStamp = Date.now();
  }

  get srcElement() {
    return this.target;
  }

  get returnValue() {
    return !this._canceledFlag;
  }

  set returnValue(v) {
    if (this.cancelable && v === false) {
      this._canceledFlag = true;
    }
  }

  get defaultPrevented() {
    return this._canceledFlag;
  }

  stopPropagation() {
    this._stopPropagationFlag = true;
  }

  get cancelBubble() {
    return this._stopPropagationFlag;
  }

  set cancelBubble(v) {
    if (v) {
      this._stopPropagationFlag = true;
    }
  }

  stopImmediatePropagation() {
    this._stopPropagationFlag = true;
    this._stopImmediatePropagationFlag = true;
  }

  preventDefault() {
    if (this.cancelable) {
      this._canceledFlag = true;
    }
  }

  // https://dom.spec.whatwg.org/#dom-event-composedpath
  // This method doesn't implements the spec since there is a spec bug. Revisit this method once the
  // spec bug has been fixed: https://github.com/whatwg/dom/issues/684
  composedPath() {
    const composedPath = [];

    const { currentTarget, _path } = this;

    // Get the index and the hidden subtree level of the current target in the path.
    // Iterating from the end to the start of the path to go from the window to the target.
    let currentTargetIndexInPath = -1;
    let currentTargetHiddenSubtreeLevel = 0;

    for (let i = _path.length - 1; i >= 0; i--) {
      const { item, rootOfClosedTree, slotInClosedTree } = _path[i];
      if (rootOfClosedTree) {
        currentTargetHiddenSubtreeLevel++;
      }

      if (item === idlUtils.implForWrapper(currentTarget)) {
        currentTargetIndexInPath = i;
        break;
      }

      if (slotInClosedTree) {
        currentTargetHiddenSubtreeLevel--;
      }
    }

    // Handle post-dispatch case where the _path has been reset.
    if (currentTargetIndexInPath === -1) {
      return composedPath;
    }

    // The current target is in the path, so we can now add it
    composedPath.push(idlUtils.wrapperForImpl(_path[currentTargetIndexInPath].item));

    // Let's iteration over the items in the path that are before in the path and add
    // them to the composedPath if they are part of the same shadow tree
    let currentHiddenLevel = currentTargetHiddenSubtreeLevel;
    let maxHiddenLevel = currentTargetHiddenSubtreeLevel;

    for (let i = currentTargetIndexInPath - 1; i >= 0; i--) {
      const { item, rootOfClosedTree, slotInClosedTree } = _path[i];

      if (rootOfClosedTree) {
        currentHiddenLevel++;
      }

      if (currentHiddenLevel <= maxHiddenLevel) {
        composedPath.unshift(idlUtils.wrapperForImpl(item));
      }

      if (slotInClosedTree) {
        currentHiddenLevel--;
        if (currentHiddenLevel < maxHiddenLevel) {
          maxHiddenLevel = currentHiddenLevel;
        }
      }
    }

    // Let's now iterate over the items that are after in the path and add them to the
    // composed path if necessary
    currentHiddenLevel = currentTargetHiddenSubtreeLevel;
    maxHiddenLevel = currentTargetHiddenSubtreeLevel;
    for (let i = currentTargetIndexInPath + 1; i < _path.length; i++) {
      const { item, rootOfClosedTree, slotInClosedTree } = _path[i];

      if (slotInClosedTree) {
        currentHiddenLevel++;
      }

      if (currentHiddenLevel <= maxHiddenLevel) {
        composedPath.push(idlUtils.wrapperForImpl(item));
      }

      if (rootOfClosedTree) {
        currentHiddenLevel--;
        if (currentHiddenLevel < maxHiddenLevel) {
          maxHiddenLevel = currentHiddenLevel;
        }
      }
    }

    return composedPath;
  }

  _initialize(type, bubbles, cancelable) {
    this.type = type;
    this._initializedFlag = true;

    this._stopPropagationFlag = false;
    this._stopImmediatePropagationFlag = false;
    this._canceledFlag = false;

    this.isTrusted = false;
    this.target = null;
    this.bubbles = bubbles;
    this.cancelable = cancelable;
  }

  initEvent(type, bubbles, cancelable) {
    if (this._dispatchFlag) {
      return;
    }

    this._initialize(type, bubbles, cancelable);
  }
}
EventImpl.defaultInit = EventInit.convert(undefined);

module.exports = {
  implementation: EventImpl
};
