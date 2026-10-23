
// https://drafts.csswg.org/cssom-1/#stylesheet
[Exposed=Window]
interface StyleSheet {
    attribute boolean disabled;
    readonly attribute USVString? href;
    [SameObject, PutForwards=mediaText] readonly attribute MediaList media;
    readonly attribute (Element or ProcessingInstruction)? ownerNode;
    readonly attribute CSSStyleSheet? parentStyleSheet;
    readonly attribute DOMString? title;
    readonly attribute CSSOMString type;
};
