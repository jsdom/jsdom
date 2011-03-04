var sys = require('sys');
var testcase = require('nodeunit').testCase;

// NOTE: only used in one test
var EventListenerN65595 = function(events, listeners) {
  this.events = events;
  this.listeners = listeners;
}

/**
 *
 This method is called whenever an event occurs of the type for which theEventListenerinterface was registered.

 * @param evt
 TheEventcontains contextual information about the event. It also contains thestopPropagationandpreventDefaultmethods which are used in determining the event's flow and default action.

*/
EventListenerN65595.prototype.handleEvent = function(evt) {
  // bring class variables into scope
  var events = listener1.events,
      listeners = listener1.listeners,
      target;
  events[events.length] = evt;
  target = evt.currentTarget;
  for(var i=0; i<listeners.length; i++) {
    target.removeEventListener("foo", listeners[i].handleEvent, false);
  }
}

// NOTE: only used in one test (same test as N65595)
var EventListenerN65652 = function(events, listeners) {
  this.events = events;
  this.listeners = listeners;
}

/**
 *
 This method is called whenever an event occurs of the type for which theEventListenerinterface was registered.

 * @param evt
 TheEventcontains contextual information about the event. It also contains thestopPropagationandpreventDefaultmethods which are used in determining the event's flow and default action.

*/
EventListenerN65652.prototype.handleEvent = function(evt) {
  // bring class variables into scope
  var events = listener2.events,
      listeners = listener2.listeners,
      target;
  events[events.length] = evt;
  target = evt.currentTarget;
  for(var i=0; i<listeners.length; i++) {
    target.removeEventListener("foo", listeners[i].handleEvent, false);
  }
}

// NOTE: used in "dispatch event"
var EventMonitor = function() {
  self = this;
  self.atEvents = [];
  self.bubbledEvents = [];
  self.capturedEvents = [];
  self.allEvents = [];
  self.handleEvent = function(event) {
    self.allEvents.push(event);
    switch(event.eventPhase) {
    case event.CAPTURING_PHASE:
      self.capturedEvents.push(event);
      break;
    case event.AT_TARGET:
      self.atEvents.push(event);
      break;
    case event.BUBBLING_PHASE:
      self.bubbledEvents.push(event);
      break;
    default:
      throw new events.EventException(0, "Unspecified event phase");
    }
  };
};

global.events = require("../../lib/jsdom/level2/events").dom.level2.events;

// A document is created using implementation.createDocument and cast to a DocumentEvent interface.
// @author Curt Arnold
// @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-DocumentEvent
exports['DocumentEvent interface'] = function (test) {
  var doc = require('./events/files/hc_staff.xml').hc_staff();
  test.ok((doc.createEvent instanceof Function), "should have createEvent function");
  test.done();
}

// A document is created using implementation.createDocument and cast to a EventTarget interface.
// @author Curt Arnold
// @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget
exports['EventTarget interface'] = function (test) {
  var doc = require('./events/files/hc_staff.xml').hc_staff();
  test.ok((doc instanceof events.EventTarget), 'should be an instance of EventTarget');
  test.done();
}

// An object implementing the Event interface is created by using DocumentEvent.createEvent method with an eventType
// @author Curt Arnold
// @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-DocumentEvent-createEvent
exports['create event'] = testcase({
  setUp: function(cb){
    this.doc = require('./events/files/hc_staff.xml').hc_staff();
    cb();
  },

  tearDown: function(cb){
    this.doc = undefined;
    delete(this.doc);
    cb();
  },

  'type equals Events': function (test) {
    var event = this.doc.createEvent("Events");
    test.expect(2);
    test.notEqual(event, null, "should not be null");
    test.ok((event instanceof events.Event),"should be instanceof Event");
    test.done();
  },

  // Only applicable if implementation supports MutationEvents.
  'type equals MutationEvents': function (test) {
    var event = this.doc.createEvent("MutationEvents");
    test.expect(2);
    test.notEqual(event, null, "should not be null");
    test.ok((event instanceof events.MutationEvent),"should be instanceof MutationEvent");
    test.done();
  },

  // Only applicable if implementation supports the "UIEvents" feature.
  'type equals UIEvents': function (test) {
    var event = this.doc.createEvent("UIEvents");
    test.expect(2);
    test.notEqual(event, null, "should not be null");
    test.ok((event instanceof events.UIEvent),"should be instanceof UIEvent");
    test.done();
  },

  // Only applicable if implementation supports the "MouseEvents" feature.
  'type equals MouseEvents': function (test) {
    var event = this.doc.createEvent("MouseEvents");
    test.expect(2);
    test.notEqual(event, null, "should not be null");
    test.ok((event instanceof events.MouseEvent),"should be instanceof MouseEvent");
    test.done();
  },

  // Only applicable if implementation supports the "HTMLEvents" feature.
  'type equals HTMLEvents': function (test) {
    var event = this.doc.createEvent("HTMLEvents");
    test.expect(2);
    test.notEqual(event, null, "should not be null");
    test.ok((event instanceof events.HTMLEvent),"should be instanceof HTMLEvent");
    test.done();
  },
})

