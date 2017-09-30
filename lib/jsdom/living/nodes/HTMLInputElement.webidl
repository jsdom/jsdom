interface HTMLInputElement : HTMLElement {
  [Reflect] attribute DOMString accept;
  [Reflect] attribute DOMString alt;
  [Reflect] attribute DOMString autocomplete;
  [Reflect] attribute boolean autofocus;
  [Reflect=checked] attribute boolean defaultChecked;
  attribute boolean checked;
  [Reflect] attribute DOMString dirName;
  [Reflect] attribute boolean disabled;
  readonly attribute HTMLFormElement? form;
  readonly attribute FileList? files;
//  attribute DOMString formAction;
//  attribute DOMString formEnctype;
//  attribute DOMString formMethod;
  [Reflect] attribute boolean formNoValidate;
  [Reflect] attribute DOMString formTarget;
//  attribute unsigned long height;
//  attribute boolean indeterminate;
  [Reflect] attribute DOMString inputMode;
//  readonly attribute HTMLElement? list;
  [Reflect] attribute DOMString max;
  attribute long maxLength;
  [Reflect] attribute DOMString min;
  attribute long minLength;
  [Reflect] attribute boolean multiple;
  [Reflect] attribute DOMString name;
  [Reflect] attribute DOMString pattern;
  [Reflect] attribute DOMString placeholder;
  [Reflect] attribute boolean readOnly;
  [Reflect] attribute boolean required;
  attribute unsigned long size;
  [Reflect] attribute DOMString src;
  [Reflect] attribute DOMString step;
  attribute DOMString type;
  [Reflect=value] attribute DOMString defaultValue;
  [TreatNullAs=EmptyString] attribute DOMString value;
//  attribute object? valueAsDate;
//  attribute unrestricted double valueAsNumber;
//  attribute double valueLow;
//  attribute double valueHigh;
//  attribute unsigned long width;

//  void stepUp(optional long n = 1);
//  void stepDown(optional long n = 1);

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

  // also has obsolete members
};

partial interface HTMLInputElement {
  [Reflect] attribute DOMString align;
  [Reflect] attribute DOMString useMap;
};
