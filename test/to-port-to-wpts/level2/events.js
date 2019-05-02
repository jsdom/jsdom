"use strict";

const { assert } = require("chai");
const { beforeEach, afterEach, describe, specify } = require("mocha-sugar-free");

const { JSDOM } = require("../../..");

class EventMonitor {
  constructor() {
    this.atEvents = [];
    this.bubbledEvents = [];
    this.capturedEvents = [];
    this.allEvents = [];

    this.handleEvent = function (event) {
      this.allEvents.push(event);

      switch (event.eventPhase) {
        case event.CAPTURING_PHASE:
          this.capturedEvents.push(event);
          break;
        case event.AT_TARGET:
          this.atEvents.push(event);
          break;
        case event.BUBBLING_PHASE:
          this.bubbledEvents.push(event);
          break;
        default:
          throw new Error("Unspecified event phase");
      }
    }.bind(this);
  }
}

var _setUp = function() {
  var doc = require('../level1/core/files/hc_staff.xml').hc_staff();
  var monitor = this.monitor = new EventMonitor();
  this.win = doc.defaultView;
  this.title = doc.getElementsByTagName("title").item(0);
  this.body = doc.getElementsByTagName("body").item(0);
  this.plist = doc.getElementsByTagName("p").item(0);
  this.event = doc.createEvent("Events");
  this._handleEvent = function(type) { return(function(event) { event[type](); monitor.handleEvent(event) }); }
}
var _tearDown = function(xs) {
  xs = ['monitor', 'title', 'body', 'plist', 'event', '_handleEvent'].concat(xs ? xs : []);
  var self = this;
  xs.forEach(function(x){
    self[x] = undefined;
    delete(self[x]);
  })
}

