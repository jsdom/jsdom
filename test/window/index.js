var dom = require("../../lib/jsdom/level1/core").dom.level1.core;

exports.tests = {

  addmetatohead: function(test) {
    var window = require("../../lib/jsdom/browser/index").windowAugmentation(dom);
    var meta = window.document.createElement("meta");
    window.document.getElementsByTagName("head").item(0).appendChild(meta);
    var elements = window.document.getElementsByTagName("head").item(0).childNodes;
    test.strictEqual(elements.item(elements.length-1), meta, 'last element should be the new meta tag');
    test.ok(window.document.innerHTML.indexOf("<meta>") > -1, 'meta should have open tag');
    test.strictEqual(window.document.innerHTML.indexOf("</meta>"), -1, 'meta should not be stringified with a closing tag');
    test.done();
  },

  ensure_a_default_window_has_a_window_location_href: function(test) {
    var window = require("../../lib/jsdom/browser/index").windowAugmentation(dom);
    var rurl = /^([\w\+\.\-]+:)\/\/([^\/?#:]*)(?::(\d+))?/,
        urlParts = rurl.exec(window.location.href);
    test.ok(urlParts.length > 1, 'url shouldnt be blank');
    test.done();
  }
};
