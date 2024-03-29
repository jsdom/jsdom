// https://html.spec.whatwg.org/multipage/tables.html#htmltablecellelement
[Exposed=Window,
 HTMLConstructor]
interface HTMLTableCellElement : HTMLElement {
  [CEReactions, Reflect, ReflectRange=(1,1000), ReflectDefault=1] attribute unsigned long colSpan;
  [CEReactions, Reflect, ReflectRange=(0,65534), ReflectDefault=1] attribute unsigned long rowSpan;
  [CEReactions, Reflect] attribute DOMString headers;
  readonly attribute long cellIndex;

  [CEReactions] attribute DOMString scope; // only conforming for th elements
  [CEReactions, Reflect] attribute DOMString abbr;  // only conforming for th elements

  // also has obsolete members
};

// https://html.spec.whatwg.org/multipage/obsolete.html#HTMLTableCellElement-partial
partial interface HTMLTableCellElement {
  [CEReactions, Reflect] attribute DOMString align;
  [CEReactions, Reflect] attribute DOMString axis;
  [CEReactions, Reflect] attribute DOMString height;
  [CEReactions, Reflect] attribute DOMString width;

  [CEReactions, Reflect="char"] attribute DOMString ch;
  [CEReactions, Reflect="charoff"] attribute DOMString chOff;
  [CEReactions, Reflect] attribute boolean noWrap;
  [CEReactions, Reflect] attribute DOMString vAlign;

  [CEReactions, Reflect] attribute [LegacyNullToEmptyString] DOMString bgColor;
};
