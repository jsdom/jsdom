exports.tests = {
 addmetatohead : function() {
    var meta = window.document.createElement("meta");
    var head = window.document.getElementsByTagName("body").item(0);
    head.appendChild(meta);
    assertTrue("last element should be the new meta tag",
                head.lastChild === meta); 
    assertTrue("meta should not be stringified with a closing tag",
               window.document.innerHTML.indexOf("<meta>") > -1 &&
               window.document.innerHTML.indexOf("</meta>") === -1
               );
  }
};
