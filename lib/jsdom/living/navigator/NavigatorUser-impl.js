"use strict";

exports.implementation = class NavigatorUserImpl {
  get maxTouchPoints() {
    return 0;
  }
  get webdriver() {
    return false;
  }
};
