"use strict";

const url = require("url");
const isUrl = /^https?:/;

function Redirect(request) {
  this.request = request;
  this.followRedirects = true;
  this.followAllRedirects = false;
  this.redirects = [];
  this.redirectsFollowed = 0;
}

Redirect.prototype.onRequest = function (options) {
  const self = this;
  if (options.followRedirect !== undefined) {
    self.followRedirects = Boolean(options.followRedirect);
  }
  if (options.followAllRedirects !== undefined) {
    self.followAllRedirects = options.followAllRedirects;
  }
  if (self.followRedirects || self.followAllRedirects) {
    self.redirects = self.redirects || [];
  }
};

Redirect.prototype.redirectTo = function (response) {
  const self = this;
  const { request } = self;

  let redirectTo = null;
  if (response.statusCode >= 300 && response.statusCode < 400 && response.caseless.has("location")) {
    const location = response.caseless.get("location");

    if (self.followAllRedirects) {
      redirectTo = location;
    } else if (self.followRedirects) {
      switch (request.method) {
        case "PATCH":
        case "PUT":
        case "POST":
        case "DELETE":
          // Do not follow redirects
          break;
        default:
          redirectTo = location;
          break;
      }
    }
  } else if (response.statusCode === 401) {
    const authHeader = request._auth.onResponse(response);
    if (authHeader) {
      request.setHeader("authorization", authHeader);
      redirectTo = request.uri;
    }
  }
  return redirectTo;
};

Redirect.prototype.onResponse = function (response) {
  const self = this;
  const { request } = self;

  let redirectTo = self.redirectTo(response);
  if (!redirectTo) {
    return false;
  }

  // ignore any potential response body.  it cannot possibly be useful
  // to us at this point.
  // response.resume should be defined, but check anyway before calling. Workaround for browserify.
  if (response.resume) {
    response.resume();
  }

  if (self.redirectsFollowed >= 21) {
    request.emit("error", new Error("Exceeded maxRedirects. Probably stuck in a redirect loop " + request.uri.href));
    return false;
  }
  self.redirectsFollowed += 1;

  if (!isUrl.test(redirectTo)) {
    redirectTo = url.format(new URL(redirectTo, request.uri.href));
  }

  const uriPrev = request.uri;
  request.uri = new URL(redirectTo);

  // handle the case where we change protocol from https to http or vice versa
  if (request.uri.protocol !== uriPrev.protocol) {
    delete request.agent;
  }

  self.redirects.push({ statusCode: response.statusCode, redirectUri: redirectTo });

  if (self.followAllRedirects && request.method !== "HEAD" &&
    response.statusCode !== 401 && response.statusCode !== 307) {
    request.method = "GET";
  }
  // request.method = 'GET' // Force all redirects to use GET || commented out fixes #215
  delete request.src;
  delete request.req;
  delete request._started;
  if (response.statusCode !== 401 && response.statusCode !== 307) {
    // Remove parameters from the previous response, unless this is the second request
    // for a server that requires digest authentication.
    delete request.body;
    delete request._form;
    if (request.headers) {
      request.removeHeader("host");
      request.removeHeader("content-type");
      request.removeHeader("content-length");
      if (request.uri.hostname !== request.originalHost.split(":")[0]) {
        // Remove authorization if changing hostnames (but not if just
        // changing ports or protocols).  This matches the behavior of curl:
        // https://github.com/bagder/curl/blob/6beb0eee/lib/http.c#L710
        request.removeHeader("authorization");
      }
    }
  }

  request.setHeader("referer", uriPrev.href);

  request.emit("redirect");

  request.init();

  return true;
};

module.exports = Redirect;
