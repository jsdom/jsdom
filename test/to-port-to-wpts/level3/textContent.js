var hc_staff = require("../level1/core/files/hc_staff.xml");

// Most of the level3 tests fail, so we don't turn them on by default. We extracted out one that passes into this file.

exports.tests = {
  nodesettextcontent07: function (test) {
    var success;
    var doc;
    var elemList;
    var elem;
    var txt;
    var textContent;

    doc = hc_staff.hc_staff();
    elemList = doc.getElementsByTagName("em");
    elem = elemList.item(0);
    txt = elem.firstChild;

    txt.textContent = "Text";

    textContent = txt.textContent;

    test.equal(textContent, "Text", 'nodegettextcontent10');

    test.done()
  },
}
