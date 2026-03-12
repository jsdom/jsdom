// https://drafts.csswg.org/cssom/#the-cssrulelist-interface
[Exposed=Window]
interface CSSRuleList {
  [WebIDL2JSValueAsUnsupported=_null] getter CSSRule? item(unsigned long index);
  readonly attribute unsigned long length;
};
