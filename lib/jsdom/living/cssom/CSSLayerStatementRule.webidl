// https://drafts.csswg.org/css-cascade-5/#the-csslayerstatementrule-interface
[Exposed=Window]
interface CSSLayerStatementRule : CSSRule {
  // TODO: use FrozenArray<CSSOMString> when webidl2js gets support for it.
  readonly attribute sequence<DOMString> nameList;
};
