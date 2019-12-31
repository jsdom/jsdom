// https://w3c.github.io/FileAPI/#APIASynch
[Exposed=(Window,Worker)]
interface FileReader: EventTarget {
  constructor();
  // async read methods
  void readAsArrayBuffer(Blob blob);
  void readAsBinaryString(Blob blob);
  void readAsText(Blob blob, optional DOMString label);
  void readAsDataURL(Blob blob);

  void abort();

  // states
  const unsigned short EMPTY = 0;
  const unsigned short LOADING = 1;
  const unsigned short DONE = 2;


  readonly attribute unsigned short readyState;

  // File or Blob data
  readonly attribute (DOMString or ArrayBuffer)? result;

  readonly attribute DOMException? error;

  // event handler content attributes
  attribute EventHandler onloadstart;
  attribute EventHandler onprogress;
  attribute EventHandler onload;
  attribute EventHandler onabort;
  attribute EventHandler onerror;
  attribute EventHandler onloadend;

};
