"use strict";
const jsdom = require("../..");

exports["should not give CSS parsing errors upon encountering @-moz-document (GH-687)"] = t => {
  const css = ".x @-moz-document url-prefix() { .y { color: blue; } }";
  const html = `<!DOCTYPE html><html><head><style>${css}</style></head><body><p>Hi</p></body></html>`;

  jsdom.env({
    html,
    done(err) {
      t.strictEqual(err, null);
      t.done();
    }
  });
};
