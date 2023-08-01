interface mixin InnerText {
  [CEReactions] attribute [LegacyNullToEmptyString] DOMString innerText;
};

HTMLElement includes InnerText;
