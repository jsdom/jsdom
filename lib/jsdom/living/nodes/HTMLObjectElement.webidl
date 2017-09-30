interface HTMLObjectElement : HTMLElement {
  attribute DOMString data;
  [Reflect] attribute DOMString type;
//  attribute boolean typeMustMatch;
  [Reflect] attribute DOMString name;
  [Reflect] attribute DOMString useMap;
  readonly attribute HTMLFormElement? form;
  [Reflect] attribute DOMString width;
  [Reflect] attribute DOMString height;
  readonly attribute Document? contentDocument;
//  readonly attribute WindowProxy? contentWindow;
//  Document? getSVGDocument();

//  readonly attribute boolean willValidate;
//  readonly attribute ValidityState validity;
//  readonly attribute DOMString validationMessage;
//  boolean checkValidity();
//  boolean reportValidity();
//  void setCustomValidity(DOMString error);

//  legacycaller any (any... arguments);

  // also has obsolete members
};

partial interface HTMLObjectElement {
  [Reflect] attribute DOMString align;
  [Reflect] attribute DOMString archive;
  [Reflect] attribute DOMString code;
  [Reflect] attribute boolean declare;
  [Reflect] attribute unsigned long hspace;
  [Reflect] attribute DOMString standby;
  [Reflect] attribute unsigned long vspace;
  attribute DOMString codeBase;
  [Reflect] attribute DOMString codeType;

  [Reflect, TreatNullAs=EmptyString] attribute DOMString border;
};
