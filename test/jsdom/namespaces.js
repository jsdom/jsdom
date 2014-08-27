exports["namespace prefixes (GH-861)"] = function (t) {
  var doc = jsdom();
  doc.body.innerHTML = "<svg xmlns:xlink='http://www.w3.org/1999/xlink'><use xlink:href='#test'></use></svg>";

  t.ok(doc.body.firstChild.getAttribute("xmlns:xlink"));

  t.done();
};

exports["should set namespaces"] = function (t) {
  var doc = jsdom();
  doc.body.innerHTML = "<svg xmlns:xlink='http://www.w3.org/1999/xlink'><use xlink:href='#test'></use></svg>";

  t.strictEqual(doc.body.namespaceURI, "http://www.w3.org/1999/xhtml", "default namespace URI should be xhtml");

  var xmlnsAttr = doc.body.firstChild.attributes["xmlns:xlink"];
  t.strictEqual(xmlnsAttr.prefix, "xmlns", "prefix should be set correctly");
  t.strictEqual(xmlnsAttr.localName, "xlink", "localName should be set correctly");
  t.strictEqual(xmlnsAttr.namespaceURI, "http://www.w3.org/2000/xmlns/", "xmlns should be in xmlns namespace");

  var xlinkAttr = doc.body.firstChild.firstChild.attributes["xlink:href"];
  t.strictEqual(xlinkAttr.prefix, "xlink", "prefix should be set to xlink");
  t.strictEqual(xlinkAttr.localName, "href", "localName should be set to href");
  t.strictEqual(xlinkAttr.namespaceURI, "http://www.w3.org/1999/xlink", "namespaceURI should be set correctly");

  t.done();
};
