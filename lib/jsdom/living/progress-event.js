"use strict";

module.exports = function (core) {
  class ProgressEvent extends core.Event {
    constructor(eventType, eventInit) {
      super(eventType);
      if (eventInit) {
        this.lengthComputable = Boolean(eventInit.lengthComputable);
        this.loaded = Number(eventInit.loaded) || 0;
        this.total = Number(eventInit.total) || 0;
      } else {
        this.lengthComputable = false;
        this.loaded = 0;
        this.total = 0;
      }
    }
    initProgressEvent(type, bubbles, cancelable, lengthComputable, loaded, total) {
      this.initEvent(type, bubbles, cancelable);
      this.lengthComputable = lengthComputable;
      this.loaded = loaded;
      this.total = total;
    }
  }

  core.ProgressEvent = ProgressEvent;
};