describe("level2/events", () => {
  // A document is created using implementation.createDocument and cast to a DocumentEvent interface.
  // @author Curt Arnold
  // @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-DocumentEvent
  specify('DocumentEvent interface', () => {
    var doc = require('../level1/core/files/hc_staff.xml').hc_staff();
    assert.ok((doc.createEvent instanceof Function), "should have createEvent function");
  });

  // A document is created using implementation.createDocument and cast to a EventTarget interface.
  // @author Curt Arnold
  // @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget
  specify('EventTarget interface', () => {
    var doc = require('../level1/core/files/hc_staff.xml').hc_staff();
    assert.ok((doc instanceof doc.defaultView.EventTarget), 'should be an instance of EventTarget');
  });

  // An object implementing the Event interface is created by using DocumentEvent.createEvent method with an eventType
  // @author Curt Arnold
  // @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-DocumentEvent-createEvent
  specify('create event with each event type', () => {
    var doc = require('../level1/core/files/hc_staff.xml').hc_staff(),
        event_types = {'Events': doc.defaultView.Event,
                      'UIEvents': doc.defaultView.UIEvent,
                      'MouseEvents': doc.defaultView.MouseEvent ,
                      'HTMLEvents': doc.defaultView.Event};
    for (var type in event_types) {
      var event = doc.createEvent(type);
      assert.notEqual(event, null, "should not be null for " + type);
      assert.ok((event instanceof event_types[type]),"should be instanceof " + type);
    }
  });

  // @author Curt Arnold
  // @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
  // @see http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-17189187
  describe('dispatch event', () => {
    beforeEach(() => {
      this.doc = require('../level1/core/files/hc_staff.xml').hc_staff();
    });

    afterEach(() => {
      _tearDown.call(this, 'doc');
    });

    specify('a null reference passed to dispatchEvent', () => {
      var doc = this.doc;
      assert.throws(function(){ doc.dispatchEvent(null) }, TypeError);
      // TODO: figure out the best way to test (exception.code == 0) and (exception.message == 'Null event')
    });

    specify('a created but not initialized event passed to dispatchEvent', () => {
      var doc = this.doc,
          event_types = ['Events', 'UIEvents', 'MouseEvents', 'HTMLEvents'];
      event_types.forEach(function(type){
        assert.throwsDomException(function(){ doc.dispatchEvent(doc.createEvent(type)) }, doc, 'InvalidStateError');
      })
    });

    // An EventListener registered on the target node with capture false, should receive any event fired on that node.
    specify('EventListener with capture false', () => {
      var monitor = new EventMonitor();
      this.doc.addEventListener("foo", monitor.handleEvent, false);
      var event = this.doc.createEvent("Events");
      event.initEvent("foo",true,false);
      assert.strictEqual(event.eventPhase, 0);
      assert.strictEqual(event.currentTarget, null);
      this.doc.dispatchEvent(event);
      assert.equal(monitor.atEvents.length, 1, 'should receive atEvent');
      assert.equal(monitor.bubbledEvents.length, 0, 'should not receive at bubble phase');
      assert.equal(monitor.capturedEvents.length, 0, 'should not receive at capture phase');
      assert.strictEqual(event.eventPhase, 0);
      assert.strictEqual(event.currentTarget, null);
    });

    // An EventListener registered on the target node with capture true, should receive any event fired on that node.
    specify('EventListener with capture true', () => {
      var monitor = new EventMonitor();
      this.doc.addEventListener("foo", monitor.handleEvent, true);
      var event = this.doc.createEvent("Events");
      event.initEvent("foo",true,false);
      assert.strictEqual(event.eventPhase, 0);
      assert.strictEqual(event.currentTarget, null);
      this.doc.dispatchEvent(event);
      assert.equal(monitor.atEvents.length, 1, 'should receive atEvent');
      assert.equal(monitor.bubbledEvents.length, 0, 'should not receive at bubble phase');
      assert.equal(monitor.capturedEvents.length, 0, 'should not receive at capture phase');
      assert.strictEqual(event.eventPhase, 0);
      assert.strictEqual(event.currentTarget, null);
    });

    // The same monitor is registered twice and an event is dispatched.  The monitor should receive only one handleEvent call.
    specify('EventListener is registered twice', () => {
      var monitor = new EventMonitor();
      this.doc.addEventListener("foo", monitor.handleEvent, false);
      this.doc.addEventListener("foo", monitor.handleEvent, false);
      var event = this.doc.createEvent("Events");
      event.initEvent("foo",true,false);
      this.doc.dispatchEvent(event);
      assert.equal(monitor.atEvents.length, 1, 'should receive atEvent only once');
      assert.equal(monitor.bubbledEvents.length, 0, 'should not receive at bubble phase');
      assert.equal(monitor.capturedEvents.length, 0, 'should not receive at capture phase');
    });

    // The same monitor is registered twice, removed once, and an event is dispatched. The monitor should receive only no handleEvent calls.
    specify('EventListener is registered twice, removed once', () => {
      var monitor = new EventMonitor();
      this.doc.addEventListener("foo", monitor.handleEvent, false);
      this.doc.addEventListener("foo", monitor.handleEvent, false);
      this.doc.removeEventListener("foo", monitor.handleEvent, false);
      var event = this.doc.createEvent("Events");
      event.initEvent("foo",true,false);
      this.doc.dispatchEvent(event);
      assert.equal(monitor.allEvents.length, 0, 'should not receive any handleEvent calls');
    });

    // A monitor is added, multiple calls to removeEventListener are made with similar but not identical arguments, and an event is dispatched.
    // The monitor should receive handleEvent calls.
    specify('EventListener is registered, other listeners (similar but not identical) are removed', () => {
      var monitor = new EventMonitor();
      var other = {handleEvent: function(){}}
      this.doc.addEventListener("foo", monitor.handleEvent, false);
      this.doc.removeEventListener("foo", monitor.handleEvent, true);
      this.doc.removeEventListener("food", monitor.handleEvent, false);
      this.doc.removeEventListener("foo", other.handleEvent, false);
      var event = this.doc.createEvent("Events");
      event.initEvent("foo",true,false);
      this.doc.dispatchEvent(event);
      assert.equal(monitor.allEvents.length, 1, 'should still receive the handleEvent call');
    });

    // Two listeners are registered on the same target, each of which will remove both itself and the other on the first event.  Only one should see the event since event listeners can never be invoked after being removed.
    specify('two EventListeners which both handle by unregistering itself and the other', () => {
      // setup
      var es = [];
      var ls = [];
      var EventListener1 = function() { ls.push(this); }
      var EventListener2 = function() { ls.push(this); }
      EventListener1.prototype.handleEvent = function(event) { _handleEvent(event); }
      EventListener2.prototype.handleEvent = function(event) { _handleEvent(event); }
      var _handleEvent = function(event) {
        es.push(event);
        ls.forEach(function(l){
          event.currentTarget.removeEventListener("foo", l.handleEvent, false);
        })
      }
      // test
      var listener1 = new EventListener1();
      var listener2 = new EventListener2();
      this.doc.addEventListener("foo", listener1.handleEvent, false);
      this.doc.addEventListener("foo", listener2.handleEvent, false);
      var event = this.doc.createEvent("Events");
      event.initEvent("foo",true,false);
      this.doc.dispatchEvent(event);
      assert.equal(es.length, 1, 'should only be handled by one EventListener');
    });
  })

  // The Event.initEvent method is called for event returned by DocumentEvent.createEvent("Events")
  // The state is checked to see if it reflects the parameters.
  // @author Curt Arnold
  // @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-Event-initEvent
  describe('init event', () => {
    beforeEach(() => {
      var doc = require('../level1/core/files/hc_staff.xml').hc_staff();
      this._events = ['Events'].map(function(t){ return(doc.createEvent(t)); })
    });

    afterEach(() => {
      _tearDown.call(this, '_events');
    });

    specify('set state from params, bubble no cancel', () => {
      this._events.forEach(function(event){
        assert.notEqual(event, null, 'event should not be null for ' + event.eventType);
        event.initEvent('rotate', true, false);
        assert.equal(event.type, 'rotate', 'event type should be \"rotate\" for ' + event.eventType);
        assert.equal(event.bubbles, true, 'event should bubble for ' + event.eventType);
        assert.equal(event.cancelable, false, 'event should not be cancelable for ' + event.eventType);
      })
    });

    specify('set state from params, cancel no bubble', () => {
      this._events.forEach(function(event){
        assert.notEqual(event, null, 'event should not be null for' + event.eventType);
        event.initEvent('rotate', false, true);
        assert.equal(event.type, 'rotate', 'event type should be \"rotate\" for ' + event.eventType);
        assert.equal(event.bubbles, false, 'event should not bubble for ' + event.eventType);
        assert.equal(event.cancelable, true, 'event should be cancelable for ' + event.eventType);
      })
    });

    specify('initEvent called multiple times, final time is definitive', () => {
      this._events.forEach(function(event){
        assert.notEqual(event, null, 'event should not be null for ' + event.eventType);
        // rotate
        event.initEvent("rotate", true, true);
        assert.equal(event.type, 'rotate', 'event type should be \"rotate\" for ' + event.eventType);
        assert.equal(event.bubbles, true, 'event should bubble for ' + event.eventType);
        assert.equal(event.cancelable, true, 'event should be cancelable for ' + event.eventType);
        // shear
        event.initEvent("shear", false, false);
        assert.equal(event.type, 'shear', 'event type should be \"shear\" for ' + event.eventType);
        assert.equal(event.bubbles, false, 'event should not bubble for ' + event.eventType);
        assert.equal(event.cancelable, false, 'event should not be cancelable for ' + event.eventType);
      })
    });
  })

  describe('capture event', () => {
    beforeEach(() => {
      _setUp.call(this);
      this.event.initEvent("foo",true,false);
    });

    afterEach(() => {
      _tearDown.call(this);
    });

    specify('all capturing listeners in a direct line from dispatched node will receive the event', () => {
      this.plist.addEventListener("foo", this.monitor.handleEvent, true);
      this.plist.firstChild.addEventListener("foo", this.monitor.handleEvent, false);
      this.plist.firstChild.dispatchEvent(this.event);
      assert.equal(this.monitor.atEvents.length, 1, 'should be at 1 event');
      assert.equal(this.monitor.bubbledEvents.length, 0, 'should not have any bubbled events');
      assert.equal(this.monitor.capturedEvents.length, 1, 'should have captured 1 event');
    });

    specify('only capture listeners in a direct line from target to the document node should receive the event', () => {
      var self = this;
      this.title.addEventListener("foo", this.monitor.handleEvent, true);
      this.plist.addEventListener("foo", function(event) { event.preventDefault(); self.monitor.handleEvent(event) }, false);
      this.plist.firstChild.addEventListener("foo", this.monitor.handleEvent, false);
      var return_val = this.plist.firstChild.dispatchEvent(this.event);
      assert.equal(return_val, true, 'dispatchEvent should return *true*');
      assert.equal(this.monitor.atEvents.length, 1, 'should be at 1 event');
      assert.equal(this.monitor.bubbledEvents.length, 1, 'should have bubbled 1 event');
      assert.equal(this.monitor.capturedEvents.length, 0, 'should not have captured any events');
    });
  })

  describe('bubble event', () => {
    beforeEach(() => {
      _setUp.call(this);
      this.event.initEvent("foo",true,false);
    });

    afterEach(() => {
      _tearDown.call(this);
    });

    specify('all non-capturing listeners in a direct line from dispatched node will receive a bubbling event', () => {
      this.win.addEventListener("foo", this.monitor.handleEvent, false);
      this.plist.addEventListener("foo", this.monitor.handleEvent, false);
      this.plist.firstChild.addEventListener("foo", this.monitor.handleEvent, false);
      this.plist.firstChild.dispatchEvent(this.event);
      assert.equal(this.monitor.atEvents.length, 1, 'should be at 1 event');
      assert.equal(this.monitor.bubbledEvents.length, 2, 'should have 2 bubbled events');
      assert.equal(this.monitor.capturedEvents.length, 0, 'should not have any captured events');
    });

    specify('only bubble listeners in a direct line from target to the document node should receive the event', () => {
      this.win.addEventListener("foo", this.monitor.handleEvent, false);
      this.title.addEventListener("foo", this.monitor.handleEvent, false);
      this.plist.addEventListener("foo", this._handleEvent('preventDefault'), true);
      this.plist.firstChild.addEventListener("foo", this.monitor.handleEvent, false);
      var return_val = this.plist.firstChild.dispatchEvent(this.event);
      assert.equal(return_val, true, 'dispatchEvent should return *true*');
      assert.equal(this.monitor.atEvents.length, 1, 'should be at 1 event');
      assert.equal(this.monitor.bubbledEvents.length, 1, 'should have 1 bubbled event');
      assert.equal(this.monitor.capturedEvents.length, 1, 'should have captured 1 event');
    });

    specify('if an event does not bubble, bubble listeners should not receive the event', () => {
      this.win.addEventListener("foo", this.monitor.handleEvent, false);
      this.body.addEventListener("foo", this.monitor.handleEvent, true);
      this.plist.addEventListener("foo", this._handleEvent('preventDefault'), false);
      this.plist.firstChild.addEventListener("foo", this.monitor.handleEvent, false);
      this.event.initEvent("foo",false,false);
      var return_val = this.plist.firstChild.dispatchEvent(this.event);
      assert.equal(return_val, true, 'dispatchEvent should return *true*');
      assert.equal(this.monitor.atEvents.length, 1, 'should be at 1 event');
      assert.equal(this.monitor.bubbledEvents.length, 0, 'should not have any bubbled events');
      assert.equal(this.monitor.capturedEvents.length, 1, 'should have captured 1 event');
    });
  })

  describe('stop propagation', () => {
    beforeEach(() => {
      _setUp.call(this);
      this.event.initEvent("foo",true,false);
    });

    afterEach(() => {
      _tearDown.call(this);
    });

    specify('should prevent the target from receiving the event', () => {
      this.win.addEventListener("foo", this.monitor.handleEvent, false);
      this.plist.addEventListener("foo", this._handleEvent('stopPropagation'), true);
      this.plist.firstChild.addEventListener("foo", this.monitor.handleEvent, false);
      this.plist.firstChild.dispatchEvent(this.event);
      assert.equal(this.monitor.atEvents.length, 0, 'should be at 0 events');
      assert.equal(this.monitor.bubbledEvents.length, 0, 'should have no bubbled events');
      assert.equal(this.monitor.capturedEvents.length, 1, 'should have 1 captured event');
    });

    specify('should prevent all listeners from receiving the event', () => {
      this.win.addEventListener("foo", this.monitor.handleEvent, false);
      this.body.addEventListener("foo", this.monitor.handleEvent, false);
      this.plist.addEventListener("foo", this._handleEvent('stopPropagation'), false);
      this.plist.firstChild.addEventListener("foo", this.monitor.handleEvent, false);
      this.plist.firstChild.dispatchEvent(this.event);
      assert.equal(this.monitor.atEvents.length, 1, 'should be at 1 event');
      assert.equal(this.monitor.bubbledEvents.length, 1, 'should have 1 bubbled event');
      assert.equal(this.monitor.capturedEvents.length, 0, 'should have no captured events');
    });

    specify('stopPropagation should not prevent listeners on the same element from receiving the event', () => {
      this.win.addEventListener("foo", this.monitor.handleEvent, false);
      this.body.addEventListener("foo", this.monitor.handleEvent, false);
      this.plist.addEventListener("foo", this._handleEvent('stopPropagation'), true);
      this.plist.addEventListener("foo", this._handleEvent('stopPropagation'), false);
      this.plist.addEventListener("foo",  this.monitor.handleEvent, true);
      this.plist.addEventListener("foo",  this.monitor.handleEvent, false);
      this.plist.dispatchEvent(this.event);
      assert.equal(this.monitor.atEvents.length, 2, 'should be at 2 events'); // Changed from 4 to 2 after https://github.com/whatwg/dom/commit/98564fc5284439d2555f545fa04288e230a37a03
      assert.equal(this.monitor.bubbledEvents.length, 0, 'should have no bubbled events');
      assert.equal(this.monitor.capturedEvents.length, 0, 'should have no captured events');
    });
  })

  describe('prevent default', () => {
    beforeEach(() => {
      _setUp.call(this);
      this.event.initEvent("foo",true,true);
    });

    afterEach(() => {
      _tearDown.call(this);
    });

    specify('the defaultPrevented flag is set when the event is prevented', () => {
      this.title.addEventListener("foo", function(event) { event.preventDefault();}, false);
      var return_val = this.title.dispatchEvent(this.event);
      assert.equal(this.event.defaultPrevented, true, 'the defaultPrevented flag should be true when the event is prevented');
    });

    specify('the defaultPrevented flag is not set when the event is not prevented', () => {
      this.title.addEventListener("foo", this.monitor.handleEvent, false);
      var return_val = this.title.dispatchEvent(this.event);
      assert.equal(this.event.defaultPrevented, false, 'the defaultPrevented flag should be false when the event is not prevented');
    });

    specify('a cancelable event can have its default event disabled', () => {
      this.body.addEventListener("foo", this.monitor.handleEvent, true);
      this.plist.addEventListener("foo", this._handleEvent('preventDefault'), false);
      this.plist.firstChild.addEventListener("foo", this.monitor.handleEvent, false);
      var return_val = this.plist.firstChild.dispatchEvent(this.event);
      assert.equal(return_val, false, 'dispatchEvent should return *false*');
      assert.equal(this.monitor.atEvents.length, 1, 'should be at 1 event');
      assert.equal(this.monitor.bubbledEvents.length, 1, 'should have bubbled 1 event');
      assert.equal(this.monitor.capturedEvents.length, 1, 'should have captured 1 event');
    });

    specify('a non-cancelable event cannot have its default event disabled', () => {
      this.body.addEventListener("foo", this.monitor.handleEvent, true);
      this.plist.addEventListener("foo", this._handleEvent('preventDefault'), false);
      this.plist.firstChild.addEventListener("foo", this.monitor.handleEvent, false);
      this.event.initEvent("foo",true,false);
      var return_val = this.plist.firstChild.dispatchEvent(this.event);
      assert.equal(return_val, true, 'dispatchEvent should return *true*');
      assert.equal(this.monitor.atEvents.length, 1, 'should be at 1 event');
      assert.equal(this.monitor.bubbledEvents.length, 1, 'should have bubbled 1 event');
      assert.equal(this.monitor.capturedEvents.length, 1, 'should have captured 1 event');
    });
  });

  specify('remove listener in handler', () => {
    const { document } = (new JSDOM()).window;
    let h1 = 0, h2 = 0;

    document.addEventListener("click", function handler1() {
      // Event handler that removes itself
      h1++;
      document.removeEventListener("click", handler1);
    });
    document.addEventListener("click", () => h2++);

    const ev = document.createEvent("MouseEvents");
    ev.initEvent("click", true, true);

    document.dispatchEvent(ev);
    assert.strictEqual(h1, 1, "handler1 must be called once");
    assert.strictEqual(h2, 1, "handler2 must be called once");

    document.dispatchEvent(ev);
    assert.strictEqual(h1, 1, "handler1 must be called once");
    assert.strictEqual(h2, 2, "handler2 must be called twice");
  });
});
