
// https://drafts.csswg.org/css-pseudo-4/#csspseudoelement
[Exposed=Window]
interface CSSPseudoElement {
    readonly attribute CSSOMString type;
    readonly attribute Element element;
    readonly attribute (Element or CSSPseudoElement) parent;
    readonly attribute CSSOMString selectorText;
    CSSPseudoElement? pseudo(CSSOMString type);
};
