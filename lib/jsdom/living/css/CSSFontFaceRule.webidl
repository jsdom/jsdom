
// https://drafts.csswg.org/css-fonts-4/#cssfontfacerule
[Exposed=Window]
interface CSSFontFaceRule : CSSRule {
    [SameObject, PutForwards=cssText] readonly attribute CSSFontFaceDescriptors style;
};
