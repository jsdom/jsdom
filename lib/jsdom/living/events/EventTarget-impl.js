"use strict";
const DOMException = require("../../web-idl/DOMException");
const reportException = require("../helpers/runtime-script-errors");
const domSymbolTree = require("../helpers/internal-constants").domSymbolTree;
const idlUtils = require("../generated/utils");

const EventImpl = require("./Event-impl").implementation;
const Event = require("../generated/Event").interface;

class EventTargetImpl {
  constructor() {
    this._eventListeners = Object.create(null);
  }

  addEventListener(type, callback, capture) {
    // webidl2js currently can't handle neither optional arguments nor callback interfaces
    if (callback === undefined || callback === null) {
      callback = null;
    } else if (typeof callback !== "object" && typeof callback !== "function") {
      throw new TypeError("Only undefined, null, an object, or a function are allowed for the callback parameter");
    }

    if (callback === null) {
      return;
    }

    if (capture === undefined) {
      capture = false;
    }

    if (!this._eventListeners[type]) {
      this._eventListeners[type] = [];
    }

    for (let i = 0; i < this._eventListeners[type].length; ++i) {
      const listener = this._eventListeners[type][i];
      if (listener.capture === capture && listener.callback === callback) {
        return;
      }
    }

    this._eventListeners[type].push({
      callback,
      capture
    });
  }

  removeEventListener(type, callback, capture) {
    if (callback === undefined || callback === null) {
      callback = null;
    } else if (typeof callback !== "object" && typeof callback !== "function") {
      throw new TypeError("Only undefined, null, an object, or a function are allowed for the callback parameter");
    }

    if (callback === null) {
      // Optimization, not in the spec.
      return;
    }

    if (capture === undefined) {
      capture = false;
    }

    if (!this._eventListeners[type]) {
      return;
    }

    for (let i = 0; i < this._eventListeners[type].length; ++i) {
      const listener = this._eventListeners[type][i];
      if (listener.callback === callback && listener.capture === capture) {
        this._eventListeners[type].splice(i, 1);
        break;
      }
    }
  }

  dispatchEvent(eventImpl) {
    if (!(eventImpl instanceof EventImpl)) {
      throw new TypeError("Argument to dispatchEvent must be an Event");
    }

    if (eventImpl._dispatchFlag || !eventImpl._initializedFlag) {
      throw new DOMException(DOMException.INVALID_STATE_ERR, "Tried to dispatch an uninitialized event");
    }
    if (eventImpl.eventPhase !== Event.NONE) {
      throw new DOMException(DOMException.INVALID_STATE_ERR, "Tried to dispatch a dispatching event");
    }

    eventImpl.isTrusted = false;

    return this._dispatch(eventImpl);
  }

  _dispatch(eventImpl, targetOverride) {
    eventImpl._dispatchFlag = true;
    eventImpl.target = targetOverride || this;

    const eventPath = [];
    let targetParent = domSymbolTree.parent(eventImpl.target);
    let target = eventImpl.target;
    while (targetParent) {
      eventPath.push(targetParent);
      target = targetParent;
      targetParent = domSymbolTree.parent(targetParent);
    }
    if (eventImpl.type !== "load" && target._defaultView) { // https://html.spec.whatwg.org/#events-and-the-window-object
      eventPath.push(idlUtils.implForWrapper(target._defaultView));
    }

    eventImpl.eventPhase = Event.CAPTURING_PHASE;
    for (let i = eventPath.length - 1; i >= 0; --i) {
      if (eventImpl._stopPropagationFlag) {
        break;
      }

      const object = eventPath[i];
      const objectImpl = idlUtils.implForWrapper(object) || object; // window :(
      const eventListeners = objectImpl._eventListeners[eventImpl.type];
      invokeEventListeners(eventListeners, object, eventImpl);
    }

    eventImpl.eventPhase = Event.AT_TARGET;

    if (!eventImpl._stopPropagationFlag) {
      invokeInlineListeners(eventImpl.target, eventImpl);

      if (this._eventListeners[eventImpl.type]) {
        const eventListeners = this._eventListeners[eventImpl.type];
        invokeEventListeners(eventListeners, eventImpl.target, eventImpl);
      }
    }

    if (eventImpl.bubbles) {
      eventImpl.eventPhase = Event.BUBBLING_PHASE;
      for (let i = 0; i < eventPath.length; ++i) {
        if (eventImpl._stopPropagationFlag) {
          break;
        }

        const object = eventPath[i];
        const objectImpl = idlUtils.implForWrapper(object) || object; // window :(
        const eventListeners = objectImpl._eventListeners[eventImpl.type];
        invokeInlineListeners(object, eventImpl);
        invokeEventListeners(eventListeners, object, eventImpl);
      }
    }

    eventImpl._dispatchFlag = false;
    eventImpl.eventPhase = Event.NONE;
    eventImpl.currentTarget = null;
    return !eventImpl._canceledFlag;
  }
}

module.exports = {
  implementation: EventTargetImpl
};

function invokeInlineListeners(object, event) {
  const wrapper = idlUtils.wrapperForImpl(object);
  const inlineListener = getListenerForInlineEventHandler(wrapper, event.type);
  if (inlineListener) {
    const document = object._ownerDocument || (wrapper && (wrapper._document || wrapper._ownerDocument));

    // Will be falsy for windows that have closed
    if (document && (!object.nodeName || document.implementation._hasFeature("ProcessExternalResources", "script"))) {
      invokeEventListeners([{ callback: inlineListener }], object, event);
    }
  }
}

function invokeEventListeners(listeners, target, eventImpl) {
  const wrapper = idlUtils.wrapperForImpl(target);
  const document = target._ownerDocument || (wrapper && (wrapper._document || wrapper._ownerDocument));
  // Will be falsy for windows that have closed
  if (!document) {
    return;
  }

  // workaround for events emitted on window (window-proxy)
  // the wrapper is the root window instance, but we only want to expose the vm proxy at all times
  if (wrapper._document) {
    target = idlUtils.implForWrapper(wrapper._document)._defaultView;
  }
  eventImpl.currentTarget = target;
  if (!listeners) {
    return;
  }

  const handlers = listeners.slice();
  for (let i = 0; i < handlers.length; ++i) {
    if (eventImpl._stopImmediatePropagationFlag) {
      return;
    }

    const listener = handlers[i];
    if (listeners.indexOf(listener) === -1 ||
        (eventImpl.eventPhase === Event.CAPTURING_PHASE && !listener.capture) ||
        (eventImpl.eventPhase === Event.BUBBLING_PHASE && listener.capture)) {
      continue;
    }

    try {
      if (typeof listener.callback === "object") {
        if (typeof listener.callback.handleEvent === "function") {
          listener.callback.handleEvent(idlUtils.wrapperForImpl(eventImpl));
        }
      } else {
        listener.callback.call(idlUtils.wrapperForImpl(eventImpl.currentTarget), idlUtils.wrapperForImpl(eventImpl));
      }
    } catch (e) {
      let window = null;
      if (wrapper && wrapper._document) {
        window = wrapper;
      } else if (target._ownerDocument) {
        window = target._ownerDocument._defaultView;
      }

      if (window) {
        reportException(window, e);
      }
      // Errors in window-less documents just get swallowed... can you think of anything better?
    }
  }
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
