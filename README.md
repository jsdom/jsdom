# jsdom

CommonJS implementation of the DOM intended to be platform independent and as minimal/light as
possible while completely adhering to the w3c DOM specifications.

Currently Implemented and w3c Compliant:

  - DOM Level 1 (html/svg/xml)
  - DOM Level 2 (html/events) with partial level2/core support
  - Browser (BOM) Augmentation (getElementsByClassName, getElementById, etc..)

# Installation

    npm install jsdom

or

    git clone http://github.com/tmpvar/jsdom.git
    cd jsdom
    npm link .

# Easymode

Bootstrapping a DOM is never easy, that is why a new method, jsdom.env(), has been
added in jsdom 0.2.0 which should make everyone's lives easier.

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

    // Fetch the first page of hackernews links
    var jsdom = require('jsdom');
    
    jsdom.env({
      html    : "http://news.ycombinator.com/",
      scripts : ['http://code.jquery.com/jquery-1.5.min.js'],
      done    : function(errors, window) {
        console.log("HN Links");
        window.$("td.title a").each(function() {
          console.log(" - " + window.$(this).text());
        });
      }
    });


# Flexibility

One of the stated goals of jsdom is to be as minimal and light as possible. This section details how
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



## Default Features

Default features are extremely important for jsdom as they lower the configuration requirement and present developers a set of consistent default behaviors. The following sections detail the available features, their defaults, and the values that jsdom uses.


### FetchExternalResources
**Default**: ['script']

**Allowed**: ['script', 'img', 'css', 'frame', 'link'] or false

Enables/Disables fetching files over the filesystem/http

### ProcessExternalResources
**Default** ['script']

**Allowed** ['script'] or false

By default, jsdom executes text content in a SCRIPT and the text retrieved from fetching data from a SCRIPT.src. Turning it off will disable script execution (currently only javascript)

Support for frames is in the works


### MutationEvents
**Default** : '2.0'

**Allowed** : '2.0' or false

Initially enabled to be up to spec. Disable this if you do not need mutation events and want jsdom to be a bit more efficient.

### QuerySelector
**Default** : false

**Allowed** : true

This feature is backed by [sizzle][]

[sizzle]: http://sizzlejs.com/ but currently causes problems with some libraries.  Enable if you want `document.querySelector` and friends, but be aware that many libraries feature detect for this, and it may cause you a bit of trouble.

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

# More

see: [mailing list][]

see: [testlog][] for w3/jsdom test compliance

see: [plan][] for roadmap and thoughts about this project

see: [project site][] for additional information

  [mailing list]: http://groups.google.com/group/jsdom
  [project site]: http://www.jsdom.org
  [mjsunit.runner]: http://github.com/tmpvar/mjsunit.runner
  [testlog]: http://github.com/tmpvar/jsdom/blob/master/test/testlog.txt
  [plan]: http://github.com/tmpvar/jsdom/blob/master/PLAN.json

[mjsunit.runner]: http://github.com/tmpvar/mjsunit.runner
