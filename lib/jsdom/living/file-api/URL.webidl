// The base URL interface is supplied by whatwg-url. These generated static methods are installed on that interface.
// https://w3c.github.io/FileAPI/#creating-revoking
[Exposed=Window]
interface URL {
  [WebIDL2JSCallWithGlobal] static DOMString createObjectURL(Blob obj);
  [WebIDL2JSCallWithGlobal] static undefined revokeObjectURL(DOMString url);
};
