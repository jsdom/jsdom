// https://drafts.csswg.org/cssom/#the-cssrule-interface
[Exposed=Window]
interface CSSRule {
  attribute CSSOMString cssText;
  readonly attribute CSSRule? parentRule;
  readonly attribute CSSStyleSheet? parentStyleSheet;

  // the following attribute and constants are historical
  readonly attribute unsigned short type;
  const unsigned short STYLE_RULE = 1;
  const unsigned short CHARSET_RULE = 2;
  const unsigned short IMPORT_RULE = 3;
  const unsigned short MEDIA_RULE = 4;
  const unsigned short FONT_FACE_RULE = 5;
  const unsigned short PAGE_RULE = 6;
  const unsigned short MARGIN_RULE = 9;
  const unsigned short NAMESPACE_RULE = 10;
};

// https://drafts.csswg.org/css-animations-1/#interface-cssrule-idl
partial interface CSSRule {
  const unsigned short KEYFRAMES_RULE = 7;
  const unsigned short KEYFRAME_RULE = 8;
};

// https://drafts.csswg.org/css-counter-styles-3/#extensions-to-cssrule-interface
partial interface CSSRule {
  const unsigned short COUNTER_STYLE_RULE = 11;
};

// https://drafts.csswg.org/css-conditional-3/#extensions-to-cssrule-interface
partial interface CSSRule {
  const unsigned short SUPPORTS_RULE = 12;
};

// https://drafts.csswg.org/css-fonts-4/#om-fontfeaturevalues
partial interface CSSRule {
  const unsigned short FONT_FEATURE_VALUES_RULE = 14;
};
