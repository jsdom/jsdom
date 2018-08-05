[Constructor(DOMString type, optional InputEventInit eventInitDict), Exposed=Window]
interface InputEvent : UIEvent {
  readonly attribute DOMString? data;
  readonly attribute boolean isComposing;
};

dictionary InputEventInit : UIEventInit {
  // The spec seems incorrect about data's default value - https://github.com/w3c/uievents/issues/139
  // DOMString? data = "";
  DOMString? data = null;
  boolean isComposing = false;
};
