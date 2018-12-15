[Exposed=Window,
 HTMLConstructor]
interface HTMLProgressElement : HTMLElement {
  [CEReactions] attribute double value;
  [CEReactions] attribute double max;
  readonly attribute double position;
  readonly attribute NodeList labels;
};
