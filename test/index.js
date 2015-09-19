"use strict";
// For: Mocha
// This includes all tests that are run using Mocha, including web-platform-tests.
// Whether a test runs in Node, the browser, or both is determined using annotations inside each test.

require("./api/basics.js");
require("./api/encoding.js");
require("./api/fragment.js");
require("./api/from-file.js");
require("./api/from-url.js");
require("./api/methods.js");
require("./api/options.js");
require("./api/virtual-console.js");

require("./old-api/cancel-requests.js");
require("./old-api/cookie.js");
require("./old-api/env.js");
require("./old-api/inside-worker-smoke-tests.js");
require("./old-api/keep-alive-connections.js");
require("./old-api/named-properties-tracker.js");
require("./old-api/resource-loading.js");
require("./old-api/utils.js");

require("./to-port-to-wpts/css.js");
require("./to-port-to-wpts/jsonp.js");
require("./to-port-to-wpts/misc.js");
require("./to-port-to-wpts/misc2.js");
require("./to-port-to-wpts/namespaces.js");
require("./to-port-to-wpts/parsing.js");
require("./to-port-to-wpts/selectors.js");
require("./to-port-to-wpts/serialization.js");
require("./to-port-to-wpts/xml.js");

require("./to-port-to-wpts/level1/core.js");
require("./to-port-to-wpts/level1/html.js");

require("./web-platform-tests/to-upstream.js");
// keep this one last so that you can cancel the test run early
require("./web-platform-tests/index.js");
