interface Navigator {
  // objects implementing this interface also implement the interfaces given below
};
Navigator implements NavigatorID;
Navigator implements NavigatorLanguage;
Navigator implements NavigatorOnLine;
//Navigator implements NavigatorContentUtils;
Navigator implements NavigatorCookies;
Navigator implements NavigatorPlugins;
Navigator implements NavigatorConcurrentHardware;

[NoInterfaceObject, Exposed=(Window,Worker)]
interface NavigatorID {
  [Exposed=Window] readonly attribute DOMString appCodeName; // constant "Mozilla"
  readonly attribute DOMString appName; // constant "Netscape"
  readonly attribute DOMString appVersion;
  readonly attribute DOMString platform;
  [Exposed=Window] readonly attribute DOMString product; // constant "Gecko"
  [Exposed=Window] readonly attribute DOMString productSub;
  readonly attribute DOMString userAgent;
  [Exposed=Window] readonly attribute DOMString vendor;
  [Exposed=Window] readonly attribute DOMString vendorSub; // constant ""

  // also has additional members in a partial interface
};

[NoInterfaceObject, Exposed=(Window,Worker)]
interface NavigatorLanguage {
  readonly attribute DOMString language;
  readonly attribute FrozenArray<DOMString> languages;
};

[NoInterfaceObject, Exposed=(Window,Worker)]
interface NavigatorOnLine {
  readonly attribute boolean onLine;
};

[NoInterfaceObject]
interface NavigatorCookies {
  readonly attribute boolean cookieEnabled;
};

[NoInterfaceObject]
interface NavigatorCookies {
  readonly attribute boolean cookieEnabled;
};

[NoInterfaceObject]
interface NavigatorPlugins {
//  [SameObject] readonly attribute PluginArray plugins;
//  [SameObject] readonly attribute MimeTypeArray mimeTypes;
  boolean javaEnabled();
};

[NoInterfaceObject, Exposed=(Window,Worker)]
interface NavigatorConcurrentHardware {
  readonly attribute unsigned long long hardwareConcurrency;
};
