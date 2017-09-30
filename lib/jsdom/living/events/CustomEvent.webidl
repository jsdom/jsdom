[Constructor(DOMString type, optional CustomEventInit eventInitDict),
 Exposed=(Window,Worker)]
interface CustomEvent : Event {
  readonly attribute any detail;

  void initCustomEvent(DOMString type, optional boolean bubbles = false, optional boolean cancelable = false, optional any detail = null);
};

dictionary CustomEventInit : EventInit {
  any detail = null;
};
