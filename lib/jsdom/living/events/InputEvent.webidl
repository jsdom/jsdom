// https://w3c.github.io/uievents/#idl-inputevent
[Exposed=Window]
interface InputEvent : UIEvent {
  constructor(DOMString type, optional InputEventInit eventInitDict = {});

  readonly attribute DOMString? data;
  readonly attribute boolean isComposing;
};

// https://w3c.github.io/uievents/#idl-inputeventinit
dictionary InputEventInit : UIEventInit {
  // The spec seems incorrect about data's default value - https://github.com/w3c/uievents/issues/139
  // DOMString? data = "";
  DOMString? data = null;
  boolean isComposing = false;
};
