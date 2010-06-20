/*
#ifndef _EVENTS_IDL_
#define _EVENTS_IDL_

#include "dom.idl"
#include "views.idl"

#pragma prefix "dom.w3c.org"
module events
{

  typedef dom::DOMString DOMString;
  typedef dom::DOMTimeStamp DOMTimeStamp;
  typedef dom::Node Node;

  interface EventListener;
  interface Event;

  // Introduced in DOM Level 2:
  exception EventException {
    unsigned short   code;
  };
  // EventExceptionCode
  const unsigned short      UNSPECIFIED_EVENT_TYPE_ERR     = 0;


  // Introduced in DOM Level 2:
  interface EventTarget {
    void               addEventListener(in DOMString type, 
                                        in EventListener listener, 
                                        in boolean useCapture);
    void               removeEventListener(in DOMString type, 
                                           in EventListener listener, 
                                           in boolean useCapture);
    boolean            dispatchEvent(in Event evt)
                                        raises(EventException);
  };

  // Introduced in DOM Level 2:
  interface EventListener {
    void               handleEvent(in Event evt);
  };

  // Introduced in DOM Level 2:
  interface Event {

    // PhaseType
    const unsigned short      CAPTURING_PHASE                = 1;
    const unsigned short      AT_TARGET                      = 2;
    const unsigned short      BUBBLING_PHASE                 = 3;

    readonly attribute DOMString        type;
    readonly attribute EventTarget      target;
    readonly attribute EventTarget      currentTarget;
    readonly attribute unsigned short   eventPhase;
    readonly attribute boolean          bubbles;
    readonly attribute boolean          cancelable;
    readonly attribute DOMTimeStamp     timeStamp;
    void               stopPropagation();
    void               preventDefault();
    void               initEvent(in DOMString eventTypeArg, 
                                 in boolean canBubbleArg, 
                                 in boolean cancelableArg);
  };

  // Introduced in DOM Level 2:
  interface DocumentEvent {
    Event              createEvent(in DOMString eventType)
                                        raises(dom::DOMException);
  };

  // Introduced in DOM Level 2:
  interface UIEvent : Event {
    readonly attribute views::AbstractView  view;
    readonly attribute long             detail;
    void               initUIEvent(in DOMString typeArg, 
                                   in boolean canBubbleArg, 
                                   in boolean cancelableArg, 
                                   in views::AbstractView viewArg, 
                                   in long detailArg);
  };

  // Introduced in DOM Level 2:
  interface MouseEvent : UIEvent {
    readonly attribute long             screenX;
    readonly attribute long             screenY;
    readonly attribute long             clientX;
    readonly attribute long             clientY;
    readonly attribute boolean          ctrlKey;
    readonly attribute boolean          shiftKey;
    readonly attribute boolean          altKey;
    readonly attribute boolean          metaKey;
    readonly attribute unsigned short   button;
    readonly attribute EventTarget      relatedTarget;
    void               initMouseEvent(in DOMString typeArg, 
                                      in boolean canBubbleArg, 
                                      in boolean cancelableArg, 
                                      in views::AbstractView viewArg, 
                                      in long detailArg, 
                                      in long screenXArg, 
                                      in long screenYArg, 
                                      in long clientXArg, 
                                      in long clientYArg, 
                                      in boolean ctrlKeyArg, 
                                      in boolean altKeyArg, 
                                      in boolean shiftKeyArg, 
                                      in boolean metaKeyArg, 
                                      in unsigned short buttonArg, 
                                      in EventTarget relatedTargetArg);
  };

  // Introduced in DOM Level 2:
  interface MutationEvent : Event {

    // attrChangeType
    const unsigned short      MODIFICATION                   = 1;
    const unsigned short      ADDITION                       = 2;
    const unsigned short      REMOVAL                        = 3;

    readonly attribute Node             relatedNode;
    readonly attribute DOMString        prevValue;
    readonly attribute DOMString        newValue;
    readonly attribute DOMString        attrName;
    readonly attribute unsigned short   attrChange;
    void               initMutationEvent(in DOMString typeArg, 
                                         in boolean canBubbleArg, 
                                         in boolean cancelableArg, 
                                         in Node relatedNodeArg, 
                                         in DOMString prevValueArg, 
                                         in DOMString newValueArg, 
                                         in DOMString attrNameArg, 
                                         in unsigned short attrChangeArg);
  };
};

#endif // _EVENTS_IDL_
*/
