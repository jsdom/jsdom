[Exposed=Window,
 HTMLConstructor]
interface HTMLTrackElement : HTMLElement {
  [CEReactions, Reflect] attribute DOMString kind; // TODO limited to only known values
  [CEReactions] attribute USVString src; // TODO could use URL reflection
  [CEReactions, Reflect] attribute DOMString srclang;
  [CEReactions, Reflect] attribute DOMString label;
  [CEReactions, Reflect] attribute boolean default;

  const unsigned short NONE = 0;
  const unsigned short LOADING = 1;
  const unsigned short LOADED = 2;
  const unsigned short ERROR = 3;
  readonly attribute unsigned short readyState;

//  readonly attribute TextTrack track;
};
