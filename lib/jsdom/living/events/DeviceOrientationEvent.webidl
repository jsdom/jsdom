// https://w3c.github.io/deviceorientation/#deviceorientation
[Exposed=Window, SecureContext]
interface DeviceOrientationEvent : Event {
  constructor(DOMString type, optional DeviceOrientationEventInit eventInitDict = {});
  readonly attribute double? alpha;
  readonly attribute double? beta;
  readonly attribute double? gamma;
  readonly attribute boolean absolute;

  // static Promise<PermissionState> requestPermission(); // Not implemented
};

dictionary DeviceOrientationEventInit : EventInit {
  double? alpha = null;
  double? beta = null;
  double? gamma = null;
  boolean absolute = false;
};
