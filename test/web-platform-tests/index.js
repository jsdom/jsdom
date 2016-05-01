"use strict";
const path = require("path");
const describe = require("mocha-sugar-free").describe;
const runWebPlatformTest = require("./run-web-platform-test")(path.resolve(__dirname, "tests"));

describe("Web Platform Tests", () => {
  /* eslint-disable max-len */
  [
    "dom/nodes/CharacterData-appendData.html",
    "dom/nodes/CharacterData-deleteData.html",
    "dom/nodes/CharacterData-insertData.html",
    "dom/nodes/CharacterData-remove.html",
    "dom/nodes/CharacterData-replaceData.html",
    "dom/nodes/Document-adoptNode.html",
    "dom/nodes/Document-contentType/contentType/createHTMLDocument.html",
    "dom/nodes/Document-createComment.html",
    "dom/nodes/Document-createProcessingInstruction.html",
    "dom/nodes/Document-createProcessingInstruction-xhtml.xhtml",
    "dom/nodes/Document-createTextNode.html",
    "dom/nodes/Document-implementation.html",
    "dom/nodes/DocumentType-literal.html",
    "dom/nodes/DocumentType-literal-xhtml.xhtml",
    "dom/nodes/DocumentType-remove.html",
    "dom/nodes/DOMImplementation-createDocumentType.html",
    "dom/nodes/DOMImplementation-createHTMLDocument.html",
    "dom/nodes/DOMImplementation-hasFeature.html",
    "dom/nodes/Element-classlist.html",
    "dom/nodes/Element-getElementsByClassName.html",
    "dom/nodes/Element-remove.html",
    "dom/nodes/attributes.html",
    "dom/nodes/getElementsByClassName-01.htm",
    "dom/nodes/getElementsByClassName-02.htm",
    "dom/nodes/getElementsByClassName-03.htm",
    "dom/nodes/getElementsByClassName-04.htm",
    "dom/nodes/getElementsByClassName-05.htm",
    "dom/nodes/getElementsByClassName-06.htm",
    "dom/nodes/getElementsByClassName-07.htm",
    "dom/nodes/getElementsByClassName-08.htm",
    "dom/nodes/getElementsByClassName-09.htm",
    "dom/nodes/getElementsByClassName-10.xml",
    // "dom/nodes/getElementsByClassName-11.xml", // XML class attribute and localName and namespaces don't work well
    "dom/nodes/getElementsByClassName-12.htm",
    "dom/nodes/getElementsByClassName-13.htm",
    "dom/nodes/getElementsByClassName-14.htm",
    "dom/nodes/getElementsByClassName-15.htm",
    "dom/nodes/getElementsByClassName-16.htm",
    "dom/nodes/getElementsByClassName-17.htm",
    "dom/nodes/getElementsByClassName-18.htm",
    "dom/nodes/getElementsByClassName-19.htm",
    "dom/nodes/getElementsByClassName-20.htm",
    "dom/nodes/getElementsByClassName-21.htm",
    "dom/nodes/getElementsByClassName-22.htm",
    "dom/nodes/getElementsByClassName-23.htm",
    "dom/nodes/getElementsByClassName-24.htm",
    "dom/nodes/getElementsByClassName-25.htm",
    "dom/nodes/getElementsByClassName-26.htm",
    "dom/nodes/getElementsByClassName-27.htm",
    "dom/nodes/getElementsByClassName-28.htm",
    "dom/nodes/getElementsByClassName-29.htm",
    "dom/nodes/getElementsByClassName-30.htm",
    "dom/nodes/getElementsByClassName-31.htm",
    "dom/nodes/Node-baseURI.html",
    "dom/nodes/Node-cloneNode.html",
    "dom/traversal/NodeFilter-constants.html",
    "dom/traversal/NodeIterator.html",
    "dom/traversal/TreeWalker-acceptNode-filter.html",
    "dom/traversal/TreeWalker-basic.html",
    "dom/traversal/TreeWalker-currentNode.html",
    "dom/traversal/TreeWalker-previousNodeLastChildReject.html",
    "dom/traversal/TreeWalker-previousSiblingLastChildSkip.html",
    "dom/traversal/TreeWalker-traversal-reject.html",
    "dom/traversal/TreeWalker-traversal-skip-most.html",
    "dom/traversal/TreeWalker-traversal-skip.html",
    "dom/traversal/TreeWalker-walking-outside-a-tree.html",
    "dom/traversal/TreeWalker.html",
    "domparsing/insert-adjacent.html",
    // "html/browsers/browsing-the-web/history-traversal/PopStateEvent.html", // https://github.com/w3c/web-platform-tests/pull/2964
    "html/browsers/browsing-the-web/history-traversal/hashchange_event.html",
    "html/browsers/browsing-the-web/history-traversal/popstate_event.html",
    // "html/browsers/history/the-history-interface/001.html", // complicated navigation stuff and structured cloning
    // "html/browsers/history/the-history-interface/002.html", // complicated navigation stuff and structured cloning
    // "html/browsers/history/the-history-interface/004.html", // subtle timing issues that I can't quite figure out; see comment in History-impl.js
    "html/browsers/history/the-history-interface/005.html",
    "html/browsers/history/the-history-interface/006.html",
    // "html/browsers/history/the-history-interface/007.html", // depends on the load event being delayed properly
    "html/browsers/history/the-history-interface/008.html",
    // "html/browsers/history/the-history-interface/009.html", // complicated navigation stuff for iframes
    // "html/browsers/history/the-history-interface/010.html", // complicated navigation stuff for iframes
    "html/browsers/history/the-history-interface/011.html",
    "html/browsers/history/the-history-interface/012.html",
    "html/browsers/history/the-location-interface/document_location.html",
    "html/browsers/history/the-location-interface/location-stringifier.html",
    "html/browsers/history/the-location-interface/location_hash.html",
    "html/browsers/history/the-location-interface/location_host.html",
    "html/browsers/history/the-location-interface/location_hostname.html",
    "html/browsers/history/the-location-interface/location_href.html",
    "html/browsers/history/the-location-interface/location_pathname.html",
    "html/browsers/history/the-location-interface/location_port.html",
    "html/browsers/history/the-location-interface/location_protocol.html",
    "html/browsers/history/the-location-interface/location_search.html",
    "html/browsers/windows/browsing-context-first-created.xhtml",
    "html/dom/dynamic-markup-insertion/document-writeln/document.writeln-02.html",
    "html/dom/dynamic-markup-insertion/document-writeln/document.writeln-03.html",
    "html/dom/elements/global-attributes/classlist-nonstring.html",
    // "html/infrastructure/urls/terminology-0/document-base-url.html", // we don't support srcdoc <base> correctly
    "html/semantics/forms/the-input-element/selection.html",
    "html/semantics/scripting-1/the-script-element/script-language-type.html",
    "html/semantics/scripting-1/the-script-element/script-languages-01.html",
    // "html/semantics/scripting-1/the-script-element/script-languages-02.html", // our script execution timing is off; see discussion in https://github.com/tmpvar/jsdom/pull/1406
    "html/semantics/scripting-1/the-script-element/script-noembed-noframes-iframe.xhtml",
    // "html/semantics/scripting-1/the-script-element/script-text-xhtml.xhtml", // not sure; XHTML problems?
    "html/semantics/scripting-1/the-script-element/script-text.html",
    // "html/semantics/scripting-1/the-template-element/additions-to-parsing-xhtml-documents/node-document.html", // templates in XHTML are totally messed up
    // "html/semantics/scripting-1/the-template-element/additions-to-parsing-xhtml-documents/template-child-nodes.html", // templates in XHTML are totally messed up
    // "html/semantics/scripting-1/the-template-element/additions-to-serializing-xhtml-documents/outerhtml.html", // templates in XHTML are totally messed up
    "html/semantics/scripting-1/the-template-element/additions-to-the-steps-to-clone-a-node/template-clone-children.html",
    "html/semantics/scripting-1/the-template-element/additions-to-the-steps-to-clone-a-node/templates-copy-document-owner.html",
    // "html/semantics/scripting-1/the-template-element/definitions/template-contents-owner-document-type.html", // requires @@toStringTag
    // "html/semantics/scripting-1/the-template-element/definitions/template-contents-owner-test-001.html", // template content owner document semantics not yet implemented
    // "html/semantics/scripting-1/the-template-element/definitions/template-contents-owner-test-002.html", // template content owner document semantics not yet implemented
    // "html/semantics/scripting-1/the-template-element/definitions/template-contents.html", // requires @@toStringTag
    "html/semantics/scripting-1/the-template-element/innerhtml-on-templates/innerhtml.html",
    "html/semantics/scripting-1/the-template-element/serializing-html-templates/outerhtml.html",
    "html/semantics/scripting-1/the-template-element/template-element/content-attribute.html",
    // "html/semantics/scripting-1/the-template-element/template-element/node-document-changes.html", // template content owner document semantics not yet implemented
    // "html/semantics/scripting-1/the-template-element/template-element/template-as-a-descendant.html", // template parsing not quite perfect yet
    "html/semantics/scripting-1/the-template-element/template-element/template-content-node-document.html",
    "html/semantics/scripting-1/the-template-element/template-element/template-content.html",
    "html/semantics/scripting-1/the-template-element/template-element/template-descendant-body.html",
    "html/semantics/scripting-1/the-template-element/template-element/template-descendant-frameset.html",
    "html/semantics/scripting-1/the-template-element/template-element/template-descendant-head.html",
    // "html/semantics/tabular-data/the-table-element/caption-methods.html",
    // "html/semantics/tabular-data/the-table-element/createTBody.html",
    "html/semantics/tabular-data/the-table-element/delete-caption.html",
    "html/semantics/tabular-data/the-table-element/insertRow-method-01.html",
    "html/semantics/tabular-data/the-table-element/insertRow-method-02.html",
    // "html/semantics/tabular-data/the-table-element/tBodies.html",
    // "html/semantics/tabular-data/the-table-element/table-insertRow.html",
    // "html/semantics/tabular-data/the-table-element/table-rows.html",
    "html/syntax/serializing-html-fragments/outerHTML.html",
    // "html/syntax/parsing/html5lib_template.html", // no idea what's going on here
    "html/syntax/parsing/template/additions-to-foster-parenting/template-is-a-foster-parent-element.html",
    "html/syntax/parsing/template/additions-to-foster-parenting/template-is-not-a-foster-parent-element.html",
    "html/syntax/parsing/template/additions-to-the-in-body-insertion-mode/generating-of-implied-end-tags.html",
    "html/syntax/parsing/template/additions-to-the-in-body-insertion-mode/ignore-body-token.html",
    "html/syntax/parsing/template/additions-to-the-in-body-insertion-mode/ignore-frameset-token.html",
    "html/syntax/parsing/template/additions-to-the-in-body-insertion-mode/ignore-head-token.html",
    "html/syntax/parsing/template/additions-to-the-in-body-insertion-mode/ignore-html-token.html",
    "html/syntax/parsing/template/additions-to-the-in-body-insertion-mode/start-tag-body.html",
    "html/syntax/parsing/template/additions-to-the-in-body-insertion-mode/start-tag-html.html",
    "html/syntax/parsing/template/additions-to-the-in-body-insertion-mode/template-end-tag-without-start-one.html",
    // "html/syntax/parsing/template/additions-to-the-in-frameset-insertion-mode/end-tag-frameset.html", // template parsing not quite perfect yet
    "html/syntax/parsing/template/additions-to-the-in-head-insertion-mode/generating-of-implied-end-tags.html",
    "html/syntax/parsing/template/additions-to-the-in-head-insertion-mode/template-end-tag-without-start-one.html",
    "html/syntax/parsing/template/additions-to-the-in-table-insertion-mode/end-tag-table.html",
    "html/syntax/parsing/template/appending-to-a-template/template-child-nodes.html",
    "html/syntax/parsing/template/clearing-the-stack-back-to-a-given-context/clearing-stack-back-to-a-table-body-context.html",
    "html/syntax/parsing/template/clearing-the-stack-back-to-a-given-context/clearing-stack-back-to-a-table-context.html",
    "html/syntax/parsing/template/clearing-the-stack-back-to-a-given-context/clearing-stack-back-to-a-table-row-context.html",
    // "html/syntax/parsing/template/creating-an-element-for-the-token/template-owner-document.html", // template content owner document semantics not yet implemented
    "html/webappapis/atob/base64.html",
    "html/webappapis/timers/evil-spec-example.html",

    "dom/events/Event-constants.html",
    "dom/events/Event-defaultPrevented.html",
    "dom/events/Event-dispatch-bubbles-false.html",
    "dom/events/Event-dispatch-handlers-changed.html",
    "dom/events/Event-dispatch-omitted-capture.html",
    "dom/events/Event-dispatch-propagation-stopped.html",
    "dom/events/Event-dispatch-reenter.html",
    "dom/events/Event-dispatch-target-moved.html",
    "dom/events/Event-dispatch-target-removed.html",
    "dom/events/Event-initEvent.html",
    "dom/events/Event-propagation.html",
    "dom/events/Event-type.html",
    "dom/events/Event-type-empty.html",
    "dom/events/EventTarget-addEventListener.html",
    "dom/events/EventTarget-dispatchEvent-returnvalue.html",
    "dom/events/EventTarget-dispatchEvent.html",
    "dom/events/EventTarget-removeEventListener.html",
    "dom/events/ProgressEvent.html",

    "DOMEvents/ClickFakeEvent.nondocument.html",
    "DOMEvents/event-phases-order.html",
    "DOMEvents/throwing-in-listener-and-window-error-event.html",
    "DOMEvents/throwing-in-listener-when-all-have-not-run-yet.html",

    "FileAPI/fileReader.html",
    "FileAPI/historical.html",
    // "FileAPI/idlharness.html", // idl should be used here
    "FileAPI/blob/Blob-close.html",
    // "FileAPI/blob/Blob-constructor.html", // - Blob is not a function
                                             // - a date is not instanceof Date
                                             // - a regexp is not instanceof Regexp
                                             // - strange v8 behaviour when error triggered in overridden array length
                                             // - HTMLSelectElement does not have indexed properties
                                             // - MessageChannel not implemented
                                             // - element attributes does not have  indexed properties
    "FileAPI/blob/Blob-slice.html",
    "FileAPI/blob/Blob-slice-overflow.html",
    // "FileAPI/blob/Blob-XHR-revoke.html", // URL.createObjectURL not implemented
    "FileAPI/file/File-constructor.html",
    // "FileAPI/filelist-section/filelist.html", // function is not instanceof Function
    "FileAPI/FileReader/Progress_event_bubbles_cancelable.html",
    "FileAPI/reading-data-section/Determining-Encoding.html",
    "FileAPI/reading-data-section/FileReader-event-handler-attributes.html",
    // "FileAPI/reading-data-section/FileReader-multiple-reads.html", // last test seems wrong ?
    "FileAPI/reading-data-section/filereader_abort.html",
    "FileAPI/reading-data-section/filereader_error.html",
    "FileAPI/reading-data-section/filereader_readAsArrayBuffer.html",
    "FileAPI/reading-data-section/filereader_readAsDataURL.html",
    "FileAPI/reading-data-section/filereader_readAsText.html",
    "FileAPI/reading-data-section/filereader_readystate.html",
    "FileAPI/reading-data-section/filereader_result.html",
    // "FileAPI/url/url_createobjecturl_blob.html", // URL.createObjectURL not implemented
    // "FileAPI/url/url_xmlhttprequest.html", // URL.createObjectURL not implemented
    "XMLHttpRequest/FormData-append.html",
    "XMLHttpRequest/abort-after-receive.htm",
    "XMLHttpRequest/abort-after-send.htm",
    "XMLHttpRequest/abort-after-stop.htm",
    "XMLHttpRequest/abort-after-timeout.htm",
    "XMLHttpRequest/abort-during-done.htm",
    "XMLHttpRequest/abort-during-open.htm",
    "XMLHttpRequest/abort-during-unsent.htm",
    "XMLHttpRequest/abort-during-upload.htm",
    "XMLHttpRequest/abort-event-abort.htm",
    "XMLHttpRequest/abort-event-listeners.htm",
    "XMLHttpRequest/abort-event-loadend.htm",
    "XMLHttpRequest/abort-event-order.htm",
    "XMLHttpRequest/abort-upload-event-abort.htm",
    "XMLHttpRequest/abort-upload-event-loadend.htm",
    "XMLHttpRequest/anonymous-mode-unsupported.htm",
    "XMLHttpRequest/data-uri.htm",
    "XMLHttpRequest/event-abort.htm",
    "XMLHttpRequest/event-error.html",
    "XMLHttpRequest/event-load.htm",
    "XMLHttpRequest/event-loadend.htm",
    "XMLHttpRequest/event-loadstart.htm",
    "XMLHttpRequest/event-progress.htm",
    "XMLHttpRequest/event-readystate-sync-open.htm",
    "XMLHttpRequest/event-readystatechange-loaded.htm",
    "XMLHttpRequest/event-timeout.htm",
    "XMLHttpRequest/event-upload-progress-crossorigin.sub.htm",
    "XMLHttpRequest/event-upload-progress.htm",
    "XMLHttpRequest/formdata-blob.htm",
    "XMLHttpRequest/formdata-delete.htm",
    "XMLHttpRequest/formdata-get.htm",
    "XMLHttpRequest/formdata-has.htm",
    "XMLHttpRequest/formdata-set.htm",
    "XMLHttpRequest/formdata.htm",
    "XMLHttpRequest/getallresponseheaders-cookies.htm",
    "XMLHttpRequest/getallresponseheaders-status.htm",
    "XMLHttpRequest/getresponseheader-case-insensitive.htm",
    "XMLHttpRequest/getresponseheader-chunked-trailer.htm",
    "XMLHttpRequest/getresponseheader-cookies-and-more.htm",
    "XMLHttpRequest/getresponseheader-error-state.htm",
    "XMLHttpRequest/getresponseheader-server-date.htm",
    "XMLHttpRequest/getresponseheader-special-characters.htm",
    "XMLHttpRequest/getresponseheader-unsent-opened-state.htm",
    // "XMLHttpRequest/interface.html", // needs this PR https://github.com/tmpvar/jsdom/pull/1406
    "XMLHttpRequest/open-after-abort.htm",
    "XMLHttpRequest/open-after-setrequestheader.htm",
    "XMLHttpRequest/open-during-abort.htm",
    "XMLHttpRequest/open-method-case-insensitive.htm",
    // "XMLHttpRequest/open-method-case-sensitive.htm", // request module forces upper case
    "XMLHttpRequest/open-method-bogus.htm",
    "XMLHttpRequest/open-method-insecure.htm",
    "XMLHttpRequest/open-method-responsetype-set-sync.htm",
    "XMLHttpRequest/open-open-send.htm",
    "XMLHttpRequest/open-open-sync-send.htm",
    "XMLHttpRequest/open-referer.htm",
    "XMLHttpRequest/open-send-open.htm",
    "XMLHttpRequest/open-sync-open-send.htm",
    "XMLHttpRequest/open-url-about-blank-window.htm",
    "XMLHttpRequest/open-url-base.htm",
    "XMLHttpRequest/open-url-base-inserted.htm",
    "XMLHttpRequest/open-url-base-inserted-after-open.htm",
    // "XMLHttpRequest/open-url-bogus.htm", // I don't understand this one
    "XMLHttpRequest/open-url-encoding.htm",
    "XMLHttpRequest/open-url-fragment.htm",
    "XMLHttpRequest/open-url-javascript-window-2.htm",
    "XMLHttpRequest/open-url-javascript-window.htm",
    "XMLHttpRequest/open-url-multi-window.htm",
    "XMLHttpRequest/open-url-multi-window-2.htm",
    "XMLHttpRequest/open-url-multi-window-3.htm",
    "XMLHttpRequest/open-url-multi-window-4.htm",
    // "XMLHttpRequest/open-url-multi-window-5.htm", // location.reload is not implemented
    // "XMLHttpRequest/open-url-worker-origin.htm", // needs Worker implementation
    // "XMLHttpRequest/open-url-worker-simple.htm", // needs Worker implementation
    "XMLHttpRequest/open-user-password-non-same-origin.htm",
    "XMLHttpRequest/overridemimetype-done-state.htm",
    "XMLHttpRequest/overridemimetype-headers-received-state-force-shiftjis.htm",
    "XMLHttpRequest/overridemimetype-invalid-mime-type.htm",
    "XMLHttpRequest/overridemimetype-loading-state.htm",
    "XMLHttpRequest/overridemimetype-open-state-force-utf-8.htm",
    "XMLHttpRequest/overridemimetype-open-state-force-xml.htm",
    "XMLHttpRequest/overridemimetype-unsent-state-force-shiftjis.htm",
    "XMLHttpRequest/preserve-ua-header-on-redirect.htm",
    "XMLHttpRequest/progress-events-response-data-gzip.htm",
    "XMLHttpRequest/response-data-arraybuffer.htm",
    "XMLHttpRequest/response-data-blob.htm",
    // "XMLHttpRequest/response-data-deflate.htm", // request module does not support deflate
    "XMLHttpRequest/response-data-gzip.htm",
    "XMLHttpRequest/response-data-progress.htm",
    "XMLHttpRequest/response-invalid-responsetype.htm",
    "XMLHttpRequest/response-json.htm",
    "XMLHttpRequest/response-method.htm",
    "XMLHttpRequest/responseText-status.html",
    "XMLHttpRequest/responsetype.html",
    "XMLHttpRequest/responseurl.html",
    // "XMLHttpRequest/responsexml-basic.htm", // xml namespace issue with getElementById
    // "XMLHttpRequest/responsexml-document-properties.htm", see https://github.com/w3c/web-platform-tests/issues/2668
    "XMLHttpRequest/responsexml-media-type.htm",
    "XMLHttpRequest/responsexml-non-document-types.htm",
    // "XMLHttpRequest/responsexml-non-well-formed.htm", // xml parsing is not strict
    "XMLHttpRequest/security-consideration.sub.html",
    "XMLHttpRequest/send-accept-language.htm",
    "XMLHttpRequest/send-accept.htm",
    "XMLHttpRequest/send-authentication-basic-cors-not-enabled.htm",
    "XMLHttpRequest/send-authentication-basic-cors.htm",
    "XMLHttpRequest/send-authentication-basic-repeat-no-args.htm",
    "XMLHttpRequest/send-authentication-basic-setrequestheader-existing-session.htm",
    "XMLHttpRequest/send-authentication-basic-setrequestheader.htm",
    "XMLHttpRequest/send-authentication-basic.htm",
    "XMLHttpRequest/send-authentication-competing-names-passwords.htm",
    // "XMLHttpRequest/send-authentication-cors-basic-setrequestheader.htm", // seems wrong ?
    "XMLHttpRequest/send-conditional.htm",
    "XMLHttpRequest/send-content-type-charset.htm",
    "XMLHttpRequest/send-content-type-string.htm",
    "XMLHttpRequest/send-data-arraybuffer.htm",
    "XMLHttpRequest/send-data-blob.htm",
    "XMLHttpRequest/send-data-es-object.htm",
    "XMLHttpRequest/send-data-formdata.htm",
    "XMLHttpRequest/send-data-unexpected-tostring.htm",
    "XMLHttpRequest/send-entity-body-basic.htm",
    "XMLHttpRequest/send-entity-body-document-bogus.htm",
    "XMLHttpRequest/send-entity-body-document.htm",
    "XMLHttpRequest/send-entity-body-empty.htm",
    "XMLHttpRequest/send-entity-body-get-head-async.htm",
    "XMLHttpRequest/send-entity-body-get-head.htm",
    "XMLHttpRequest/send-entity-body-none.htm",
    "XMLHttpRequest/send-network-error-async-events.sub.htm",
    "XMLHttpRequest/send-network-error-sync-events.sub.htm",
    "XMLHttpRequest/send-no-response-event-loadend.htm",
    "XMLHttpRequest/send-no-response-event-loadstart.htm",
    "XMLHttpRequest/send-no-response-event-order.htm",
    "XMLHttpRequest/send-non-same-origin.sub.htm",
    "XMLHttpRequest/send-receive-utf16.htm",
    "XMLHttpRequest/send-redirect-bogus-sync.htm",
    "XMLHttpRequest/send-redirect-bogus.htm",
    // "XMLHttpRequest/send-redirect-infinite-sync.htm", // the test seems broken locally
    // "XMLHttpRequest/send-redirect-infinite.htm", // the test seems broken locally
    "XMLHttpRequest/send-redirect-no-location.htm",
    // "XMLHttpRequest/send-redirect-to-cors.htm", // request module remove content-type header on redirect
    "XMLHttpRequest/send-redirect-to-non-cors.htm",
    // "XMLHttpRequest/send-redirect.htm", // request module remove content-type header on redirect
    "XMLHttpRequest/send-response-event-order.htm",
    "XMLHttpRequest/send-response-upload-event-loadend.htm",
    "XMLHttpRequest/send-response-upload-event-loadstart.htm",
    "XMLHttpRequest/send-response-upload-event-progress.htm",
    "XMLHttpRequest/send-send.htm",
    "XMLHttpRequest/send-sync-blocks-async.htm",
    "XMLHttpRequest/send-sync-no-response-event-load.htm",
    "XMLHttpRequest/send-sync-no-response-event-loadend.htm",
    "XMLHttpRequest/send-sync-no-response-event-order.htm",
    "XMLHttpRequest/send-sync-response-event-order.htm",
    "XMLHttpRequest/send-sync-timeout.htm",
    "XMLHttpRequest/send-timeout-events.htm",
    // "XMLHttpRequest/send-usp.html", // needs URLSearchParams implementation
    "XMLHttpRequest/setrequestheader-after-send.htm",
    "XMLHttpRequest/setrequestheader-allow-empty-value.htm",
    "XMLHttpRequest/setrequestheader-allow-whitespace-in-value.htm",
    "XMLHttpRequest/setrequestheader-before-open.htm",
    "XMLHttpRequest/setrequestheader-bogus-name.htm",
    "XMLHttpRequest/setrequestheader-bogus-value.htm",
    "XMLHttpRequest/setrequestheader-case-insensitive.htm",
    "XMLHttpRequest/setrequestheader-content-type.htm",
    "XMLHttpRequest/setrequestheader-header-allowed.htm",
    "XMLHttpRequest/setrequestheader-header-forbidden.htm",
    "XMLHttpRequest/setrequestheader-open-setrequestheader.htm",
    "XMLHttpRequest/status-async.htm",
    "XMLHttpRequest/status-basic.htm",
    "XMLHttpRequest/status-error.htm",
    "XMLHttpRequest/timeout-cors-async.htm",
    "XMLHttpRequest/timeout-sync.htm",
    "XMLHttpRequest/xmlhttprequest-basic.htm",
    "XMLHttpRequest/xmlhttprequest-eventtarget.htm",
    // "XMLHttpRequest/xmlhttprequest-network-error-sync.htm", // the test seems broken locally
    // "XMLHttpRequest/xmlhttprequest-network-error.htm", // the test seems broken locally
    // "XMLHttpRequest/xmlhttprequest-timeout-aborted.html", // self instanceof Window fails
    // "XMLHttpRequest/xmlhttprequest-timeout-abortedonmain.html", // self instanceof Window fails
    // "XMLHttpRequest/xmlhttprequest-timeout-overrides.html", // self instanceof Window fails
    // "XMLHttpRequest/xmlhttprequest-timeout-overridesexpires.html", // self instanceof Window fails
    // "XMLHttpRequest/xmlhttprequest-timeout-simple.html", // self instanceof Window fails
    // "XMLHttpRequest/xmlhttprequest-timeout-synconmain.html", // self instanceof Window fails
    // "XMLHttpRequest/xmlhttprequest-timeout-twice.html", // self instanceof Window fails
    // "XMLHttpRequest/xmlhttprequest-timeout-worker-aborted.html", // needs worker implementation
    // "XMLHttpRequest/xmlhttprequest-timeout-worker-overrides.html", // needs worker implementation
    // "XMLHttpRequest/xmlhttprequest-timeout-worker-overridesexpires.html", // needs worker implementation
    // "XMLHttpRequest/xmlhttprequest-timeout-worker-simple.html", // needs worker implementation
    // "XMLHttpRequest/xmlhttprequest-timeout-worker-synconworker.html", // needs worker implementation
    // "XMLHttpRequest/xmlhttprequest-timeout-worker-twice.html", // needs worker implementation
    "XMLHttpRequest/xmlhttprequest-unsent.htm",
    "XMLHttpRequest/XMLHttpRequest-withCredentials.html",
    "cors/allow-headers.htm",
    "cors/basic.htm",
    "cors/credentials-flag.htm",
    // "cors/late-upload-events.htm", // I don't know how to fix this one
    "cors/origin.htm",
    // "cors/preflight-cache.htm", // cache should probably be implemented for simple requests before
    "cors/redirect-origin.htm",
    "cors/redirect-preflight.htm",
    // "cors/redirect-preflight-2.htm", // preflight should also be done before redirected requests
                                        // but request module redirects cannot be paused while doing preflight
    "cors/redirect-userinfo.htm",
    // "cors/remote-origin.htm", // postMessage event does not contain source
    "cors/request-headers.htm",
    // "cors/response-headers.htm", // I don't find a spec about combining same value response headers
                                    // and slow synchronous requests cause a timeout on an asynchronous test
    // "cors/simple-requests.htm", // slow synchronous requests cause a timeout on an asynchronous test too
    "cors/status-async.htm",
    "cors/status-preflight.htm",
    "cors/status.htm"
  ]
  .forEach(runWebPlatformTest);
});
