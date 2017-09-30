[Constructor(DOMString typeArg, optional KeyboardEventInit keyboardEventInitDict)]
interface KeyboardEvent : UIEvent {
    // KeyLocationCode
    const unsigned long DOM_KEY_LOCATION_STANDARD = 0x00;
    const unsigned long DOM_KEY_LOCATION_LEFT = 0x01;
    const unsigned long DOM_KEY_LOCATION_RIGHT = 0x02;
    const unsigned long DOM_KEY_LOCATION_NUMPAD = 0x03;
    readonly    attribute DOMString     key;
    readonly    attribute DOMString     code;
    readonly    attribute unsigned long location;
    readonly    attribute boolean       ctrlKey;
    readonly    attribute boolean       shiftKey;
    readonly    attribute boolean       altKey;
    readonly    attribute boolean       metaKey;
    readonly    attribute boolean       repeat;
    readonly    attribute boolean       isComposing;
    boolean getModifierState (DOMString keyArg);
};

dictionary KeyboardEventInit : EventModifierInit {
             DOMString     key = "";
             DOMString     code = "";
             unsigned long location = 0;
             boolean       repeat = false;
             boolean       isComposing = false;
};

partial interface KeyboardEvent {
    // Originally introduced (and deprecated) in this specification
    void initKeyboardEvent (DOMString typeArg, boolean bubblesArg, boolean cancelableArg, Window? viewArg, DOMString keyArg, unsigned long locationArg, DOMString modifiersListArg, boolean repeat, DOMString locale);
};

partial interface KeyboardEvent {
    // The following support legacy user agents
    readonly    attribute unsigned long charCode;
    readonly    attribute unsigned long keyCode;
    readonly    attribute unsigned long which;
};

partial dictionary KeyboardEventInit {
             unsigned long charCode = 0;
             unsigned long keyCode = 0;
             unsigned long which = 0;
};
