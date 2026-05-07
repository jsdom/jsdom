// https://drafts.csswg.org/cssom/#namespacedef-css
[Exposed=Window, LegacyNoInterfaceObject]
interface CSS {
  boolean supports(CSSOMString conditionText);
  boolean supports(CSSOMString property, CSSOMString value);
  CSSOMString escape(CSSOMString ident);
};
