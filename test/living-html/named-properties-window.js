"use strict";
const jsdom = require("../..");
const todo = require("../util").todo;

exports["A named property should return an element as-is if its name attribute matches"] = t => {
  const doc = jsdom.jsdom();
  const window = doc.defaultView;

  const img = doc.createElement("img");
  img.setAttribute("name", "foo");
  doc.body.appendChild(img);

  t.ok(window.foo === img);
  t.done();
};

exports["A named property should not be set if the element is not reachable from the Document"] = t => {
  const doc = jsdom.jsdom();
  const window = doc.defaultView;

  const img = doc.createElement("img");
  img.setAttribute("name", "foo");

  t.ok(!("foo" in window));

  t.done();
};

exports["A named property should be enumerable"] = t => {
  const doc = jsdom.jsdom();
  const window = doc.defaultView;

  const img = doc.createElement("img");
  img.setAttribute("name", "foo");
  doc.body.appendChild(img);

  let found = false;
  for (const key in window) {
    if (key === "foo") {
      found = true;
    }
  }
  t.ok(found);
  t.done();
};

exports["A named property should returns any element for which the id attribute matches"] = t => {
  const doc = jsdom.jsdom();
  const window = doc.defaultView;

  const img = doc.createElement("img");
  img.setAttribute("id", "foo");
  doc.body.appendChild(img);

  t.ok(window.foo === img);
  t.done();
};

exports["A non element node in the document should not cause errors"] = t => {
  const doc = jsdom.jsdom();
  const window = doc.defaultView;

  doc.body.appendChild(doc.createTextNode("foo"));

  const img = doc.createElement("img");
  img.setAttribute("id", "foo");
  doc.body.appendChild(img);

  t.ok(window.foo === img);
  t.done();
};

exports["Changing an attribute should update the named properties (id)"] = t => {
  const doc = jsdom.jsdom();
  const window = doc.defaultView;

  const img = doc.createElement("img");
  doc.body.appendChild(img);
  img.setAttribute("id", "foo");
  t.ok(window.foo === img);

  img.setAttribute("id", "bar");
  t.ok(!("foo" in window));
  t.ok(window.bar === img);

  t.done();
};

exports["Changing an attribute should update the named properties (name)"] = t => {
  const doc = jsdom.jsdom();
  const window = doc.defaultView;

  const img = doc.createElement("img");
  doc.body.appendChild(img);
  img.setAttribute("name", "foo");
  t.ok(window.foo === img);

  img.setAttribute("name", "bar");
  t.ok(!("foo" in window));
  t.ok(window.bar === img);

  t.done();
};

exports["An element with identical name and id attributes should occur in the value once, not twice"] = t => {
  const doc = jsdom.jsdom();
  const window = doc.defaultView;

  const img = doc.createElement("img");
  doc.body.appendChild(img);
  img.setAttribute("name", "foo");
  img.setAttribute("id", "foo");
  t.ok(window.foo === img);

  const img2 = doc.createElement("img");
  doc.body.appendChild(img2);
  img2.setAttribute("name", "foo");
  img2.setAttribute("id", "foo");
  t.strictEqual(window.foo.length, 2);
  t.ok(window.foo[0] === img);
  t.ok(window.foo[1] === img2);

  t.done();
};

exports["Changing an attribute should not remove the named properties if a different attribute still matches (id)"] =
t => {
  const doc = jsdom.jsdom();
  const window = doc.defaultView;

  const img = doc.createElement("img");
  doc.body.appendChild(img);
  img.setAttribute("name", "foo");
  img.setAttribute("id", "foo");
  t.ok(window.foo === img);

  img.setAttribute("id", "bar");
  t.ok(window.foo === img);

  t.done();
};

exports["Changing an attribute should not remove the named properties if a different attribute still matches (name)"] =
t => {
  const doc = jsdom.jsdom();
  const window = doc.defaultView;

  const img = doc.createElement("img");
  doc.body.appendChild(img);
  img.setAttribute("name", "foo");
  img.setAttribute("id", "foo");
  t.ok(window.foo === img);

  img.setAttribute("name", "bar");
  t.ok(window.foo === img);

  t.done();
};

exports["Changing an attribute that is not id or name should not cause errors"] = t => {
  const doc = jsdom.jsdom();
  const window = doc.defaultView;

  const img = doc.createElement("img");
  img.setAttribute("alt", "Cat pictures on the internet");
  img.setAttribute("id", "foo");
  doc.body.appendChild(img);
  t.ok(window.foo === img);

  img.setAttribute("alt", "Dog pictures on the internet");
  t.ok(window.foo === img);

  t.done();
};

exports["Removing an element should update the named properties"] = t => {
  const doc = jsdom.jsdom();
  const window = doc.defaultView;

  const img = doc.createElement("img");
  img.setAttribute("id", "foo");
  doc.body.appendChild(img);
  t.ok(window.foo === img);

  doc.body.removeChild(img);
  t.ok(!("foo" in window));

  t.done();
};

exports["Removing a non-element node should not cause errors"] = t => {
  const doc = jsdom.jsdom();
  const window = doc.defaultView;

  const text = doc.createTextNode("foo");
  doc.body.appendChild(text);

  const img = doc.createElement("img");
  img.setAttribute("id", "foo");
  doc.body.appendChild(img);
  t.ok(window.foo === img);

  doc.body.removeChild(text);
  t.ok(window.foo === img);

  t.done();
};

