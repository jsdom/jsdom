
// https://drafts.css-houdini.org/css-properties-values-api-1/#csspropertyrule
[Exposed=Window]
interface CSSPropertyRule : CSSRule {
    readonly attribute boolean inherits;
    readonly attribute CSSOMString? initialValue;
    readonly attribute CSSOMString name;
    readonly attribute FrozenArray<CSSOMString> names;
    readonly attribute CSSOMString syntax;
};
