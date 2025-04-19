// https://w3c.github.io/deviceorientation/#devicemotion
[Exposed=Window, SecureContext]
interface DeviceMotionEventRotationRate {
  readonly attribute double? alpha;
  readonly attribute double? beta;
  readonly attribute double? gamma;
};
