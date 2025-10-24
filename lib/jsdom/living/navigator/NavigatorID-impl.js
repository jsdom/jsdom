"use strict";

exports.implementation = class NavigatorIDImpl {
  get appCodeName() {
    return "Mozilla";
  }

  get appName() {
    return "Netscape";
  }

  get appVersion() {
    return "5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/121.0.0.0 Safari/537.36";
  }

  get platform() {
    return "MacIntel";
  }

  get product() {
    return "Gecko";
  }

  get productSub() {
    return "20030107";
  }

  // see Navigator constructor for userAgent

  get vendor() {
    return "Google Inc.";
  }

  get vendorSub() {
    return "";
  }
};
