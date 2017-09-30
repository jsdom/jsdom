//[NamedConstructor=Option(optional DOMString text = "", optional DOMString value, optional boolean defaultSelected = false, optional boolean selected = false)]
interface HTMLOptionElement : HTMLElement {
  [Reflect] attribute boolean disabled;
  readonly attribute HTMLFormElement? form;
  attribute DOMString label;
  [Reflect=selected] attribute boolean defaultSelected;
  attribute boolean selected;
  attribute DOMString value;

  attribute DOMString text;
  readonly attribute long index;
};
