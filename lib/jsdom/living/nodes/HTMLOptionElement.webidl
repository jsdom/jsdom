[Exposed=Window,
 HTMLConstructor,
 NamedConstructor=Option(optional DOMString text = "", optional DOMString value, optional boolean defaultSelected = false, optional boolean selected = false)]
interface HTMLOptionElement : HTMLElement {
  [CEReactions, Reflect] attribute boolean disabled;
  readonly attribute HTMLFormElement? form;
  [CEReactions] attribute DOMString label;
  [CEReactions, Reflect="selected"] attribute boolean defaultSelected;
  attribute boolean selected;
  [CEReactions] attribute DOMString value;

  [CEReactions] attribute DOMString text;
  readonly attribute long index;
};
