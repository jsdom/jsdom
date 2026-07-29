// https://drafts.csswg.org/cssom/#namespacedef-css
[Exposed=Window]
namespace CSS {
  [WebIDL2JSCallWithGlobal] boolean supports(CSSOMString conditionText);
  [WebIDL2JSCallWithGlobal] boolean supports(CSSOMString property, CSSOMString value);
  CSSOMString escape(CSSOMString ident);
};
