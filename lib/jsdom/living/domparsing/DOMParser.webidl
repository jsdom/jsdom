[Constructor,
  Exposed=Window]
interface DOMParser {
  [NewObject] Document parseFromString(DOMString str, SupportedType type);
};

enum SupportedType {
    "text/html",
    "text/xml",
    "application/xml",
    "application/xhtml+xml",
    "image/svg+xml"
};