exports['dispatch event'] = testcase({
  setUp: function(cb){
    this.doc = require('./events/files/hc_staff.xml').hc_staff();
    cb();
  },

  tearDown: function(cb){
    this.doc = undefined;
    delete(this.doc);
    cb();
  },

  // A null reference passed to EventTarget.dispatchEvent() should raise an implementation or platform exception.
  // @author Curt Arnold
  // @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
  // @see http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-17189187
  'passing a null reference': function (test) {
    var doc = this.doc;
    test.throws(function(){ doc.dispatchEvent(null) }, events.EventException, 'should throw an exception');
    // TODO: figure out the best way to test (exception.code == 0) and (exception.message == 'Null event')
    test.done();
  },

  // A created but not initialized event is passed to EventTarget.dispatchEvent(). Should raise UNSPECIFIED_EVENT_TYPE_ERR EventException.
  // @author Curt Arnold
  // @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
  // @see http://www.w3.org/TR/DOM-Level-2-Events/events#xpointer(id('Events-EventTarget-dispatchEvent')/raises/exception[@name='EventException']/descr/p[substring-before(.,':')='UNSPECIFIED_EVENT_TYPE_ERR'])
  'passing an uninitialized event': function (test) {
    var doc = this.doc,
        event_types = ['Events', 'MutationEvents', 'UIEvents', 'MouseEvents', 'HTMLEvents'];
    test.expect(5);
    event_types.forEach(function(event){
      test.throws(function(){ doc.dispatchEvent(doc.createEvent(event)) }, events.EventException, 'type '+ event + ' should throw an exception');
      // TODO: figure out the best way to test (exception.code == 0) and (exception.message == 'Uninitialized event')
    })
    test.done();
  },

  // An Event initialized with a empty name is passed to EventTarget.dispatchEvent().  Should raise UNSPECIFIED_EVENT_TYPE_ERR EventException.
  // @author Curt Arnold
  // @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
  // @see http://www.w3.org/TR/DOM-Level-2-Events/events#xpointer(id('Events-EventTarget-dispatchEvent')/raises/exception[@name='EventException']/descr/p[substring-before(.,':')='UNSPECIFIED_EVENT_TYPE_ERR'])
  'passing an initialized, empty event': function (test) {
    var doc = this.doc,
        event = doc.createEvent("Events");
    event.initEvent("",false,false);
    test.throws(function(){ doc.dispatchEvent(event) }, events.EventException, 'should throw an exception');
    // TODO: figure out the best way to test (exception.code == 0) and (exception.message == 'Uninitialized event')
    test.done();
  },

  // An EventListener registered on the target node with capture false, should recieve any event fired on that node.
  // @author Curt Arnold
  // @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
  // @see http://www.w3.org/TR/DOM-Level-2-Events/events#xpointer(id('Events-EventTarget-dispatchEvent')/raises/exception[@name='EventException']/descr/p[substring-before(.,':')='UNSPECIFIED_EVENT_TYPE_ERR'])
  'EventListener with capture false': function (test) {
    var monitor = new EventMonitor();
    this.doc.addEventListener("foo", monitor.handleEvent, false);
    var event = this.doc.createEvent("Events");
    event.initEvent("foo",true,false);
    this.doc.dispatchEvent(event);
    test.expect(3);
    test.equal(monitor.atEvents.length, 1, 'should recieve atEvent');
    test.equal(monitor.bubbledEvents.length, 0, 'should not receive at bubble phase');
    test.equal(monitor.capturedEvents.length, 0, 'should not receive at capture phase');
    test.done();
  },

  // An event is dispatched to the document with a capture listener attached.
  // A capturing EventListener will not be triggered by events dispatched directly to the EventTarget upon which it is registered.
  // @author Curt Arnold
  // @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
  // @see http://www.w3.org/TR/DOM-Level-2-Events/events#xpointer(id('Events-EventTarget-dispatchEvent')/raises/exception[@name='EventException']/descr/p[substring-before(.,':')='UNSPECIFIED_EVENT_TYPE_ERR'])
  'EventListener with capture true': function (test) {
    var monitor = new EventMonitor();
    this.doc.addEventListener("foo", monitor.handleEvent, true);
    var event = this.doc.createEvent("Events");
    event.initEvent("foo",true,false);
    this.doc.dispatchEvent(event);
    test.expect(3);
    test.equal(monitor.atEvents.length, 0, 'should not recieve atEvent');
    test.equal(monitor.bubbledEvents.length, 0, 'should not receive at bubble phase');
    test.equal(monitor.capturedEvents.length, 0, 'should not receive at capture phase');
    test.done();
  },

  // The same monitor is registered twice and an event is dispatched.  The monitor should recieve only one handleEvent call.
  // @author Curt Arnold
  // @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
  // @see http://www.w3.org/TR/DOM-Level-2-Events/events#xpointer(id('Events-EventTarget-dispatchEvent')/raises/exception[@name='EventException']/descr/p[substring-before(.,':')='UNSPECIFIED_EVENT_TYPE_ERR'])
  'EventListener is registered twice': function (test) {
    var monitor = new EventMonitor();
    this.doc.addEventListener("foo", monitor.handleEvent, false);
    this.doc.addEventListener("foo", monitor.handleEvent, false);
    var event = this.doc.createEvent("Events");
    event.initEvent("foo",true,false);
    this.doc.dispatchEvent(event);
    test.expect(3);
    test.equal(monitor.atEvents.length, 1, 'should recieve atEvent only once');
    test.equal(monitor.bubbledEvents.length, 0, 'should not receive at bubble phase');
    test.equal(monitor.capturedEvents.length, 0, 'should not receive at capture phase');
    test.done();
  },

  // The same monitor is registered twice, removed once, and an event is dispatched. The monitor should recieve only no handleEvent calls.
  // @author Curt Arnold
  // @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
  // @see http://www.w3.org/TR/DOM-Level-2-Events/events#xpointer(id('Events-EventTarget-dispatchEvent')/raises/exception[@name='EventException']/descr/p[substring-before(.,':')='UNSPECIFIED_EVENT_TYPE_ERR'])
  'EventListener is registered twice, removed once': function (test) {
    var monitor = new EventMonitor();
    this.doc.addEventListener("foo", monitor.handleEvent, false);
    this.doc.addEventListener("foo", monitor.handleEvent, false);
    this.doc.removeEventListener("foo", monitor.handleEvent, false);
    var event = this.doc.createEvent("Events");
    event.initEvent("foo",true,false);
    this.doc.dispatchEvent(event);
    test.equal(monitor.allEvents.length, 0, 'should not receive any handleEvent calls');
    test.done();
  },

  // A monitor is added, multiple calls to removeEventListener are made with similar but not identical arguments, and an event is dispatched.
  // The monitor should recieve handleEvent calls.
  // @author Curt Arnold
  // @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
  // @see http://www.w3.org/TR/DOM-Level-2-Events/events#xpointer(id('Events-EventTarget-dispatchEvent')/raises/exception[@name='EventException']/descr/p[substring-before(.,':')='UNSPECIFIED_EVENT_TYPE_ERR'])
  'EventListener is registered, other listeners (similar but not identical) are removed': function (test) {
    var monitor = new EventMonitor();
    var other = {handleEvent: function(){}}
    this.doc.addEventListener("foo", monitor.handleEvent, false);
    this.doc.removeEventListener("foo", monitor.handleEvent, true);
    this.doc.removeEventListener("food", monitor.handleEvent, false);
    this.doc.removeEventListener("foo", other.handleEvent, false);
    var event = this.doc.createEvent("Events");
    event.initEvent("foo",true,false);
    this.doc.dispatchEvent(event);
    test.equal(monitor.allEvents.length, 1, 'should still receive the handleEvent call');
    test.done();
  },

  // Two listeners are registered on the same target, each of which will remove both itself and the other on the first event.  Only one should see the event since event listeners can never be invoked after being removed.
  // @author Curt Arnold
  // @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
  // @see http://www.w3.org/TR/DOM-Level-2-Events/events#xpointer(id('Events-EventTarget-dispatchEvent')/raises/exception[@name='EventException']/descr/p[substring-before(.,':')='UNSPECIFIED_EVENT_TYPE_ERR'])
  'two EventListeners which both handle by unregistering itself and the other': function (test) {
    var listeners = new Array();
    var events = new Array();
    listener1 = new EventListenerN65595(events, listeners);
    listener2 = new EventListenerN65652(events, listeners);

    listeners[listeners.length] = listener1;
    listeners[listeners.length] = listener2;
    this.doc.addEventListener("foo", listener1.handleEvent, false);
    this.doc.addEventListener("foo", listener2.handleEvent, false);
    var event = this.doc.createEvent("Events");
    event.initEvent("foo",true,false);
    this.doc.dispatchEvent(event);
    test.equal(events.length, 1, 'should only be handled by one EventListener');
    test.done();
  }
})

