[Exposed=Window]
interface StyleSheetList {
  [WebIDL2JSValueAsUnsupported=_null]
  getter CSSStyleSheet? item(unsigned long index);
  readonly attribute unsigned long length;
};
