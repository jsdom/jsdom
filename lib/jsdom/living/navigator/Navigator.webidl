// https://html.spec.whatwg.org/#navigator
[Exposed=Window]
interface Navigator {
  // objects implementing this interface also implement the interfaces given below
};
Navigator includes NavigatorID;
Navigator includes NavigatorLanguage;
Navigator includes NavigatorOnLine;
// Navigator includes NavigatorContentUtils;
Navigator includes NavigatorCookies;
Navigator includes NavigatorPlugins;
Navigator includes NavigatorConcurrentHardware;

// https://html.spec.whatwg.org/#navigatorid
interface mixin NavigatorID {
  readonly attribute DOMString appCodeName; // constant "Mozilla"
  readonly attribute DOMString appName; // constant "Netscape"
  readonly attribute DOMString appVersion;
  readonly attribute DOMString platform;
  readonly attribute DOMString product; // constant "Gecko"
  [Exposed=Window] readonly attribute DOMString productSub;
  readonly attribute DOMString userAgent;
  [Exposed=Window] readonly attribute DOMString vendor;
  [Exposed=Window] readonly attribute DOMString vendorSub; // constant ""
};

// https://html.spec.whatwg.org/#navigatorlanguage
interface mixin NavigatorLanguage {
  readonly attribute DOMString language;
  readonly attribute FrozenArray<DOMString> languages;
};

// https://html.spec.whatwg.org/#navigatoronline
interface mixin NavigatorOnLine {
  readonly attribute boolean onLine;
};

// https://html.spec.whatwg.org/#navigatorcookies
interface mixin NavigatorCookies {
  readonly attribute boolean cookieEnabled;
};

interface mixin NavigatorPlugins {
  [SameObject] readonly attribute PluginArray plugins;
  [SameObject] readonly attribute MimeTypeArray mimeTypes;
  boolean javaEnabled();
};

[Exposed=Window]
interface PluginArray {
  undefined refresh();
  readonly attribute unsigned long length;
  [WebIDL2JSValueAsUnsupported=_null] getter object? item(unsigned long index);
  object? namedItem(DOMString name);
};

[Exposed=Window]
interface MimeTypeArray {
  readonly attribute unsigned long length;
  [WebIDL2JSValueAsUnsupported=_null] getter object? item(unsigned long index);
  object? namedItem(DOMString name);
};

[Exposed=Window]
interface Plugin {
  readonly attribute undefined name;
  readonly attribute undefined description;
  readonly attribute undefined filename;
  readonly attribute undefined length;
  getter undefined item(unsigned long index);
  undefined namedItem(DOMString name);
};

[Exposed=Window]
interface MimeType {
  readonly attribute undefined type;
  readonly attribute undefined description;
  readonly attribute undefined suffixes;
  readonly attribute undefined enabledPlugin;
};

// https://html.spec.whatwg.org/#navigatorconcurrenthardware
interface mixin NavigatorConcurrentHardware {
  readonly attribute unsigned long long hardwareConcurrency;
};
