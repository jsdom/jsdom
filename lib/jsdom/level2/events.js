"use strict";
/* DOM Level2 Events implemented as described here:
 *
 * http://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html
 *
 */
var core = require("../level1/core"),
    utils = require("../utils"),
    defineGetter = utils.defineGetter,
    defineSetter = utils.defineSetter,
    inheritFrom = utils.inheritFrom;

// The dependencies here are a bit screwy; when we get a chance to move all events to living, things will get simpler.
const addMessageEventToCore = require("../living/message-event");
const addErrorEventToCore = require("../living/error-event");
const addHashChangeEventToCore = require("../living/hash-change-event");
const addProgressEventToCore = require("../living/progress-event");
const addCustomEventToCore = require("../living/custom-event");
const domSymbolTree = require("../living/helpers/internal-constants").domSymbolTree;
const NODE_TYPE = require("../living/node-type");

core.Event = function(eventType, eventInit) {
    if(!(this instanceof core.Event)) {
        return new core.Event(eventType, eventInit);
    }
    if (arguments.length === 0) {
      throw new TypeError("eventType cannot be undefined");
    }
    this._type = String(eventType);

    if (eventInit === undefined || eventInit === null) {
      eventInit = {};
    }
    if (typeof eventInit !== "object") {
      throw new TypeError("cannot convert eventInit argument to a dictionary");
    }
    this._bubbles = Boolean(eventInit.bubbles);
    this._cancelable = Boolean(eventInit.cancelable);

    this._target = null;
    this._currentTarget = null;
    this._eventPhase = 0;
    this._timeStamp = Date.now();
    this._stopPropagation = false;
    this._canceled = false;
};

core.Event.prototype = {
    initEvent: function(type, bubbles, cancelable) {
        this._type = type;
        this._bubbles = bubbles;
        this._cancelable = cancelable;
        this._canceled = false;
        this._stopPropagation = false;
        this._stopImmediatePropagation = false;
        this._eventPhase = core.Event.NONE;
    },
    preventDefault: function() {
        if (this._cancelable) {
            this._canceled = true;
        }
    },
    stopPropagation: function() {
        this._stopPropagation = true;
    },
    stopImmediatePropagation: function() {
        this._stopPropagation = true;
        this._stopImmediatePropagation = true;
    },
    NONE            : 0,
    CAPTURING_PHASE : 1,
    AT_TARGET       : 2,
    BUBBLING_PHASE  : 3,
    get type() { return this._type; },
    get bubbles() { return this._bubbles; },
    get cancelable() { return this._cancelable; },
    get target() { return this._target; },
    get currentTarget() { return this._currentTarget; },
    get eventPhase() { return this._eventPhase; },
    get timeStamp() { return this._timeStamp; },
    get defaultPrevented() { return this._canceled; }
};

utils.addConstants(core.Event, {
    NONE            : 0,
    CAPTURING_PHASE : 1,
    AT_TARGET       : 2,
    BUBBLING_PHASE  : 3
});

addMessageEventToCore(core);
addErrorEventToCore(core);
addHashChangeEventToCore(core);
addProgressEventToCore(core);
addCustomEventToCore(core);

core.UIEvent = function(eventType, eventInit) {
    core.Event.call(this, eventType, eventInit);
    this.view = null;
    this.detail = null;
};
inheritFrom(core.Event, core.UIEvent, {
    initUIEvent: function(type, bubbles, cancelable, view, detail) {
        this.initEvent(type, bubbles, cancelable);
        this.view = view;
        this.detail = detail;
    },
});


core.MouseEvent = function(eventType, eventInit) {
    core.UIEvent.call(this, eventType, eventInit);
    this.screenX = null;
    this.screenY = null;
    this.clientX = null;
    this.clientY = null;
    this.ctrlKey = null;
    this.shiftKey = null;
    this.altKey = null;
    this.metaKey = null;
    this.button = null;
    this.relatedTarget = null;
};
inheritFrom(core.UIEvent, core.MouseEvent, {
    initMouseEvent:   function(type,
                               bubbles,
                               cancelable,
                               view,
                               detail,
                               screenX,
                               screenY,
                               clientX,
                               clientY,
                               ctrlKey,
                               altKey,
                               shiftKey,
                               metaKey,
                               button,
                               relatedTarget) {
        this.initUIEvent(type, bubbles, cancelable, view, detail);
        this.screenX  = screenX
        this.screenY  = screenY
        this.clientX  = clientX
        this.clientY  = clientY
        this.ctrlKey  = ctrlKey
        this.shiftKey  = shiftKey
        this.altKey  = altKey
        this.metaKey  = metaKey
        this.button  = button
        this.relatedTarget  = relatedTarget
    }
});


