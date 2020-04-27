// https://html.spec.whatwg.org/multipage/browsing-the-web.html#the-beforeunloadevent-interface
[Exposed=Window]
interface BeforeUnloadEvent : Event {
  attribute DOMString returnValue;
};
