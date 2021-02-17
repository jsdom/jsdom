"use strict";
const http = require("http");
const https = require("https");
const { parse } = require("url");
const HttpProxyAgent = require("http-proxy-agent");
const HttpsProxyAgent = require("https-proxy-agent");

function getRequest(uri) {
  const isHttps = uri.substr(0, 6) === "https:";
  if (isHttps) {
    return https.request;
  }
  return http.request;
}

function agentFactory(uri, proxy, rejectUnauthorized) {
  const isHttps = uri.substr(0, 6) === "https:";
  const agentOpts = { keepAlive: true, rejectUnauthorized };
  if (proxy) {
    const proxyOpts = { ...parse(proxy), ...agentOpts };
    return isHttps ? new HttpsProxyAgent(proxyOpts) : new HttpProxyAgent(proxyOpts);
  }
  return isHttps ? new https.Agent(agentOpts) : new http.Agent(agentOpts);
}

module.exports = { agentFactory, getRequest };
