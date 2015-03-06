"use strict";

var jsdom = require("../..").jsdom;

exports["should fire events properly"] = function (t) {
  t.expect(2);

  jsdom.env({
    html: "",
    done: function (errors, window) {
      var first = true;
      window.addEventListener("click", function () {
        t.strictEqual(first, true, "events should be called FIFO");
        first = false;
      });
      window.addEventListener("click", function () {
        t.strictEqual(first, false, "events should be called FIFO");
        t.done();
      });

      var event = new window.Event();
      event.initEvent("click", null, null);
      window.dispatchEvent(event);
    }
  });
};
