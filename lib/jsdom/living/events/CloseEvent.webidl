// https://html.spec.whatwg.org/multipage/web-sockets.html#the-closeevent-interface
[Exposed=(Window,Worker)]
interface CloseEvent : Event {
  constructor(DOMString type, optional CloseEventInit eventInitDict);

  readonly attribute boolean wasClean;
  readonly attribute unsigned short code;
  readonly attribute USVString reason;
};

dictionary CloseEventInit : EventInit {
  boolean wasClean = false;
  unsigned short code = 0;
  USVString reason = "";
};
