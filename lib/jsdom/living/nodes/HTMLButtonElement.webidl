interface HTMLButtonElement : HTMLElement {
  [Reflect] attribute boolean autofocus;
  [Reflect] attribute boolean disabled;
  readonly attribute HTMLFormElement? form;
//  attribute DOMString formAction;
//  attribute DOMString formEnctype;
//  attribute DOMString formMethod;
  [Reflect] attribute boolean formNoValidate;
  [Reflect] attribute DOMString formTarget;
  [Reflect] attribute DOMString name;
  attribute DOMString type;
  [Reflect] attribute DOMString value;
//  attribute HTMLMenuElement? menu;

//  readonly attribute boolean willValidate;
//  readonly attribute ValidityState validity;
//  readonly attribute DOMString validationMessage;
//  boolean checkValidity();
//  boolean reportValidity();
//  void setCustomValidity(DOMString error);

//  [SameObject] readonly attribute NodeList labels;
};
