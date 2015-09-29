"use strict";
const jsdom = require("../..");

exports["<script> loading errors show up as jsdomErrors in the virtual console"] = t => {
  t.expect(3);

  const virtualConsole = jsdom.createVirtualConsole();
  virtualConsole.on("jsdomError", error => {
    t.ok(error instanceof Error);
    t.equal(error.message, `Could not load script: "http://localhost:12345/script.js"`);
    t.ok(error.detail);

    t.done();
  });

  const doc = jsdom.jsdom(undefined, { virtualConsole });
  const el = doc.createElement("script");
  el.src = "http://localhost:12345/script.js";

  doc.body.appendChild(el);
};

exports["<link rel=\"stylesheet\"> loading errors show up as jsdomErrors in the virtual console"] = t => {
  t.expect(3);

  const virtualConsole = jsdom.createVirtualConsole();
  virtualConsole.on("jsdomError", error => {
    t.ok(error instanceof Error);
    t.equal(error.message, `Could not load link: "http://localhost:12345/style.css"`);
    t.ok(error.detail);

    t.done();
  });

  const doc = jsdom.jsdom(undefined, { virtualConsole, features: { FetchExternalResources: ["link"] } });
  const el = doc.createElement("link");
  el.rel = "stylesheet";
  el.href = "http://localhost:12345/style.css";

  doc.head.appendChild(el);
};

exports["<iframe> loading errors show up as jsdomErrors in the virtual console"] = t => {
  t.expect(3);

  const virtualConsole = jsdom.createVirtualConsole();
  virtualConsole.on("jsdomError", error => {
    t.ok(error instanceof Error);
    t.equal(error.message, `Could not load iframe: "http://localhost:12345/foo.html"`);
    t.ok(error.detail);

    t.done();
  });

  jsdom.jsdom(`<iframe src="http://localhost:12345/foo.html"></iframe>`,
    { virtualConsole, features: { FetchExternalResources: ["iframe"] } });
};

exports["<frame> loading errors show up as jsdomErrors in the virtual console"] = t => {
  t.expect(3);

  const virtualConsole = jsdom.createVirtualConsole();
  virtualConsole.on("jsdomError", error => {
    t.ok(error instanceof Error);
    t.equal(error.message, `Could not load frame: "http://localhost:12345/foo.html"`);
    t.ok(error.detail);

    t.done();
  });

  jsdom.jsdom(`<frameset><frame src="http://localhost:12345/foo.html"></frameset>`,
    { virtualConsole, features: { FetchExternalResources: ["frame"] } });
};
