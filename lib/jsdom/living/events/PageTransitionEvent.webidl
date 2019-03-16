[Exposed=Window,
 Constructor(DOMString type, optional PageTransitionEventInit eventInitDict)]
interface PageTransitionEvent : Event {
  readonly attribute boolean persisted;
};

dictionary PageTransitionEventInit : EventInit {
  boolean persisted = false;
};
