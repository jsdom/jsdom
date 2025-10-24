// https://html.spec.whatwg.org/multipage/history.html#location
[Exposed=Window]
interface Location { // but see also additional creation steps and overridden internal methods
  stringifier attribute USVString href;
  readonly attribute USVString origin;
  attribute USVString protocol;
  attribute USVString host;
  attribute USVString hostname;
  attribute USVString port;
  attribute USVString pathname;
  attribute USVString search;
  attribute USVString hash;

  undefined assign(USVString url);
  undefined replace(USVString url);
  undefined reload();

//  [LegacyUnforgeable, SameObject] readonly attribute DOMStringList ancestorOrigins;
};
