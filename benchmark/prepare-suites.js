"use strict";

module.exports = function prepareSuites(path, obj) {
  // set a default suite name
  if (typeof obj.run === "function") {
    // a single suite
    if (!obj.name) {
      obj.name = path;
    }
    return;
  }

  for (const name of Object.keys(obj)) {
    const currentPath = (path ? path + "/" : "") + name;
    // If an entry in a manifest file (e.g. dom/index.js) is a function,
    // assume that function will generate the suite (or another manifest)
    if (typeof obj[name] === "function") {
      obj[name] = obj[name](currentPath);
    }

    module.exports(currentPath, obj[name]);
  }
};
