interface HTMLVideoElement : HTMLMediaElement {
  [Reflect] attribute unsigned long width;
  [Reflect] attribute unsigned long height;
  readonly attribute unsigned long videoWidth;
  readonly attribute unsigned long videoHeight;
  attribute DOMString poster; // TODO could use URL reflection
};
