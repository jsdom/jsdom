
// https://drafts.csswg.org/cssom-1/#cssrule
// https://drafts.csswg.org/css-animations-1/#interface-cssrule-idl
// https://drafts.csswg.org/css-conditional-3/#extensions-to-cssrule-interface
// https://drafts.csswg.org/css-counter-styles-3/#extensions-to-cssrule-interface
// https://drafts.csswg.org/css-fonts-4/#om-fontfeaturevalues
[Exposed=Window]
interface CSSRule {
    const unsigned short STYLE_RULE = 1;
    const unsigned short CHARSET_RULE = 2;
    const unsigned short IMPORT_RULE = 3;
    const unsigned short MEDIA_RULE = 4;
    const unsigned short FONT_FACE_RULE = 5;
    const unsigned short PAGE_RULE = 6;
    const unsigned short KEYFRAMES_RULE = 7;
    const unsigned short KEYFRAME_RULE = 8;
    const unsigned short MARGIN_RULE = 9;
    const unsigned short NAMESPACE_RULE = 10;
    const unsigned short COUNTER_STYLE_RULE = 11;
    const unsigned short SUPPORTS_RULE = 12;
    const unsigned short FONT_FEATURE_VALUES_RULE = 14;
    attribute CSSOMString cssText;
    readonly attribute CSSRule? parentRule;
    readonly attribute CSSStyleSheet? parentStyleSheet;
    readonly attribute unsigned short type;
};
