[Exposed=Window,
 HTMLConstructor]
interface HTMLFieldSetElement : HTMLElement {
  [CEReactions, Reflect] attribute boolean disabled;
  readonly attribute HTMLFormElement? form;
  [CEReactions, Reflect] attribute DOMString name;

//  readonly attribute DOMString type;

//  [SameObject] readonly attribute HTMLCollection elements;

//  readonly attribute boolean willValidate;
//  [SameObject] readonly attribute ValidityState validity;
//  readonly attribute DOMString validationMessage;
//  boolean checkValidity();
//  boolean reportValidity();
//  void setCustomValidity(DOMString error);
};
