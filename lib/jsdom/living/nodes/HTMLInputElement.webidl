// https://html.spec.whatwg.org/multipage/input.html#htmlinputelement
[Exposed=Window,
 HTMLConstructor]
interface HTMLInputElement : HTMLElement {
  [CEReactions, Reflect] attribute DOMString accept;
  [CEReactions, Reflect] attribute DOMString alt;
  [CEReactions, Reflect] attribute DOMString autocomplete;
  [CEReactions, Reflect] attribute boolean autofocus;
  [CEReactions, Reflect="checked"] attribute boolean defaultChecked;
  attribute boolean checked;
  [CEReactions, Reflect] attribute DOMString dirName;
  [CEReactions, Reflect] attribute boolean disabled;
  readonly attribute HTMLFormElement? form;
  attribute FileList? files;
//  [CEReactions] attribute USVString formAction;
//  [CEReactions] attribute DOMString formEnctype;
//  [CEReactions] attribute DOMString formMethod;
  [CEReactions, Reflect] attribute boolean formNoValidate;
  [CEReactions, Reflect] attribute DOMString formTarget;
//  [CEReactions] attribute unsigned long height;
  attribute boolean indeterminate;
  [CEReactions, Reflect] attribute DOMString inputMode;
  readonly attribute HTMLElement? list;
  [CEReactions, Reflect] attribute DOMString max;
  [CEReactions] attribute long maxLength;
  [CEReactions, Reflect] attribute DOMString min;
  [CEReactions] attribute long minLength;
  [CEReactions, Reflect] attribute boolean multiple;
  [CEReactions, Reflect] attribute DOMString name;
  [CEReactions, Reflect] attribute DOMString pattern;
  [CEReactions, Reflect] attribute DOMString placeholder;
  [CEReactions, Reflect] attribute boolean readOnly;
  [CEReactions, Reflect] attribute boolean required;
  [CEReactions] attribute unsigned long size;
  [CEReactions, ReflectURL] attribute USVString src;
  [CEReactions, Reflect] attribute DOMString step;
  [CEReactions] attribute DOMString type;
  [CEReactions, Reflect="value"] attribute DOMString defaultValue;
  [CEReactions] attribute [LegacyNullToEmptyString] DOMString value;
  attribute object? valueAsDate;
  attribute unrestricted double valueAsNumber;
//  [CEReactions] attribute unsigned long width;

  void stepUp(optional long n = 1);
  void stepDown(optional long n = 1);

  readonly attribute boolean willValidate;
  readonly attribute ValidityState validity;
  readonly attribute DOMString validationMessage;
  boolean checkValidity();
  boolean reportValidity();
  void setCustomValidity(DOMString error);

  readonly attribute NodeList? labels;

  void select();
  attribute unsigned long? selectionStart;
  attribute unsigned long? selectionEnd;
  attribute DOMString? selectionDirection;
  void setRangeText(DOMString replacement);
  void setRangeText(DOMString replacement, unsigned long start, unsigned long end, optional SelectionMode selectionMode = "preserve");
  void setSelectionRange(unsigned long start, unsigned long end, optional DOMString direction);

  // also has obsolete members
};

// https://html.spec.whatwg.org/multipage/obsolete.html#HTMLInputElement-partial
partial interface HTMLInputElement {
  [CEReactions, Reflect] attribute DOMString align;
  [CEReactions, Reflect] attribute DOMString useMap;
};

// https://html.spec.whatwg.org/multipage/form-control-infrastructure.html#selectionmode
enum SelectionMode {
  "select",
  "start",
  "end",
  "preserve" // default
};
