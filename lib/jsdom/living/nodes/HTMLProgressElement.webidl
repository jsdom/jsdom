[Exposed=Window,
 HTMLConstructor]
interface HTMLProgressElement : HTMLElement {
  [CEReactions] attribute double value;
  [CEReactions, ReflectPositive, ReflectDefault=1.0] attribute double max;
  readonly attribute double position;
  readonly attribute NodeList labels;
};
