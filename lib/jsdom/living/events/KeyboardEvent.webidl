[Constructor(DOMString type, optional KeyboardEventInit eventInitDict), Exposed=Window]
interface KeyboardEvent : UIEvent {
  // KeyLocationCode
  const unsigned long DOM_KEY_LOCATION_STANDARD = 0x00;
  const unsigned long DOM_KEY_LOCATION_LEFT = 0x01;
  const unsigned long DOM_KEY_LOCATION_RIGHT = 0x02;
  const unsigned long DOM_KEY_LOCATION_NUMPAD = 0x03;

  readonly attribute DOMString key;
  readonly attribute DOMString code;
  readonly attribute unsigned long location;

  readonly attribute boolean ctrlKey;
  readonly attribute boolean shiftKey;
  readonly attribute boolean altKey;
  readonly attribute boolean metaKey;

  readonly attribute boolean repeat;
  readonly attribute boolean isComposing;

  boolean getModifierState(DOMString keyArg);
};

dictionary KeyboardEventInit : EventModifierInit {
  DOMString key = "";
  DOMString code = "";
  unsigned long location = 0;
  boolean repeat = false;
  boolean isComposing = false;
};

partial interface KeyboardEvent {
  // Originally introduced (and deprecated) in this specification
  void initKeyboardEvent(DOMString typeArg,
                         optional boolean bubblesArg = false,
                         optional boolean cancelableArg = false,
                         optional Window? viewArg = null,
                         optional DOMString keyArg = "",
                         optional unsigned long locationArg = 0,
                         optional boolean ctrlKey = false,
                         optional boolean altKey = false,
                         optional boolean shiftKey = false,
                         optional boolean metaKey = false);
};

partial interface KeyboardEvent {
  // The following support legacy user agents
  readonly attribute unsigned long charCode;
  readonly attribute unsigned long keyCode;
};

partial dictionary KeyboardEventInit {
  // The following support legacy user agents
  unsigned long charCode = 0;
  unsigned long keyCode = 0;
};
