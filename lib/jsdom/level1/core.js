"use strict";
/*
  ServerJS Javascript DOM Level 1
*/
var HtmlToDom = require("../browser/htmltodom").HtmlToDom;
var Location = require("../browser/location");
var vm = require("vm");
var CookieJar = require('tough-cookie').CookieJar;
const URL = require("../utils").URL;

var core = exports;

core.DOMException = require("../web-idl/DOMException");
core.NamedNodeMap = require("../living/attributes").NamedNodeMap;

const Node = require("../living/generated/Node");
core.Node = Node.interface;

const Element = require("../living/generated/Element");
core.Element = Element.interface;

core.DocumentFragment = require("../living/generated/DocumentFragment").interface;

core.Document = require("../living/generated/Document").interface;
