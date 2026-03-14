// https://drafts.csswg.org/cssom/#the-stylesheet-interface
[Exposed=Window]
interface StyleSheet {
  readonly attribute CSSOMString type;
  readonly attribute USVString? href;
  readonly attribute (Element or ProcessingInstruction)? ownerNode;
  readonly attribute CSSStyleSheet? parentStyleSheet;
  readonly attribute DOMString? title;
  [SameObject, PutForwards=mediaText] readonly attribute MediaList media;
  attribute boolean disabled;
};
