// https://html.spec.whatwg.org/multipage/browsing-the-web.html#the-pagetransitionevent-interface
[Exposed=Window]
interface PageTransitionEvent : Event {
  constructor(DOMString type, optional PageTransitionEventInit eventInitDict = {});
  readonly attribute boolean persisted;
};

dictionary PageTransitionEventInit : EventInit {
  boolean persisted = false;
};
