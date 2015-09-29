"use strict";
const jsdom = require("../..");

exports["Image constructor should create a HTMLImageElement with specified width and height"] = t => {
  const window = jsdom.jsdom().defaultView;
  const image = new window.Image(100, 200);

  t.equal(image.width, 100, "width should be set to the passed constructor parameter");
  t.equal(image.height, 200, "height should be set to the passed constructor parameter");
  t.done();
};
