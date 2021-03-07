"use strict";

function toBase64(str) {
  const forcedString = typeof str === "string" ? str : "";
  return Buffer.from(forcedString, "utf8").toString("base64");
}

function Auth(request) {
  // define all public properties here
  this.request = request;
  this.hasAuth = false;
  this.sentAuth = false;
  this.user = null;
  this.pass = null;
}

Auth.prototype.basic = function (user, pass, sendImmediately) {
  const self = this;
  if (typeof user !== "string" || (pass !== undefined && typeof pass !== "string")) {
    self.request.emit("error", new Error("auth() received invalid user or password"));
  }
  self.user = user;
  self.pass = pass;
  self.hasAuth = true;
  const header = user + ":" + (pass || "");
  if (sendImmediately || typeof sendImmediately === "undefined") {
    const authHeader = "Basic " + toBase64(header);
    self.sentAuth = true;
    return authHeader;
  }
  return undefined;
};

Auth.prototype.onRequest = function (user, pass, sendImmediately, bearer) {
  const self = this;
  const { request } = self;

  let authHeader;
  if (bearer === undefined && user === undefined) {
    self.request.emit("error", new Error("no auth mechanism defined"));
  } else {
    authHeader = self.basic(user, pass, sendImmediately);
  }
  if (authHeader) {
    request.setHeader("authorization", authHeader);
  }
};

Auth.prototype.onResponse = function () {
  const self = this;

  if (!self.hasAuth || self.sentAuth) {
    return null;
  }

  return self.basic(self.user, self.pass, true);
};

module.exports = Auth;
