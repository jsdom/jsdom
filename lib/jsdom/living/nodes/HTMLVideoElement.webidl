[Exposed=Window,
 HTMLConstructor]
interface HTMLVideoElement : HTMLMediaElement {
  [CEReactions, Reflect] attribute unsigned long width;
  [CEReactions, Reflect] attribute unsigned long height;
  readonly attribute unsigned long videoWidth;
  readonly attribute unsigned long videoHeight;
  [CEReactions] attribute USVString poster; // TODO could use URL reflection
  [CEReactions, Reflect] attribute boolean playsInline;
};
