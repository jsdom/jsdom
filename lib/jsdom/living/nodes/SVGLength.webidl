// https://dxr.mozilla.org/mozilla-beta/source/dom/webidl/SVGLength.webidl

[NoInterfaceObject]
interface SVGLength {
  // Length Unit Types
  const unsigned short SVG_LENGTHTYPE_UNKNOWN = 0;
  const unsigned short SVG_LENGTHTYPE_NUMBER = 1;
  const unsigned short SVG_LENGTHTYPE_PERCENTAGE = 2;
  const unsigned short SVG_LENGTHTYPE_EMS = 3;
  const unsigned short SVG_LENGTHTYPE_EXS = 4;
  const unsigned short SVG_LENGTHTYPE_PX = 5;
  const unsigned short SVG_LENGTHTYPE_CM = 6;
  const unsigned short SVG_LENGTHTYPE_MM = 7;
  const unsigned short SVG_LENGTHTYPE_IN = 8;
  const unsigned short SVG_LENGTHTYPE_PT = 9;
  const unsigned short SVG_LENGTHTYPE_PC = 10;

  readonly attribute unsigned short unitType;
  [Throws]
           attribute float value;
  [SetterThrows]
           attribute float valueInSpecifiedUnits;
  [SetterThrows]
           attribute DOMString valueAsString;

  [Throws]
  void newValueSpecifiedUnits(unsigned short unitType, float valueInSpecifiedUnits);
  [Throws]
  void convertToSpecifiedUnits(unsigned short unitType);
};
