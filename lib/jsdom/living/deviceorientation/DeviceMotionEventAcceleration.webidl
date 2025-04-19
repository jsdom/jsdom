// https://w3c.github.io/deviceorientation/#devicemotion
[Exposed=Window, SecureContext]
interface DeviceMotionEventAcceleration {
  readonly attribute double? x;
  readonly attribute double? y;
  readonly attribute double? z;
};
