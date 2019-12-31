// https://html.spec.whatwg.org/multipage/browsing-the-web.html#the-popstateevent-interface
[Exposed=Window]
interface PopStateEvent : Event {
  constructor(DOMString type, optional PopStateEventInit eventInitDict = {});
  readonly attribute any state;
};

dictionary PopStateEventInit : EventInit {
  any state = null;
};
