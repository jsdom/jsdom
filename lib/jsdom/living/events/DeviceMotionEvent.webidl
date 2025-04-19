// https://w3c.github.io/deviceorientation/#devicemotion
[Exposed=Window, SecureContext]
interface DeviceMotionEvent : Event {
  constructor(DOMString type, optional DeviceMotionEventInit eventInitDict = {});
  readonly attribute DeviceMotionEventAcceleration? acceleration;
  readonly attribute DeviceMotionEventAcceleration? accelerationIncludingGravity;
  readonly attribute DeviceMotionEventRotationRate? rotationRate;
  readonly attribute double interval;

  // static Promise<PermissionState> requestPermission(); // Not implemented
};

dictionary DeviceMotionEventAccelerationInit {
  double? x = null;
  double? y = null;
  double? z = null;
};

dictionary DeviceMotionEventRotationRateInit {
  double? alpha = null;
  double? beta = null;
  double? gamma = null;
};

dictionary DeviceMotionEventInit : EventInit {
  DeviceMotionEventAccelerationInit acceleration;
  DeviceMotionEventAccelerationInit accelerationIncludingGravity;
  DeviceMotionEventRotationRateInit rotationRate;
  double interval = 0;
};
