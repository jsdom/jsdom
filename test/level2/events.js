var sys = require('sys');




/**
      *    Inner class implementation for variable other 
      */
var other;

/**
        * Constructor

        */
	      
var EventListenerN65589 = function () { 
           }
   
        /**
         *    
This method is called whenever an event occurs of the type for which theEventListenerinterface was registered.

         * @param evt 
TheEventcontains contextual information about the event. It also contains thestopPropagationandpreventDefaultmethods which are used in determining the event's flow and default action.

         */
EventListenerN65589.prototype.handleEvent = function(evt) {
         //
         //   bring class variables into scope
         //
        }

/**
      *    Inner class implementation for variable listener1 
      */
var listener1;

/**
        * Constructor

        * @param events Value from value attribute of nested var element
        * @param listeners Value from value attribute of nested var element
        */
	      
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
         //
         //   bring class variables into scope
         //
        var events = listener1.events;
           var listeners = listener1.listeners;
           var target;
      var listener;
      events[events.length] = evt;
target = evt.currentTarget;

      for(var indexN65637 = 0;indexN65637 < listeners.length; indexN65637++) {
      listener = listeners[indexN65637];
      target.removeEventListener("foo", listener.handleEvent, false);
	 
	}
   }

     /**
      *    Inner class implementation for variable listener2 
      */
var listener2;

/**
        * Constructor

        * @param events Value from value attribute of nested var element
        * @param listeners Value from value attribute of nested var element
        */
	      
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
         //
         //   bring class variables into scope
         //
        var events = listener2.events;
           var listeners = listener2.listeners;
           var target;
      var listener;
      events[events.length] = evt;
target = evt.currentTarget;

      for(var indexN65688 = 0;indexN65688 < listeners.length; indexN65688++) {
      listener = listeners[indexN65688];
      target.removeEventListener("foo", listener.handleEvent, false);
	 
	}
   }


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



