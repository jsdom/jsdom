
// https://drafts.csswg.org/cssom-1/#cssstyledeclaration
[Exposed=Window]
interface CSSStyleDeclaration {

    [CEReactions] attribute [LegacyNullToEmptyString] CSSOMString cssFloat;
    [CEReactions] attribute CSSOMString cssText;
    readonly attribute unsigned long length;
    readonly attribute CSSRule? parentRule;

    CSSOMString getPropertyPriority(CSSOMString property);
    CSSOMString getPropertyValue(CSSOMString property);
    getter CSSOMString item(unsigned long index);
    [CEReactions] CSSOMString removeProperty(CSSOMString property);
    [CEReactions] undefined setProperty(CSSOMString property, [LegacyNullToEmptyString] CSSOMString value, optional [LegacyNullToEmptyString] CSSOMString priority = "");
};
