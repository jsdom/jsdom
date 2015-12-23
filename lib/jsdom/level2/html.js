"use strict";
const core = require("../level1/core");

// Setup the javascript language processor
core.languageProcessors = {
  javascript: require("./languages/javascript").javascript
};

require("../living/register-wrappers")(core);
core.HTMLDocument = require("../living/generated/Document").interface;
