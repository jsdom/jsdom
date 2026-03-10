typedef (CanvasRenderingContext2D or WebGLRenderingContext) RenderingContext;

[Exposed=Window,
 HTMLConstructor]
interface HTMLCanvasElement : HTMLElement {
  [CEReactions, Reflect, ReflectDefault=300] attribute unsigned long width;
  [CEReactions, Reflect, ReflectDefault=150] attribute unsigned long height;

  RenderingContext? getContext(DOMString contextId, any... arguments);

  USVString toDataURL(optional DOMString type, optional any quality);
  undefined toBlob(BlobCallback _callback, optional DOMString type, optional any quality);
//  OffscreenCanvas transferControlToOffscreen();
};

callback BlobCallback = undefined (Blob? blob);
