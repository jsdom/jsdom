interface HTMLCanvasElement : HTMLElement {
  attribute unsigned long width;
  attribute unsigned long height;

  RenderingContext? getContext(DOMString contextId, any... arguments);
  boolean probablySupportsContext(DOMString contextId, any... arguments);

  void setContext(RenderingContext context);
//  CanvasProxy transferControlToProxy();

  DOMString toDataURL(optional DOMString type, any... arguments);
  void toBlob(BlobCallback _callback, optional DOMString type, any... arguments);
};
