# jsdom

A JavaScript implementation of the W3C DOM.

## Install

```bash
$ npm install jsdom
```

If this gives you trouble with errors about installing Contextify, especially on Windows, see [below](#contextify).

## Human contact

see: [mailing list](http://groups.google.com/group/jsdom)

## Easymode

Bootstrapping a DOM is generally a difficult process involving many error prone steps. We didn't want jsdom to fall into the same trap and that is why a new method, `jsdom.env()`, has been added in jsdom 0.2.0 which should make everyone's lives easier.

with URL

```js
// Count all of the links from the nodejs build page
var jsdom = require("jsdom");

jsdom.env(
  "http://nodejs.org/dist/",
  ["http://code.jquery.com/jquery.js"],
  function (errors, window) {
    console.log("there have been", window.$("a").length, "nodejs releases!");
  }
);
```

or with raw HTML

```js
// Run some jQuery on a html fragment
var jsdom = require("jsdom");

jsdom.env(
  '<p><a class="the-link" href="https://github.com/tmpvar/jsdom">jsdom\'s Homepage</a></p>',
  ["http://code.jquery.com/jquery.js"],
  function(errors, window) {
    console.log("contents of a.the-link:", window.$("a.the-link").text());
  }
);
```

or with a configuration object

```js
// Print all of the news items on hackernews
var jsdom = require("jsdom");

jsdom.env({
  html: "http://news.ycombinator.com/",
  scripts: ["http://code.jquery.com/jquery.js"],
  done: function (errors, window) {
    var $ = window.$;
    console.log("HN Links");
    $("td.title:not(:last) a").each(function() {
      console.log(" -", $(this).text());
    });
  }
});
```

or with raw JavaScript source

```js
// Print all of the news items on hackernews
var jsdom = require("jsdom");
var fs = require("fs");
var jquery = fs.readFileSync("./jquery.js").toString();

jsdom.env({
  html: "http://news.ycombinator.com/",
  src: [jquery],
  done: function (errors, window) {
    var $ = window.$;
    console.log("HN Links");
    $("td.title:not(:last) a").each(function() {
      console.log(" -", $(this).text());
    });
  }
});
```

### How it works
`jsdom.env` is built for ease of use, which is rare in the world of the DOM! Since the web has some absolutely horrible JavaScript on it, as of jsdom 0.2.0 `jsdom.env` will not process external resources (scripts, images, etc).  If you want to process the JavaScript use one of the methods below (`jsdom.jsdom` or `jsdom.jQueryify`)

```js
jsdom.env(html, [scripts], [config], callback);
```

- `html` (**required**): may be a URL, HTML fragment, or file.
- `scripts` (**optional**): may contain files or URLs.
- `config` (**optional**): see below.
- `callback` (**required**): takes two arguments:
  - `errors`: an array of errors
  - `window`: a brand new window

_example:_

```js
jsdom.env(html, function (errors, window) {
  // free memory associated with the window
  window.close();
});
```

If you would like to specify a configuration object only:

```js
jsdom.env(config);
```

- `config.html`: see `html` above.
- `config.scripts`: see `scripts` above.
- `config.src`: an array of JavaScript strings that will be evaluated against the resulting document. Similar to `scripts`, but it accepts JavaScript instead of paths/URLs.
- `config.done`: see `callback` above.
- `config.document`:
  - `referer`: the new document will have this referer
  - `cookie`: manually set a cookie value, e.g. `'key=value; expires=Wed, Sep 21 2011 12:00:00 GMT; path=/'`
- `config.features` : see `Flexibility` section below. **Note**: the default feature set for jsdom.env does _not_ include fetching remote JavaScript and executing it. This is something that you will need to **carefully** enable yourself.

## For the hardcore

If you want to spawn a document/window and specify all sorts of options this is the section for you. This section covers the `jsdom.jsdom` method:

```js
var jsdom = require("jsdom").jsdom;
var doc = jsdom(markup, level, options);
var window = doc.createWindow();
```

- `markup` is an HTML/XML document to be parsed. You can also pass `null` or an undefined value to get a basic document with empty `<head>` and `<body>` tags. Document fragments are also supported (including `""`), and will behave as sanely as possible (e.g. the resulting document will lack the `head`, `body` and `documentElement` properties if the corresponding elements aren't included).

- `level` is `null` (which means level3) by default, but you can pass another level if you'd like.

  ```js
  var jsdom = require("jsdom");
  var doc = jsdom.jsdom("<html><body></body></html>", jsdom.level(1, "core"));
  ```

- `options` see the **Flexibility** section below.

### Flexibility

One of the goals of jsdom is to be as minimal and light as possible. This section details how someone can change the behavior of `Document`s on the fly.  These features are baked into the `DOMImplementation` that every `Document` has, and may be tweaked in two ways:

1. When you create a new `Document` using the jsdom builder (`require("jsdom").jsdom()`)

  ```js
  var jsdom = require("jsdom").jsdom;
  var doc = jsdom("<html><body></body></html>", null, {
      features: {
        FetchExternalResources : ["img"]
      }
  });
  ```

  Do note, that this will only affect the document that is currently being created. All other documents will use the defaults specified below (see: Default Features).

2. Before creating any documents, you can modify the defaults for all future documents:

  ```js
  require("jsdom").defaultDocumentFeatures = {
      FetchExternalResources: ["script"],
      ProcessExternalResources: false
  };
  ```

#### Default Features

Default features are extremely important for jsdom as they lower the configuration requirement and present developers a set of consistent default behaviors. The following sections detail the available features, their defaults, and the values that jsdom uses.


`FetchExternalResources`

- _Default_: `["script"]`
- _Allowed_: `["script", "img", "css", "frame", "iframe", "link"]` or `false`

Enables/disables fetching files over the file system/HTTP.

`ProcessExternalResources`

- _Default_: `["script"]`
- _Allowed_: `["script"]` or `false`

Disabling this will disable script execution (currently only JavaScript).

`SkipExternalResources`

- _Default_: `false`
- _Allowed_: `/url to be skipped/` or `false`
- _Example_: `/http:\/\/example.org/js/bad\.js/`

Do not download and process resources with url matching a regular expression.

### Canvas

jsdom includes support for using the [canvas](https://npmjs.org/package/canvas) package to extend any `<canvas>` elements with the canvas API. To make this work, you need to include canvas as a dependency in your project, as a peer of jsdom. If jsdom can find the canvas package, it will use it, but if it's not present, then `<canvas>` elements will behave like `<div>`s.

## More Examples

### Creating a document-less window

```js
var jsdom = require("jsdom");
var window = jsdom.createWindow();

console.log(window.document); // output: undefined
```

### Creating a document

```js
var jsdom = require("jsdom");
var doc = new (jsdom.level(1, "core").Document)();

console.log(doc.nodeName); // outputs: #document
```

### Creating a browser-like BOM/DOM/Window

```js
var jsdom = require("jsdom").jsdom;
var document = jsdom("<html><head></head><body>hello world</body></html>");
var window = document.createWindow();

console.log(window.document.innerHTML);
// output: "<html><head></head><body>hello world</body></html>"

console.log(window.innerWidth);
// output: 1024

console.log(typeof window.document.getElementsByClassName);
// outputs: function
```

## jQueryify

```js
var jsdom = require("jsdom");
var window = jsdom.jsdom().createWindow();

jsdom.jQueryify(window, "http://code.jquery.com/jquery.js", function () {
  window.$("body").append('<div class="testing">Hello World, It works</div>');

  console.log(window.$(".testing").text());
});
```

### Passing objects to scripts inside the page

```js
var jsdom = require("jsdom").jsdom;
var window = jsdom().createWindow();

window.__myObject = { foo: "bar" };

var scriptEl = window.document.createElement("script");
scriptEl.src = "anotherScript.js";
window.document.body.appendChild(scriptEl);

// anotherScript.js will have the ability to read `window.__myObject`, even
// though it originated in Node!
```

## Test Compliance:

```
 level1/core                        532/532      100%
 level1/html                        238/238      100%
 level1/svg                         527/527      100%
 level2/core                        283/283      100%
 level2/html                        700/700      100%
 level2/style                         11/11      100%
 level2/extra                           4/4      100%
 level2/events                        24/24      100%
 level3/xpath                         93/93      100%
 window/index                           5/5      100%
 window/script                        10/10      100%
 window/frame                         14/14      100%
 sizzle/index                         14/14      100%
 jsdom/index                          86/86      100%
 jsonp/jsonp                            1/1      100%
 browser/contextifyReplacement          4/4      100%
 browser/index                        34/34      100%
------------------------------------------------------
TOTALS: 0/2580 failed; 100% success
```

### Running the tests

First you'll want to `npm install`. To run all the tests, use `npm test`, which just calls `node test/runner`.

Using `test/runner` directly, you can slice and dice which tests your want to run from different levels. Usage is as follows:

```
test/runner --help
Run the jsdom test suite

Options:
-s, --suites     suites that you want to run. ie: -s level1/core,1/html,html [string]
-f, --fail-fast  stop on the first failed test
-h, --help       show the help
-t, --tests      choose the test cases to run. ie: -t jquery
```

## Contextify

[Contextify](https://npmjs.org/package/contextify) is a dependency of jsdom, used for running `<script>` tags within the
page. In other words, it allows jsdom, which is run in Node.js, to run strings of JavaScript in an isolated environment
that pretends to be a browser environment instead of a server. You can see how this is an important feature.

Unfortunately, doing this kind of magic requires C++. And in Node.js, using C++ from JavaScript means using "native
modules." Native modules are compiled at installation time so that they work precisely for your machine; that is, you
don't download a contextify binary from npm, but instead build one locally after downloading the source from npm.

For Mac and Linux users, this is usually fine. Their systems come preinstalled with the necessaries for compiling C++.
For Windows users, however, things can be tricky. Thus, one of the most common problems with jsdom is trying to use it
on Windows without the proper compilation tools installed. Here's what you need to compile Contextify, and thus to
install jsdom, on Windows:

* A recent copy of the *x86* version of [Node.js for Windows](http://nodejs.org/download/), *not* the x64 version.
* A copy of [Visual C++ 2010 Express](http://www.microsoft.com/visualstudio/eng/downloads#d-2010-express).
* A copy of [Python 2.7](http://www.python.org/download/), installed in the default location of `C:\Python27`.

There are some slight modifications to this that can work; for example full versions of Visual Studio usually work, and
sometimes you can even get an x64 version of Node.js working too. But it's tricky, so start with the basics!
