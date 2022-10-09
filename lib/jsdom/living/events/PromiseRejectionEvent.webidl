// https://html.spec.whatwg.org/multipage/webappapis.html#the-promiserejectionevent-interface
[Exposed=(Window,Worker)]
interface PromiseRejectionEvent : Event {
  constructor(DOMString type, PromiseRejectionEventInit eventInitDict);

  readonly attribute Promise<any> promise;
  readonly attribute any reason;
};

dictionary PromiseRejectionEventInit : EventInit {
  required Promise<any> promise;
  any reason;
};
