[Exposed=Window,
 HTMLConstructor]
interface HTMLObjectElement : HTMLElement {
  [CEReactions] attribute USVString data;
  [CEReactions, Reflect] attribute DOMString type;
//  [CEReactions] attribute boolean typeMustMatch;
  [CEReactions, Reflect] attribute DOMString name;
  [CEReactions, Reflect] attribute DOMString useMap;
  readonly attribute HTMLFormElement? form;
  [CEReactions, Reflect] attribute DOMString width;
  [CEReactions, Reflect] attribute DOMString height;
  readonly attribute Document? contentDocument;
//  readonly attribute WindowProxy? contentWindow;
//  Document? getSVGDocument();

//  readonly attribute boolean willValidate;
//  readonly attribute ValidityState validity;
//  readonly attribute DOMString validationMessage;
//  boolean checkValidity();
//  boolean reportValidity();
//  void setCustomValidity(DOMString error);

  // also has obsolete members
};

partial interface HTMLObjectElement {
  [CEReactions, Reflect] attribute DOMString align;
  [CEReactions, Reflect] attribute DOMString archive;
  [CEReactions, Reflect] attribute DOMString code;
  [CEReactions, Reflect] attribute boolean declare;
  [CEReactions, Reflect] attribute unsigned long hspace;
  [CEReactions, Reflect] attribute DOMString standby;
  [CEReactions, Reflect] attribute unsigned long vspace;
  [CEReactions] attribute DOMString codeBase;
  [CEReactions, Reflect] attribute DOMString codeType;

  [CEReactions, Reflect] attribute [TreatNullAs=EmptyString] DOMString border;
};
