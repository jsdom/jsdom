[Exposed=Window, LegacyUnenumerableNamedProperties]
interface HTMLCollection {
  readonly attribute unsigned long length;
  [WebIDL2JSValueAsUnsupported=null] getter Element? item(unsigned long index);
  [WebIDL2JSValueAsUnsupported=null] getter Element? namedItem(DOMString name);
};
