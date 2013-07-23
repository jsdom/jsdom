var dom = require("../../lib/jsdom/level1/core").dom.level1.core;

exports.tests = {

  addmetatohead: function(test) {
    var window = require("../../lib/jsdom/browser/index").windowAugmentation(dom);
    var meta = window.document.createElement("meta");
    window.document.getElementsByTagName("head").item(0).appendChild(meta);
    var elements = window.document.getElementsByTagName("head").item(0).childNodes;
    test.strictEqual(elements.item(elements.length-1), meta, 'last element should be the new meta tag');
    test.ok(window.document.innerHTML.indexOf("<meta />") > -1, 'meta should have open tag');
    test.strictEqual(window.document.innerHTML.indexOf("</meta>"), -1, 'meta should not be stringified with a closing tag');
    test.done();
  },

  ensure_a_default_window_has_a_window_location_href: function(test) {
    var window = require("../../lib/jsdom/browser/index").windowAugmentation(dom);
    var rurl = /^([\w\+\.\-]+:)\/\/([^\/?#:]*)(?::(\d+))?/,
        urlParts = rurl.exec(window.location.href);
    test.ok(urlParts.length > 1, 'url shouldnt be blank');
    test.done();
  },

  ensure_a_default_window_has_a_window_location_hash: function(test) {
    var window = require("../../lib/jsdom/browser/index").windowAugmentation(dom);
    var defaultHref = window.location.href;
    test.equals(window.location.hash, "");
    window.location.href = window.location.href + "#foobar";
    test.equals(window.location.hash, "#foobar");
    window.location.hash = "#baz";
    test.equals(window.location.hash, "#baz");
    test.equals(window.location.href, defaultHref + "#baz");
    test.done();
  },

  ensure_a_default_window_has_a_window_location_search: function(test) {
    var window = require("../../lib/jsdom/browser/index").windowAugmentation(dom);
    var defaultSearch = window.location.search;
    test.equals(window.location.search, "");
    window.location.search = window.location.search + "?foo=bar";
    test.equals(window.location.search, "?foo=bar");
    window.location.search = "?baz=qux";
    test.equals(window.location.search, "?baz=qux");
    test.equals(window.location.search, defaultSearch + "?baz=qux");
    test.done();
  },

  ensure_a_default_window_can_set_search_with_a_hash: function(test) {
    var window = require("../../lib/jsdom/browser/index").windowAugmentation(dom);
    window.location.href = window.location.href + "#foo";
    window.location.search = "?foo=bar";
    test.equals(window.location.href.split("?")[1], "foo=bar#foo");
    window.location.search = "";
    test.equals(window.location.href.indexOf("?"), -1);
    test.done();
  },

  ensure_a_default_window_fires_hashchange_by_changing_href: function(test) {
    var window = require("../../lib/jsdom/browser/index").windowAugmentation(dom);
    var eventfired = false;
    window.addEventListener("hashchange", function() { eventfired = true; });
    window.location.href = window.location.href + "#foo";
    setTimeout(function() {
      test.ok(eventfired, "hashchange event should be fired.");
      test.done();
    }, 100);
  },

  ensure_a_default_window_fires_hashchange_by_changing_hash: function(test) {
    var window = require("../../lib/jsdom/browser/index").windowAugmentation(dom);
    var eventfired = false;
    window.addEventListener("hashchange", function() { eventfired = true; });
    window.location.hash = "#foo";
    setTimeout(function() {
      test.ok(eventfired, "hashchange event should be fired.");
      test.done();
    }, 100);
  },

  ensure_a_default_window_has_a_history_object_with_correct_default_values: function(test) {
    var window = require("../../lib/jsdom/browser/index").windowAugmentation(dom);
    test.ok(!!window.history);
    test.equals(window.history.state, null);
    test.equals(window.history.length, 0);
    test.done();
  },

  ensure_the_history_object_updates_properties_correctly_when_calling_pushState_and_replaceState: function (test) {
    var window = require("../../lib/jsdom/browser/index").windowAugmentation(dom);

    // Absolute path
    window.history.pushState({
      foo: "one"
    }, "unused title", "/bar/baz");
    test.equals(window.history.length, 1);
    test.equals(window.history.state.foo, "one");
    test.equals(window.location.pathname, "/bar/baz");

    // Relative path
    window.history.pushState({
      foo: "two"
    }, "unused title 2", "fizz");
    test.equals(window.history.length, 2);
    test.equals(window.history.state.foo, "two");
    test.equals(window.location.pathname, "/bar/baz/fizz");

    window.history.replaceState({
      foo: "three"
    }, "unused title 3", "/buzz");
    test.equals(window.history.length, 2);
    test.equals(window.history.state.foo, "three");
    test.equals(window.location.pathname, "/buzz");

    test.done();
  },

  ensure_the_history_object_updates_properties_correctly_when_calling_forward_back_and_go: function (test) {
    var window = require("../../lib/jsdom/browser/index").windowAugmentation(dom);
    [
      [{ foo: "bar"  }, "title 1", "/bar"],
      [{ foo: "baz"  }, "title 2", "/baz"],
      [{ foo: "buzz" }, "title 3", "/buzz"]
    ].forEach(function (args) {
      window.history.pushState.apply(window.history, args);
    });

    // Sanity check
    test.equals(window.history.length, 3);
    test.equals(window.history.state.foo, "buzz");
    test.equals(window.location.pathname, "/buzz");

    // Test forward boundary
    window.history.forward();
    test.equals(window.history.length, 3);
    test.equals(window.history.state.foo, "buzz");
    test.equals(window.location.pathname, "/buzz");

    window.history.back();
    test.equals(window.history.length, 3);
    test.equals(window.history.state.foo, "baz");
    test.equals(window.location.pathname, "/baz");

    window.history.back();
    test.equals(window.history.length, 3);
    test.equals(window.history.state.foo, "bar");
    test.equals(window.location.pathname, "/bar");

    // Test backward boundary
    window.history.back();
    test.equals(window.history.length, 3);
    test.equals(window.history.state.foo, "bar");
    test.equals(window.location.pathname, "/bar");

    window.history.go(2);
    test.equals(window.history.length, 3);
    test.equals(window.history.state.foo, "buzz");
    test.equals(window.location.pathname, "/buzz");

    test.done();
  },

  ensure_the_history_object_updates_correctly_when_calling_pushState_and_index_is_behind_length: function (test) {
    var window = require("../../lib/jsdom/browser/index").windowAugmentation(dom);
    [
      [{ foo: "bar"  }, "title 1", "/bar"],
      [{ foo: "baz"  }, "title 2", "/baz"],
      [{ foo: "buzz" }, "title 3", "/buzz"]
    ].forEach(function (args) {
      window.history.pushState.apply(window.history, args);
    });

    // Sanity check
    test.equals(window.history.length, 3);
    test.equals(window.history.state.foo, "buzz");
    test.equals(window.location.pathname, "/buzz");
    window.history.go(-2);

    test.equals(window.history.length, 3);
    test.equals(window.history.state.foo, "bar");
    test.equals(window.location.pathname, "/bar");

    // Call pushState when index is behind length
    window.history.pushState({
      foo: "bar-b"
    }, "title 2b", "/bar/b");

    test.equals(window.history.length, 2);
    test.equals(window.history.state.foo, "bar-b");
    test.equals(window.location.pathname, "/bar/b");

    test.done();
  },

  ensure_the_history_object_fires_popstate_while_navigating_history: function (test) {
    var window = require("../../lib/jsdom/browser/index").windowAugmentation(dom);
    var eventfired = false;
    var state = {
      foo: "bar"
    };
    var eventState;


    window.addEventListener("popstate", function(event) {
      eventState = event.state;
      eventfired = true;
    });
    window.history.pushState(state, "title", "bar");
    setTimeout(function() {
      test.ok(eventfired, "popstate event should be fired.");
      test.equals(state, eventState);
      test.done();
    }, 100);
  }
};
