[Constructor(optional sequence<BlobPart> blobParts, optional BlobPropertyBag options),
Exposed=(Window,Worker)]
interface Blob {

  readonly attribute unsigned long long size;
  readonly attribute DOMString type;

  // slice Blob into byte-ranged chunks
  Blob slice([Clamp] optional long long start,
            [Clamp] optional long long end,
            optional DOMString contentType);
};

dictionary BlobPropertyBag {
  DOMString type = "";
};

typedef (BufferSource or Blob or USVString) BlobPart;
