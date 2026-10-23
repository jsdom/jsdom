
// https://drafts.csswg.org/cssom-1/#cssimportrule
[Exposed=Window]
interface CSSImportRule : CSSRule {
    readonly attribute USVString href;
    readonly attribute CSSOMString? layerName;
    [SameObject, PutForwards=mediaText] readonly attribute MediaList media;
    [SameObject] readonly attribute CSSStyleSheet? styleSheet;
    readonly attribute CSSOMString? supportsText;
};
