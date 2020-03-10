"use strict";
/* eslint-disable no-console, global-require */
const dns = require("dns");
const path = require("path");
const util = require("util");
const childProcess = require("child_process");
const request = require("request-promise-native");
const { inBrowserContext } = require("../util.js");
const { configPaths, configs } = require("./wpt-configs.js");

const dnsLookup = !inBrowserContext() && util.promisify(dns.lookup);
const wptDir = path.resolve(__dirname, "tests");

module.exports = ({ toUpstream = false } = {}) => {
  if (inBrowserContext()) {
    return pollForServer("http://localhost:8000/", 30 * 1000)
      .then(() => {
        return request.get(`http://localhost:8000/start-wpt-server?to-upstream=${toUpstream}`);
      })
      .then(url => {
        console.log(`WPT server at ${url} is up!`);
        return url;
      });
  }

  const configType = toUpstream ? "toUpstream" : "default";
  const configPath = configPaths[configType];
  const config = configs[configType];

  return dnsLookup("web-platform.test").then(
    () => {
      const configArg = path.relative(path.resolve(wptDir), configPath);
      const args = ["./wpt.py", "serve", "--config", configArg];
      const python = childProcess.spawn("python", args, {
        cwd: wptDir,
        stdio: "inherit"
      });

      return new Promise((resolve, reject) => {
        python.on("error", e => {
          reject(new Error(`Error starting python server process: ${e.message}`));
        });

        resolve(Promise.all([
          pollForServer(`http://${config.browser_host}:${config.ports.http[0]}/`),
          pollForServer(`https://${config.browser_host}:${config.ports.https[0]}/`),
          pollForServer(`http://${config.browser_host}:${config.ports.ws[0]}/`),
          pollForServer(`https://${config.browser_host}:${config.ports.wss[0]}/`)
        ]));

        process.on("exit", () => {
          // Python doesn't register a default handler for SIGTERM and it doesn't run __exit__() methods of context
          // managers when it gets that signal. Using SIGINT avoids this problem.
          python.kill("SIGINT");
        });
      });
    },
    () => {
      throw new Error("Host entries not present for web platform tests. See " +
                      "https://github.com/web-platform-tests/wpt#running-the-tests");
    }
  ).then(([firstURL]) => firstURL);
};

function pollForServer(url, maxTimeout = null) {
  let retryTimeoutId;
  const req = request.head(url, { strictSSL: false })
    .then(() => {
      console.log(`WPT server at ${url} is up!`);
      return url;
    }, err => {
      console.log(`WPT server at ${url} is not up yet (${err.message}); trying again`);
      return new Promise(resolve => {
        retryTimeoutId = setTimeout(() => resolve(pollForServer(url)), 500);
      });
    });

  if (maxTimeout !== null) {
    return new Promise((resolve, reject) => {
      const maxTimeoutId = setTimeout(
        () => reject(new Error(`Maximum timeout of ${maxTimeout}ms exceeded`)),
        maxTimeout
      );

      req.finally(() => {
        if (retryTimeoutId !== undefined) {
          clearTimeout(retryTimeoutId);
        }
        clearTimeout(maxTimeoutId);
      }).then(resolve, reject);
    });
  }

  return req;
}
