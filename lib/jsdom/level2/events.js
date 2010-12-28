/* DOM Level2 Events implemented as described here:
 *
 * http://www.w3.org/TR/2000/REC-DOM-Level-2-Events-20001113/events.html
 *
 */
var core = require("./core").dom.level2.core,
    sys = require("sys");

var events = {};

events.EventException = function() {
    if (arguments.length > 0) {
        this._code = arguments[0];
    } else {
        this._code = 0;
    }
    if (arguments.length > 1) {
        this._message = arguments[1];
    } else {
        this._message = "Unspecified event type";
    }
    Error.call(this, this._message);
    if (Error.captureStackTrace) {
        Error.captureStackTrace(this, events.EventException);
    }
};
events.EventException.prototype = {
  get UNSPECIFIED_EVENT_TYPE_ERR() { return 0; },
  get code() { return this._code;}
};
events.EventException.prototype.__proto__ = Error.prototype;

events.Event = function(eventType) {
    this._eventType = eventType;
    this._type = null;
    this._bubbles = null;
    this._cancelable = null;
    this._target = null;
    this._currentTarget = null;
    this._eventPhase = null;
    this._timeStamp = null;
    this._preventDefault = false;
    this._stopPropagation = false;
};
events.Event.prototype = {
    initEvent: function(type, bubbles, cancelable) {
        this._type = type;
        this._bubbles = bubbles;
        this._cancelable = cancelable;
    },
    preventDefault: function() {
        if (this._cancelable) {
            this._preventDefault = true;
        }
    },
    stopPropagation: function() {
        this._stopPropagation = true;
    },
    get CAPTURING_PHASE() { return 1; },
    get AT_TARGET() { return 2; },
    get BUBBLING_PHASE() { return 3; },
    get eventType() { return this._eventType; },
    get type() { return this._type; },
    get bubbles() { return this._bubbles; },
    get cancelable() { return this._cancelable; },
    get target() { return this._target; },
    get currentTarget() { return this._currentTarget; },
    get eventPhase() { return this._eventPhase; },
    get timeStamp() { return this._timeStamp; }
};

events.HTMLEvent = function(eventType) {
    events.Event.call(this, eventType);
};
events.HTMLEvent.prototype.__proto__ = events.Event.prototype;


events.UIEvent = function(eventType) {
    events.Event.call(this, eventType);
    this.view = null;
    this.detail = null;
};
events.UIEvent.prototype = {
    initUIEvent: function(type, bubbles, cancelable, view, detail) {
        this.initEvent(type, bubbles, cancelable);
        this.view = view;
        this.detail = detail;
    },
};
events.UIEvent.prototype.__proto__ = events.Event.prototype;


