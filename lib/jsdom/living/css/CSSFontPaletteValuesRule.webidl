
// https://drafts.csswg.org/css-fonts-4/#cssfontpalettevaluesrule
[Exposed=Window]
interface CSSFontPaletteValuesRule : CSSRule {
    readonly attribute CSSOMString basePalette;
    readonly attribute CSSOMString fontFamily;
    readonly attribute CSSOMString name;
    readonly attribute CSSOMString overrideColors;
};
