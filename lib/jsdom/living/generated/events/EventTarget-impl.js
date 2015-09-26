"use strict";
const DOMException = require("../../../web-idl/DOMException");
const reportException = require("../../helpers/runtime-script-errors");
const domSymbolTree = require("../../helpers/internal-constants").domSymbolTree;
const idlUtils = require("../util");

class EventTargetImpl {
  constructor() {
    this._events = Object.create(null);
  }

  addEventListener(type, callback, capture) {
    // webidl2js currently can't handle neither optional arguments nor callback interfaces
    if (callback === undefined || callback === null) {
      callback = null;
    } else if (typeof callback === "object") {
      callback = callback.handleEvent;
    } else if (typeof callback !== "function") {
      throw new TypeError("Only undefined, null, an object, or a function are allowed for the callback parameter");
    }

    capture = Boolean(capture);

    if (callback === null) {
      return;
    }

    if (this._events[type] === undefined) {
      this._events[type] = {
        capturing: [],
        bubbling: []
      };
    }

    const handlers = this._events[type][capture ? "capturing" : "bubbling"];
    if (handlers.indexOf(callback) !== -1) {
      return;
    }

    handlers.unshift(callback);
  }

  removeEventListener(type, callback, capture) {
    if (callback === undefined || callback === null) {
      callback = null;
    } else if (typeof callback === "object") {
      callback = callback.handleEvent;
    } else if (typeof callback !== "function") {
      throw new TypeError("Only undefined, null, an object, or a function are allowed for the callback parameter");
    }

    capture = Boolean(capture);

    if (callback === null) {
      // Optimization, not in the spec.
      return;
    }

    if (this._events[type] === undefined) {
      return;
    }

    const handlers = this._events[type][capture ? "capturing" : "bubbling"];
    const idx = handlers.indexOf(callback);

    if (idx !== -1) {
      handlers.splice(idx, 1);
    }
  }

  dispatchEvent(event) {
    if (!("_bubbles" in event) || !("_cancelable" in event)) {
      throw new TypeError("Argument to dispatchEvent must be an Event");
    }

    if (event._type === null || event._type === "") {
      throw new DOMException(DOMException.INVALID_STATE_ERR, "Tried to dispatch an uninitialized event");
    }

    const targetList = [];

    event._target = idlUtils.wrapperForImpl(this);

    // per the spec we gather the list of targets first to ensure
    // against dom modifications during actual event dispatch
    let target = idlUtils.wrapperForImpl(this);
    let targetParent = domSymbolTree.parent(target);
    while (targetParent) {
      targetList.push(targetParent);
      target = targetParent;
      targetParent = domSymbolTree.parent(target);
    }
    targetParent = target.defaultView;
    if (targetParent) {
      targetList.push(targetParent);
    }

    let iterator = backwardIterator(targetList);

    event._eventPhase = event.CAPTURING_PHASE;
    dispatchPhase(event, iterator);

    iterator = singleIterator(event._target);
    event._eventPhase = event.AT_TARGET;
    dispatchPhase(event, iterator);

    if (event._bubbles) {
      iterator = forwardIterator(targetList);
      event._eventPhase = event.BUBBLING_PHASE;
      dispatchPhase(event, iterator);
    }

    event._currentTarget = null;
    event._eventPhase = event.NONE;

    return !event._canceled;
  }
}

module.exports = {
  implementation: EventTargetImpl
};

function forwardIterator(list) {
  let i = 0;
  const len = list.length;
  return function iterator() {
    return i < len ? list[i++] : null;
  };
}

function backwardIterator(list) {
  let i = list.length;
  return function iterator() {
    return i >= 0 ? list[--i] : null;
  };
}

function singleIterator(obj) {
  let i = 1;
  return function iterator() {
    return i-- ? obj : null;
  };
}

function dispatchPhase(event, iterator) {
  let target = iterator();

  while (target && !event._stopPropagation) {
    if (event._eventPhase === event.CAPTURING_PHASE || event._eventPhase === event.AT_TARGET) {
      callListeners(event, target, getListeners(target, event._type, true));
    }
    if (event._eventPhase === event.AT_TARGET || event._eventPhase === event.BUBBLING_PHASE) {
      callListeners(event, target, getListeners(target, event._type, false));
    }
    target = iterator();
  }
}

function callListeners(event, target, listeners) {
  let currentListener = listeners.length;
  while (currentListener--) {
    event._currentTarget = target;
    try {
      listeners[currentListener].call(target, event);
    } catch (e) {
      const window = target._document ? target : target._ownerDocument._defaultView;

      if (window) {
        reportException(window, e);
      }
      // Errors in window-less documents just get swallowed... can you think of anything better?
    }
  }
}

function getListeners(target, type, capturing) {
  let listeners;
  const impl = idlUtils.implForWrapper(target, "EventTarget");
  if (impl._events[type]) {
    listeners = impl._events[type][capturing ? "capturing" : "bubbling"];
  } else {
    listeners = [];
  }

  if (!capturing) {
    const inlineListener = getListenerForInlineEventHandler(target, type);
    if (inlineListener) {
      const document = target._ownerDocument || target._document;

      // Will be falsy for windows that have closed
      if (document) {
        const implementation = document.implementation;

        if (implementation._hasFeature("ProcessExternalResources", "script")) {
          if (listeners.indexOf(inlineListener) === -1) {
            listeners.push(inlineListener);
          }
        }
      }
    }
  }
  return listeners;
}

const wrappedListener = Symbol("inline event listener wrapper");

function getListenerForInlineEventHandler(target, type) {
  const callback = target["on" + type];

  if (!callback) { // TODO event handlers: only check null
    return null;
  }

  if (!callback[wrappedListener]) {
    // https://html.spec.whatwg.org/multipage/webappapis.html#the-event-handler-processing-algorithm
    callback[wrappedListener] = function (E) {
      const isWindowError = E.constructor.name === "ErrorEvent" && type === "error"; // TODO branding

      let returnValue;
      if (isWindowError) {
        returnValue = callback.call(E.currentTarget, E.message, E.filename, E.lineno, E.colno, E.error);
      } else {
        returnValue = callback.call(E.currentTarget, E);
      }

      if (type === "mouseover" || isWindowError) {
        if (returnValue) {
          E.preventDefault();
        }
      } else if (!returnValue) {
        E.preventDefault();
      }
    };
  }

  return callback[wrappedListener];
}
