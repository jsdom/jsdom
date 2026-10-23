
// https://drafts.csswg.org/css-cascade-5/#csslayerstatementrule
[Exposed=Window]
interface CSSLayerStatementRule : CSSRule {
    readonly attribute FrozenArray<CSSOMString> nameList;
};