exports["A document without a Window should not cause errors"] = t => {
  const doc = jsdom.jsdom().implementation.createHTMLDocument();
  t.strictEqual(doc.defaultView, null, "Test case prerequisite");

  const img = doc.createElement("img");
  img.setAttribute("id", "foo");
  doc.body.appendChild(img);
  t.ok(img.parentNode);

  img.setAttribute("id", "bar");
  t.strictEqual(img.getAttribute("id"), "bar");

  doc.body.removeChild(img);
  t.ok(!img.parentNode);

  t.done();
};

exports["A named property should return a HTMLCollection if there are multiple matches"] = t => {
  const doc = jsdom.jsdom();
  const window = doc.defaultView;

  const img1 = doc.createElement("img");
  img1.setAttribute("name", "foo");
  doc.body.appendChild(img1);

  // inserted at a later moment, however it should occur first because of tree-order
  const img0 = doc.createElement("img");
  img0.setAttribute("name", "foo");
  doc.body.insertBefore(img0, img1);

  const div = doc.createElement("div");
  div.setAttribute("id", "foo");
  doc.body.appendChild(div);

  t.ok(window.foo instanceof window.HTMLCollection);
  t.strictEqual(window.foo.length, 3);
  t.ok(window.foo[0] === img0);
  t.ok(window.foo[1] === img1);
  t.ok(window.foo[2] === div);

  t.done();
};

exports["A named property should not be set if a property already exists"] = t => {
  const doc = jsdom.jsdom();
  const window = doc.defaultView;

  window.foo = 5;

  const img = doc.createElement("img");
  img.setAttribute("id", "foo");
  doc.body.appendChild(img);

  t.ok(window.foo === 5);
  t.done();
};

exports["A named property should not be set if a property already exists, even if undefined"] = t => {
  const doc = jsdom.jsdom();
  const window = doc.defaultView;

  window.foo = undefined;

  const img = doc.createElement("img");
  img.setAttribute("id", "foo");
  doc.body.appendChild(img);

  t.ok(window.foo === undefined);
  t.done();
};

exports["If a property is occupied by a named property but then the user sets it, the user's value shadows it"] = t => {
  const doc = jsdom.jsdom();
  const window = doc.defaultView;

  const img = doc.createElement("img");
  img.setAttribute("id", "foo");
  doc.body.appendChild(img);

  window.foo = 5;

  t.ok(window.foo === 5);
  t.done();
};

exports["If a named property is shadowed by the user but then deleted, the named property value should return."] =
t => {
  const doc = jsdom.jsdom();
  const window = doc.defaultView;

  window.foo = 5;

  const img = doc.createElement("img");
  img.setAttribute("id", "foo");
  doc.body.appendChild(img);

  delete window.foo;

  // Would require ES6 Proxy to properly implement this behaviour
  todo(t, tt => {
    tt.ok(window.foo === img);
  });

  t.done();
};

exports["Only elements with specific tag names may be returned if their name attribute matches"] = t => {
  const doc = jsdom.jsdom();
  const window = doc.defaultView;
  const tags = ["a", "applet", "area", "embed", "form", "frameset", "img", "object",
                "A", "APPLET", "AREA", "EMBED", "FORM", "FRAMESET", "IMG", "OBJECT"];

  for (const tagName of tags) {
    const element = doc.createElement(tagName);
    element.setAttribute("name", "foo");
    doc.body.appendChild(element);
  }

  tags.forEach((tagName, index) => {
    const element = window.foo[index];
    t.ok(element && element.nodeName.toUpperCase() === tags[index].toUpperCase());
  });

  t.done();
};

exports["Only elements with specific tag names may be returned if their name attribute matches (negative test)"] =
t => {
  const doc = jsdom.jsdom();
  const window = doc.defaultView;

  // Not exhaustive
  const tags = ["div", "span", "style", "script", "h1", "strong", "input",
                "audio", "button", "select", "textarea"];

  for (const tagName of tags) {
    const element = doc.createElement(tagName);
    element.setAttribute("name", "foo");
    doc.body.appendChild(element);
  }

  t.ok(!window.foo);

  t.done();
};

exports["Removing an element for which the name attribute is not tracked, should not cause errors upon removing it"] =
t => {
  const doc = jsdom.jsdom();
  const window = doc.defaultView;

  // Not exhaustive
  const tags = ["div", "span", "style", "script", "h1", "strong", "input",
                "audio", "button", "select", "textarea"];

  const img = doc.createElement("img");
  img.setAttribute("name", "foo");
  doc.body.appendChild(img);

  for (const tagName of tags) {
    const element = doc.createElement(tagName);
    element.setAttribute("name", "foo");
    doc.body.appendChild(element);
    doc.body.removeChild(element);
  }

  t.ok(window.foo === img);
  t.done();
};

exports["A named property that matches any element that contains a nested browsing context, should return the " +
"WindowProxy of that context"] = t => {
  const doc = jsdom.jsdom();
  const window = doc.defaultView;

  const iframe = doc.createElement("iframe");
  iframe.setAttribute("name", "foo");
  doc.body.appendChild(iframe);

  t.ok(iframe.contentWindow, "test prerequisite");
  t.ok(window.foo === iframe.contentWindow);
  t.done();
};
