// https://www.w3.org/TR/geometry-1/#dompoint

[Constructor(optional unrestricted double x = 0, optional unrestricted double y = 0,
             optional unrestricted double z = 0, optional unrestricted double w = 1),
 Exposed=(Window,Worker),
 Serializable,
 LegacyWindowAlias=SVGPoint]
interface DOMPoint : DOMPointReadOnly {
    [NewObject] static DOMPoint fromPoint(optional DOMPointInit other);

    inherit attribute unrestricted double x;
    inherit attribute unrestricted double y;
    inherit attribute unrestricted double z;
    inherit attribute unrestricted double w;
};

dictionary DOMPointInit {
    unrestricted double x = 0;
    unrestricted double y = 0;
    unrestricted double z = 0;
    unrestricted double w = 1;
};
