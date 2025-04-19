// https://w3c.github.io/uievents/#idl-mouseevent
[Exposed=Window]
interface MouseEvent : UIEvent {
  constructor(DOMString type, optional MouseEventInit eventInitDict = {});

  readonly attribute long screenX;
  readonly attribute long screenY;
  readonly attribute long clientX;
  readonly attribute long clientY;
  readonly attribute boolean ctrlKey;
  readonly attribute boolean shiftKey;
  readonly attribute boolean altKey;
  readonly attribute boolean metaKey;

  readonly attribute short button;
  readonly attribute unsigned short buttons;

  readonly attribute EventTarget? relatedTarget;

  boolean getModifierState(DOMString keyArg);
};

// https://w3c.github.io/uievents/#idl-mouseeventinit
dictionary MouseEventInit : EventModifierInit {
  long screenX = 0;
  long screenY = 0;
  long clientX = 0;
  long clientY = 0;

  short button = 0;
  unsigned short buttons = 0;
  EventTarget? relatedTarget = null;
};

// https://github.com/w3c/uievents/issues/136
partial interface MouseEvent {
    // Deprecated in this specification
    undefined initMouseEvent(DOMString typeArg,
                        optional boolean bubblesArg = false,
                        optional boolean cancelableArg = false,
                        optional Window? viewArg = null,
                        optional long detailArg = 0,
                        optional long screenXArg = 0,
                        optional long screenYArg = 0,
                        optional long clientXArg = 0,
                        optional long clientYArg = 0,
                        optional boolean ctrlKeyArg = 0,
                        optional boolean altKeyArg = 0,
                        optional boolean shiftKeyArg = 0,
                        optional boolean metaKeyArg = 0,
                        optional short buttonArg = 0,
                        optional EventTarget? relatedTargetArg = null);
};

// https://drafts.csswg.org/cssom-view/#extensions-to-the-mouseevent-interface
// Adds attributes and changes existing ones to doubles
partial interface MouseEvent {
  readonly attribute double screenX;
  readonly attribute double screenY;
  readonly attribute double pageX;
  readonly attribute double pageY;
  readonly attribute double clientX;
  readonly attribute double clientY;
  readonly attribute double x;
  readonly attribute double y;
  readonly attribute double offsetX;
  readonly attribute double offsetY;
};

// https://drafts.csswg.org/cssom-view/#extensions-to-the-mouseevent-interface
// Changes existing coordinate entries to doubles
partial dictionary MouseEventInit {
  double screenX = 0.0;
  double screenY = 0.0;
  double clientX = 0.0;
  double clientY = 0.0;
};

// https://w3c.github.io/pointerlock/#extensions-to-the-mouseevent-interface
partial interface MouseEvent {
  readonly attribute double movementX;
  readonly attribute double movementY;
};

// https://w3c.github.io/pointerlock/#extensions-to-the-mouseeventinit-dictionary
partial dictionary MouseEventInit {
  double movementX = 0;
  double movementY = 0;
};