core.MutationEvent = function(eventType, eventInit) {
    core.Event.call(this, eventType, eventInit);
    this.relatedNode = null;
    this.prevValue = null;
    this.newValue = null;
    this.attrName = null;
    this.attrChange = null;
};
inheritFrom(core.Event, core.MutationEvent, {
    initMutationEvent:   function(type,
                                  bubbles,
                                  cancelable,
                                  relatedNode,
                                  prevValue,
                                  newValue,
                                  attrName,
                                  attrChange) {
        this.initEvent(type, bubbles, cancelable);
        this.relatedNode = relatedNode;
        this.prevValue = prevValue;
        this.newValue = newValue;
        this.attrName = attrName;
        this.attrChange = attrChange;
    },
    MODIFICATION : 1,
    ADDITION     : 2,
    REMOVAL      : 3
});

core.EventTarget = require('../living/generated/events/EventTarget').interface;

// Reinherit class heirarchy with EventTarget at its root
inheritFrom(core.EventTarget, core.Node, core.Node.prototype);

// Node
inheritFrom(core.Node, core.Attr, core.Attr.prototype);
inheritFrom(core.Node, core.Document, core.Document.prototype);
inheritFrom(core.Node, core.DocumentFragment, core.DocumentFragment.prototype);
inheritFrom(core.Node, core.Element, core.Element.prototype);


function getDocument(el) {
  return el.nodeType == NODE_TYPE.DOCUMENT_NODE ? el : el._ownerDocument;
}

function mutationEventsEnabled(el) {
  return el.nodeType != NODE_TYPE.ATTRIBUTE_NODE &&
         getDocument(el).implementation._hasFeature('MutationEvents');
}

var insertBefore_super = core.Node.prototype.insertBefore;
core.Node.prototype.insertBefore = function(newChild, refChild) {
  var ret = insertBefore_super.apply(this, arguments);
  if (mutationEventsEnabled(this)) {
    var doc = getDocument(this),
        ev = doc.createEvent("MutationEvents");

    ev.initMutationEvent("DOMNodeInserted", true, false, this, null, null, null, null);
    newChild.dispatchEvent(ev);

    ev = doc.createEvent("MutationEvents");
    ev.initMutationEvent("DOMSubtreeModified", true, false, this, null, null, null, null);
    this.dispatchEvent(ev);

    if (this.nodeType == NODE_TYPE.DOCUMENT_NODE || this._attachedToDocument) {
      ev = doc.createEvent("MutationEvents");
      ev.initMutationEvent("DOMNodeInsertedIntoDocument", false, false, null, null, null, null, null);

      for (const el of domSymbolTree.treeIterator(newChild)) {
        if (el.nodeType == NODE_TYPE.ELEMENT_NODE) {
          el.dispatchEvent(ev);
          el._attachedToDocument = true;
        }
      }
    }
  }
  return ret;
};

var removeChild_super = core.Node.prototype.removeChild;
core.Node.prototype.removeChild = function (oldChild) {
  if (mutationEventsEnabled(this)) {
    var doc = getDocument(this),
        ev = doc.createEvent("MutationEvents");

    ev.initMutationEvent("DOMNodeRemoved", true, false, this, null, null, null, null);
    oldChild.dispatchEvent(ev);

    ev = doc.createEvent("MutationEvents");
    ev.initMutationEvent("DOMSubtreeModified", true, false, this, null, null, null, null);
    this.dispatchEvent(ev);

    ev = doc.createEvent("MutationEvents");
    ev.initMutationEvent("DOMNodeRemovedFromDocument", false, false, null, null, null, null, null);
    for (const el of domSymbolTree.treeIterator(oldChild)) {
      if (el.nodeType == NODE_TYPE.ELEMENT_NODE) {
        el.dispatchEvent(ev);
        el._attachedToDocument = false;
      }
    }
  }
  return removeChild_super.apply(this, arguments);
};


var _attrModified_super = core.Node.prototype._attrModified;
core.Node.prototype._attrModified = function (name, value, oldValue) {
    var ret = _attrModified_super.apply(this, arguments);
    if (mutationEventsEnabled(this) && value !== oldValue) {
        var doc = getDocument(this),
            ev = doc.createEvent("MutationEvents");

        ev.initMutationEvent("DOMSubtreeModified", true, false, this, null, null, null, null);
        this.dispatchEvent(ev);
    }
    return ret;
};

var interfaceTable = {
  event: core.Event,
  events: core.Event,
  htmlevents: core.Event,
  mouseevent: core.MouseEvent,
  mouseevents: core.MouseEvent,
  uievent: core.UIEvent,
  uievents: core.UIEvent,
  messageevent: core.MessageEvent,

  // alias unimplemented interfaces to Event
  customevent: core.Event, // CustomEvent
  keyboardevent: core.Event, // KeyboardEvent
  keyevents: core.Event, // KeyboardEvent
  touchevent: core.Event, // TouchEvent

  // old, not part of spec anymore
  mutationevents: core.MutationEvent
};

core.Document.prototype.createEvent = function (type) {
  var typeLower = type.toLowerCase();
  var Constructor = interfaceTable[typeLower] || null;

  if (!Constructor) {
    throw new core.DOMException(core.DOMException.NOT_SUPPORTED_ERR,
      "The provided event type (\"" + type + "\") is invalid");
  }

  return new Constructor("");
};