exports.tests = {
/**
* 
A document is created using implementation.createDocument and 
cast to a DocumentEvent interface.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-DocumentEvent
*/
DocumentEventCast01 : function () {
   var success;
    if(checkInitialization(builder, "DocumentEventCast01") != null) return;
    var doc;
      var docEvent;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      docEvent =  doc;
      assertTrue("Document does not have createEvent function", (docEvent.createEvent instanceof Function));
},
/**
* 
A document is created using implementation.createDocument and 
cast to a EventTarget interface.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget
*/
EventTargetCast01 : function () {
   var success;
    if(checkInitialization(builder, "EventTargetCast01") != null) return;
    var doc;
      var target;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      target =  doc;
      assertTrue("Document is not instanceof EventTarget", (target instanceof events.EventTarget));

},
/**
* 
An object implementing the Event interface is created by using 
DocumentEvent.createEvent method with eventType equals "Events".

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-DocumentEvent-createEvent
*/
createEvent01 : function () {
   var success;
    if(checkInitialization(builder, "createEvent01") != null) return;
    var doc;
      var event;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      event = doc.createEvent("Events");
      assertNotNull("notnull",event);
      assertTrue("event not instanceof Event", (event instanceof events.Event));

},
/**
* 
An object implementing the Event interface is created by using 
DocumentEvent.createEvent method with eventType equals "MutationEvents".
Only applicable if implementation supports MutationEvents.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-DocumentEvent-createEvent
*/
createEvent02 : function () {
   var success;
    if(checkInitialization(builder, "createEvent02") != null) return;
    var doc;
      var event;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      event = doc.createEvent("MutationEvents");
      assertNotNull("notnull",event);
      assertTrue("event not instanceof MutationEvent", (event instanceof events.MutationEvent));

},
/**
* 
An object implementing the Event interface is created by using 
DocumentEvent.createEvent method with eventType equals "UIEvents".
Only applicable if implementation supports the "UIEvents" feature.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-DocumentEvent-createEvent
*/
createEvent03 : function () {
   var success;
    if(checkInitialization(builder, "createEvent03") != null) return;
    var doc;
      var event;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      event = doc.createEvent("UIEvents");
      assertNotNull("notnull",event);
      assertTrue("event not instanceof UIEvent", (event instanceof events.UIEvent));
},
/**
* 
An object implementing the Event interface is created by using 
DocumentEvent.createEvent method with eventType equals "MouseEvents".
Only applicable if implementation supports the "MouseEvents" feature.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-DocumentEvent-createEvent
*/
createEvent04 : function () {
   var success;
    if(checkInitialization(builder, "createEvent04") != null) return;
    var doc;
      var event;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      event = doc.createEvent("MouseEvents");
      assertNotNull("notnull",event);
      assertTrue("event not instanceof MouseEvent", (event instanceof events.MouseEvent));

},
/**
* 
An object implementing the Event interface is created by using 
DocumentEvent.createEvent method with eventType equals "HTMLEvents".
Only applicable if implementation supports the "HTMLEvents" feature.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-DocumentEvent-createEvent
*/
createEvent05 : function () {
   var success;
    if(checkInitialization(builder, "createEvent05") != null) return;
    var doc;
      var event;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      event = doc.createEvent("HTMLEvents");
      assertNotNull("notnull",event);
      assertTrue("event not instanceof HTMLEvent", (event instanceof events.HTMLEvent));

},
/**
* 
A null reference is passed to EventTarget.dispatchEvent(), should raise implementation
or platform exception.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
* @see http://www.w3.org/TR/DOM-Level-2-Core/core.html#ID-17189187
*/
dispatchEvent01 : function () {
   var success;
    if(checkInitialization(builder, "dispatchEvent01") != null) return;
    var doc;
      var target;
      var evt = null;

      var preventDefault;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      
      {
         success = false;
         try {
            preventDefault = doc.dispatchEvent(evt);
      
      } catch (ex) {
    	 success = true;
      }
      assertTrue("throw_ImplException", success);
	}
      
},
/**
* 
An created but not initialized event is passed to EventTarget.dispatchEvent().  Should raise 
UNSPECIFIED_EVENT_TYPE_ERR EventException.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#xpointer(id('Events-EventTarget-dispatchEvent')/raises/exception[@name='EventException']/descr/p[substring-before(.,':')='UNSPECIFIED_EVENT_TYPE_ERR'])
*/
dispatchEvent02 : function () {
   var success;
    if(checkInitialization(builder, "dispatchEvent02") != null) return;
    var doc;
      var target;
      var evt;
      var preventDefault;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      evt = doc.createEvent("Events");
      
	{
		success = false;
		try {
            preventDefault = doc.dispatchEvent(evt);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 0);
		}
		assertTrue("throw_UNSPECIFIED_EVENT_TYPE_ERR",success);
	}

},
/**
* 
An created but not initialized event is passed to EventTarget.dispatchEvent().  Should raise 
UNSPECIFIED_EVENT_TYPE_ERR EventException.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#xpointer(id('Events-EventTarget-dispatchEvent')/raises/exception[@name='EventException']/descr/p[substring-before(.,':')='UNSPECIFIED_EVENT_TYPE_ERR'])
*/
dispatchEvent03 : function () {
   var success;
    if(checkInitialization(builder, "dispatchEvent03") != null) return;
    var doc;
      var target;
      var evt;
      var preventDefault;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      evt = doc.createEvent("MutationEvents");
      
	{
		success = false;
		try {
            preventDefault = doc.dispatchEvent(evt);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 0);
		}
		assertTrue("throw_UNSPECIFIED_EVENT_TYPE_ERR",success);
	}

},
/**
* 
An created but not initialized event is passed to EventTarget.dispatchEvent().  Should raise 
UNSPECIFIED_EVENT_TYPE_ERR EventException.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#xpointer(id('Events-EventTarget-dispatchEvent')/raises/exception[@name='EventException']/descr/p[substring-before(.,':')='UNSPECIFIED_EVENT_TYPE_ERR'])
*/
dispatchEvent04 : function () {
   var success;
    if(checkInitialization(builder, "dispatchEvent04") != null) return;
    var doc;
      var target;
      var evt;
      var preventDefault;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      evt = doc.createEvent("UIEvents");
      
	{
		success = false;
		try {
            preventDefault = doc.dispatchEvent(evt);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 0);
		}
		assertTrue("throw_UNSPECIFIED_EVENT_TYPE_ERR",success);
	}

},
/**
* 
An created but not initialized event is passed to EventTarget.dispatchEvent().  Should raise 
UNSPECIFIED_EVENT_TYPE_ERR EventException.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#xpointer(id('Events-EventTarget-dispatchEvent')/raises/exception[@name='EventException']/descr/p[substring-before(.,':')='UNSPECIFIED_EVENT_TYPE_ERR'])
*/
dispatchEvent05 : function () {
   var success;
    if(checkInitialization(builder, "dispatchEvent05") != null) return;
    var doc;
      var target;
      var evt;
      var preventDefault;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      evt = doc.createEvent("MouseEvents");
      
	{
		success = false;
		try {
            preventDefault = doc.dispatchEvent(evt);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 0);
		}
		assertTrue("throw_UNSPECIFIED_EVENT_TYPE_ERR",success);
	}

},
/**
* 
An created but not initialized event is passed to EventTarget.dispatchEvent().  Should raise 
UNSPECIFIED_EVENT_TYPE_ERR EventException.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#xpointer(id('Events-EventTarget-dispatchEvent')/raises/exception[@name='EventException']/descr/p[substring-before(.,':')='UNSPECIFIED_EVENT_TYPE_ERR'])
*/
dispatchEvent06 : function () {
   var success;
    if(checkInitialization(builder, "dispatchEvent06") != null) return;
    var doc;
      var target;
      var evt;
      var preventDefault;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      evt = doc.createEvent("HTMLEvents");
      
	{
		success = false;
		try {
            preventDefault = doc.dispatchEvent(evt);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 0);
		}
		assertTrue("throw_UNSPECIFIED_EVENT_TYPE_ERR",success);
	}

},
/**
* 
An Event initialized with a empty name is passed to EventTarget.dispatchEvent().  Should raise 
UNSPECIFIED_EVENT_TYPE_ERR EventException.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#xpointer(id('Events-EventTarget-dispatchEvent')/raises/exception[@name='EventException']/descr/p[substring-before(.,':')='UNSPECIFIED_EVENT_TYPE_ERR'])
*/
dispatchEvent07 : function () {
   var success;
    if(checkInitialization(builder, "dispatchEvent07") != null) return;
    var doc;
      var target;
      var evt;
      var preventDefault;
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      evt = doc.createEvent("Events");
      evt.initEvent("",false,false);
      
	{
		success = false;
		try {
            preventDefault = doc.dispatchEvent(evt);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 0);
		}
		assertTrue("throw_UNSPECIFIED_EVENT_TYPE_ERR",success);
	}

},
/**
* 
An EventListener registered on the target node with capture false, should
recieve any event fired on that node.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#xpointer(id('Events-EventTarget-dispatchEvent')/raises/exception[@name='EventException']/descr/p[substring-before(.,':')='UNSPECIFIED_EVENT_TYPE_ERR'])
*/
dispatchEvent08 : function () {
   var success;
    if(checkInitialization(builder, "dispatchEvent08") != null) return;
    var doc;
      var target;
      var evt;
      var preventDefault;
      monitor = new EventMonitor();
      
      var atEvents = new Array();

      var bubbledEvents = new Array();

      var capturedEvents = new Array();

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      doc.addEventListener("foo", monitor.handleEvent, false);
	  evt = doc.createEvent("Events");
      evt.initEvent("foo",true,false);
      preventDefault = doc.dispatchEvent(evt);
      atEvents = monitor.atEvents;
assertSize("atCount",1,atEvents);
bubbledEvents = monitor.bubbledEvents;
assertSize("bubbleCount",0,bubbledEvents);
capturedEvents = monitor.capturedEvents;
assertSize("captureCount",0,capturedEvents);

},
/**
* 
An event is dispatched to the document with a capture listener attached.
A capturing EventListener will not be triggered by events dispatched directly to the EventTarget upon which it is registered.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#xpointer(id('Events-EventTarget-dispatchEvent')/raises/exception[@name='EventException']/descr/p[substring-before(.,':')='UNSPECIFIED_EVENT_TYPE_ERR'])
*/
dispatchEvent09 : function () {
   var success;
    if(checkInitialization(builder, "dispatchEvent09") != null) return;
    var doc;
      var target;
      var evt;
      var preventDefault;
      monitor = new EventMonitor();
      
      var atEvents = new Array();

      var bubbledEvents = new Array();

      var capturedEvents = new Array();

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      doc.addEventListener("foo", monitor.handleEvent, true);
	 evt = doc.createEvent("Events");
      evt.initEvent("foo",true,false);
      preventDefault = doc.dispatchEvent(evt);
      atEvents = monitor.atEvents;
assertSize("atCount",0,atEvents);
bubbledEvents = monitor.bubbledEvents;
assertSize("bubbleCount",0,bubbledEvents);
capturedEvents = monitor.capturedEvents;
assertSize("captureCount",0,capturedEvents);
},
/**
* 
The same monitor is registered twice and an event is dispatched.  The monitor should
recieve only one handleEvent call.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#xpointer(id('Events-EventTarget-dispatchEvent')/raises/exception[@name='EventException']/descr/p[substring-before(.,':')='UNSPECIFIED_EVENT_TYPE_ERR'])
*/
dispatchEvent10 : function () {
   var success;
    if(checkInitialization(builder, "dispatchEvent10") != null) return;
    var doc;
      var target;
      var evt;
      var preventDefault;
      monitor = new EventMonitor();
      
      var atEvents = new Array();

      var bubbledEvents = new Array();

      var capturedEvents = new Array();

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      doc.addEventListener("foo", monitor.handleEvent, false);
	 doc.addEventListener("foo", monitor.handleEvent, false);
	 evt = doc.createEvent("Events");
      evt.initEvent("foo",true,false);
      preventDefault = doc.dispatchEvent(evt);
      atEvents = monitor.atEvents;
assertSize("atCount",1,atEvents);
bubbledEvents = monitor.bubbledEvents;
assertSize("bubbleCount",0,bubbledEvents);
capturedEvents = monitor.capturedEvents;
assertSize("captureCount",0,capturedEvents);

},
/**
* 
The same monitor is registered twice, removed once, and an event is dispatched.  
The monitor should recieve only no handleEvent calls.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#xpointer(id('Events-EventTarget-dispatchEvent')/raises/exception[@name='EventException']/descr/p[substring-before(.,':')='UNSPECIFIED_EVENT_TYPE_ERR'])
*/
dispatchEvent11 : function () {
   var success;
    if(checkInitialization(builder, "dispatchEvent11") != null) return;
    var doc;
      var target;
      var evt;
      var preventDefault;
      monitor = new EventMonitor();
      
      var events = new Array();

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      doc.addEventListener("foo", monitor.handleEvent, false);
	 doc.addEventListener("foo", monitor.handleEvent, false);
	 doc.removeEventListener("foo", monitor.handleEvent, false);
	 evt = doc.createEvent("Events");
      evt.initEvent("foo",true,false);
      preventDefault = doc.dispatchEvent(evt);
      events = monitor.allEvents;
assertSize("eventCount",0,events);

},

