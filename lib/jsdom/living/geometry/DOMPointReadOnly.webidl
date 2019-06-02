// https://www.w3.org/TR/geometry-1/#dompointreadonly

[Constructor(optional unrestricted double x = 0, optional unrestricted double y = 0,
             optional unrestricted double z = 0, optional unrestricted double w = 1),
 Exposed=(Window,Worker),
 Serializable]
interface DOMPointReadOnly {
    [NewObject] static DOMPointReadOnly fromPoint(optional DOMPointInit other);

    readonly attribute unrestricted double x;
    readonly attribute unrestricted double y;
    readonly attribute unrestricted double z;
    readonly attribute unrestricted double w;

    DOMPoint matrixTransform(optional DOMMatrixInit matrix);

    [Default] object toJSON();
};
