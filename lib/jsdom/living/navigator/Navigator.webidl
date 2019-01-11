[Exposed=Window]
interface Navigator {
  // objects implementing this interface also implement the interfaces given below
};
Navigator implements NavigatorID;
Navigator implements NavigatorLanguage;
Navigator implements NavigatorOnLine;
// Navigator implements NavigatorContentUtils;
Navigator implements NavigatorCookies;
Navigator implements NavigatorPlugins;
Navigator implements NavigatorConcurrentHardware;

[NoInterfaceObject, Exposed=(Window,Worker)]
interface NavigatorID {
  readonly attribute DOMString appCodeName; // constant "Mozilla"
  readonly attribute DOMString appName; // constant "Netscape"
  readonly attribute DOMString appVersion;
  readonly attribute DOMString platform;
  readonly attribute DOMString product; // constant "Gecko"
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

[Exposed=Window,
 NoInterfaceObject]
interface NavigatorCookies {
  readonly attribute boolean cookieEnabled;
};

[Exposed=Window,
 NoInterfaceObject]
interface NavigatorPlugins {
  [SameObject] readonly attribute PluginArray plugins;
  [SameObject] readonly attribute MimeTypeArray mimeTypes;
  boolean javaEnabled();
};

[Exposed=Window,
 LegacyUnenumerableNamedProperties]
interface PluginArray {
  void refresh(optional boolean reload = false);
  readonly attribute unsigned long length;
  [WebIDL2JSValueAsUnsupported=null] getter Plugin? item(unsigned long index);
  [WebIDL2JSValueAsUnsupported=null] getter Plugin? namedItem(DOMString name);
};

[Exposed=Window,
 LegacyUnenumerableNamedProperties]
interface MimeTypeArray {
  readonly attribute unsigned long length;
  [WebIDL2JSValueAsUnsupported=null] getter MimeType? item(unsigned long index);
  [WebIDL2JSValueAsUnsupported=null] getter MimeType? namedItem(DOMString name);
};

[Exposed=Window,
 LegacyUnenumerableNamedProperties]
interface Plugin {
  readonly attribute DOMString name;
  readonly attribute DOMString description;
  readonly attribute DOMString filename;
  readonly attribute unsigned long length;
  [WebIDL2JSValueAsUnsupported=null] getter MimeType? item(unsigned long index);
  [WebIDL2JSValueAsUnsupported=null] getter MimeType? namedItem(DOMString name);
};

[Exposed=Window]
interface MimeType {
  readonly attribute DOMString type;
  readonly attribute DOMString description;
  readonly attribute DOMString suffixes; // comma-separated
  readonly attribute Plugin enabledPlugin;
};

[NoInterfaceObject, Exposed=(Window,Worker)]
interface NavigatorConcurrentHardware {
  readonly attribute unsigned long long hardwareConcurrency;
};
