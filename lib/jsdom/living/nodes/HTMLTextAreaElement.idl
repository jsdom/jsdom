interface HTMLTextAreaElement : HTMLElement {
  [Reflect] attribute DOMString autocomplete;
  [Reflect] attribute boolean autofocus;
  attribute unsigned long cols;
  [Reflect] attribute DOMString dirName;
  [Reflect] attribute boolean disabled;
  readonly attribute HTMLFormElement? form;
  [Reflect] attribute DOMString inputMode;
  [Reflect] attribute long maxLength; // TODO limited to only non-negative numbers
  [Reflect] attribute long minLength; // TODO limited to only non-negative numbers
  [Reflect] attribute DOMString name;
  [Reflect] attribute DOMString placeholder;
  [Reflect] attribute boolean readOnly;
  [Reflect] attribute boolean required;
  attribute unsigned long rows;
  [Reflect] attribute DOMString wrap;

  readonly attribute DOMString type;
  attribute DOMString defaultValue;
  [TreatNullAs=EmptyString] attribute DOMString value;
  readonly attribute unsigned long textLength;

//  readonly attribute boolean willValidate;
//  readonly attribute ValidityState validity;
//  readonly attribute DOMString validationMessage;
//  boolean checkValidity();
//  boolean reportValidity();
//  void setCustomValidity(DOMString error);

//  [SameObject] readonly attribute NodeList labels;

  void select();
  attribute unsigned long? selectionStart;
  attribute unsigned long? selectionEnd;
  attribute DOMString? selectionDirection;
  void setRangeText(DOMString replacement);
  void setRangeText(DOMString replacement, unsigned long start, unsigned long end, optional SelectionMode selectionMode = "preserve");
  void setSelectionRange(unsigned long start, unsigned long end, optional DOMString direction);
};
