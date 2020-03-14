// https://drafts.csswg.org/cssom/#the-stylesheetlist-interface
[Exposed=Window]
interface StyleSheetList {
  [WebIDL2JSValueAsUnsupported=_null] getter CSSStyleSheet? item(unsigned long index);
  readonly attribute unsigned long length;
};
