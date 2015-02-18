"use strict";

var EventException = require("./EventException");

var propEvents = Symbol();

module.exports = EventTarget;

function EventTarget() {
  // since window inherits from EventTarget and the vm module doesn't support Symbols
  // (https://github.com/iojs/io.js/issues/884) we still have to store config in a property
  if (!this.__jsdom) {
    this.__jsdom = {};
  }

  this.__jsdom[propEvents] = {};
}


EventTarget.prototype.addEventListener = function (type, callback, capture) {
  type = String(type);
  if (callback === null || callback === undefined || typeof callback !== "function") {
    return;
  }
  if (capture === undefined || capture === null) {
    capture = false;
  }
  capture = Boolean(capture);

  var events = this.__jsdom[propEvents];

  if (events[type] === undefined) {
    events[type] = {
      capturing: [],
      bubbling: []
    };
  }

  var handlers = events[type][capture ? "capturing" : "bubbling"];
  if (handlers.indexOf(callback) !== -1) {
    return;
  }

  handlers.push(callback);
};

EventTarget.prototype.removeEventListener = function (type, callback, capture) {
  type = String(type);
  if (callback === null || callback === undefined || typeof callback !== "function") {
    return;
  }
  if (capture === undefined || capture === null) {
    capture = false;
  }
  capture = Boolean(capture);

  var events = this.__jsdom[propEvents];
  if (!events[type]) {
    return;
  }

  var handlers = events[type][capture ? "capturing" : "bubbling"];
  var idx = handlers.indexOf(callback);

  if (idx !== -1) {
    handlers.splice(idx, 1);
  }
};

EventTarget.prototype.dispatchEvent = function (event) {
  if (event === null || event === undefined) {
    throw new EventException(0, "Null event");
  }
  if (event._type === null || event._type === "") {
    throw new EventException(0, "Uninitialized event");
  }

  var targetList = [];

  event._target = this;

  //per the spec we gather the list of targets first to ensure
  //against dom modifications during actual event dispatch
  var target = this,
      targetParent = target._parentNode;
  while (targetParent) {
    targetList.push(targetParent);
    target = targetParent;
    targetParent = target._parentNode;
  }
  targetParent = target.defaultView;
  if (targetParent) {
    targetList.push(targetParent);
  }

  var iterator = backwardIterator(targetList);

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

  return !event._preventDefault;
};

function forwardIterator(list) {
  var i = 0, len = list.length;
  return function iterator() {
    return i < len ? list[i++] : null;
  };
}

function backwardIterator(list) {
  var i = list.length;
  return function iterator() {
    return i >= 0 ? list[--i] : null;
  };
}

function singleIterator(obj) {
  var i = 1;
  return function iterator() {
    return i-- ? obj : null;
  };
}

function dispatchPhase(event, iterator) {
  var target = iterator();

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
  var currentListener = listeners.length;
  while (currentListener--) {
    event._currentTarget = target;
    try {
      listeners[currentListener].call(target, event);
    } catch (e) {
      target.raise(
        "error", "Dispatching event '" + event._type + "' failed",
        { error: e, event: event }
      );
    }
  }
}

function getListeners(target, type, capturing) {
  var events = target.__jsdom[propEvents];

  var listeners;
  if (events[type]) {
    listeners = events[type][capturing ? "capturing" : "bubbling"];
  } else {
    listeners = [];
  }

  if (!capturing) {
    var traditionalHandler = target["on" + type];
    if (traditionalHandler) {
      var implementation = (target._ownerDocument ? target._ownerDocument.implementation
                                                  : target.document.implementation);

      if (implementation._hasFeature("ProcessExternalResources", "script")) {
        if (listeners.indexOf(traditionalHandler) === -1) {
          listeners.push(traditionalHandler);
        }
      }
    }
  }
  return listeners;
}
