"use strict";
const http = require("http");
const https = require("https");
const HttpProxyAgent = require("http-proxy-agent");
const HttpsProxyAgent = require("https-proxy-agent");

const ver = process.version.replace("v", "").split(".");
const majorNodeVersion = Number.parseInt(ver[0]);
const minorNodeVersion = Number.parseInt(ver[1]);

function setAbort(clientRequest) {
  if (majorNodeVersion > 13 || (majorNodeVersion === 13 && minorNodeVersion > 13)) {
    clientRequest.abort = clientRequest.destroy;
  }
}

function getRequest(uri, rejectUnauthorized) {
  const isHttps = uri.substr(0, 6) === "https:";
  if (isHttps) {
    return (url, options) => https.request(url, Object.assign({}, options, { rejectUnauthorized }));
  }
  return http.request;
}

function agentFactory(uri, proxy, rejectUnauthorized) {
  const isHttps = uri.substr(0, 6) === "https:";
  const agentOpts = { keepAlive: true, rejectUnauthorized };
  if (proxy) {
    const url = new URL(proxy);
    const proxyOpts = { ...url, ...agentOpts };
    return isHttps ? new HttpsProxyAgent(proxyOpts) : new HttpProxyAgent(proxyOpts);
  }
  return isHttps ? new https.Agent(agentOpts) : new http.Agent(agentOpts);
}

module.exports = { agentFactory, getRequest, setAbort };

/*
Important: Hard reset the branch replace-fetch this hash
5832687b07849808ca9b84264e8473e5e875a4cd
*/

/* TODO Define request with follow-redirect */

