// https://drafts.csswg.org/css-fonts-4/#om-fontface
[Exposed=Window]
interface CSSFontFaceRule : CSSRule {
  // TODO: use `CSSFontFaceDescriptors` instead of `CSSStyleDeclaration` here,
  // per https://drafts.csswg.org/css-fonts-4/#cssfontfacedescriptors.
  [SameObject, PutForwards=cssText] readonly attribute CSSStyleDeclaration style;
};
