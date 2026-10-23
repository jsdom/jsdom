
// https://drafts.csswg.org/cssom-1/#cssnamespacerule
[Exposed=Window]
interface CSSNamespaceRule : CSSRule {
    readonly attribute CSSOMString namespaceURI;
    readonly attribute CSSOMString prefix;
};
