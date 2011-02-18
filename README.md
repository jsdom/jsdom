# jsdom 0.2.0

A javascript implementation of the W3C DOM.

## Install

    npm install jsdom

or

    git clone http://github.com/tmpvar/jsdom.git
    cd jsdom
    npm link .

## Easymode

Bootstrapping a DOM is generally a difficult process involving many error prone steps. We didn't want jsdom to fall into the same trap and that is why a new method, `jsdom.env()`, has been added in jsdom 0.2.0 which should make everyone's lives easier.

    // Count all of the links from the nodejs build page
    var jsdom = require("jsdom");
    
    jsdom.env("http://nodejs.org/dist/", [
      'http://code.jquery.com/jquery-1.5.min.js'
    ], function(errors, window) {
      console.log("there have been", window.$("a").length, "nodejs releases!");
    });

or with raw html

    // Run some jQuery on a html fragment
    var jsdom = require('jsdom');
    
    jsdom.env('<p><a class="the-link" href="http://jsdom.org>JSDOM\'s Homepage</a></p>', [
      'http://code.jquery.com/jquery-1.5.min.js'
    ], function(errors, window) {
      console.log("contents of a.the-link:", window.$("a.the-link").text());
    });

or with a configuration object

    // Print all of the news items on hackernews
    var jsdom = require('jsdom');
    
    jsdom.env('http://news.ycombinator.com/', [
      'http://code.jquery.com/jquery-1.5.min.js'
    ], function(errors, window) {
      var $ = window.$;

      console.log('HN Links');
      $('td.title:not(:last) a').each(function() {
        console.log(' -', $(this).text());
      });
    });


### How it works
  `jsdom.env` is built for ease of use, which is rare in the world of the DOM!  Since the web has some absolutely horrible javascript on it, as of jsdom 0.2.0 `jsdom.env` will not process external resources (scripts, images, etc).  If you want to process the javascript use one of the methods below (`jsdom.jsdom` or `jsdom.jQueryify`)

    jsdom.env(html, [scripts], [options], callback)

  - `html` (**required**)
    May be a url, html fragment, or file

  - `scripts` (**optional**)
    May contain files or urls
 
  - `callback` (**required**)
    Takes 2 arguments: 
    - `errors` : array of errors
    - `window` : a brand new window

    _example:_  jsdom.env(html, function(`errors`, `window`) {})


If you would like to specify a configuration object

    jsdom.env({ /* config */ })

  - config.html    : see `html` above
  - config.scripts : see `scripts` above
  - config.done    : see `callback` above

## For the hardcore

If you want to spawn a document/window and specify all sorts of options this is the section for you. This section covers the `jsdom.jsdom` method:

    var jsdom  = require("jsdom").jsdom,
        doc    = jsdom(markup, level, options),
        window = doc.createWindow();
 
 - `markup` is a full html/xml document to be parsed
 - `level` is `null` (which means level3) by default, but you can pass another level if you'd like.


        var jsdom = require('jsdom'),
            doc   = jsdom.jsdom('<html><body></body></html>', jsdom.dom.level1.core)
     
 - `options` see the **Flexibility** section below

### Flexibility

One of the goals of jsdom is to be as minimal and light as possible. This section details how
someone can change the behavior of `Document`s on the fly.  These features are baked into
the `DOMImplementation` that every `Document` has, and may be tweaked in two ways:

1. When you create a new `Document` using the jsdom builder (`require('jsdom').jsdom()`)

        var jsdom = require('jsdom').jsdom,
            doc   = jsdom("<html><body></body></html>", null, {
              features: {
                FetchExternalResources : ['img']
              }
            });

 Do note, that this will only affect the document that is currently being created.  All other documents
will use the defaults specified below (see: Default Features)

2. Previous to creating any documents you can modify the defaults for all future documents
    
        require('jsdom').defaultDocumentFeatures = {
          FetchExternalResources   : ['script'], 
          ProcessExternalResources : false,
          MutationEvents           : false,
          QuerySelector            : false
        }



#### Default Features

Default features are extremely important for jsdom as they lower the configuration requirement and present developers a set of consistent default behaviors. The following sections detail the available features, their defaults, and the values that jsdom uses.


`FetchExternalResources`
_Default_: ['script']
_Allowed_: ['script', 'img', 'css', 'frame', 'link'] or false

Enables/Disables fetching files over the filesystem/http

`ProcessExternalResources`
_default_: ['script']
_allowed_: ['script'] or false
 
Disabling this will disable script execution (currently only javascript).

`MutationEvents`
_default_: '2.0'
_allowed_ : '2.0' or false

Initially enabled to be up to spec. Disable this if you do not need mutation events and want jsdom to be a bit more efficient.

**Note**: `ProcessExternalResources` requires this to be enabled

`QuerySelector`
_default_ : false
_allowed_ : true

This feature is backed by [sizzle][] but currently causes problems with some libraries.  Enable this if you want `document.querySelector` and friends, but be aware that many libraries feature detect for this, and it may cause you a bit of trouble.

[sizzle]:http://sizzlejs.com/

# More Examples

## Creating a document-less window

    var jsdom  = require("jsdom"),
        window = jsdom.createWindow();

    console.log(window.document);
    // output: undefined

## Creating a document
    var jsdom = require("jsdom"),
        doc   = new (jsdom.dom.level1.core.Document)();
    console.log(doc.nodeName);
    // outputs: #document

## Creating a browser-like BOM/DOM/Window

    var jsdom    = require("./lib/jsdom").jsdom,
        document = jsdom("<html><head></head><body>hello world</body></html>"),
        window   = document.createWindow();

    console.log(window.document.innerHTML);
    // output: '<html><head></head><body>hello world</body></html>'

    console.log(window.innerWidth)
    // output: 1024

    console.log(typeof window.document.getElementsByClassName);
    // outputs: function


## jQueryify

    var jsdom  = require("jsdom"),
        window = jsdom.jsdom().createWindow();

    jsdom.jQueryify(window, 'http://code.jquery.com/jquery-1.4.2.min.js' , function() {
      window.$('body').append('<div class="testing">Hello World, It works</div>');
      console.log(window.$('.testing').text());
    });

# W3C Test Compliance:

  - DOM Level 1 html/svg/xml (100%)
  - DOM Level 2 html/events/core (100%)
  - DOM Level 3 core (14%)

see: [testlog][] for w3/jsdom test compliance

# More

see: [mailing list][]



see: [plan][] for roadmap and thoughts about this project

see: [project site][] for additional information

  [mailing list]: http://groups.google.com/group/jsdom
  [project site]: http://www.jsdom.org
  [mjsunit.runner]: http://github.com/tmpvar/mjsunit.runner
  [testlog]: http://github.com/tmpvar/jsdom/blob/master/test/testlog.txt
  [plan]: http://github.com/tmpvar/jsdom/blob/master/PLAN.json

[mjsunit.runner]: http://github.com/tmpvar/mjsunit.runner
