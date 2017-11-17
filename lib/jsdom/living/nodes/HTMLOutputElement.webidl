[Exposed=Window,
 HTMLConstructor]
interface HTMLOutputElement : HTMLElement {
//  [SameObject, PutForwards=value] readonly attribute DOMTokenList htmlFor;
//  readonly attribute HTMLFormElement? form;
  [CEReactions, Reflect] attribute DOMString name;

//  readonly attribute DOMString type;
//  [CEReactions] attribute DOMString defaultValue;
//  [CEReactions] attribute DOMString value;

//  readonly attribute boolean willValidate;
//  readonly attribute ValidityState validity;
//  readonly attribute DOMString validationMessage;
//  boolean checkValidity();
//  boolean reportValidity();
//  void setCustomValidity(DOMString error);

//  readonly attribute NodeList labels;
};
