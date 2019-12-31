// https://w3c.github.io/DOM-Parsing/#the-domparser-interface
[Exposed=Window]
interface DOMParser {
  constructor();
  [NewObject] Document parseFromString(DOMString str, SupportedType type);
};

enum SupportedType {
  "text/html",
  "text/xml",
  "application/xml",
  "application/xhtml+xml",
  "image/svg+xml"
};
