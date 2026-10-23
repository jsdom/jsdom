
// https://drafts.csswg.org/cssom-1/#cssrulelist
[Exposed=Window]
interface CSSRuleList {
    readonly attribute unsigned long length;
    getter CSSRule? item(unsigned long index);
};