/**
* 
A monitor is added, multiple calls to removeEventListener
are mde with similar but not identical arguments, and an event is dispatched.  
The monitor should recieve handleEvent calls.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#xpointer(id('Events-EventTarget-dispatchEvent')/raises/exception[@name='EventException']/descr/p[substring-before(.,':')='UNSPECIFIED_EVENT_TYPE_ERR'])
*/
dispatchEvent12 : function () {
   var success;
    if(checkInitialization(builder, "dispatchEvent12") != null) return;
    var doc;
      var target;
      var evt;
      var preventDefault;
      monitor = new EventMonitor();
      
      other = new EventListenerN65589();
	  
      var events = new Array();

      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      doc.addEventListener("foo", monitor.handleEvent, false);
	 doc.removeEventListener("foo", monitor.handleEvent, true);
	 doc.removeEventListener("food", monitor.handleEvent, false);
	 doc.removeEventListener("foo", other.handleEvent, false);
	 evt = doc.createEvent("Events");
      evt.initEvent("foo",true,false);
      preventDefault = doc.dispatchEvent(evt);
      events = monitor.allEvents;
assertSize("eventCount",1,events);

},
/**
* 
Two listeners are registered on the same target, each of which will remove both itself and 
the other on the first event.  Only one should see the event since event listeners
can never be invoked after being removed.

* @author Curt Arnold
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#Events-EventTarget-dispatchEvent
* @see http://www.w3.org/TR/DOM-Level-2-Events/events#xpointer(id('Events-EventTarget-dispatchEvent')/raises/exception[@name='EventException']/descr/p[substring-before(.,':')='UNSPECIFIED_EVENT_TYPE_ERR'])
*/
dispatchEvent13 : function () {
   var success;
    if(checkInitialization(builder, "dispatchEvent13") != null) return;
    var doc;
      var target;
      var evt;
      var preventDefault;
      var listeners = new Array();

      var events = new Array();

      listener1 = new EventListenerN65595(events, listeners);
	  
      listener2 = new EventListenerN65652(events, listeners);
	  
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      listeners[listeners.length] = listener1;
listeners[listeners.length] = listener2;
doc.addEventListener("foo", listener1.handleEvent, false);
	 doc.addEventListener("foo", listener2.handleEvent, false);
	 evt = doc.createEvent("Events");
      evt.initEvent("foo",true,false);
      preventDefault = doc.dispatchEvent(evt);
      assertSize("eventCount",1,events);

},
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
