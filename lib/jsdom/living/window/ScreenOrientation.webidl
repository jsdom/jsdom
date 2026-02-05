// https://w3c.github.io/screen-orientation/#screenorientation-interface
[Exposed=Window]
interface ScreenOrientation : EventTarget {
  Promise<undefined> lock(OrientationLockType orientation);
  undefined unlock();
  readonly attribute OrientationType type;
  readonly attribute unsigned short angle;
  attribute EventHandler onchange;
};

enum OrientationType {
  "portrait-primary",
  "portrait-secondary",
  "landscape-primary",
  "landscape-secondary"
};

enum OrientationLockType {
  "any",
  "natural",
  "landscape",
  "portrait",
  "portrait-primary",
  "portrait-secondary",
  "landscape-primary",
  "landscape-secondary"
};
