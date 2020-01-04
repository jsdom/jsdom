// https://w3c.github.io/uievents/#idl-focusevent
[Exposed=Window]
interface FocusEvent : UIEvent {
  constructor(DOMString type, optional FocusEventInit eventInitDict = {});

  readonly attribute EventTarget? relatedTarget;
};

// https://w3c.github.io/uievents/#idl-focuseventinit
dictionary FocusEventInit : UIEventInit {
  EventTarget? relatedTarget = null;
};
