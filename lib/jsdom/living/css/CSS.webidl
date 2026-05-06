// https://drafts.csswg.org/cssom/#namespacedef-css
[Exposed=Window]
interface CSS {
  static CSSOMString escape(CSSOMString ident);
  static boolean supports(CSSOMString property, CSSOMString value);
  static boolean supports(CSSOMString conditionText);
};
