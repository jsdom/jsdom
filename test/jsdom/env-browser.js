/* global location */

"use strict";

// This suite tests env() within a WebWorker

const env = require("../..").env;
const testServerLocation = location.origin; // WorkerLocation

exports["should be able to fetch a html document"] = t => {
  env({
    url: testServerLocation + "/test/jsdom/files/reddit.html",
    done(err, window) {
      t.ifError(err);
      t.strictEqual(window.document.getElementById("header-bottom-left").nodeName, "DIV");
      t.done();
    }
  });
};
