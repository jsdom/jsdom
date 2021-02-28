"use strict";
const http = require("http");
const https = require("https");
const HttpProxyAgent = require("http-proxy-agent");
const HttpsProxyAgent = require("https-proxy-agent");

module.exports = function agentFactory(url, proxy) {
  const config = {};
  const noProxy = proxy === null || proxy === undefined;
  const isSecure = url.startsWith("https");
  if (isSecure) {
    if (noProxy) {
      config.https = new https.Agent({ keepAlive: true });
    } else {
      config.https = new HttpsProxyAgent({ keepAlive: true, proxy });
    }
  } else if (noProxy) {
    config.http = new http.Agent({ keepAlive: true });
  } else {
    config.http = new HttpProxyAgent({ keepAlive: true, proxy });
  }
  return config;
};
