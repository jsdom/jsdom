
// https://drafts.csswg.org/css-fonts-4/#cssfontfeaturevaluesrule
[Exposed=Window]
interface CSSFontFeatureValuesRule : CSSRule {
    // CSSFontFeatureValuesMap requires maplike support in webidl2js.
    // readonly attribute CSSFontFeatureValuesMap annotation;
    // readonly attribute CSSFontFeatureValuesMap characterVariant;
    attribute CSSOMString fontFamily;
    // readonly attribute CSSFontFeatureValuesMap historicalForms;
    // readonly attribute CSSFontFeatureValuesMap ornaments;
    // readonly attribute CSSFontFeatureValuesMap styleset;
    // readonly attribute CSSFontFeatureValuesMap stylistic;
    // readonly attribute CSSFontFeatureValuesMap swash;
};
