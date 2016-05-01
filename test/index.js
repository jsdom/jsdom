"use strict";

require("./jsdom/encoding.js");
require("./jsdom/env.js");
require("./jsdom/inside-worker-smoke-tests.js");
require("./jsdom/misc.js");
require("./jsdom/named-properties-tracker.js");
require("./jsdom/namespaces.js");
require("./jsdom/node-location.js");
require("./jsdom/parsing.js");
require("./jsdom/reconfigure-window.js");
require("./jsdom/resource-loading.js");
require("./jsdom/selectors.js");
require("./jsdom/serialization.js");
require("./jsdom/utils.js");
require("./jsdom/virtual-console.js");
require("./jsdom/xml.js");

require("./browser/css.js");

require("./web-platform-tests/to-upstream.js");
// keep this one last so that you can cancel the test run early
require("./web-platform-tests/index.js");
