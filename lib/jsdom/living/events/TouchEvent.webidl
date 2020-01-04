// https://w3c.github.io/touch-events/#touchevent-interface
dictionary TouchEventInit : EventModifierInit {
    sequence<Touch> touches = [];
    sequence<Touch> targetTouches = [];
    sequence<Touch> changedTouches = [];
};

[Exposed=Window]
interface TouchEvent : UIEvent {
    constructor(DOMString type, optional TouchEventInit eventInitDict = {});
    readonly attribute TouchList touches;
    readonly attribute TouchList targetTouches;
    readonly attribute TouchList changedTouches;
    readonly attribute boolean   altKey;
    readonly attribute boolean   metaKey;
    readonly attribute boolean   ctrlKey;
    readonly attribute boolean   shiftKey;
};
