// https://drafts.csswg.org/cssom/#the-medialist-interface
[Exposed=Window]
interface MediaList {
  stringifier attribute [LegacyNullToEmptyString] DOMString mediaText;
  readonly attribute unsigned long length;
  [WebIDL2JSValueAsUnsupported=_null] getter CSSOMString? item(unsigned long index);
  undefined appendMedium(CSSOMString medium);
  undefined deleteMedium(CSSOMString medium);
};