events.MouseEvent = function(eventType) {
    events.UIEvent.call(this, eventType);
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
events.MouseEvent.prototype = {
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
};
events.MouseEvent.prototype.__proto__ = events.UIEvent.prototype;


events.MutationEvent = function(eventType) {
    events.Event.call(this, eventType);
    this.relatedNode = null;
    this.prevValue = null;
    this.newValue = null;
    this.attrName = null;
    this.attrChange = null;
};
events.MutationEvent.prototype = {
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
    get MODIFICATION() { return 1; },
    get ADDITION() { return 2; },
    get REMOVAL() { return 3; },
};
events.MutationEvent.prototype.__proto__ = events.Event.prototype;


events.EventTarget = function() {};
events.EventTarget.prototype = {
    addEventListener: function(type, listener, capturing) {
        this._listeners = this._listeners || {};
        var listeners = this._listeners[type] || {};
        capturing = (capturing === true);
        var capturingListeners = listeners[capturing] || [];
        for (var i=0; i < capturingListeners.length; i++) {
            if (capturingListeners[i] === listener) {
                return;
            }
        }
        capturingListeners.push(listener);
        listeners[capturing] = capturingListeners;
        this._listeners[type] = listeners;
    },

    removeEventListener: function(type, listener, capturing) {
        var listeners  = this._listeners && this._listeners[type];
        if (!listeners) return;
        var capturingListeners = listeners[(capturing === true)];
        if (!capturingListeners) return;
        for (var i=0; i < capturingListeners.length; i++) {
            if (capturingListeners[i] === listener) {
                capturingListeners.splice(i, 1);
                return;
            }
        }
    },

    dispatchEvent: function(event) {
        if (event == null) {
            throw new events.EventException(0, "Null event");
        }
        if (event._type == null || event._type == "") {
            throw new events.EventException(0, "Uninitialized event");
        }


        var nextTarget = null;
        var targetList = [];


        function _getListeners(target, type, capturing) {
            var listeners = target._listeners
                    && target._listeners[type]
                    && target._listeners[type][capturing];
            if (listeners && listeners.length) {
                return listeners;
            }
            return [];
        }

        function _dispatchEvent(event, iterator, capturing) {
            var target = iterator();
            while (target && !event._stopPropagation) {
                listeners = _getListeners(target, event._type, capturing);
                for (var y = 0; y < listeners.length; y++) {
                    event._currentTarget = target;
                    try {
                        listeners[y].call(target, event);
                    } catch (e) {
                        sys.log("Listener "
                            + sys.inspect(listeners[y])
                            + "\n\n on target \n\n"
                            + sys.inspect(target)
                            + "\n\n threw error \n\n"
                            + sys.inspect(e.stack)
                            + "\n\n handling event \n\n"
                            + sys.inspect(event));
                    }
                }
                target = iterator();
            }
            return !event._stopPropagation;
        }


        event._target = this;

        //per the spec we gather the list of targets first to ensure
        //against dom modifications during actual event dispatch
        nextTarget = this.parentNode;
        while (nextTarget) {
            targetList.push(nextTarget);
            nextTarget = nextTarget.parentNode;
        }


        var i = targetList.length,
        iterator = function() { return i >=0 ? targetList[--i] : null };

        event._eventPhase = event.CAPTURING_PHASE;
        if (!_dispatchEvent(event, iterator, true)) return event._preventDefault;


        i = 1;
        iterator = function() { return i-- ? event._target : null };
        event._eventPhase = event.AT_TARGET;
        if (!_dispatchEvent(event, iterator, false)) return event._preventDefault;

        var traditionalHandler = this["on" + event._type];
        if (traditionalHandler) {
          try {
            if (traditionalHandler(event) === false) {
              return true;
            }
          }
          catch (e) {
            sys.log("The on" + event._type + " handler"
              + "\n\n on target \n\n"
              + sys.inspect(this)
              + "\n\n threw error \n\n"
              + sys.inspect(e)
              + "\n\n handling event \n\n"
              + sys.inspect(event));
          }
        }

        if (event._bubbles && !event._stopPropagation) {
            i = 0;
            iterator = function() { return i < targetList.length ? targetList[i++] : null };
            event._eventPhase = event.BUBBLING_PHASE;
            _dispatchEvent(event, iterator, false);
        }

        return event._preventDefault;
    }

};


core.Node.prototype.__proto__ = events.EventTarget.prototype;

function getDocument(el) {
  return el.nodeType == 9 ? el : el.ownerDocument;
}

function mutationEventsEnabled(el) {
  return (el.nodeType == 1 || el.nodeType == 9); //TODO getDocument(el).isSupported('MutationEvents', '2.0');
}

function advise(clazz, method, advice) {
    var proto = clazz.prototype,
        impl = proto[method];

  proto[method] = function() {
    var args = Array.prototype.slice.call(arguments);
    var ret = impl.apply(this, arguments);
    args.unshift(ret);
    return advice.apply(this, args) || ret;
  };
}

function adviseBefore(clazz, method, advice) {
  var proto = clazz.prototype,
      impl = proto[method];

  proto[method] = function() {
    advice.apply(this, arguments);
    return impl.apply(this, arguments);
  };
}

function dispatchInsertionEvent(append) {
  return function(ret, newChild, refChild) {
    if ((append || refChild != null) && mutationEventsEnabled(this)) {
      var doc = getDocument(this),
          ev = doc.createEvent("MutationEvents");

      ev.initMutationEvent("DOMNodeInserted", true, false, this, null, null, null, null);
      newChild.dispatchEvent(ev);
      if (this.nodeType == 9 || this._attachedToDocument) {
        ev = doc.createEvent("MutationEvents");
        ev.initMutationEvent("DOMNodeInsertedIntoDocument", false, false, null, null, null, null, null);
        core.visitTree(newChild, function(el) { 
          if (el.nodeType == 1) {
            el.dispatchEvent(ev);
            el._attachedToDocument = true;
          }
        });
      }
    }
  };
}

function dispatchRemovalEvent(oldChild) {
  if (mutationEventsEnabled(this)) {
    var doc = getDocument(this),
        ev = doc.createEvent("MutationEvents");

    ev.initMutationEvent("DOMNodeRemoved", true, false, this, null, null, null, null);
    oldChild.dispatchEvent(ev);

    ev = doc.createEvent("MutationEvents");
    ev.initMutationEvent("DOMNodeRemovedFromDocument", false, false, null, null, null, null, null);
    core.visitTree(oldChild, function(el) { 
      if (el.nodeType == 1) {
        el.dispatchEvent(ev);
        el._attachedToDocument = false;
      }
    });
  }
}

function dispatchAttrEvent(change, arg) {
  return function(ret) {
    var target = this._parentNode,
        node = arguments[arg];

    if (mutationEventsEnabled(target)) {
      var doc = target.ownerDocument,
          attrChange = events.MutationEvent.prototype[change],
          ev = doc.createEvent("MutationEvents");

      ev.initMutationEvent("DOMAttrModified", true, false, target, node.value, null, node.name, attrChange);
      target.dispatchEvent(ev);
    }
  }
}

advise(core.Node, 'insertBefore', dispatchInsertionEvent());
advise(core.Node, 'appendChild', dispatchInsertionEvent(true));
adviseBefore(core.Node, 'removeChild', dispatchRemovalEvent);

advise(core.AttrNodeMap, 'removeNamedItem', dispatchAttrEvent('REMOVAL', 0));
advise(core.AttrNodeMap, 'setNamedItem', dispatchAttrEvent('ADDITION', 1));


core.Document.prototype.createEvent = function(eventType) {
    switch (eventType) {
        case "MutationEvents": return new events.MutationEvent(eventType);
        case "UIEvents": return new events.UIEvent(eventType);
        case "MouseEvents": return new events.MouseEvent(eventType);
        case "HTMLEvents": return new events.HTMLEvent(eventType);
    }
    return new events.Event(eventType);
};


exports.dom =
{
  level2 : {
    core   : core,
    events : events
  }
};

