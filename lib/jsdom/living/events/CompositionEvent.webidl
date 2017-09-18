// https://w3c.github.io/uievents/#interface-compositionevent
[Constructor(DOMString type, optional CompositionEventInit eventInitDict), Exposed=Window]
interface CompositionEvent : UIEvent {
  readonly attribute DOMString data;
};

dictionary CompositionEventInit : UIEventInit {
  DOMString data = "";
};

// https://github.com/w3c/uievents/issues/134
partial interface CompositionEvent {
  // Originally introduced (and deprecated) in this specification
  void initCompositionEvent(DOMString typeArg,
                            optional boolean bubblesArg = false,
                            optional boolean cancelableArg = false,
                            optional Window? viewArg = null,
                            optional DOMString dataArg = "");
};
