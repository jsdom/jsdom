"use strict";

const toBase64 = require("./toBase64");

function Auth(request) {
  this.request = request;
  this.hasAuth = false;
  this.sentAuth = false;
  this.user = null;
  this.pass = null;
}

Auth.prototype.basic = function (sendImmediately) {
  const self = this;
  const { user, pass, request } = self;
  if (typeof user !== "string" || (pass !== undefined && typeof pass !== "string")) {
    request.emit("error", new Error("auth() received invalid user or password"));
  }
  self.hasAuth = true;
  const header = user + ":" + (pass || "");
  if (sendImmediately || typeof sendImmediately === "undefined") {
    const authHeader = "Basic " + toBase64(header);
    self.sentAuth = true;
    return authHeader;
  }
  return null;
};

Auth.prototype.onRequest = function (user, pass, sendImmediately) {
  const self = this;
  const { request } = self;
  let authHeader;
  if (user === undefined) {
    self.request.emit("error", new Error("no auth mechanism defined"));
  } else {
    self.user = user;
    self.pass = pass;
    authHeader = self.basic(sendImmediately);
  }
  if (authHeader) {
    request.setHeader("authorization", authHeader);
  }
};

Auth.prototype.onResponse = function (response) {
  const self = this;
  if (!self.hasAuth || self.sentAuth) {
    return null;
  }
  const authHeader = response.headers.get("WWW-Authenticate");
  if (
    typeof authHeader === "string" &&
    authHeader.split(" ")[0].toLowerCase() === "basic"
  ) {
    return self.basic(true);
  }
  return null;
};

exports.Auth = Auth;
