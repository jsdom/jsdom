
// https://drafts.csswg.org/css-mixins-1/#cssfunctiondeclarations
[Exposed=Window]
interface CSSFunctionDeclarations : CSSRule {
    [SameObject, PutForwards=cssText] readonly attribute CSSFunctionDescriptors style;
};
