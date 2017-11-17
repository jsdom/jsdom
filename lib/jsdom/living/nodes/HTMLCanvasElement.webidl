typedef (CanvasRenderingContext2D or WebGLRenderingContext) RenderingContext;

[Exposed=Window,
 HTMLConstructor]
interface HTMLCanvasElement : HTMLElement {
  [CEReactions] attribute unsigned long width;
  [CEReactions] attribute unsigned long height;

  RenderingContext? getContext(DOMString contextId, any... arguments);

  USVString toDataURL(optional DOMString type, optional any quality);
  void toBlob(BlobCallback _callback, optional DOMString type, optional any quality);
//  OffscreenCanvas transferControlToOffscreen();
};

callback BlobCallback = void (Blob? blob);
