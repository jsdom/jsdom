[Constructor(DOMString type, optional FocusEventInit eventInitDict), Exposed=Window]
interface FocusEvent : UIEvent {
  readonly attribute EventTarget? relatedTarget;
};

dictionary FocusEventInit : UIEventInit {
  EventTarget? relatedTarget = null;
};
