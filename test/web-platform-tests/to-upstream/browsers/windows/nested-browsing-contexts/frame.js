var path = require("path");
var fs = require("fs");

var root = "../../../../..";
var jsdom = require(root);
var toFileUrl = require(path.join(root, "test/util")).toFileUrl(__dirname);

exports.tests = {

  "iframe document referrer" : function(test) {
    var htmlPath = path.resolve(__dirname, "files", "iframe_parent.html");
    var doc = jsdom.jsdom(fs.readFileSync(htmlPath, "utf8"), {
      features : {
        FetchExternalResources   : ["script", "iframe"],
        ProcessExternalResources : ["script", "iframe"]
      },
      url : toFileUrl(__filename)
    });

    doc.addEventListener("load", function () {
      var iframeElem = doc.getElementById("simpleIFrameID");
      test.notEqual(iframeElem, null);
      var iframeDoc = iframeElem.contentDocument;
      test.notEqual(iframeDoc, null);
      test.equal(iframeDoc.referrer, toFileUrl(__filename));
      test.done();
    });
  },
};
