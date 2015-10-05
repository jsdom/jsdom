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
      this._events[type] = [];
    }

    const handlers = this._events[type];
    if (handlers.findIndex(cb => cb.callback === callback && cb.capture === capture) !== -1) {
      return;
    }

    handlers.unshift({
      callback,
      capture
    });
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

    const handlers = this._events[type];
    const idx = handlers.findIndex(cb => cb.callback === callback && cb.capture === capture);

    if (idx !== -1) {
      handlers.splice(idx, 1);
    }
  }

  dispatchEvent(event) {
    if (!("_bubbles" in event) || !("_cancelable" in event)) {
      throw new TypeError("Argument to dispatchEvent must be an Event");
    }

    if (event._type === "") {
      throw new DOMException(DOMException.INVALID_STATE_ERR, "Tried to dispatch an uninitialized event");
    }
    if (event.eventPhase !== event.NONE) {
      throw new DOMException(DOMException.INVALID_STATE_ERR, "Tried to dispatch a dispatching event");
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
    const document = target._ownerDocument || target._document;
    // Will be falsy for windows that have closed
    if (document) {
      const inlineListener = getListenerForInlineEventHandler(target, event._type);
      if (inlineListener &&
        (event._eventPhase === event.AT_TARGET || event._eventPhase === event.BUBBLING_PHASE) &&
        (!target.nodeName || document.implementation._hasFeature("ProcessExternalResources", "script"))) {
        callListener(event, target, inlineListener);
      }
      const listeners = getListeners(target, event._type);
      const listenersCopy = listeners.slice(0);
      let currentListenerIndex = listenersCopy.length;
      while (currentListenerIndex-- && !event._stopImmediatePropagation) {
        const currentListener = listenersCopy[currentListenerIndex];
        if (listeners.indexOf(currentListener) !== -1 &&
            (
              (currentListener.capture && (event._eventPhase === event.CAPTURING_PHASE || event._eventPhase === event.AT_TARGET)) ||
              (!currentListener.capture && (event._eventPhase === event.AT_TARGET || event._eventPhase === event.BUBBLING_PHASE))
            )) {
          callListener(event, target, currentListener.callback);
        }
      }
    }
    target = iterator();
  }
}

function callListener(event, target, listener) {
  event._currentTarget = target;
  try {
    listener.call(target, event);
  } catch (e) {
    const window = target._document ? target : target._ownerDocument._defaultView;

    if (window) {
      reportException(window, e);
    }
    // Errors in window-less documents just get swallowed... can you think of anything better?
  }
}

function getListeners(target, type) {
  let listeners;
  const impl = idlUtils.implForWrapper(target, "EventTarget");
  if (impl._events[type]) {
    listeners = impl._events[type];
  } else {
    listeners = [];
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
