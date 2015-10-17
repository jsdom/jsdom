"use strict";
const jsdom = require("../..");

exports["should fire events properly"] = t => {
  t.expect(3);

  jsdom.env({
    html: "",
    done(err, window) {
      t.ifError(err);

      let first = true;
      window.addEventListener("click", () => {
        t.strictEqual(first, true, "events should be called FIFO");
        first = false;
      });
      window.addEventListener("click", () => {
        t.strictEqual(first, false, "events should be called FIFO");
        t.done();
      });

      const event = new window.Event("");
      event.initEvent("click", null, null);
      window.dispatchEvent(event);
    }
  });
};
