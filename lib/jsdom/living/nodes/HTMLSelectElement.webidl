[Exposed=Window,
 HTMLConstructor]
interface HTMLSelectElement : HTMLElement {
//  [CEReactions] attribute DOMString autocomplete;
  [CEReactions, Reflect] attribute boolean autofocus;
  [CEReactions, Reflect] attribute boolean disabled;
  readonly attribute HTMLFormElement? form;
  [CEReactions, Reflect] attribute boolean multiple;
  [CEReactions, Reflect] attribute DOMString name;
  [CEReactions, Reflect] attribute boolean required;
  [CEReactions, Reflect] attribute unsigned long size;

  readonly attribute DOMString type;

  [SameObject] readonly attribute HTMLOptionsCollection options;
  [CEReactions] attribute unsigned long length;
  [WebIDL2JSValueAsUnsupported=null] getter Element? item(unsigned long index);
  HTMLOptionElement? namedItem(DOMString name);
  [CEReactions] void add((HTMLOptionElement or HTMLOptGroupElement) element, optional (HTMLElement or long)? before = null);
  [CEReactions] void remove(); // ChildNode overload
  [CEReactions] void remove(long index);
  [CEReactions] setter void (unsigned long index, HTMLOptionElement? option);

  [SameObject] readonly attribute HTMLCollection selectedOptions;
  attribute long selectedIndex;
  attribute DOMString value;

//  readonly attribute boolean willValidate;
//  readonly attribute ValidityState validity;
//  readonly attribute DOMString validationMessage;
//  boolean checkValidity();
//  boolean reportValidity();
//  void setCustomValidity(DOMString error);

//  readonly attribute NodeList labels;
};
