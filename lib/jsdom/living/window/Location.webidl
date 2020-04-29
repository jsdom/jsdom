// https://html.spec.whatwg.org/multipage/history.html#location
[Exposed=Window]
interface Location { // but see also additional creation steps and overridden internal methods
  [LegacyUnforgeable] stringifier attribute USVString href;
  [LegacyUnforgeable] readonly attribute USVString origin;
  [LegacyUnforgeable] attribute USVString protocol;
  [LegacyUnforgeable] attribute USVString host;
  [LegacyUnforgeable] attribute USVString hostname;
  [LegacyUnforgeable] attribute USVString port;
  [LegacyUnforgeable] attribute USVString pathname;
  [LegacyUnforgeable] attribute USVString search;
  [LegacyUnforgeable] attribute USVString hash;

  [LegacyUnforgeable] void assign(USVString url);
  [LegacyUnforgeable] void replace(USVString url);
  [LegacyUnforgeable] void reload();

//  [LegacyUnforgeable, SameObject] readonly attribute DOMStringList ancestorOrigins;
};
