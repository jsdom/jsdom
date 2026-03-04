// https://drafts.csswg.org/css-cascade-5/#the-csslayerstatementrule-interface
[Exposed=Window]
interface CSSLayerStatementRule : CSSRule {
  // Spec says FrozenArray<CSSOMString> but webidl2js doesn't support FrozenArray,
  // so we use sequence<DOMString> instead.
  readonly attribute sequence<DOMString> nameList;
};
