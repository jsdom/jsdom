// https://html.spec.whatwg.org/multipage/browsing-the-web.html#the-hashchangeevent-interface
[Exposed=Window]
interface HashChangeEvent : Event {
  constructor(DOMString type, optional HashChangeEventInit eventInitDict = {});
  readonly attribute USVString oldURL;
  readonly attribute USVString newURL;
};

dictionary HashChangeEventInit : EventInit {
  USVString oldURL = "";
  USVString newURL = "";
};
