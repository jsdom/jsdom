// https://html.spec.whatwg.org/multipage/webappapis.html#eventhandlernonnull
[LegacyTreatNonObjectAsNull]
callback EventHandlerNonNull = any (Event event);
typedef EventHandlerNonNull? EventHandler;

// https://html.spec.whatwg.org/multipage/webappapis.html#onerroreventhandlernonnull
[LegacyTreatNonObjectAsNull]
callback OnErrorEventHandlerNonNull = any (
  (Event or DOMString) event,
  optional DOMString source,
  optional unsigned long lineno,
  optional unsigned long colno,
  optional any error
);
typedef OnErrorEventHandlerNonNull? OnErrorEventHandler;

// https://html.spec.whatwg.org/multipage/webappapis.html#onbeforeunloadeventhandlernonnull
[LegacyTreatNonObjectAsNull]
callback OnBeforeUnloadEventHandlerNonNull = DOMString? (Event event);
typedef OnBeforeUnloadEventHandlerNonNull? OnBeforeUnloadEventHandler;
