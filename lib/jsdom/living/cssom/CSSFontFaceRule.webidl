// https://drafts.csswg.org/css-fonts-4/#om-fontface
[Exposed=Window]
interface CSSFontFaceRule : CSSRule {
  // TODO: change to `[SameObject, PutForwards=cssText] readonly attribute CSSStyleDeclaration style;`
  // when `CSSStyleDeclaration` is converted to webidl2js.
  // TODO: use `CSSFontFaceDescriptors` instead of `CSSStyleDeclaration` here.
  [SameObject] attribute any style;
};
