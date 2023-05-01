[Exposed=(Window,Worker)]
interface MessageChannel {
  constructor();

  readonly attribute MessagePort port1;
  readonly attribute MessagePort port2;
};
