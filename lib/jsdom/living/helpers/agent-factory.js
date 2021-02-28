"use strict";
const http = require("http");
const https = require("https");
const HttpProxyAgent = require("http-proxy-agent");
const HttpsProxyAgent = require("https-proxy-agent");

module.exports = function agentFactory(url, proxy, rejectUnauthorized) {
  const config = {};
  const hasProxy = proxy !== null && proxy !== undefined;
  const isHttps = url.startsWith("https");
  const agentOptions = { keepAlive: true, rejectUnauthorized };
  if (hasProxy) {
    const proxyUrl = new URL(proxy);
    const proxyOptions = { ...proxyUrl, ...agentOptions };
    if (isHttps) {
      config.https = new HttpsProxyAgent(proxyOptions);
    } else {
      config.http = new HttpProxyAgent(proxyOptions);
    }
  } else if (isHttps) {
    config.https = new https.Agent(agentOptions);
  } else {
    config.http = new http.Agent(agentOptions);
  }
  return config;
};
