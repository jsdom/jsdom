[Exposed=(Window,Worker)]
interface Performance : EventTarget {
    DOMHighResTimeStamp now();
    readonly attribute DOMHighResTimeStamp timeOrigin;
    [Default] object              toJSON();
};