var foo = {
  /**
   *
   The Event.initEvent method is called for event returned by DocumentEvent.createEvent("events")
   and the state is checked to see if it reflects the parameters.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-Event-initEvent
   */
  initEvent01 : function () {
    var success;
    if(checkInitialization(builder, "initEvent01") != null) return;
    var doc;
    var event;
    var expectedEventType = "rotate";
    var actualEventType;
    var expectedCanBubble = true;
    var actualCanBubble;
    var expectedCancelable = false;
    var actualCancelable;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");
    event = doc.createEvent("Events");
    assertNotNull("notnull",event);
    event.initEvent(expectedEventType,expectedCanBubble,expectedCancelable);
    actualEventType = event.type;

    assertEquals("type",expectedEventType,actualEventType);
    actualCancelable = event.cancelable;

    assertEquals("cancelable",expectedCancelable,actualCancelable);
    actualCanBubble = event.bubbles;

    assertEquals("canBubble",expectedCanBubble,actualCanBubble);

  },
  /**
   *
   The Event.initEvent method is called for event returned by DocumentEvent.createEvent("events")
   and the state is checked to see if it reflects the parameters.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-Event-initEvent
   */
  initEvent02 : function () {
    var success;
    if(checkInitialization(builder, "initEvent02") != null) return;
    var doc;
    var event;
    var expectedEventType = "rotate";
    var actualEventType;
    var expectedCanBubble = false;
    var actualCanBubble;
    var expectedCancelable = true;
    var actualCancelable;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");
    event = doc.createEvent("Events");
    assertNotNull("notnull",event);
    event.initEvent(expectedEventType,expectedCanBubble,expectedCancelable);
    actualEventType = event.type;

    assertEquals("type",expectedEventType,actualEventType);
    actualCancelable = event.cancelable;

    assertEquals("cancelable",expectedCancelable,actualCancelable);
    actualCanBubble = event.bubbles;

    assertEquals("canBubble",expectedCanBubble,actualCanBubble);

  },
  /**
   *
   The Event.initEvent method is called for event returned by DocumentEvent.createEvent("events")
   and the state is checked to see if it reflects the parameters.  initEvent may be
   called multiple times and the last time is definitive.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-Event-initEvent
   */
  initEvent03 : function () {
    var success;
    if(checkInitialization(builder, "initEvent03") != null) return;
    var doc;
    var event;
    var expectedEventType = "rotate";
    var actualEventType;
    var actualCanBubble;
    var actualCancelable;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");
    event = doc.createEvent("Events");
    assertNotNull("notnull",event);
    event.initEvent("rotate",true,true);
    actualEventType = event.type;

    assertEquals("type","rotate",actualEventType);
    actualCancelable = event.cancelable;

    assertEquals("cancelable",true,actualCancelable);
    actualCanBubble = event.bubbles;

    assertEquals("canBubble",true,actualCanBubble);
    event.initEvent("shear",false,false);
    actualEventType = event.type;

    assertEquals("type2","shear",actualEventType);
    actualCancelable = event.cancelable;

    assertEquals("cancelable2",false,actualCancelable);
    actualCanBubble = event.bubbles;

    assertEquals("canBubble2",false,actualCanBubble);

  },
  /**
   *
   The Event.initEvent method is called for event returned by
   DocumentEvent.createEvent("MutationEvents")
   and the state is checked to see if it reflects the parameters.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-Event-initEvent
   */
  initEvent04 : function () {
    var success;
    if(checkInitialization(builder, "initEvent04") != null) return;
    var doc;
    var event;
    var expectedEventType = "rotate";
    var actualEventType;
    var expectedCanBubble = true;
    var actualCanBubble;
    var expectedCancelable = false;
    var actualCancelable;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");
    event = doc.createEvent("MutationEvents");
    assertNotNull("notnull",event);
    event.initEvent(expectedEventType,expectedCanBubble,expectedCancelable);
    actualEventType = event.type;

    assertEquals("type",expectedEventType,actualEventType);
    actualCancelable = event.cancelable;

    assertEquals("cancelable",expectedCancelable,actualCancelable);
    actualCanBubble = event.bubbles;

    assertEquals("canBubble",expectedCanBubble,actualCanBubble);

  },
  /**
   *
   The Event.initEvent method is called for event returned by
   DocumentEvent.createEvent("MutationEvents")
   and the state is checked to see if it reflects the parameters.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-Event-initEvent
   */
  initEvent05 : function () {
    var success;
    if(checkInitialization(builder, "initEvent05") != null) return;
    var doc;
    var event;
    var expectedEventType = "rotate";
    var actualEventType;
    var expectedCanBubble = false;
    var actualCanBubble;
    var expectedCancelable = true;
    var actualCancelable;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");
    event = doc.createEvent("MutationEvents");
    assertNotNull("notnull",event);
    event.initEvent(expectedEventType,expectedCanBubble,expectedCancelable);
    actualEventType = event.type;

    assertEquals("type",expectedEventType,actualEventType);
    actualCancelable = event.cancelable;

    assertEquals("cancelable",expectedCancelable,actualCancelable);
    actualCanBubble = event.bubbles;

    assertEquals("canBubble",expectedCanBubble,actualCanBubble);
  },
  /**
   *
   The Event.initEvent method is called for event returned by
   DocumentEvent.createEvent("MutationEvents")
   and the state is checked to see if it reflects the parameters.  initEvent may be
   called multiple times and the last time is definitive.

   * @author Curt Arnold
   * @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-Event-initEvent
   */
  initEvent06 : function () {
    var success;
    if(checkInitialization(builder, "initEvent06") != null) return;
    var doc;
    var event;
    var expectedEventType = "rotate";
    var actualEventType;
    var actualCanBubble;
    var actualCancelable;

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }
    doc = load(docRef, "doc", "hc_staff");
    event = doc.createEvent("MutationEvents");
    assertNotNull("notnull",event);
    event.initEvent("rotate",true,true);
    actualEventType = event.type;

    assertEquals("type","rotate",actualEventType);
    actualCancelable = event.cancelable;

    assertEquals("cancelable",true,actualCancelable);
    actualCanBubble = event.bubbles;

    assertEquals("canBubble",true,actualCanBubble);
    event.initEvent("shear",false,false);
    actualEventType = event.type;

    assertEquals("type2","shear",actualEventType);
    actualCancelable = event.cancelable;

    assertEquals("cancelable2",false,actualCancelable);
    actualCanBubble = event.bubbles;

    assertEquals("canBubble2",false,actualCanBubble);
  },

  /*
   * All capturing listeners in a direct line from dispatched node will receive the event
   */
  captureEvent01: function() {
    var success;
    if(checkInitialization(builder, "captureEvent01") != null) return;
    var doc;
    var target;
    var evt;
    var preventDefault;
    var monitor = new EventMonitor();

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }

    doc = load(docRef, "doc", "hc_staff");
    var plist = doc.getElementsByTagName("p");
    plist.item(0).addEventListener("foo", monitor.handleEvent, true);
    plist.item(0).firstChild.addEventListener("foo", monitor.handleEvent, false);
    evt = doc.createEvent("Events");
    evt.initEvent("foo",true,false);
    preventDefault = plist.item(0).firstChild.dispatchEvent(evt);

    assertSize("atCount",1,monitor.atEvents);
    assertSize("bubbleCount",0,monitor.bubbledEvents);
    assertSize("captureCount",1,monitor.capturedEvents);
  },

  /*
   * All non-capturing listeners in a direct line from dispatched node will receive a bubbling event
   */
  bubbleEvent01: function() {
    var success;
    if(checkInitialization(builder, "bubbleEvent01") != null) return;
    var doc;
    var target;
    var evt;
    var preventDefault;
    var monitor = new EventMonitor();

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }

    doc = load(docRef, "doc", "hc_staff");
    var plist = doc.getElementsByTagName("p");
    plist.item(0).addEventListener("foo", monitor.handleEvent, false);
    plist.item(0).firstChild.addEventListener("foo", monitor.handleEvent, false);
    evt = doc.createEvent("Events");
    evt.initEvent("foo",true,false);
    preventDefault = plist.item(0).firstChild.dispatchEvent(evt);

    assertSize("atCount",1,monitor.atEvents);
    assertSize("bubbleCount",1,monitor.bubbledEvents);
    assertSize("captureCount",0,monitor.capturedEvents);
  },

  /*
   * Calling stopPropagation on an event will prevent the target from receiving the event
   */
  stopPropagation01: function() {
    var success;
    if(checkInitialization(builder, "stopPropagation01") != null) return;
    var doc;
    var target;
    var evt;
    var preventDefault;
    var monitor = new EventMonitor();

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }

    doc = load(docRef, "doc", "hc_staff");
    var plist = doc.getElementsByTagName("p");
    plist.item(0).addEventListener("foo", function(evt) { evt.stopPropagation(); monitor.handleEvent(evt) }, true);
    plist.item(0).firstChild.addEventListener("foo", monitor.handleEvent, false);
    evt = doc.createEvent("Events");
    evt.initEvent("foo",true,false);
    preventDefault = plist.item(0).firstChild.dispatchEvent(evt);

    assertSize("atCount",0,monitor.atEvents);
    assertSize("bubbleCount",0,monitor.bubbledEvents);
    assertSize("captureCount",1,monitor.capturedEvents);
  },

  /*
   * Calling stopPropagation on an event will prevent all listeners from receiving the event
   */
  stopPropagation02: function() {
    var success;
    if(checkInitialization(builder, "stopPropagation02") != null) return;
    var doc;
    var target;
    var evt;
    var preventDefault;
    var monitor = new EventMonitor();

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }

    doc = load(docRef, "doc", "hc_staff");

    var bodyList = doc.getElementsByTagName("body");
    bodyList.item(0).addEventListener("foo", monitor.handleEvent, false);

    var plist = doc.getElementsByTagName("p");
    plist.item(0).addEventListener("foo", function(evt) { evt.stopPropagation(); monitor.handleEvent(evt) }, false);
    plist.item(0).firstChild.addEventListener("foo", monitor.handleEvent, false);
    evt = doc.createEvent("Events");
    evt.initEvent("foo",true,false);
    preventDefault = plist.item(0).firstChild.dispatchEvent(evt);

    assertSize("atCount",1,monitor.atEvents);
    assertSize("bubbleCount",1,monitor.bubbledEvents);
    assertSize("captureCount",0,monitor.capturedEvents);
  },

  /*
   * A cancelable event can have its default event disabled
   */
  preventDefault01: function() {
    var success;
    if(checkInitialization(builder, "preventDefault01") != null) return;
    var doc;
    var target;
    var evt;
    var preventDefault;
    var monitor = new EventMonitor();

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }

    doc = load(docRef, "doc", "hc_staff");

    var bodyList = doc.getElementsByTagName("body");
    bodyList.item(0).addEventListener("foo", monitor.handleEvent, true);

    var plist = doc.getElementsByTagName("p");
    plist.item(0).addEventListener("foo", function(evt) { evt.preventDefault(); monitor.handleEvent(evt) }, false);
    plist.item(0).firstChild.addEventListener("foo", monitor.handleEvent, false);
    evt = doc.createEvent("Events");
    evt.initEvent("foo",true,true);
    preventDefault = plist.item(0).firstChild.dispatchEvent(evt);

    assertTrue("preventDefault", preventDefault);
    assertSize("atCount",1,monitor.atEvents);
    assertSize("bubbleCount",1,monitor.bubbledEvents);
    assertSize("captureCount",1,monitor.capturedEvents);
  },

  /*
   * A non-cancelable event cannot have its default event disabled
   */
  preventDefault02: function() {
    var success;
    if(checkInitialization(builder, "preventDefault02") != null) return;
    var doc;
    var target;
    var evt;
    var preventDefault;
    var monitor = new EventMonitor();

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }

    doc = load(docRef, "doc", "hc_staff");

    var bodyList = doc.getElementsByTagName("body");
    bodyList.item(0).addEventListener("foo", monitor.handleEvent, true);

    var plist = doc.getElementsByTagName("p");
    plist.item(0).addEventListener("foo", function(evt) { evt.preventDefault(); monitor.handleEvent(evt) }, false);
    plist.item(0).firstChild.addEventListener("foo", monitor.handleEvent, false);
    evt = doc.createEvent("Events");
    evt.initEvent("foo",true,false);
    preventDefault = plist.item(0).firstChild.dispatchEvent(evt);

    assertFalse("preventDefault", preventDefault);
    assertSize("atCount",1,monitor.atEvents);
    assertSize("bubbleCount",1,monitor.bubbledEvents);
    assertSize("captureCount",1,monitor.capturedEvents);
  },


  /*
   * Only capture listeners in a direct line from target to the document node should receive the event
   */
  captureEvent02: function() {
    var success;
    if(checkInitialization(builder, "captureEvent02") != null) return;
    var doc;
    var target;
    var evt;
    var preventDefault;
    var monitor = new EventMonitor();

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }

    doc = load(docRef, "doc", "hc_staff");

    var titleList = doc.getElementsByTagName("title");
    titleList.item(0).addEventListener("foo", monitor.handleEvent, true);

    var plist = doc.getElementsByTagName("p");
    plist.item(0).addEventListener("foo", function(evt) { evt.preventDefault(); monitor.handleEvent(evt) }, false);
    plist.item(0).firstChild.addEventListener("foo", monitor.handleEvent, false);
    evt = doc.createEvent("Events");
    evt.initEvent("foo",true,false);
    preventDefault = plist.item(0).firstChild.dispatchEvent(evt);

    assertFalse("preventDefault", preventDefault);
    assertSize("atCount",1,monitor.atEvents);
    assertSize("bubbleCount",1,monitor.bubbledEvents);
    assertSize("captureCount",0,monitor.capturedEvents);
  },

  /*
   * Only bubble listeners in a direct line from target to the document node should receive the event
   */
  bubbleEvent02: function() {
    var success;
    if(checkInitialization(builder, "bubbleEvent02") != null) return;
    var doc;
    var target;
    var evt;
    var preventDefault;
    var monitor = new EventMonitor();

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }

    doc = load(docRef, "doc", "hc_staff");

    var titleList = doc.getElementsByTagName("title");
    titleList.item(0).addEventListener("foo", monitor.handleEvent, false);

    var plist = doc.getElementsByTagName("p");
    plist.item(0).addEventListener("foo", function(evt) { evt.preventDefault(); monitor.handleEvent(evt) }, true);
    plist.item(0).firstChild.addEventListener("foo", monitor.handleEvent, false);
    evt = doc.createEvent("Events");
    evt.initEvent("foo",true,false);
    preventDefault = plist.item(0).firstChild.dispatchEvent(evt);

    assertFalse("preventDefault", preventDefault);
    assertSize("atCount",1,monitor.atEvents);
    assertSize("bubbleCount",0,monitor.bubbledEvents);
    assertSize("captureCount",1,monitor.capturedEvents);
  },

  /*
   * If an event does not bubble, bubble listeners should not receive the event
   */
  bubbleEvent03: function() {
    var success;
    if(checkInitialization(builder, "bubbleEvent03") != null) return;
    var doc;
    var target;
    var evt;
    var preventDefault;
    var monitor = new EventMonitor();

    var docRef = null;
    if (typeof(this.doc) != 'undefined') {
      docRef = this.doc;
    }

    doc = load(docRef, "doc", "hc_staff");

    var bodyList = doc.getElementsByTagName("body");
    bodyList.item(0).addEventListener("foo", monitor.handleEvent, true);


    var plist = doc.getElementsByTagName("p");
    plist.item(0).addEventListener("foo", function(evt) { evt.preventDefault(); monitor.handleEvent(evt) }, false);
    plist.item(0).firstChild.addEventListener("foo", monitor.handleEvent, false);
    evt = doc.createEvent("Events");
    evt.initEvent("foo",false,false);
    preventDefault = plist.item(0).firstChild.dispatchEvent(evt);

    assertFalse("preventDefault", preventDefault);
    assertSize("atCount",1,monitor.atEvents);
    assertSize("bubbleCount",0,monitor.bubbledEvents);
    assertSize("captureCount",1,monitor.capturedEvents);
  }
}
