"use strict";

const vm = require("vm");
const validateNames = require("../helpers/validate-names");
const createDocumentTypeInternal = require("../document-type").create;
const Document = require("../generated/Document");

class DOMImplementationImpl {
  constructor(args, privateData) {
    if (!privateData.core) {
      console.log(new Error().stack)
    }
    this.core = privateData.core;
    this._ownerDocument = privateData.ownerDocument;
    this._features = Object.create(null);
  }

  hasFeature() {
    return true;
  }

  createDocumentType(qualifiedName, publicId, systemId) {
    validateNames.qname(qualifiedName);

    return createDocumentTypeInternal(this.core, this._ownerDocument, qualifiedName, publicId, systemId);
  }

  createDocument(namespace, qualifiedName, doctype) {
    namespace = namespace !== null ? String(namespace) : namespace;
    qualifiedName = qualifiedName === null ? "" : String(qualifiedName);
    if (doctype === undefined) {
      doctype = null;
    }

    const document = Document.createImpl([], { core: this.core });

    let element = null;
    if (qualifiedName !== "") {
      element = document.createElementNS(namespace, qualifiedName);
    }

    if (doctype !== null) {
      document.appendChild(doctype);
    }

    if (element !== null) {
      document.appendChild(element);
    }

    return document;
  }

  createHTMLDocument(title) {
    // Let doc be a new document that is an HTML document.
    // Set doc's content type to "text/html".
    const document = Document.createImpl([], { core: this.core, options: { parsingMode: "html" } });

    // Create a doctype, with "html" as its name and with its node document set
    // to doc. Append the newly created node to doc.
    const doctype = createDocumentTypeInternal(this.core, this, "html", "", "");
    document.appendChild(doctype);

    // Create an html element in the HTML namespace, and append it to doc.
    const htmlElement = document.createElementNS("http://www.w3.org/1999/xhtml", "html");
    document.appendChild(htmlElement);

    // Create a head element in the HTML namespace, and append it to the html
    // element created in the previous step.
    const headElement = document.createElement("head");
    htmlElement.appendChild(headElement);

    // If the title argument is not omitted:
    if (title !== undefined) {
      // Create a title element in the HTML namespace, and append it to the head
      // element created in the previous step.
      const titleElement = document.createElement("title");
      headElement.appendChild(titleElement);

      // Create a Text node, set its data to title (which could be the empty
      // string), and append it to the title element created in the previous step.
      titleElement.appendChild(document.createTextNode(title));
    }

    // Create a body element in the HTML namespace, and append it to the html
    // element created in the earlier step.
    htmlElement.appendChild(document.createElement("body"));

    // doc's origin is an alias to the origin of the context object's associated
    // document, and doc's effective script origin is an alias to the effective
    // script origin of the context object's associated document.

    return document;
  }

  _removeFeature(feature, version) {
    feature = feature.toLowerCase();
    if (this._features[feature]) {
      if (version) {
        var j        = 0,
            versions = this._features[feature],
            l        = versions.length;

        for (j; j<l; j++) {
          if (versions[j] === version) {
            versions.splice(j,1);
            return;
          }
        }
      } else {
        delete this._features[feature];
      }
    }
  }

  _addFeature(feature, version) {
    feature = feature.toLowerCase();

    if (version) {

      if (!this._features[feature]) {
        this._features[feature] = [];
      }

      if (version instanceof Array) {
        Array.prototype.push.apply(this._features[feature], version);
      } else {
        this._features[feature].push(version);
      }

      if (feature === "processexternalresources" &&
          (version === "script" || (version.indexOf && version.indexOf("script") !== -1)) &&
          !vm.isContext(this._ownerDocument._global)) {
        vm.createContext(this._ownerDocument._global);
        this._ownerDocument._defaultView._globalProxy = vm.runInContext("this", this._ownerDocument._global);
        this._ownerDocument._defaultView = this._ownerDocument._defaultView._globalProxy;
      }
    }
  }

  // The real hasFeature is in living/dom-implementation.js, and returns true always.
  // This one is used internally
  _hasFeature(/* string */ feature, /* string */ version) {
    feature = (feature) ? feature.toLowerCase() : '';
    var versions = (this._features[feature]) ?
                    this._features[feature]  :
                    false;

    if (!version && versions.length && versions.length > 0) {
      return true;
    } else if (typeof versions === 'string') {
      return versions === version;
    } else if (versions.indexOf && versions.length > 0) {
      for (var i = 0; i < versions.length; i++) {
        var found = versions[i] instanceof RegExp ?
          versions[i].test(version) :
          versions[i] === version;
        if (found) { return true; }
      }
      return false;
    } else {
      return false;
    }
  }
}

module.exports = {
  implementation: DOMImplementationImpl
};
