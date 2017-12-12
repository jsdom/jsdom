[Constructor(DOMString type, optional UIEventInit eventInitDict), Exposed=Window]
interface UIEvent : Event {
  readonly attribute Window? view;
  readonly attribute long detail;
};

dictionary UIEventInit : EventInit {
  Window? view = null;
  long detail = 0;
};

dictionary EventModifierInit : UIEventInit {
  boolean ctrlKey = false;
  boolean shiftKey = false;
  boolean altKey = false;
  boolean metaKey = false;

  boolean modifierAltGraph = false;
  boolean modifierCapsLock = false;
  boolean modifierFn = false;
  boolean modifierFnLock = false;
  boolean modifierHyper = false;
  boolean modifierNumLock = false;
  boolean modifierScrollLock = false;
  boolean modifierSuper = false;
  boolean modifierSymbol = false;
  boolean modifierSymbolLock = false;
};

// https://github.com/w3c/uievents/issues/133
partial interface UIEvent {
    // Deprecated in this specification
    void initUIEvent(DOMString typeArg,
                     optional boolean bubblesArg = false,
                     optional boolean cancelableArg = false,
                     optional Window? viewArg = null,
                     optional long detailArg = 0);
};

// https://w3c.github.io/uievents/#legacy-interface-UIEvent
partial interface UIEvent {
  // The following support legacy user agents
  readonly attribute unsigned long which;
};

// https://w3c.github.io/uievents/#legacy-dictionary-UIEventInit
partial dictionary UIEventInit {
  unsigned long which = 0;
};
