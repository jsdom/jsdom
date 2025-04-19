// https://html.spec.whatwg.org/multipage/webappapis.html#unhandled-promise-rejections
// Not yet supported by webidl2js: [Exposed=*]
[Exposed=Window]
interface PromiseRejectionEvent : Event {
  constructor(DOMString type, PromiseRejectionEventInit eventInitDict);

  readonly attribute object promise;
  readonly attribute any reason;
};

dictionary PromiseRejectionEventInit : EventInit {
  required object promise;
  any reason;
};
