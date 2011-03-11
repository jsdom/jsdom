exports.tests = {
 addmetatohead : function() {
    var meta = window.document.createElement("meta");
    window.document.getElementsByTagName("head").item(0).appendChild(meta);
    var elements = window.document.getElementsByTagName("head").item(0).childNodes;

    assertTrue("last element should be the new meta tag",
                elements.item(elements.length-1) === meta); 
    assertTrue("meta should not be stringified with a closing tag",
               window.document.innerHTML.indexOf("<meta>") > -1 &&
               window.document.innerHTML.indexOf("</meta>") === -1
               );
  },
  ensure_a_default_window_has_a_window_location_href : function() {
    var rurl     = /^([\w\+\.\-]+:)\/\/([^\/?#:]*)(?::(\d+))?/,
        urlParts = rurl.exec(window.location.href);
console.log(window.location.href, urlParts)
    assertTrue("url shouldnt be blank", urlParts.length > 1);

  }
};
