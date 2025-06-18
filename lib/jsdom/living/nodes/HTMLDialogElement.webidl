[Exposed=Window,
 HTMLConstructor]
interface HTMLDialogElement : HTMLElement {
  [CEReactions, Reflect] attribute boolean open;
  attribute DOMString returnValue;
  [CEReactions] attribute DOMString closedBy;
  [CEReactions] undefined show();
  [CEReactions] undefined showModal();
  [CEReactions] undefined close(optional DOMString returnValue);
  [CEReactions] undefined requestClose(optional DOMString returnValue);
};
