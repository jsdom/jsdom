exports.tests = {
/**
* Changes certifiedText on LSInput.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-DOMImplementationLS-createLSInput
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSInput-certifiedText
*/
CertifiedText1 : function () {
   var success;
    if(checkInitialization(builder, "CertifiedText1") != null) return;
    var domImpl;
      var input;
      var certifiedText;
      domImpl = getImplementation();
input = domImpl.createLSInput();
      certifiedText = input.certifiedText;

      assertFalse("initiallyFalse",certifiedText);
input.certifiedText = true;

      certifiedText = input.certifiedText;

      assertTrue("setTrue",certifiedText);
input.certifiedText = false;

      certifiedText = input.certifiedText;

      assertFalse("setFalse",certifiedText);

},
/**
* Writes a document to a character stream and rereads the document.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-DOMImplementationLS-createLSInput
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSInput-characterStream
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSOutput-characterStream
*/
CharacterStream1 : function () {
   var success;
    if(checkInitialization(builder, "CharacterStream1") != null) return;
    var testDoc;
      var domImpl;
      var output;
      var serializer;
      var writer;
      var checkWriter;
      var reader;
      var checkReader;
      var status;
      var input;
      var parser;
      var checkDoc;
      var docElem;
      var docElemName;
      var NULL_SCHEMA_TYPE = null;

      
      var testDocRef = null;
      if (typeof(this.testDoc) != 'undefined') {
        testDocRef = this.testDoc;
      }
      testDoc = load(testDocRef, "testDoc", "test0");
      domImpl = getImplementation();
output = domImpl.createLSOutput();
      checkWriter = output.characterStream;

      assertNull("writerInitiallyNull",checkWriter);
    output.characterStream = writer;

      checkWriter = output.characterStream;

      assertNotNull("writerNotNull",checkWriter);
serializer = domImpl.createLSSerializer();
      status = serializer.write(testDoc,output);
      assertTrue("writeStatus",status);
reader =  writer;
input = domImpl.createLSInput();
      checkReader = input.characterStream;

      assertNull("readerInitiallyNull",checkReader);
    input.characterStream = reader;

      checkReader = input.characterStream;

      assertNotNull("readerNotNull",checkReader);
parser = domImpl.createLSParser(1,NULL_SCHEMA_TYPE);
      checkDoc = parser.parse(input);
      assertNotNull("checkNotNull",checkDoc);
docElem = checkDoc.documentElement;

      docElemName = docElem.nodeName;

      assertEquals("checkDocElemName","elt0",docElemName);
       
},
/**
* Parses a document twice, once using a filter to reject all elt1 elements.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-filter
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParserFilter-startElement
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParserFilter-whatToShow
*/
DOMBuilderFilterTest0 : function () {
   var success;
    if(checkInitialization(builder, "DOMBuilderFilterTest0") != null) return;
    myfilter = new LSParserFilterN10027();
	  
      var list;
      var count;
      var resourceURI;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      resourceURI = getResourceURI(TEST1);
      document = builder.parseURI(resourceURI);
      list = document.getElementsByTagName("elt1");
      count = list.length;

      assertEquals("filter_count_1",1,count);
       builder.filter = myfilter;

      document = builder.parseURI(resourceURI);
      assertNotNull("secondParseDocumentNotNull",document);
list = document.getElementsByTagName("elt1");
      count = list.length;

      assertEquals("filter_count_2",0,count);
       
},

/**
* DOM Builder Filter test, test whether incorrect node types are never passed to the filter.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-Interfaces-LSParserFilter
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-filter
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParserFilter-acceptNode
*/
DOMBuilderFilterTest1 : function () {
   var success;
    if(checkInitialization(builder, "DOMBuilderFilterTest1") != null) return;
    var resourceURI;
      myfilter = new LSParserFilterN1002B();
	  
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      builder.filter = myfilter;

      resourceURI = getResourceURI(TEST7);
      document = builder.parseURI(resourceURI);
      assertNotNull("documentNotNull",document);

},
/**
* Checks that attributes are visible when elements are passed to LSParserFilter.startElement.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-Interfaces-LSParserFilter
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParserFilter-startElement
*/
DOMBuilderFilterTest2 : function () {
   var success;
    if(checkInitialization(builder, "DOMBuilderFilterTest2") != null) return;
    var resourceURI;
      myfilter = new LSParserFilterN10028();
	  
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      builder.filter = myfilter;

      resourceURI = getResourceURI(TEST3);
      document = builder.parseURI(resourceURI);
      
},
/**
* Parses a document, writes it to string, parses the string and checks that the number of elt1 elements is as expected.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parse
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSInput-stringData
*/
DOMBuilderTest0 : function () {
   var success;
    if(checkInitialization(builder, "DOMBuilderTest0") != null) return;
    var elementList;
      var stringDoc;
      var resourceURI;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      resourceURI = getResourceURI(TEST0);
      document = builder.parseURI(resourceURI);
      elementList = document.getElementsByTagName("elt1");
      assertSize("count_elt1_1",2,elementList);
stringDoc = writer.writeToString(document);
      inputSource.stringData = stringDoc;

      document = builder.parse(inputSource);
      elementList = document.getElementsByTagName("elt1");
      assertSize("count_elt1_2",2,elementList);

},
/**
* Uses LSParser.parseWithContext to replace a node in an existing document.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseWithContext
*/
DOMBuilderTest1 : function () {
   var success;
    if(checkInitialization(builder, "DOMBuilderTest1") != null) return;
    var elementList;
      var stringDoc;
      var firstElt2;
      var returnNode;
      var resourceURI;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      resourceURI = getResourceURI(TEST0);
      document = builder.parseURI(resourceURI);
      elementList = document.getElementsByTagName("elt2");
      assertSize("elt2Count_1",1,elementList);
firstElt2 = elementList.item(0);
      resourceURI = getResourceURI(TEST2);
      inputSource.systemId = resourceURI;

      
      try {
      returnNode = builder.parseWithContext(inputSource,firstElt2,ACTION_REPLACE);
      
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_SUPPORTED_ERR */ 9 :
               return ;
    default:
          throw ex;
          }
       } else { 
       throw ex;
        }
         }
        elementList = document.getElementsByTagName("elt2");
      assertSize("elt2Count_2",1,elementList);
elementList = document.getElementsByTagName("elt3");
      assertSize("elt3Count",1,elementList);

},
/**
* Uses LSParser.parseWithContext to append a document as a child of an existing node.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseWithContext
*/
DOMBuilderTest2 : function () {
   var success;
    if(checkInitialization(builder, "DOMBuilderTest2") != null) return;
    var elementList;
      var stringDoc;
      var firstElt0;
      var returnNode;
      var resourceURI;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      resourceURI = getResourceURI(TEST0);
      document = builder.parseURI(resourceURI);
      elementList = document.getElementsByTagName("elt0");
      assertSize("count_elt0",1,elementList);
firstElt0 = elementList.item(0);
      resourceURI = getResourceURI(TEST2);
      inputSource.systemId = resourceURI;

      
      try {
      returnNode = builder.parseWithContext(inputSource,firstElt0,ACTION_APPEND_AS_CHILDREN);
      
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_SUPPORTED_ERR */ 9 :
               return ;
    default:
          throw ex;
          }
       } else { 
       throw ex;
        }
         }
        elementList = document.getElementsByTagName("elt2");
      assertSize("count_elt2",2,elementList);
elementList = document.getElementsByTagName("elt3");
      assertSize("count_elt3",1,elementList);

},
/**
* Uses LSParser.parseWithContext to insert a document after a node.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseWithContext
*/
DOMBuilderTest3 : function () {
   var success;
    if(checkInitialization(builder, "DOMBuilderTest3") != null) return;
    var elementList;
      var stringDoc;
      var firstElt1;
      var secondElt1;
      var thirdElt;
      var nodeName;
      var returnNode;
      var resourceURI;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      resourceURI = getResourceURI(TEST0);
      document = builder.parseURI(resourceURI);
      elementList = document.getElementsByTagName("elt1");
      assertSize("count_elt1",2,elementList);
firstElt1 = elementList.item(0);
      secondElt1 = firstElt1.nextSibling;

      nodeName = secondElt1.nodeName;

      assertEquals("nextSibling_before_add","elt1",nodeName);
       resourceURI = getResourceURI(TEST2);
      inputSource.systemId = resourceURI;

      
      try {
      returnNode = builder.parseWithContext(inputSource,firstElt1,ACTION_INSERT_AFTER);
      
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_SUPPORTED_ERR */ 9 :
               return ;
    default:
          throw ex;
          }
       } else { 
       throw ex;
        }
         }
        secondElt1 = firstElt1.nextSibling;

      nodeName = secondElt1.nodeName;

      assertEquals("nextSibling_after_add","elt2",nodeName);
       thirdElt = secondElt1.nextSibling;

      nodeName = thirdElt.nodeName;

      assertEquals("nextSiblings_sibling_after_add","elt1",nodeName);
       
},
/**
* Uses LSParser.parseWithContext to insert a document before a node.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseWithContext
*/
DOMBuilderTest4 : function () {
   var success;
    if(checkInitialization(builder, "DOMBuilderTest4") != null) return;
    var elementList;
      var stringDoc;
      var firstElt1;
      var secondElt1;
      var thirdElt;
      var nodeName;
      var returnNode;
      var resourceURI;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      resourceURI = getResourceURI(TEST0);
      document = builder.parseURI(resourceURI);
      elementList = document.getElementsByTagName("elt1");
      assertSize("count_elt1",2,elementList);
secondElt1 = elementList.item(1);
      firstElt1 = secondElt1.previousSibling;

      nodeName = firstElt1.nodeName;

      assertEquals("previousSibling_before_insert_before","elt1",nodeName);
       resourceURI = getResourceURI(TEST2);
      inputSource.systemId = resourceURI;

      
      try {
      returnNode = builder.parseWithContext(inputSource,secondElt1,ACTION_INSERT_BEFORE);
      
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_SUPPORTED_ERR */ 9 :
               return ;
    default:
          throw ex;
          }
       } else { 
       throw ex;
        }
         }
        firstElt1 = secondElt1.previousSibling;

      nodeName = firstElt1.nodeName;

      assertEquals("previousSibling_after_insert_before","elt2",nodeName);
       
},

/**
* supported-media-types-only is set to true if supported and
    an XML file with an unsupported media type from an HTTP server
    on the local machine is retrieved.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-supported-media-types-only
*/
DOMBuilderTest5 : function () {
   var success;
    if(checkInitialization(builder, "DOMBuilderTest5") != null) return;
    var elementList;
      var stringDoc;
      var configuration;
      var ERROR_HANDLER = "error-handler";
      var SUPPORTED_MEDIATYPES_ONLY = "supported-media-types-only";
      var mediaTypesSupported;
      var resourceURI;
      errorHandler = new DOMErrorHandlerN10042();
	  
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      configuration = builder.domConfig;

      resourceURI = getResourceURI(TESTPDF);
      document = builder.parseURI(resourceURI);
      assertNotNull("testpdf_parsed",document);
mediaTypesSupported = configuration.canSetParameter(SUPPORTED_MEDIATYPES_ONLY,true);
      
	if(
	mediaTypesSupported
	) {
	configuration.setParameter(SUPPORTED_MEDIATYPES_ONLY, true);
	 configuration.setParameter(ERROR_HANDLER, errorHandler.handleError);
	 
	{
		success = false;
		try {
            document = builder.parseURI(resourceURI);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 81);
		}
		assertTrue("throw_PARSE_ERR",success);
	}

	}
	
},
/**
* Parses from an uninitialized LSInput.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parse
*/
DOMBuilderTest6 : function () {
   var success;
    if(checkInitialization(builder, "DOMBuilderTest6") != null) return;
    var domImpl;
      var parser;
      var NULL_SCHEMA_TYPE = null;

      var input;
      var document;
      domImpl = getImplementation();
parser = domImpl.createLSParser(1,NULL_SCHEMA_TYPE);
      input = domImpl.createLSInput();
      
	{
		success = false;
		try {
            document = parser.parse(input);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 81);
		}
		assertTrue("throw_PARSE_ERR",success);
	}

},
/**
* Parses an unresolvable System ID.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parse
*/
DOMBuilderTest8 : function () {
   var success;
    if(checkInitialization(builder, "DOMBuilderTest8") != null) return;
    var domImpl;
      var parser;
      var NULL_SCHEMA_TYPE = null;

      var input;
      var document;
      var resourceURI;
      domImpl = getImplementation();
parser = domImpl.createLSParser(1,NULL_SCHEMA_TYPE);
      input = domImpl.createLSInput();
      resourceURI = getResourceURI("test0");
      resourceURI = resourceURI + "_missing";
input.systemId = resourceURI;

      
	{
		success = false;
		try {
            document = parser.parse(input);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 81);
		}
		assertTrue("throw_PARSE_ERR",success);
	}

},
/**
* Checks parameters on call to resolve resource are
       as expected and redirects to parse a different resource.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSResourceResolver-resolveResource
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-resource-resolver
*/
DOMEntityResolverTest0 : function () {
   var success;
    if(checkInitialization(builder, "DOMEntityResolverTest0") != null) return;
    var resourceURI;
      var elt2List;
      var elt2Count;
      myentityresolver = new LSResourceResolverN10030();
	  
      var configuration;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      configuration = builder.domConfig;

      configuration.setParameter("resource-resolver", myentityresolver);
	 resourceURI = getResourceURI(TEST4);
      document = builder.parseURI(resourceURI);
      elt2List = document.getElementsByTagName("elt2");
      elt2Count = elt2List.length;

      assertEquals("elt2Count",1,elt2Count);
       
},
/**
* Tests a custom entity resolver. The entity resolver creates an input source that supplies 2 elt1 elements. The original entity reference referes to 1 elt1
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSResourceResolver-resolveResource
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-resource-resolver
*/
DOMEntityResolverTest1 : function () {
   var success;
    if(checkInitialization(builder, "DOMEntityResolverTest1") != null) return;
    myentityresolver = new LSResourceResolverN10028();
	  
      var elementList;
      var configuration;
      var resourceURI;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      configuration = builder.domConfig;

      resourceURI = getResourceURI(TEST4);
      document = builder.parseURI(resourceURI);
      elementList = document.getElementsByTagName("elt1");
      assertSize("count_elt1_before_applying_entity_resolver",2,elementList);
configuration.setParameter("resource-resolver", myentityresolver);
	 document = builder.parseURI(resourceURI);
      elementList = document.getElementsByTagName("elt1");
      assertSize("count_elt1_after_applying_entity_resolver",3,elementList);

},
/**
* Resource resolvers do not participate in resolving the top-level document entity.
    This test attempts to redirect any resource and then checks that the
    requested document was not affected.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSResourceResolver-resolveResource
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-resource-resolver
*/
DOMEntityResolverTest2 : function () {
   var success;
    if(checkInitialization(builder, "DOMEntityResolverTest2") != null) return;
    var resourceURI;
      var docElem;
      var docElemName;
      myentityresolver = new LSResourceResolverN10030();
	  
      var configuration;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      configuration = builder.domConfig;

      configuration.setParameter("resource-resolver", myentityresolver);
	 resourceURI = getResourceURI(TEST0);
      document = builder.parseURI(resourceURI);
      assertNotNull("documentNotNull",document);
docElem = document.documentElement;

      docElemName = docElem.nodeName;

      assertEquals("docElemName","elt0",docElemName);
       
},
/**
* Uses DOMImplementationLS.createLSParser to create a synchronous parser with an unspecified schema type.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-DOMImplementationLS-createLSParser
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-async
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-busy
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-filter
*/
DOMImplementationLSTest0 : function () {
   var success;
    if(checkInitialization(builder, "DOMImplementationLSTest0") != null) return;
    var isAsync;
      var isBusy;
      var filter;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      assertNotNull("builderNotNull",builder);
isAsync = builder.async;

      assertFalse("notAsync",isAsync);
isBusy = builder.busy;

      assertFalse("notBusy",isBusy);
filter = builder.filter;

      assertNull("nullFilter",filter);
    
},
/**
* Calls DOMImplementationLS.createLSParser(MODE_ASYNCHRONOUS, null) and 
       checks the return value is not null.  Only applicable if DOMImplementation.hasFeature("LS-ASync", null) is true.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-DOMImplementationLS-createLSParser
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-async
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-busy
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-filter
*/
DOMImplementationLSTest1 : function () {
   var success;
    if(checkInitialization(builder, "DOMImplementationLSTest1") != null) return;
    var isAsync;
      var isBusy;
      var filter;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_ASYNCHRONOUS,NULL_SCHEMATYPE);
      assertNotNull("builderNotNull",builder);
isAsync = builder.async;

      assertTrue("notAsync",isAsync);
isBusy = builder.busy;

      assertFalse("notBusy",isBusy);
filter = builder.filter;

      assertNull("nullFilter",filter);
    
},
/**
* Calls DOMImplementationLS.createLSParser(MODE_SYNCHRONOUS, "http://www.w3.org/TR/REC-xml") and checks the return value is not null.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-DOMImplementationLS-createLSParser
*/
DOMImplementationLSTest2 : function () {
   var success;
    if(checkInitialization(builder, "DOMImplementationLSTest2") != null) return;
    var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,DTD_SCHEMATYPE);
      assertNotNull("builderNotNull",builder);

},
/**
* Calls DOMImplementationLS.createLSParser(MODE_SYNCHRONOUS, "http://www.w3.org/2001/XMLSchema").  
    Should either throw a NOT_SUPPORTED_ERR or return a non-null builder.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-DOMImplementationLS-createLSParser
*/
DOMImplementationLSTest3 : function () {
   var success;
    if(checkInitialization(builder, "DOMImplementationLSTest3") != null) return;
    var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;

      try {
      builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,SCHEMA_SCHEMATYPE);
      assertNotNull("builderNotNull",builder);

      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_SUPPORTED_ERR */ 9 :
       break;
          default:
          throw ex;
          }
       } else { 
       throw ex;
        }
         }
        
},
/**
* Calls DOMImplementationLS.createLSParser(MODE_SYNCHRONOUS, "http://nobody...err") expecting that a
    NOT_SUPPORTED_ERR would be raised.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-DOMImplementationLS-createLSParser
*/
DOMImplementationLSTest4 : function () {
   var success;
    if(checkInitialization(builder, "DOMImplementationLSTest4") != null) return;
    var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;

	{
		success = false;
		try {
            builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,"http://nobody_should_support_this_schematype_this_should_throw_a_not_supported_err");
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("NOT_SUPPORTED_ERR",success);
	}

},
/**
* Calls DOMImplementationLS.createLSParser(MODE_SYNCHRONOUS, "http://nobody...err") expecting that a
    NOT_SUPPORTED_ERR would be raised.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-DOMImplementationLS-createLSParser
*/
DOMImplementationLSTest5 : function () {
   var success;
    if(checkInitialization(builder, "DOMImplementationLSTest5") != null) return;
    var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;

	{
		success = false;
		try {
            builder = lsImplementation.createLSParser(17,NULL_SCHEMATYPE);
        }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("NOT_SUPPORTED_ERR",success);
	}

},
/**
* Parses a document from a byte stream.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSInput-byteStream
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parse
*/
DOMInputSourceTest0 : function () {
   var success;
    if(checkInitialization(builder, "DOMInputSourceTest0") != null) return;
    var myByteStream = "3C656C74302F3E";
      var elementList;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      inputSource.byteStream = myByteStream;

      document = builder.parse(inputSource);
      elementList = document.getElementsByTagName("elt0");
      assertSize("count_elt0",1,elementList);

},
/**
* Parses a document from a character stream.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSInput-characterStream
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parse
*/
DOMInputSourceTest1 : function () {
   var success;
    if(checkInitialization(builder, "DOMInputSourceTest1") != null) return;
    var myReader = "&lt;elt0/>";
      var elementList;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      inputSource.characterStream = myReader;

      document = builder.parse(inputSource);
      elementList = document.getElementsByTagName("elt0");
      assertSize("count_elt0",1,elementList);

},
/**
* test the builder by using a string inputsource
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSInput-stringData
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parse
*/
DOMInputSourceTest2 : function () {
   var success;
    if(checkInitialization(builder, "DOMInputSourceTest2") != null) return;
    var elementList;
      var myString = "&lt;elt0>elt0&lt;/elt0>";
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      inputSource.stringData = myString;

      document = builder.parse(inputSource);
      elementList = document.getElementsByTagName("elt0");
      assertSize("count_elt0",1,elementList);

},
/**
* Specify encodings for LSInput with string data.  The
    setting should have no effect and the inputEncoding of the resulting document should be UTF-16.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSInput-encoding
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parse
*/
DOMInputSourceTest3 : function () {
   var success;
    if(checkInitialization(builder, "DOMInputSourceTest3") != null) return;
    var myString = "<?xml version='1.0' encoding='UTF-8'?>&lt;elt0>elt0&lt;/elt0>";
      var encodingString;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      inputSource.stringData = myString;

      inputSource.encoding = "UTF-8";

      document = builder.parse(inputSource);
      encodingString = document.inputEncoding;

      assertEquals("encodingstringcheck0","UTF-16".toLowerCase(),encodingString.toLowerCase());
       
},
/**
* tests whether DOMInput whether abort can be called even if loading is finished already
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-abort
*/
DOMInputSourceTest4 : function () {
   var success;
    if(checkInitialization(builder, "DOMInputSourceTest4") != null) return;
    var elementList;
      var myString = "<?xml version='1.0' encoding='UTF-8'?>&lt;elt0>elt0&lt;/elt0>";
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      inputSource.stringData = myString;

      document = builder.parse(inputSource);
      builder.abort();
      
},
/**
* Parses a document containing an external entity and checks
    that resource resolver is passed the baseURI value specified on LSInput.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSInput-systemId
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSInput-publicId
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSInput-baseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSResourceResolver-resolveResource
*/
DOMInputSourceTest5 : function () {
   var success;
    if(checkInitialization(builder, "DOMInputSourceTest5") != null) return;
    myentityresolver = new LSResourceResolverN1002A();
	  
      var configuration;
      var resourceURI;
      var nodeList;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      configuration = builder.domConfig;

      configuration.setParameter("resource-resolver", myentityresolver);
	 configuration.setParameter("entities", false);
	 resourceURI = getResourceURI(TEST4);
      inputSource.systemId = resourceURI;

      inputSource.publicId = "-//X-Hive//native xml storage//DE";

      inputSource.baseURI = "http://www.example.com/new_base";

      document = builder.parse(inputSource);
      assertNotNull("documentNotNull",document);
nodeList = document.getElementsByTagName("elt2");
      assertSize("noElt2",0,nodeList);
nodeList = document.getElementsByTagName("elt1");
      assertSize("hasElt1",1,nodeList);

},
/**
* Specify encodings for LSInput with a character stream.  The
    setting should have no effect and the inputEncoding of the resulting document should be UTF-16.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSInput-encoding
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parse
*/
DOMInputSourceTest6 : function () {
   var success;
    if(checkInitialization(builder, "DOMInputSourceTest6") != null) return;
    var encodingString;
      var myReader = "<?xml version='1.0' encoding='UTF-8'?>&lt;elt0>elt0&lt;/elt0>";
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      inputSource.encoding = "UTF-8";

      inputSource.characterStream = myReader;

      document = builder.parse(inputSource);
      assertNotNull("documentNotNull",document);
encodingString = document.inputEncoding;

      assertEquals("encodingstringcheck0","UTF-16".toLowerCase(),encodingString.toLowerCase());
       
},

/**
* DOMSerializerFilter test, a simple test eliminating a subtree
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-Interfaces-LSSerializerFilter
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-LSSerializerFilter
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializerFilter-acceptNode
*/
DOMWriterFilterTest0 : function () {
   var success;
    if(checkInitialization(builder, "DOMWriterFilterTest0") != null) return;
    myfilter = new LSSerializerFilterN10027();
	  
      var configuration;
      var stringDoc = "&lt;elt1>first elt1&lt;elt2>elt2&lt;/elt2>&lt;/elt1>";
      var writeResult;
      var length;
      var elementList;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      inputSource.stringData = stringDoc;

      document = builder.parse(inputSource);
      writer.filter = myfilter;

      writeResult = writer.writeToString(document);
      inputSource.stringData = writeResult;

      document = builder.parse(inputSource);
      elementList = document.getElementsByTagName("elt2");
      assertSize("count_elt2",0,elementList);
elementList = document.getElementsByTagName("elt1");
      assertSize("count_elt1",1,elementList);

},

/**
* Uses a serializer filter to eliminate attributes, parses the output and checks if the attribute is not there.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-Interfaces-LSSerializerFilter
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-LSSerializerFilter
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializerFilter-acceptNode
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializerFilter-whatToShow
*/
DOMWriterFilterTest1 : function () {
   var success;
    if(checkInitialization(builder, "DOMWriterFilterTest1") != null) return;
    myfilter = new LSSerializerFilterN1002A();
	  
      var configuration;
      var stringDoc = "&lt;elt1 attr1='attr1'>first elt1&lt;/elt1>";
      var writeResult;
      var length;
      var elementList;
      var elt1;
      var attrNode;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      inputSource.stringData = stringDoc;

      document = builder.parse(inputSource);
      writer.filter = myfilter;

      writeResult = writer.writeToString(document);
      inputSource.stringData = writeResult;

      document = builder.parse(inputSource);
      elementList = document.getElementsByTagName("elt1");
      assertSize("count_elt2",1,elementList);
elt1 = elementList.item(0);
      attrNode = elt1.getAttributeNode("attr1");
      assertNull("attrib1",attrNode);
    
},

/**
* Uses a filter to strip text during serialization
    parsers to check expections.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-LSSerializerFilter
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializerFilter-acceptNode
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializerFilter-whatToShow
* @see http://www.w3.org/Bugs/Public/show_bug.cgi?id=643
*/
DOMWriterFilterTest2 : function () {
   var success;
    if(checkInitialization(builder, "DOMWriterFilterTest2") != null) return;
    myfilter = new LSSerializerFilterN1002A();
	  
      var stringDoc = "&lt;elt1 attr1='attr1'>first elt1&lt;/elt1>";
      var writeResult;
      var length;
      var elementList;
      var elt1;
      var childs;
      var attrNode;
      var attr1;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      inputSource.stringData = stringDoc;

      document = builder.parse(inputSource);
      writer.filter = myfilter;

      writeResult = writer.writeToString(document);
      inputSource.stringData = writeResult;

      document = builder.parse(inputSource);
      elementList = document.getElementsByTagName("elt1");
      elt1 = elementList.item(0);
      attrNode = elt1.getAttributeNode("attr1");
      assertNotNull("attrExists",attrNode);
attr1 = attrNode.nodeValue;

      assertEquals("attrUnchanged","attr1",attr1);
       childs = elt1.hasChildNodes();
      assertFalse("nodeHasChilds_elt1",childs);

},

/**
* Eliminates comments on serialization, parses results and checks for comments.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-LSSerializerFilter
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializerFilter-acceptNode
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializerFilter-whatToShow
*/
DOMWriterFilterTest3 : function () {
   var success;
    if(checkInitialization(builder, "DOMWriterFilterTest3") != null) return;
    myfilter = new LSSerializerFilterN10027();
	  
      var configuration;
      var stringDoc = "&lt;elt1>&lt;elt2>elt2&lt;/elt2><!--comment1-->&lt;/elt1>";
      var writeResult;
      var length;
      var elementList;
      var children;
      var elt1;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      inputSource.stringData = stringDoc;

      document = builder.parse(inputSource);
      writer.filter = myfilter;

      writeResult = writer.writeToString(document);
      inputSource.stringData = writeResult;

      document = builder.parse(inputSource);
      elementList = document.getElementsByTagName("elt1");
      assertSize("count_elt1",1,elementList);
elt1 = elementList.item(0);
      children = elt1.childNodes;

      assertSize("count_children",1,children);

},
/**
* Calls LSSerializer.writeToString and checks result.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
*/
DOMWriterTest0 : function () {
   var success;
    if(checkInitialization(builder, "DOMWriterTest0") != null) return;
    var stringDoc;
      var writeResult;
      var elementList;
      var resourceURI;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      resourceURI = getResourceURI(TEST0);
      document = builder.parseURI(resourceURI);
      writeResult = writer.writeToString(document);
      inputSource.stringData = writeResult;

      document = builder.parse(inputSource);
      elementList = document.getElementsByTagName("elt2");
      assertSize("elt2Count_1",1,elementList);

},
/**
* Writes an element node to a byte stream.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSOutput-byteStream
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-write
*/
DOMWriterTest1 : function () {
   var success;
    if(checkInitialization(builder, "DOMWriterTest1") != null) return;
    var stringDoc;
      var writeResult;
      var elementList;
      var firstElt3;
      var output;
      var outputStream;
      var inputStream = null;

      var resourceURI;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      resourceURI = getResourceURI(TEST2);
      document = builder.parseURI(resourceURI);
      elementList = document.getElementsByTagName("elt3");
      firstElt3 = elementList.item(0);
      output = lsImplementation.createLSOutput();
      output.byteStream = outputStream;

      writeResult = writer.write(firstElt3,output);
      inputStream =  outputStream;
inputSource.byteStream = inputStream;

      document = builder.parse(inputSource);
      elementList = document.getElementsByTagName("elt2");
      assertSize("elt2Count_1",0,elementList);

},
/**
* Serializes a document without a XML declaration for both for 'xml-declaration' configuration values.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#DOMConfiguration-canSetParameter
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-config
*/
DOMWriterTest2 : function () {
   var success;
    if(checkInitialization(builder, "DOMWriterTest2") != null) return;
    var configuration;
      var XML_DECLARATION = "xml-declaration";
      var stringDoc = "&lt;hello>me again&lt;/hello>";
      var writeResult;
      var xmlDecl;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      inputSource.stringData = stringDoc;

      document = builder.parse(inputSource);
      configuration = writer.domConfig;

      configuration.setParameter(XML_DECLARATION, false);
	 writeResult = writer.writeToString(document);
      assertEquals("without_xml_declaration",stringDoc,writeResult);
       configuration.setParameter(XML_DECLARATION, true);
	 writeResult = writer.writeToString(document);
      fail("Unrecognized method or attribute substring");

      assertEquals("with_xml_declaration","<?xml ",xmlDecl);
       
},
/**
* Serializes a document with a XML declaration for both for 'xml-declaration' configuration values.
* @author Jeroen van Rotterdam
* @author X-Hive Corporation
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#DOMConfiguration-canSetParameter
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-config
*/
DOMWriterTest3 : function () {
   var success;
    if(checkInitialization(builder, "DOMWriterTest3") != null) return;
    var configuration;
      var XML_DECLARATION = "xml-declaration";
      var stringDoc = "<?xml version='1.0'?>&lt;hello>me again&lt;/hello>";
      var writeResult;
      var xmlDecl;
      var implementation;
      var lsImplementation;
      var inputSource;
      var document;
      var writer;
      var builder;
      var MODE_SYNCHRONOUS = 1;
      var MODE_ASYNCHRONOUS = 2;
      var DTD_SCHEMATYPE = "http://www.w3.org/TR/REC-xml";
      var SCHEMA_SCHEMATYPE = "http://www.w3.org/2001/XMLSchema";
      var NULL_SCHEMATYPE = null;

      var ACTION_REPLACE_CHILDREN = 2;
      var ACTION_APPEND_AS_CHILDREN = 1;
      var ACTION_INSERT_AFTER = 4;
      var ACTION_INSERT_BEFORE = 3;
      var ACTION_REPLACE = 5;
      var TEST0 = "test0";
      var TEST1 = "test1";
      var TEST2 = "test2";
      var TEST3 = "test3";
      var TEST4 = "test4";
      var TEST5 = "test5";
      var TEST6 = "test6";
      var TEST7 = "test7";
      var TESTPDF = "testpdf";
      implementation = getImplementation();
lsImplementation =  implementation;
builder = lsImplementation.createLSParser(MODE_SYNCHRONOUS,NULL_SCHEMATYPE);
      writer = lsImplementation.createLSSerializer();
      inputSource = lsImplementation.createLSInput();
      inputSource.stringData = stringDoc;

      document = builder.parse(inputSource);
      configuration = writer.domConfig;

      configuration.setParameter(XML_DECLARATION, false);
	 writeResult = writer.writeToString(document);
      assertEquals("without_xml_declaration","&lt;hello>me again&lt;/hello>",writeResult);
       configuration.setParameter(XML_DECLARATION, true);
	 writeResult = writer.writeToString(document);
      fail("Unrecognized method or attribute substring");

      assertEquals("with_xml_declaration","<?xml ",xmlDecl);
       
},
/**
* Writes a document to an uninitialized LSOutput.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-write
*/
DOMWriterTest4 : function () {
   var success;
    if(checkInitialization(builder, "DOMWriterTest4") != null) return;
    var testDoc;
      var domImpl;
      var output;
      var serializer;
      var status;
      
      var testDocRef = null;
      if (typeof(this.testDoc) != 'undefined') {
        testDocRef = this.testDoc;
      }
      testDoc = load(testDocRef, "testDoc", "test0");
      domImpl = getImplementation();
output = domImpl.createLSOutput();
      serializer = domImpl.createLSSerializer();
      
	{
		success = false;
		try {
            status = serializer.write(testDoc,output);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 82);
		}
		assertTrue("throw_SERIALIZE_ERR",success);
	}

},
/**
* Creates an document containing a namespaced attribute node without
    user-specified prefix and checks that it is serialized properly.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-write
* @see http://lists.w3.org/Archives/Public/www-dom/2003OctDec/0062.html
*/
DOMWriterTest5 : function () {
   var success;
    if(checkInitialization(builder, "DOMWriterTest5") != null) return;
    var domImpl;
      var origDoc;
      var nullDocType = null;

      var namespaceURI = "http://www.example.com/DOMWriterTest5";
      var docElem;
      var outputString;
      var input;
      var serializer;
      var parser;
      var NULL_SCHEMA_TYPE = null;

      var attrValue;
      var parsedDoc;
      var docElemLocalName;
      var docElemNS;
      domImpl = getImplementation();
origDoc = domImpl.createDocument(namespaceURI,"test",nullDocType);
      docElem = origDoc.documentElement;

      docElem.setAttributeNS(namespaceURI,"attr","test value");
      serializer = domImpl.createLSSerializer();
      outputString = serializer.writeToString(origDoc);
      input = domImpl.createLSInput();
      input.stringData = outputString;

      parser = domImpl.createLSParser(1,NULL_SCHEMA_TYPE);
      parsedDoc = parser.parse(input);
      docElem = parsedDoc.documentElement;

      docElemLocalName = docElem.localName;

      assertEquals("docElemLocalName","test",docElemLocalName);
       docElemNS = docElem.namespaceURI;

      assertEquals("docElemNS",namespaceURI,docElemNS);
       attrValue = docElem.getAttributeNS(namespaceURI,"attr");
      assertEquals("properNSAttrValue","test value",attrValue);
       
},
/**
* Creates an document containing a namespaced attribute node with
    user-specified prefix and checks that it is serialized properly.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-write
* @see http://lists.w3.org/Archives/Public/www-dom/2003OctDec/0062.html
*/
DOMWriterTest6 : function () {
   var success;
    if(checkInitialization(builder, "DOMWriterTest6") != null) return;
    var domImpl;
      var origDoc;
      var nullDocType = null;

      var namespaceURI = "http://www.example.com/DOMWriterTest5";
      var docElem;
      var outputString;
      var input;
      var serializer;
      var parser;
      var NULL_SCHEMA_TYPE = null;

      var attrValue;
      var parsedDoc;
      var docElemLocalName;
      var docElemNS;
      domImpl = getImplementation();
origDoc = domImpl.createDocument(namespaceURI,"test",nullDocType);
      docElem = origDoc.documentElement;

      docElem.setAttributeNS(namespaceURI,"test:attr","test value");
      serializer = domImpl.createLSSerializer();
      outputString = serializer.writeToString(origDoc);
      input = domImpl.createLSInput();
      input.stringData = outputString;

      parser = domImpl.createLSParser(1,NULL_SCHEMA_TYPE);
      parsedDoc = parser.parse(input);
      docElem = parsedDoc.documentElement;

      docElemLocalName = docElem.localName;

      assertEquals("docElemLocalName","test",docElemLocalName);
       docElemNS = docElem.namespaceURI;

      assertEquals("docElemNS",namespaceURI,docElemNS);
       attrValue = docElem.getAttributeNS(namespaceURI,"attr");
      assertEquals("properNSAttrValue","test value",attrValue);
       
},
/**
* DOMImplementationLS can be obtained by DOMImplementation.getFeature("LS", "3.0").
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#DOMImplementation3-getFeature
*/
GetFeature1 : function () {
   var success;
    if(checkInitialization(builder, "GetFeature1") != null) return;
    var domImpl;
      var domImplLS;
      var output;
      domImpl = getImplementation();
domImplLS = domImpl.getFeature("LS","3.0");
      assertNotNull("domImplLSNotNull",domImplLS);
output = domImplLS.createLSOutput();
      assertNotNull("outputNotNull",output);

},
/**
* DOMImplementationLS can be obtained by DOMImplementation.getFeature("+lS", "3.0").
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#DOMImplementation3-getFeature
*/
GetFeature2 : function () {
   var success;
    if(checkInitialization(builder, "GetFeature2") != null) return;
    var domImpl;
      var domImplLS;
      var output;
      domImpl = getImplementation();
domImplLS = domImpl.getFeature("+lS","3.0");
      assertNotNull("domImplLSNotNull",domImplLS);
output = domImplLS.createLSOutput();
      assertNotNull("outputNotNull",output);

},
/**
* Implementations should return true for hasFeature("LS", "3.0").
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#ID-5CED94D7
*/
HasFeature01 : function () {
   var success;
    if(checkInitialization(builder, "HasFeature01") != null) return;
    var domImpl;
      var hasLS;
      domImpl = getImplementation();
hasLS = domImpl.hasFeature("LS","3.0");
assertTrue("hasFeature_LS3",hasLS);

},
/**
* Implementations should return true for hasFeature("LS", null).
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#ID-5CED94D7
*/
HasFeature02 : function () {
   var success;
    if(checkInitialization(builder, "HasFeature02") != null) return;
    var domImpl;
      var hasLS;
      var version = null;

      domImpl = getImplementation();
hasLS = domImpl.hasFeature("LS",version);
assertTrue("hasFeature_LS",hasLS);

},
/**
* Implementations should return true for hasFeature("Core", "2.0") and hasFeature("Core", null).
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#ID-5CED94D7
*/
HasFeature03 : function () {
   var success;
    if(checkInitialization(builder, "HasFeature03") != null) return;
    var domImpl;
      var hasLS;
      var NULL_VERSION = null;

      domImpl = getImplementation();
hasLS = domImpl.hasFeature("cOrE","2.0");
assertTrue("hasFeature_Core2",hasLS);
hasLS = domImpl.hasFeature("cOrE",NULL_VERSION);
assertTrue("hasFeature_Core",hasLS);

},
/**
* Implementations should return true for hasFeature("+lS", "3.0").
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#ID-5CED94D7
*/
HasFeature04 : function () {
   var success;
    if(checkInitialization(builder, "HasFeature04") != null) return;
    var domImpl;
      var hasLS;
      domImpl = getImplementation();
hasLS = domImpl.hasFeature("+lS","3.0");
assertTrue("hasFeature_LS3",hasLS);

},
/**
* The return values of hasFeature("lS-aSynC", "3.0") and hasFeature("+Ls-AsYNc", "3.0") should be equal.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#ID-5CED94D7
*/
HasFeature05 : function () {
   var success;
    if(checkInitialization(builder, "HasFeature05") != null) return;
    var domImpl;
      var hasLS1;
      var hasLS2;
      domImpl = getImplementation();
hasLS1 = domImpl.hasFeature("lS-aSynC","3.0");
hasLS2 = domImpl.hasFeature("+Ls-AsYNc","3.0");
assertEquals("featuresEqual",hasLS1,hasLS2);
       
},
/**
* Checks initial state of parser configuration.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-config
*/
LSParserConfig1 : function () {
   var success;
    if(checkInitialization(builder, "LSParserConfig1") != null) return;
    var domImpl;
      var parser;
      var config;
      var state;
      var resolver;
      var NULL_SCHEMA_TYPE = null;

      domImpl = getImplementation();
parser = domImpl.createLSParser(1,NULL_SCHEMA_TYPE);
      config = parser.domConfig;

      assertNotNull("configNotNull",config);
state = config.getParameter("cHarset-overrides-xml-encoding");
      assertTrue("charset-overrides-xml-encoding-is-true",state);
state = config.getParameter("dIsallow-doctype");
      assertFalse("disallow-doctype-is-false",state);
state = config.getParameter("iGnore-unknown-character-denormalizations");
      assertTrue("ignore-unknown-character-denormalizations-is-true",state);
state = config.getParameter("iNfoset");
      assertTrue("infoset-is-true",state);
state = config.getParameter("nAmespaces");
      assertTrue("namespaces-is-true",state);
resolver = config.getParameter("rEsource-resolver");
      assertNull("resource-resolver-is-null",resolver);
    state = config.getParameter("sUpported-media-types-only");
      assertFalse("supported-media-types-only-is-false",state);
state = config.getParameter("wEll-formed");
      assertTrue("well-formed-is-true",state);

},
/**
* Checks getParameterNames and canSetParameter.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-config
*/
LSParserConfig2 : function () {
   var success;
    if(checkInitialization(builder, "LSParserConfig2") != null) return;
    var domImpl;
      var parser;
      var config;
      var state;
      var resolver;
      var NULL_SCHEMA_TYPE = null;

      var parameterNames;
      var parameterName;
      var matchCount = 0;
      var paramValue;
      var canSet;
      domImpl = getImplementation();
parser = domImpl.createLSParser(1,NULL_SCHEMA_TYPE);
      config = parser.domConfig;

      assertNotNull("configNotNull",config);
parameterNames = config.parameterNames;

      assertNotNull("parameterNamesNotNull",parameterNames);
for(var indexN10066 = 0;indexN10066 < parameterNames.length; indexN10066++) {
      parameterName = parameterNames.item(indexN10066);
      paramValue = config.getParameter(parameterName);
      canSet = config.canSetParameter(parameterName,paramValue);
      assertTrue("canSetToDefaultValue",canSet);
config.setParameter(parameterName, paramValue);
	 
	if(
	
	(("canonical-form".toUpperCase() == parameterName.toUpperCase()) || ("cdata-sections".toUpperCase() == parameterName.toUpperCase()) || ("check-character-normalization".toUpperCase() == parameterName.toUpperCase()) || ("comments".toUpperCase() == parameterName.toUpperCase()) || ("datatype-normalization".toUpperCase() == parameterName.toUpperCase()) || ("entities".toUpperCase() == parameterName.toUpperCase()) || ("error-handler".toUpperCase() == parameterName.toUpperCase()) || ("infoset".toUpperCase() == parameterName.toUpperCase()) || ("namespaces".toUpperCase() == parameterName.toUpperCase()) || ("namespace-declarations".toUpperCase() == parameterName.toUpperCase()) || ("normalize-characters".toUpperCase() == parameterName.toUpperCase()) || ("schema-location".toUpperCase() == parameterName.toUpperCase()) || ("schema-type".toUpperCase() == parameterName.toUpperCase()) || ("split-cdata-sections".toUpperCase() == parameterName.toUpperCase()) || ("validate".toUpperCase() == parameterName.toUpperCase()) || ("validate-if-schema".toUpperCase() == parameterName.toUpperCase()) || ("well-formed".toUpperCase() == parameterName.toUpperCase()) || ("element-content-whitespace".toUpperCase() == parameterName.toUpperCase()) || ("charset-overrides-xml-encoding".toUpperCase() == parameterName.toUpperCase()) || ("disallow-doctype".toUpperCase() == parameterName.toUpperCase()) || ("ignore-unknown-character-denormalizations".toUpperCase() == parameterName.toUpperCase()) || ("resource-resolver".toUpperCase() == parameterName.toUpperCase()) || ("supported-media-types-only".toUpperCase() == parameterName.toUpperCase()))

	) {
	matchCount += 1;

	}
	
	}
   assertEquals("definedParameterCount",23,matchCount);
       
},
/**
* Checks support of charset-overrides-xml-encoding.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-config
*/
LSParserConfig3 : function () {
   var success;
    if(checkInitialization(builder, "LSParserConfig3") != null) return;
    var domImpl;
      var parser;
      var config;
      var state;
      var canSet;
      var NULL_SCHEMA_TYPE = null;

      var propertyName = "cHarset-overrides-xml-encoding";
      domImpl = getImplementation();
parser = domImpl.createLSParser(1,NULL_SCHEMA_TYPE);
      config = parser.domConfig;

      assertNotNull("configNotNull",config);
state = config.getParameter(propertyName);
      assertTrue("defaultValue",state);
canSet = config.canSetParameter(propertyName,true);
      assertTrue("canSetTrue",canSet);
canSet = config.canSetParameter(propertyName,false);
      assertTrue("canSetFalse",canSet);
config.setParameter(propertyName, false);
	 state = config.getParameter(propertyName);
      assertFalse("setFalse",state);
config.setParameter(propertyName, true);
	 state = config.getParameter(propertyName);
      assertTrue("setTrue",state);

},
/**
* Checks support of disallow-doctype.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-config
*/
LSParserConfig4 : function () {
   var success;
    if(checkInitialization(builder, "LSParserConfig4") != null) return;
    var domImpl;
      var parser;
      var config;
      var state;
      var canSet;
      var propertyName = "dIsAllow-doctype";
      var NULL_SCHEMA_TYPE = null;

      domImpl = getImplementation();
parser = domImpl.createLSParser(1,NULL_SCHEMA_TYPE);
      config = parser.domConfig;

      assertNotNull("configNotNull",config);
state = config.getParameter(propertyName);
      assertFalse("defaultValue",state);
canSet = config.canSetParameter(propertyName,true);
      
	if(
	canSet
	) {
	config.setParameter(propertyName, true);
	 state = config.getParameter(propertyName);
      assertTrue("setTrueIsEffective",state);
config.setParameter(propertyName, false);
	 state = config.getParameter(propertyName);
      assertFalse("setFalseIsEffective",state);

	}
	
		else {
			config.setParameter(propertyName, false);
	 
	{
		success = false;
		try {
            config.setParameter(propertyName, true);
	   }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR_if_canSetParameter_false",success);
	}

		}
	
},
/**
* Checks support of ignore-unknown-character-denormalizations.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-config
*/
LSParserConfig5 : function () {
   var success;
    if(checkInitialization(builder, "LSParserConfig5") != null) return;
    var domImpl;
      var parser;
      var config;
      var state;
      var canSet;
      var propertyName = "iGnOre-unknown-character-denormalizations";
      var NULL_SCHEMA_TYPE = null;

      domImpl = getImplementation();
parser = domImpl.createLSParser(1,NULL_SCHEMA_TYPE);
      config = parser.domConfig;

      assertNotNull("configNotNull",config);
state = config.getParameter(propertyName);
      assertTrue("defaultValue",state);
canSet = config.canSetParameter(propertyName,false);
      
	if(
	canSet
	) {
	config.setParameter(propertyName, false);
	 state = config.getParameter(propertyName);
      assertFalse("setFalseIsEffective",state);
config.setParameter(propertyName, true);
	 state = config.getParameter(propertyName);
      assertFalse("setTrueIsEffective",state);

	}
	
		else {
			config.setParameter(propertyName, true);
	 
	{
		success = false;
		try {
            config.setParameter(propertyName, false);
	   }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR_if_not_canSetParameter",success);
	}

		}
	
},
/**
* Checks support of infoset.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-config
*/
LSParserConfig6 : function () {
   var success;
    if(checkInitialization(builder, "LSParserConfig6") != null) return;
    var domImpl;
      var parser;
      var config;
      var state;
      var canSet;
      var NULL_SCHEMA_TYPE = null;

      var propertyName = "iNfoset";
      domImpl = getImplementation();
parser = domImpl.createLSParser(1,NULL_SCHEMA_TYPE);
      config = parser.domConfig;

      assertNotNull("configNotNull",config);
state = config.getParameter(propertyName);
      assertTrue("defaultValue",state);
canSet = config.canSetParameter(propertyName,true);
      assertTrue("canSetTrue",canSet);
canSet = config.canSetParameter(propertyName,false);
      assertTrue("canSetFalse",canSet);
config.setParameter(propertyName, false);
	 state = config.getParameter(propertyName);
      assertTrue("setFalse",state);
config.setParameter("comments", false);
	 state = config.getParameter(propertyName);
      assertFalse("falseWhenCommentsFalse",state);
config.setParameter(propertyName, true);
	 state = config.getParameter(propertyName);
      assertTrue("resetTrue",state);
state = config.getParameter("comments");
      assertTrue("resetTrueComments",state);

},
/**
* Checks support of namespaces.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-config
*/
LSParserConfig7 : function () {
   var success;
    if(checkInitialization(builder, "LSParserConfig7") != null) return;
    var domImpl;
      var parser;
      var config;
      var state;
      var canSet;
      var propertyName = "nAmespaces";
      var NULL_SCHEMA_TYPE = null;

      domImpl = getImplementation();
parser = domImpl.createLSParser(1,NULL_SCHEMA_TYPE);
      config = parser.domConfig;

      assertNotNull("configNotNull",config);
state = config.getParameter(propertyName);
      assertTrue("defaultValue",state);
canSet = config.canSetParameter(propertyName,false);
      
	if(
	canSet
	) {
	config.setParameter(propertyName, false);
	 state = config.getParameter(propertyName);
      assertFalse("setFalseIsEffective",state);
config.setParameter(propertyName, true);
	 state = config.getParameter(propertyName);
      assertTrue("setTrueIsEffective",state);

	}
	
		else {
			config.setParameter(propertyName, true);
	 
	{
		success = false;
		try {
            config.setParameter(propertyName, false);
	   }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR_if_not_canSetParameter",success);
	}

		}
	
},
/**
* Checks support of well-formed.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-config
*/
LSParserConfig8 : function () {
   var success;
    if(checkInitialization(builder, "LSParserConfig8") != null) return;
    var domImpl;
      var parser;
      var config;
      var state;
      var canSet;
      var NULL_SCHEMA_TYPE = null;

      var propertyName = "wEll-formed";
      domImpl = getImplementation();
parser = domImpl.createLSParser(1,NULL_SCHEMA_TYPE);
      config = parser.domConfig;

      assertNotNull("configNotNull",config);
state = config.getParameter(propertyName);
      assertTrue("defaultValue",state);
canSet = config.canSetParameter(propertyName,true);
      assertTrue("canSetTrue",canSet);
canSet = config.canSetParameter(propertyName,false);
      assertFalse("canSetFalse",canSet);

	{
		success = false;
		try {
            config.setParameter(propertyName, false);
	   }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_EXCEPTION",success);
	}

},
/**
* Checks support of supported-media-types-only.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-config
*/
LSParserConfig9 : function () {
   var success;
    if(checkInitialization(builder, "LSParserConfig9") != null) return;
    var domImpl;
      var parser;
      var config;
      var state;
      var canSet;
      var propertyName = "sUpported-media-types-only";
      var NULL_SCHEMA_TYPE = null;

      domImpl = getImplementation();
parser = domImpl.createLSParser(1,NULL_SCHEMA_TYPE);
      config = parser.domConfig;

      assertNotNull("configNotNull",config);
state = config.getParameter(propertyName);
      assertFalse("defaultValue",state);
canSet = config.canSetParameter(propertyName,true);
      
	if(
	canSet
	) {
	config.setParameter(propertyName, true);
	 state = config.getParameter(propertyName);
      assertTrue("setTrueIsEffective",state);
config.setParameter(propertyName, false);
	 state = config.getParameter(propertyName);
      assertFalse("setFalseIsEffective",state);

	}
	
		else {
			config.setParameter(propertyName, false);
	 
	{
		success = false;
		try {
            config.setParameter(propertyName, true);
	   }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR_if_canSetParameter_false",success);
	}

		}
	
},
/**
* Checks initial state of serializer configuration.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-config
*/
LSSerializerConfig1 : function () {
   var success;
    if(checkInitialization(builder, "LSSerializerConfig1") != null) return;
    var domImpl;
      var serializer;
      var config;
      var state;
      var canSet;
      domImpl = getImplementation();
serializer = domImpl.createLSSerializer();
      config = serializer.domConfig;

      assertNotNull("configNotNull",config);
state = config.getParameter("cAnonical-form");
      assertFalse("canonical-form-is-false",state);
state = config.getParameter("dIscard-default-content");
      assertTrue("discard-default-content-is-true",state);
state = config.getParameter("fOrmat-pretty-print");
      assertFalse("format-pretty-print-is-false",state);
state = config.getParameter("iGnore-unknown-character-denormalizations");
      assertTrue("ignore-unknown-character-denormalizations-is-true",state);
state = config.getParameter("nOrmalize-characters");
      canSet = config.canSetParameter("normalize-characters",true);
      	assertTrue("normalize-characters-default",
      
	(state || 
	!canSet)
);
state = config.getParameter("xMl-declaration");
      assertTrue("xml-declaration-is-true",state);
state = config.getParameter("wEll-formed");
      assertTrue("well-formed-is-true",state);
state = config.getParameter("nAmespaces");
      assertTrue("namespaces-is-true",state);
state = config.getParameter("nAmespace-declarations");
      assertTrue("namespace-declarations-is-true",state);

},
/**
* Checks support of namespace-declarations.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-config
*/
LSSerializerConfig10 : function () {
   var success;
    if(checkInitialization(builder, "LSSerializerConfig10") != null) return;
    var domImpl;
      var serializer;
      var config;
      var state;
      var canSet;
      var propertyName = "nAmespace-declarations";
      domImpl = getImplementation();
serializer = domImpl.createLSSerializer();
      config = serializer.domConfig;

      assertNotNull("configNotNull",config);
state = config.getParameter(propertyName);
      assertTrue("defaultValue",state);
canSet = config.canSetParameter(propertyName,true);
      assertTrue("canSetTrue",canSet);
canSet = config.canSetParameter(propertyName,false);
      assertTrue("canSetFalse",canSet);
config.setParameter(propertyName, false);
	 state = config.getParameter(propertyName);
      assertFalse("setFalseIsEffective",state);
config.setParameter(propertyName, true);
	 state = config.getParameter(propertyName);
      assertTrue("setTrueIsEffective",state);

},
/**
* Checks getParameterNames and canSetParameter.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-config
*/
LSSerializerConfig2 : function () {
   var success;
    if(checkInitialization(builder, "LSSerializerConfig2") != null) return;
    var domImpl;
      var serializer;
      var config;
      var state;
      var parameterNames;
      var parameterName;
      var matchCount = 0;
      var paramValue;
      var canSet;
      domImpl = getImplementation();
serializer = domImpl.createLSSerializer();
      config = serializer.domConfig;

      assertNotNull("configNotNull",config);
parameterNames = config.parameterNames;

      assertNotNull("parameterNamesNotNull",parameterNames);
for(var indexN1005B = 0;indexN1005B < parameterNames.length; indexN1005B++) {
      parameterName = parameterNames.item(indexN1005B);
      paramValue = config.getParameter(parameterName);
      canSet = config.canSetParameter(parameterName,paramValue);
      assertTrue("canSetToDefaultValue",canSet);
config.setParameter(parameterName, paramValue);
	 
	if(
	
	(("canonical-form".toUpperCase() == parameterName.toUpperCase()) || ("cdata-sections".toUpperCase() == parameterName.toUpperCase()) || ("check-character-normalization".toUpperCase() == parameterName.toUpperCase()) || ("comments".toUpperCase() == parameterName.toUpperCase()) || ("datatype-normalization".toUpperCase() == parameterName.toUpperCase()) || ("entities".toUpperCase() == parameterName.toUpperCase()) || ("error-handler".toUpperCase() == parameterName.toUpperCase()) || ("infoset".toUpperCase() == parameterName.toUpperCase()) || ("namespaces".toUpperCase() == parameterName.toUpperCase()) || ("namespace-declarations".toUpperCase() == parameterName.toUpperCase()) || ("normalize-characters".toUpperCase() == parameterName.toUpperCase()) || ("split-cdata-sections".toUpperCase() == parameterName.toUpperCase()) || ("validate".toUpperCase() == parameterName.toUpperCase()) || ("validate-if-schema".toUpperCase() == parameterName.toUpperCase()) || ("well-formed".toUpperCase() == parameterName.toUpperCase()) || ("element-content-whitespace".toUpperCase() == parameterName.toUpperCase()) || ("discard-default-content".toUpperCase() == parameterName.toUpperCase()) || ("format-pretty-print".toUpperCase() == parameterName.toUpperCase()) || ("ignore-unknown-character-denormalizations".toUpperCase() == parameterName.toUpperCase()) || ("xml-declaration".toUpperCase() == parameterName.toUpperCase()))

	) {
	matchCount += 1;

	}
	
	}
   assertEquals("definedParameterCount",20,matchCount);
       
},
/**
* Checks support of canonical-form.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-config
*/
LSSerializerConfig3 : function () {
   var success;
    if(checkInitialization(builder, "LSSerializerConfig3") != null) return;
    var domImpl;
      var serializer;
      var config;
      var state;
      var canSet;
      var propertyName = "cAnonical-form";
      domImpl = getImplementation();
serializer = domImpl.createLSSerializer();
      config = serializer.domConfig;

      assertNotNull("configNotNull",config);
state = config.getParameter(propertyName);
      assertFalse("defaultValue",state);
canSet = config.canSetParameter(propertyName,true);
      
	if(
	canSet
	) {
	config.setParameter(propertyName, true);
	 state = config.getParameter(propertyName);
      assertTrue("setTrueIsEffective",state);
config.setParameter(propertyName, false);
	 state = config.getParameter(propertyName);
      assertFalse("setFalseIsEffective",state);

	}
	
		else {
			config.setParameter(propertyName, false);
	 
	{
		success = false;
		try {
            config.setParameter(propertyName, true);
	   }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR_if_canSetParameter_false",success);
	}

		}
	
},
/**
* Checks support of discard-default-content.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-config
*/
LSSerializerConfig4 : function () {
   var success;
    if(checkInitialization(builder, "LSSerializerConfig4") != null) return;
    var domImpl;
      var serializer;
      var config;
      var state;
      var canSet;
      var propertyName = "dIscard-default-content";
      domImpl = getImplementation();
serializer = domImpl.createLSSerializer();
      config = serializer.domConfig;

      assertNotNull("configNotNull",config);
state = config.getParameter(propertyName);
      assertTrue("defaultValue",state);
canSet = config.canSetParameter(propertyName,true);
      assertTrue("canSetTrue",canSet);
canSet = config.canSetParameter(propertyName,false);
      assertTrue("canSetFalse",canSet);
config.setParameter(propertyName, false);
	 state = config.getParameter(propertyName);
      assertFalse("setFalse",state);
config.setParameter(propertyName, true);
	 state = config.getParameter(propertyName);
      assertTrue("setTrue",state);

},
/**
* Checks support of format-pretty-print.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-config
*/
LSSerializerConfig5 : function () {
   var success;
    if(checkInitialization(builder, "LSSerializerConfig5") != null) return;
    var domImpl;
      var serializer;
      var config;
      var state;
      var canSet;
      var propertyName = "fOrmat-pretty-print";
      domImpl = getImplementation();
serializer = domImpl.createLSSerializer();
      config = serializer.domConfig;

      assertNotNull("configNotNull",config);
state = config.getParameter(propertyName);
      assertFalse("defaultValue",state);
canSet = config.canSetParameter(propertyName,true);
      
	if(
	canSet
	) {
	config.setParameter(propertyName, true);
	 state = config.getParameter(propertyName);
      assertTrue("setTrueIsEffective",state);
config.setParameter(propertyName, false);
	 state = config.getParameter(propertyName);
      assertFalse("setFalseIsEffective",state);

	}
	
		else {
			config.setParameter(propertyName, false);
	 
	{
		success = false;
		try {
            config.setParameter(propertyName, true);
	   }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR_if_canSetParameter_false",success);
	}

		}
	
},
/**
* Checks support of ignore-unknown-character-denormalizations.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-config
*/
LSSerializerConfig6 : function () {
   var success;
    if(checkInitialization(builder, "LSSerializerConfig6") != null) return;
    var domImpl;
      var serializer;
      var config;
      var state;
      var canSet;
      var propertyName = "iGnore-unknown-character-denormalizations";
      domImpl = getImplementation();
serializer = domImpl.createLSSerializer();
      config = serializer.domConfig;

      assertNotNull("configNotNull",config);
state = config.getParameter(propertyName);
      assertTrue("defaultValue",state);
canSet = config.canSetParameter(propertyName,false);
      
	if(
	canSet
	) {
	config.setParameter(propertyName, false);
	 state = config.getParameter(propertyName);
      assertFalse("setFalseIsEffective",state);
config.setParameter(propertyName, true);
	 state = config.getParameter(propertyName);
      assertTrue("setTrueIsEffective",state);

	}
	
		else {
			config.setParameter(propertyName, true);
	 
	{
		success = false;
		try {
            config.setParameter(propertyName, false);
	   }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_ERR_if_canSetParameter_false",success);
	}

		}
	
},
/**
* Checks support of xml-declaration.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-config
*/
LSSerializerConfig7 : function () {
   var success;
    if(checkInitialization(builder, "LSSerializerConfig7") != null) return;
    var domImpl;
      var serializer;
      var config;
      var state;
      var canSet;
      var propertyName = "xMl-declaration";
      domImpl = getImplementation();
serializer = domImpl.createLSSerializer();
      config = serializer.domConfig;

      assertNotNull("configNotNull",config);
state = config.getParameter(propertyName);
      assertTrue("defaultValue",state);
canSet = config.canSetParameter(propertyName,true);
      assertTrue("canSetTrue",canSet);
canSet = config.canSetParameter(propertyName,false);
      assertTrue("canSetFalse",canSet);
config.setParameter(propertyName, false);
	 state = config.getParameter(propertyName);
      assertFalse("setFalse",state);
config.setParameter(propertyName, true);
	 state = config.getParameter(propertyName);
      assertTrue("setTrue",state);

},
/**
* Checks support of well-formed.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-config
*/
LSSerializerConfig8 : function () {
   var success;
    if(checkInitialization(builder, "LSSerializerConfig8") != null) return;
    var domImpl;
      var serializer;
      var config;
      var state;
      var canSet;
      var propertyName = "wEll-formed";
      domImpl = getImplementation();
serializer = domImpl.createLSSerializer();
      config = serializer.domConfig;

      assertNotNull("configNotNull",config);
state = config.getParameter(propertyName);
      assertTrue("defaultValue",state);
canSet = config.canSetParameter(propertyName,true);
      assertTrue("canSetTrue",canSet);
canSet = config.canSetParameter(propertyName,false);
      
	if(
	canSet
	) {
	config.setParameter(propertyName, false);
	 state = config.getParameter(propertyName);
      assertFalse("setFalseIsEffective",state);
config.setParameter(propertyName, true);
	 state = config.getParameter(propertyName);
      assertTrue("setTrueIsEffective",state);

	}
	
		else {
			
	{
		success = false;
		try {
            config.setParameter(propertyName, false);
	   }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("throw_NOT_SUPPORTED_EXCEPTION",success);
	}

		}
	
},
/**
* Checks support of namespaces.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-config
*/
LSSerializerConfig9 : function () {
   var success;
    if(checkInitialization(builder, "LSSerializerConfig9") != null) return;
    var domImpl;
      var serializer;
      var config;
      var state;
      var canSet;
      var propertyName = "nAmespaces";
      domImpl = getImplementation();
serializer = domImpl.createLSSerializer();
      config = serializer.domConfig;

      assertNotNull("configNotNull",config);
state = config.getParameter(propertyName);
      assertTrue("defaultValue",state);
canSet = config.canSetParameter(propertyName,true);
      assertTrue("canSetTrue",canSet);
canSet = config.canSetParameter(propertyName,false);
      
	if(
	canSet
	) {
	config.setParameter(propertyName, false);
	 state = config.getParameter(propertyName);
      assertFalse("setFalseIsEffective",state);
config.setParameter(propertyName, true);
	 state = config.getParameter(propertyName);
      assertTrue("setTrueIsEffective",state);

	}
	
		else {
			
	{
		success = false;
		try {
            config.setParameter(propertyName, false);
	   }
		catch(ex) {
      success = (typeof(ex.code) != 'undefined' && ex.code == 9);
		}
		assertTrue("settingFalseWhenNotSupported",success);
	}

		}
	
},
/**
* Writes a document to a URL for a temporary file and rereads the document.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSInput-systemId
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSOutput-systemId
*/
SystemId1 : function () {
   var success;
    if(checkInitialization(builder, "SystemId1") != null) return;
    var testDoc;
      var domImpl;
      var output;
      var serializer;
      var systemId;
      var checkSystemId;
      var status;
      var input;
      var parser;
      var checkDoc;
      var docElem;
      var docElemName;
      var NULL_SCHEMA_TYPE = null;

      
      var testDocRef = null;
      if (typeof(this.testDoc) != 'undefined') {
        testDocRef = this.testDoc;
      }
      testDoc = load(testDocRef, "testDoc", "test0");
      domImpl = getImplementation();
output = domImpl.createLSOutput();
      checkSystemId = output.systemId;

      assertNull("LSOutputSystemIdInitiallyNull",checkSystemId);
    fail("Unrecognized method or attribute createTempURI");

      output.systemId = systemId;

      checkSystemId = output.systemId;

      assertEquals("LSOutputSystemIdMatch",systemId,checkSystemId);
       serializer = domImpl.createLSSerializer();
      status = serializer.write(testDoc,output);
      assertTrue("writeStatus",status);
input = domImpl.createLSInput();
      checkSystemId = input.systemId;

      assertNull("LSInputSystemIdInitiallyNull",checkSystemId);
    input.systemId = systemId;

      checkSystemId = input.systemId;

      assertEquals("LSInputSystemIdMatch",systemId,checkSystemId);
       parser = domImpl.createLSParser(1,NULL_SCHEMA_TYPE);
      checkDoc = parser.parse(input);
      assertNotNull("checkNotNull",checkDoc);
docElem = checkDoc.documentElement;

      docElemName = docElem.nodeName;

      assertEquals("checkDocElemName","elt0",docElemName);
       
},
/**
* Writes a document to a URL for a temporary http document and rereads the document.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSInput-systemId
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSOutput-systemId
*/
SystemId2 : function () {
   var success;
    if(checkInitialization(builder, "SystemId2") != null) return;
    var testDoc;
      var domImpl;
      var output;
      var serializer;
      var systemId;
      var checkSystemId;
      var status;
      var input;
      var parser;
      var checkDoc;
      var docElem;
      var docElemName;
      var NULL_SCHEMA_TYPE = null;

      
      var testDocRef = null;
      if (typeof(this.testDoc) != 'undefined') {
        testDocRef = this.testDoc;
      }
      testDoc = load(testDocRef, "testDoc", "test0");
      domImpl = getImplementation();
output = domImpl.createLSOutput();
      checkSystemId = output.systemId;

      assertNull("LSOutputSystemIdInitiallyNull",checkSystemId);
    fail("Unrecognized method or attribute createTempURI");

      output.systemId = systemId;

      checkSystemId = output.systemId;

      assertEquals("LSOutputSystemIdMatch",systemId,checkSystemId);
       serializer = domImpl.createLSSerializer();
      status = serializer.write(testDoc,output);
      assertTrue("writeStatus",status);
input = domImpl.createLSInput();
      checkSystemId = input.systemId;

      assertNull("LSInputSystemIdInitiallyNull",checkSystemId);
    input.systemId = systemId;

      checkSystemId = input.systemId;

      assertEquals("LSInputSystemIdMatch",systemId,checkSystemId);
       parser = domImpl.createLSParser(1,NULL_SCHEMA_TYPE);
      checkDoc = parser.parse(input);
      assertNotNull("checkNotNull",checkDoc);
docElem = checkDoc.documentElement;

      docElemName = docElem.nodeName;

      assertEquals("checkDocElemName","elt0",docElemName);
       
},
/**
* 
Load a document with canonical-form = true and see that entity references are not present in
the element content.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-canonical-form
*/
canonicalform01 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform01") != null) return;
    var doc;
      var docElem;
      var elemList;
      var elem;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var canSet;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSet = domConfig.canSetParameter("canonical-form",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("canonical-form", true);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(1);
      node = elem.firstChild;

      nodeType = node.nodeType;

      assertEquals("acrContentIsText",3,nodeType);
       
	}
	
},
/**
* 
Load a document with canonical-form = true and see that CDATASection are not present in
the parsed document.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-canonical-form
*/
canonicalform03 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform03") != null) return;
    var doc;
      var elem;
      var node;
      var nodeType;
      var domConfig;
      var pList;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var canSet;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSet = domConfig.canSetParameter("canonical-form",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("canonical-form", true);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      pList = doc.getElementsByTagName("strong");
      elem = pList.item(1);
      node = elem.lastChild;

      nodeType = node.nodeType;

      assertEquals("childIsText",3,nodeType);
       
	}
	
},
/**
* 
Attempt to load a namespace invalid document with canonical-form = true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-canonical-form
*/
canonicalform04 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform04") != null) return;
    var doc;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var canSet;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSet = domConfig.canSetParameter("canonical-form",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("canonical-form", true);
	 resourceURI = getResourceURI("namespaces1");
      
	{
		success = false;
		try {
            doc = lsParser.parseURI(resourceURI);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 81);
		}
		assertTrue("throw_PARSE_ERR",success);
	}

	}
	
},
/**
* 
Load a document with canonical-form = true and see that attributes for namespace declarations are present.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-namespace-declarations
*/
canonicalform05 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform05") != null) return;
    var doc;
      var docElem;
      var elemList;
      var elem;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var canSet;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSet = domConfig.canSetParameter("canonical-form",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("canonical-form", true);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      node = elem.getAttributeNode("xmlns:dmstc");
      assertNotNull("nsAttrNotNull",node);

	}
	
},
/**
* 
Load a document with canonical-form and validate = true and check that
element content whitespace is not eliminated.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-canonical-form
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-validate
*/
canonicalform06 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform06") != null) return;
    var doc;
      var elem;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var canSetValidate;
      var canSetCanonicalForm;
      var elemList;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetCanonicalForm = domConfig.canSetParameter("canonical-form",true);
      
	if(
	
	(canSetValidate && canSetCanonicalForm)

	) {
	domConfig.setParameter("validate", true);
	 domConfig.setParameter("canonical-form", true);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      node = elem.firstChild;

      nodeType = node.nodeType;

      assertEquals("nodeIsText",3,nodeType);
       
	}
	
},
/**
* 
Normalize document based on section 3.1 with canonical-form set to true and check normalized document.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-canonical-form
*/
canonicalform08 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform08") != null) return;
    var doc;
      var bodyList;
      var body;
      var domConfig;
      var canSet;
      var canSetValidate;
      var node;
      var nodeName;
      var nodeValue;
      var nodeType;
      var length;
      var text;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var canSetCanonicalForm;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSetCanonicalForm = domConfig.canSetParameter("canonical-form",true);
      
	if(
	canSetCanonicalForm
	) {
	domConfig.setParameter("canonical-form", true);
	 resourceURI = getResourceURI("canonicalform01");
      doc = lsParser.parseURI(resourceURI);
      node = doc.firstChild;

      nodeType = node.nodeType;

      assertEquals("PIisFirstChild",7,nodeType);
       nodeValue = node.data;

      length = nodeValue.length;
      assertEquals("piDataLength",36,length);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("TextisSecondChild",3,nodeType);
       nodeValue = node.nodeValue;

      length = nodeValue.length;
      assertEquals("secondChildLength",1,length);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("ElementisThirdChild",1,nodeType);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("TextisFourthChild",3,nodeType);
       nodeValue = node.nodeValue;

      length = nodeValue.length;
      assertEquals("fourthChildLength",1,length);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("PIisFifthChild",7,nodeType);
       nodeValue = node.data;

      assertEquals("trailingPIData","",nodeValue);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("TextisSixthChild",3,nodeType);
       nodeValue = node.nodeValue;

      length = nodeValue.length;
      assertEquals("sixthChildLength",1,length);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("CommentisSeventhChild",8,nodeType);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("TextisEighthChild",3,nodeType);
       nodeValue = node.nodeValue;

      length = nodeValue.length;
      assertEquals("eighthChildLength",1,length);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("CommentisNinthChild",8,nodeType);
       node = node.nextSibling;

      assertNull("TenthIsNull",node);
    
	}
	
},
/**
* 
Normalize document based on section 3.1 with canonical-form set to true
and comments to false and check normalized document.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-canonical-form
*/
canonicalform09 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform09") != null) return;
    var doc;
      var bodyList;
      var body;
      var domConfig;
      var canSet;
      var canSetValidate;
      var node;
      var nodeName;
      var nodeValue;
      var nodeType;
      var length;
      var text;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var canSetCanonicalForm;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSetCanonicalForm = domConfig.canSetParameter("canonical-form",true);
      
	if(
	canSetCanonicalForm
	) {
	domConfig.setParameter("canonical-form", true);
	 domConfig.setParameter("comments", false);
	 resourceURI = getResourceURI("canonicalform01");
      doc = lsParser.parseURI(resourceURI);
      node = doc.firstChild;

      nodeType = node.nodeType;

      assertEquals("PIisFirstChild",7,nodeType);
       nodeValue = node.data;

      length = nodeValue.length;
      assertEquals("piDataLength",36,length);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("TextisSecondChild",3,nodeType);
       nodeValue = node.nodeValue;

      length = nodeValue.length;
      assertEquals("secondChildLength",1,length);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("ElementisThirdChild",1,nodeType);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("TextisFourthChild",3,nodeType);
       nodeValue = node.nodeValue;

      length = nodeValue.length;
      assertEquals("fourthChildLength",1,length);
       node = node.nextSibling;

      nodeType = node.nodeType;

      assertEquals("PIisFifthChild",7,nodeType);
       nodeValue = node.data;

      assertEquals("trailingPIData","",nodeValue);
       node = node.nextSibling;

      assertNull("SixthIsNull",node);
    
	}
	
},
/**
* 
Check elimination of unnecessary namespace prefixes when
normalized with canonical-form = true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-canonical-form
*/
canonicalform10 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform10") != null) return;
    var doc;
      var divList;
      var div;
      var domConfig;
      var node;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var canSetCanonicalForm;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSetCanonicalForm = domConfig.canSetParameter("canonical-form",true);
      
	if(
	canSetCanonicalForm
	) {
	domConfig.setParameter("canonical-form", true);
	 resourceURI = getResourceURI("canonicalform03");
      doc = lsParser.parseURI(resourceURI);
      divList = doc.getElementsByTagName("div");
      div = divList.item(5);
      node = div.getAttributeNode("xmlns");
      assertNotNull("xmlnsPresent",node);
node = div.getAttributeNode("xmlns:a");
      assertNull("xmlnsANotPresent",node);
    
	}
	
},
/**
* 
Check that default attributes are made explicitly specified.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-canonical-form
*/
canonicalform11 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform11") != null) return;
    var doc;
      var elemList;
      var elem;
      var domConfig;
      var attr;
      var attrValue;
      var attrSpecified;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var canSetCanonicalForm;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSetCanonicalForm = domConfig.canSetParameter("canonical-form",true);
      
	if(
	canSetCanonicalForm
	) {
	domConfig.setParameter("canonical-form", true);
	 resourceURI = getResourceURI("canonicalform03");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(0);
      attr = elem.getAttributeNode("title");
      assertNotNull("titlePresent",attr);
attrSpecified = attr.specified;

      assertTrue("titleSpecified",attrSpecified);
attrValue = attr.nodeValue;

      assertEquals("titleValue","default",attrValue);
       
	}
	
},
/**
* 
Load a document with canonical-form = true and see that the DocumentType node is eliminated.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-canonical-form
*/
canonicalform12 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform12") != null) return;
    var doc;
      var doctype;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var canSet;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSet = domConfig.canSetParameter("canonical-form",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("canonical-form", true);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      doctype = doc.doctype;

      assertNull("doctypeIsNull",doctype);
    
	}
	
},
/**
* 
Serializing an XML 1.1 document when canonical-form raises a SERIALIZE_ERR.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-canonical-form
*/
canonicalform13 : function () {
   var success;
    if(checkInitialization(builder, "canonicalform13") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsSerializer;
      var docType = null;

      var output;
      var canSet;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      domConfig = lsSerializer.domConfig;

      canSet = domConfig.canSetParameter("canonical-form",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("", true);
	 doc = domImplLS.createDocument("http://www.example.org","test",docType);
      
      try {
      doc.xmlVersion = "1.1";

      
      } catch (ex) {
		  if (typeof(ex.code) != 'undefined') {      
       switch(ex.code) {
       case /* NOT_SUPPORTED_ERR */ 9 :
               return ;
    default:
          throw ex;
          }
       } else { 
       throw ex;
        }
         }
        
	{
		success = false;
		try {
            output = lsSerializer.writeToString(doc);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 82);
		}
		assertTrue("throw_SERIALIZE_ERR",success);
	}

	}
	
},
/**
* 
Load a document with cdata-sections = false and see that CDATASection are not present in
the parsed document.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-cdata-sections
*/
cdatasections01 : function () {
   var success;
    if(checkInitialization(builder, "cdatasections01") != null) return;
    var doc;
      var elem;
      var node;
      var nodeType;
      var domConfig;
      var pList;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("cdata-sections", false);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      pList = doc.getElementsByTagName("strong");
      elem = pList.item(1);
      node = elem.lastChild;

      nodeType = node.nodeType;

      assertEquals("childIsText",3,nodeType);
       
},
/**
* 
Load a document with cdata-sections = true and see that CDATASection are present in
the parsed document.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-cdata-sections
*/
cdatasections02 : function () {
   var success;
    if(checkInitialization(builder, "cdatasections02") != null) return;
    var doc;
      var elem;
      var node;
      var nodeType;
      var domConfig;
      var pList;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("cdata-sections", true);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      pList = doc.getElementsByTagName("strong");
      elem = pList.item(1);
      node = elem.lastChild;

      nodeType = node.nodeType;

      assertEquals("childIsCDATA",4,nodeType);
       
},
/**
* 
CDATASections should be preserved when cdata-sections is true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-cdata-sections
*/
cdatasections03 : function () {
   var success;
    if(checkInitialization(builder, "cdatasections03") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsSerializer;
      var docType = null;

      var docElem;
      var newNode;
      var output;
      var retNode;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      doc = domImplLS.createDocument("http://www.example.org","test",docType);
      docElem = doc.documentElement;

      newNode = doc.createCDATASection("foo");
      retNode = docElem.appendChild(newNode);
      domConfig = lsSerializer.domConfig;

      domConfig.setParameter("cdata-sections", true);
	 output = lsSerializer.writeToString(doc);
      	assertTrue("containsCDATA",
      (output.indexOf("![CDATA[foo]]") >= 0));

},
/**
* 
CDATASections should be eliminated when cdata-sections is false.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-cdata-sections
*/
cdatasections04 : function () {
   var success;
    if(checkInitialization(builder, "cdatasections04") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsSerializer;
      var docType = null;

      var docElem;
      var newNode;
      var output;
      var retNode;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      doc = domImplLS.createDocument("http://www.example.org","test",docType);
      docElem = doc.documentElement;

      newNode = doc.createCDATASection("foo");
      retNode = docElem.appendChild(newNode);
      domConfig = lsSerializer.domConfig;

      domConfig.setParameter("cdata-sections", false);
	 output = lsSerializer.writeToString(doc);
      	assertTrue("containsCDATA",
      (output.indexOf("&gt;foo&lt;/") >= 0));

},
/**
* 
Parsing a non-Unicode normalized document should not raise an exception if check-character-normalization
is false.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-check-character-normalization
*/
checkcharacternormalization01 : function () {
   var success;
    if(checkInitialization(builder, "checkcharacternormalization01") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsParser;
      var resourceURI;
      var nullSchemaLanguage = null;

      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaLanguage);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("check-character-normalization", false);
	 resourceURI = getResourceURI("characternormalization1");
      doc = lsParser.parseURI(resourceURI);
      assertNotNull("docNotNull",doc);

},
/**
* 
Parsing a non-Unicode normalized document should raise PARSE_ERR if check-character-normalization
is false.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-check-character-normalization
*/
checkcharacternormalization02 : function () {
   var success;
    if(checkInitialization(builder, "checkcharacternormalization02") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsParser;
      var resourceURI;
      var canSet;
      var nullSchemaLanguage = null;

      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var severity;
      var type;
      var errorCount = 0;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaLanguage);
      domConfig = lsParser.domConfig;

      canSet = domConfig.canSetParameter("check-character-normalization",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("check-character-normalization", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 resourceURI = getResourceURI("characternormalization1");
      
	{
		success = false;
		try {
            doc = lsParser.parseURI(resourceURI);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 81);
		}
		assertTrue("throw_PARSE_ERR",success);
	}
errors = errorMonitor.allErrors;
for(var indexN1008E = 0;indexN1008E < errors.length; indexN1008E++) {
      error = errors[indexN1008E];
      severity = error.severity;

      type = error.type;

      
	if(
	
	(severity > 1)

	) {
	assertEquals("isError",2,severity);
       assertEquals("isCheck_Failure","check-character-normalization-failure",type);
       errorCount += 1;

	}
	
	}
   assertEquals("oneError",1,errorCount);
       
	}
	
},
/**
* 
Characters should not be checked for normalization on serialization if check-character-normalization = false.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-check-character-normalization
*/
checkcharacternormalization03 : function () {
   var success;
    if(checkInitialization(builder, "checkcharacternormalization03") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsSerializer;
      var docType = null;

      var docElem;
      var newNode;
      var output;
      var retNode;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      doc = domImplLS.createDocument("http://www.example.org","suçon",docType);
      docElem = doc.documentElement;

      domConfig = lsSerializer.domConfig;

      domConfig.setParameter("check-character-normalization", false);
	 domConfig.setParameter("normalize-characters", false);
	 output = lsSerializer.writeToString(doc);
      
},
/**
* 
Characters should be checked for normalization on serialization if check-character-normalization = true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-check-character-normalization
*/
checkcharacternormalization04 : function () {
   var success;
    if(checkInitialization(builder, "checkcharacternormalization04") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsSerializer;
      var docType = null;

      var docElem;
      var newNode;
      var output;
      var retNode;
      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var severity;
      var type;
      var canSet;
      var errorCount = 0;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      doc = domImplLS.createDocument("http://www.example.org","suçon",docType);
      docElem = doc.documentElement;

      domConfig = lsSerializer.domConfig;

      canSet = domConfig.canSetParameter("check-character-normalization",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("check-character-normalization", true);
	 domConfig.setParameter("normalize-characters", false);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 
	{
		success = false;
		try {
            output = lsSerializer.writeToString(doc);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 82);
		}
		assertTrue("throw_SERIALIZE_ERR",success);
	}
errors = errorMonitor.allErrors;
for(var indexN100A3 = 0;indexN100A3 < errors.length; indexN100A3++) {
      error = errors[indexN100A3];
      severity = error.severity;

      type = error.type;

      
	if(
	("check-character-normalization-failure" == type)
	) {
	assertEquals("severityError",2,severity);
       errorCount += 1;

	}
	
	}
   	assertTrue("hasErrors",
      
	(errorCount > 0)
);

	}
	
},
/**
* 
Load a document with comments = false and see that comments are not present in
the parsed document.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-comments
*/
comments01 : function () {
   var success;
    if(checkInitialization(builder, "comments01") != null) return;
    var doc;
      var docElem;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("comments", false);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      docElem = doc.documentElement;

      node = docElem.previousSibling;

      nodeType = node.nodeType;

      assertEquals("nodeIsDocType",10,nodeType);
       
},
/**
* 
Load a document with comments = true and see that comments are present in
the parsed document.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-comments
*/
comments02 : function () {
   var success;
    if(checkInitialization(builder, "comments02") != null) return;
    var doc;
      var docElem;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("comments", true);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      docElem = doc.documentElement;

      node = docElem.previousSibling;

      nodeType = node.nodeType;

      assertEquals("nodeIsDocType",8,nodeType);
       
},
/**
* 
Comments should be preserved when comments is true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-comments
*/
comments03 : function () {
   var success;
    if(checkInitialization(builder, "comments03") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsSerializer;
      var docType = null;

      var docElem;
      var newNode;
      var output;
      var retNode;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      doc = domImplLS.createDocument("http://www.example.org","test",docType);
      docElem = doc.documentElement;

      newNode = doc.createComment("foo");
      retNode = docElem.appendChild(newNode);
      domConfig = lsSerializer.domConfig;

      domConfig.setParameter("comments", true);
	 output = lsSerializer.writeToString(doc);
      	assertTrue("hasComment",
      (output.indexOf("&gt;&lt;!--foo--&gt;&lt;/") >= 0));

},
/**
* 
Comments should be discarded when comments is false.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-comments
*/
comments04 : function () {
   var success;
    if(checkInitialization(builder, "comments04") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsSerializer;
      var docType = null;

      var docElem;
      var newNode;
      var output;
      var retNode;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      doc = domImplLS.createDocument("http://www.example.org","test",docType);
      docElem = doc.documentElement;

      newNode = doc.createComment("foo");
      retNode = docElem.appendChild(newNode);
      domConfig = lsSerializer.domConfig;

      domConfig.setParameter("comments", false);
	 output = lsSerializer.writeToString(doc);
      
			{
			assertFalse("noComment",(output.indexOf("<!--") >= 0));
}
},
/**
* 
Normalize document with datatype-normalization set to true.
Check if double values were normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-datatype-normalization
*/
datatypenormalization01 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization01") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      var domImplLS;
      var lsParser;
      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,xsdNS);
      
	if(
	
	(lsParser == null)

	) {
	        return ;

	}
	domConfig = lsParser.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 resourceURI = getResourceURI("datatype_normalization");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","double");
      element = elemList.item(0);
      str = element.getAttribute("value");
      assertEquals("firstValue","+0003.141592600E+0000",str);
       str = element.getAttribute("union");
      assertEquals("firstUnion","+0003.141592600E+0000",str);
       str = element.textContent;

      assertEquals("firstList","-31415926.00E-7 2.718",str);
       element = elemList.item(1);
      str = element.getAttribute("value");
      assertEquals("secondValue","NaN",str);
       str = element.getAttribute("union");
      assertEquals("secondUnion","NaN",str);
       str = element.textContent;

      assertEquals("secondList","INF -INF",str);
       element = elemList.item(2);
      str = element.getAttribute("value");
      assertEquals("thirdValue","1",str);
       str = element.getAttribute("union");
      assertEquals("thirdUnion","1",str);
       str = element.textContent;

      assertEquals("thirdList","-0",str);
       
	}
	
},
/**
* 
Normalize document with datatype-normalization set to true.
Check if decimal values were normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-datatype-normalization
*/
datatypenormalization02 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization02") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      var domImplLS;
      var lsParser;
      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,xsdNS);
      
	if(
	
	(lsParser == null)

	) {
	        return ;

	}
	domConfig = lsParser.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 resourceURI = getResourceURI("datatype_normalization");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","decimal");
      element = elemList.item(0);
      str = element.getAttribute("value");
      assertEquals("firstValue","+0003.141592600",str);
       str = element.getAttribute("union");
      assertEquals("firstUnion","+0003.141592600",str);
       str = element.textContent;

      assertEquals("firstList","+10 .1",str);
       element = elemList.item(1);
      str = element.getAttribute("value");
      assertEquals("secondValue","01",str);
       str = element.getAttribute("union");
      assertEquals("secondUnion","01",str);
       str = element.textContent;

      assertEquals("secondList","-.001",str);
       
	}
	
},
/**
* 
Normalize document with datatype-normalization set to true.
Check if boolean values were whitespace normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-datatype-normalization
*/
datatypenormalization03 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization03") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      var domImplLS;
      var lsParser;
      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,xsdNS);
      
	if(
	
	(lsParser == null)

	) {
	        return ;

	}
	domConfig = lsParser.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 resourceURI = getResourceURI("datatype_normalization");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","boolean");
      element = elemList.item(0);
      str = element.getAttribute("value");
      assertEquals("firstValue","true",str);
       str = element.getAttribute("union");
      assertEquals("firstUnion","false",str);
       str = element.textContent;

      assertEquals("firstList","false true false",str);
       element = elemList.item(1);
      str = element.getAttribute("value");
      assertEquals("secondValue","1",str);
       str = element.getAttribute("union");
      assertEquals("secondUnion","0",str);
       str = element.textContent;

      assertEquals("secondList","0 1 0",str);
       
	}
	
},
/**
* 
Normalize document with datatype-normalization set to true.
Check if float values were normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-datatype-normalization
*/
datatypenormalization04 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization04") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      var domImplLS;
      var lsParser;
      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,xsdNS);
      
	if(
	
	(lsParser == null)

	) {
	        return ;

	}
	domConfig = lsParser.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 resourceURI = getResourceURI("datatype_normalization");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","float");
      element = elemList.item(0);
      str = element.getAttribute("value");
      assertEquals("firstValue","+0003.141592600E+0000",str);
       str = element.getAttribute("union");
      assertEquals("firstUnion","+0003.141592600E+0000",str);
       str = element.textContent;

      assertEquals("firstList","-31415926.00E-7 2.718",str);
       element = elemList.item(1);
      str = element.getAttribute("value");
      assertEquals("secondValue","NaN",str);
       str = element.getAttribute("union");
      assertEquals("secondUnion","NaN",str);
       str = element.textContent;

      assertEquals("secondList","INF -INF",str);
       element = elemList.item(2);
      str = element.getAttribute("value");
      assertEquals("thirdValue","1",str);
       str = element.getAttribute("union");
      assertEquals("thirdUnion","1",str);
       str = element.textContent;

      assertEquals("thirdList","-0",str);
       
	}
	
},
/**
* 
Normalize document with datatype-normalization set to true.
Check if dateTime values were correctly normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-datatype-normalization
*/
datatypenormalization05 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization05") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      var domImplLS;
      var lsParser;
      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,xsdNS);
      
	if(
	
	(lsParser == null)

	) {
	        return ;

	}
	domConfig = lsParser.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 resourceURI = getResourceURI("datatype_normalization");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","dateTime");
      element = elemList.item(0);
      str = element.getAttribute("value");
      assertEquals("firstValue","2004-01-21T15:30:00-05:00",str);
       str = element.getAttribute("union");
      assertEquals("firstUnion","2004-01-21T20:30:00-05:00",str);
       str = element.textContent;

      assertEquals("firstList","2004-01-21T15:30:00 2004-01-21T15:30:00Z",str);
       element = elemList.item(1);
      str = element.getAttribute("value");
      assertEquals("secondValue","2004-01-21T15:30:00.0000-05:00",str);
       str = element.getAttribute("union");
      assertEquals("secondUnion","2004-01-21T15:30:00.0000-05:00",str);
       str = element.textContent;

      assertEquals("secondList","2004-01-21T15:30:00.0000",str);
       element = elemList.item(2);
      str = element.getAttribute("value");
      assertEquals("thirdValue","2004-01-21T15:30:00.0001-05:00",str);
       str = element.getAttribute("union");
      assertEquals("thirdUnion","2004-01-21T15:30:00.0001-05:00",str);
       str = element.textContent;

      assertEquals("thirdList","2004-01-21T15:30:00.0001",str);
       
	}
	
},
/**
* 
Normalize document with datatype-normalization set to true.
Check if time values were normalized.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-datatype-normalization
*/
datatypenormalization06 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization06") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,xsdNS);
      
	if(
	
	(lsParser == null)

	) {
	        return ;

	}
	domConfig = lsParser.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 resourceURI = getResourceURI("datatype_normalization");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","time");
      element = elemList.item(0);
      str = element.getAttribute("value");
      assertEquals("firstValue","15:30:00-05:00",str);
       str = element.getAttribute("union");
      assertEquals("firstUnion","15:30:00-05:00",str);
       str = element.textContent;

      assertEquals("firstList","15:30:00",str);
       element = elemList.item(1);
      str = element.getAttribute("value");
      assertEquals("secondValue","15:30:00.0000-05:00",str);
       str = element.getAttribute("union");
      assertEquals("secondUnion","15:30:00.0000-05:00",str);
       str = element.textContent;

      assertEquals("secondList","15:30:00.0000",str);
       element = elemList.item(2);
      str = element.getAttribute("value");
      assertEquals("thirdValue","15:30:00.0001-05:00",str);
       str = element.getAttribute("union");
      assertEquals("thirdUnion","15:30:00.0001-05:00",str);
       str = element.textContent;

      assertEquals("thirdList","15:30:00.0001",str);
       
	}
	
},
/**
* 
The default value for the double element must be provided in canonical lexical form.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-datatype-normalization
*/
datatypenormalization07 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization07") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      var domImplLS;
      var lsParser;
      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,xsdNS);
      
	if(
	
	(lsParser == null)

	) {
	        return ;

	}
	domConfig = lsParser.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 resourceURI = getResourceURI("datatype_normalization");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","double");
      element = elemList.item(0);
      str = element.getAttribute("default");
      assertEquals("firstValue","3.1415926E0",str);
       
	}
	
},
/**
* 
The default value for the decimal element must be provided in canonical lexical form.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-datatype-normalization
*/
datatypenormalization08 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization08") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      var domImplLS;
      var lsParser;
      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,xsdNS);
      
	if(
	
	(lsParser == null)

	) {
	        return ;

	}
	domConfig = lsParser.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 resourceURI = getResourceURI("datatype_normalization");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","decimal");
      element = elemList.item(0);
      str = element.getAttribute("default");
      assertEquals("firstValue","3.1415926",str);
       
	}
	
},
/**
* 
The default value for the boolean element must be provided in canonical lexical form.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-datatype-normalization
*/
datatypenormalization09 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization09") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,xsdNS);
      
	if(
	
	(lsParser == null)

	) {
	        return ;

	}
	domConfig = lsParser.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 resourceURI = getResourceURI("datatype_normalization");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","boolean");
      element = elemList.item(0);
      str = element.getAttribute("default");
      assertEquals("firstValue","true",str);
       
	}
	
},
/**
* 
The default value for the float element must be provided in canonical lexical form.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-datatype-normalization
*/
datatypenormalization10 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization10") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      var domImplLS;
      var lsParser;
      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,xsdNS);
      
	if(
	
	(lsParser == null)

	) {
	        return ;

	}
	domConfig = lsParser.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 resourceURI = getResourceURI("datatype_normalization");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","float");
      element = elemList.item(0);
      str = element.getAttribute("default");
      assertEquals("firstValue","3.1415926E0",str);
       
	}
	
},
/**
* 
The default value for the dateTime element must be provided in canonical lexical form.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-datatype-normalization
*/
datatypenormalization11 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization11") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      var domImplLS;
      var lsParser;
      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,xsdNS);
      
	if(
	
	(lsParser == null)

	) {
	        return ;

	}
	domConfig = lsParser.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 resourceURI = getResourceURI("datatype_normalization");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","dateTime");
      element = elemList.item(0);
      str = element.getAttribute("default");
      assertEquals("firstValue","2004-01-21T20:30:00Z",str);
       
	}
	
},
/**
* 
Default values must be provided in canonical lexical form.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-datatype-normalization
*/
datatypenormalization12 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization12") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      var domImplLS;
      var lsParser;
      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,xsdNS);
      
	if(
	
	(lsParser == null)

	) {
	        return ;

	}
	domConfig = lsParser.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 resourceURI = getResourceURI("datatype_normalization");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagNameNS("http://www.w3.org/2001/DOM-Test-Suite/Level-3/datatype_normalization","time");
      element = elemList.item(0);
      str = element.getAttribute("default");
      assertEquals("firstValue","20:30:00Z",str);
       
	}
	
},
/**
* 
Parse document with datatype-normalization set to true.
Check if string values were normalized per default whitespace
facet of xsd:string.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-datatype-normalization
*/
datatypenormalization13 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization13") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      var childNode;
      var childValue;
      var domImplLS;
      var lsParser;
      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,xsdNS);
      
	if(
	
	(lsParser == null)

	) {
	        return ;

	}
	domConfig = lsParser.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization2",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 resourceURI = getResourceURI("datatype_normalization2");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","em");
      element = elemList.item(0);
      childNode = element.firstChild;

      assertNotNull("childNodeNotNull",childNode);
childValue = childNode.nodeValue;

      assertEquals("content","    EMP  0001   ",childValue);
       
	}
	
},
/**
* 
Parse document with datatype-normalization set to true.
Check if string values were normalized per explicit whitespace=preserve.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-datatype-normalization
*/
datatypenormalization14 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization14") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      var childNode;
      var childValue;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,xsdNS);
      
	if(
	
	(lsParser == null)

	) {
	        return ;

	}
	domConfig = lsParser.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization2",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 resourceURI = getResourceURI("datatype_normalization2");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","acronym");
      element = elemList.item(0);
      childNode = element.firstChild;

      assertNotNull("childNodeNotNull",childNode);
childValue = childNode.nodeValue;

      assertEquals("content","    EMP  0001   ",childValue);
       
	}
	
},
/**
* 
Parse document with datatype-normalization set to true.
Check if string values were normalized per an explicit whitespace=collapse.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-datatype-normalization
*/
datatypenormalization15 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization15") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      var childNode;
      var childValue;
      var domImplLS;
      var lsParser;
      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,xsdNS);
      
	if(
	
	(lsParser == null)

	) {
	        return ;

	}
	domConfig = lsParser.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization2",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 resourceURI = getResourceURI("datatype_normalization2");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","code");
      element = elemList.item(0);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assertEquals("content1","EMP 0001",childValue);
       element = elemList.item(1);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assertEquals("content2","EMP 0001",childValue);
       element = elemList.item(2);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assertEquals("content3","EMP 0001",childValue);
       
	}
	
},
/**
* 
Parse document with datatype-normalization set to true.
Check if string values were normalized per explicit whitespace=replace.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-datatype-normalization
*/
datatypenormalization16 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization16") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetNormalization;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      var childNode;
      var childValue;
      var domImplLS;
      var lsParser;
      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,xsdNS);
      
	if(
	
	(lsParser == null)

	) {
	        return ;

	}
	domConfig = lsParser.domConfig;

      canSetNormalization = domConfig.canSetParameter("datatype-normalization2",true);
      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetNormalization && canSetValidate && canSetXMLSchema)

	) {
	domConfig.setParameter("datatype-normalization", true);
	 domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 resourceURI = getResourceURI("datatype_normalization2");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","sup");
      element = elemList.item(0);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assertEquals("content1","     EMP  0001 ",childValue);
       element = elemList.item(1);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assertEquals("content2","EMP  0001",childValue);
       element = elemList.item(2);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assertEquals("content3","EMP 0001",childValue);
       element = elemList.item(3);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assertEquals("content4","EMP 0001",childValue);
       
	}
	
},
/**
* 
Parse document with datatype-normalization set to false.
Check if string values were not normalized per an explicit whitespace=collapse.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-datatype-normalization
*/
datatypenormalization17 : function () {
   var success;
    if(checkInitialization(builder, "datatypenormalization17") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      var childNode;
      var childValue;
      var domImplLS;
      var lsParser;
      var resourceURI;
      var nullSchemaType = null;

      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,xsdNS);
      
	if(
	
	(lsParser == null)

	) {
	lsParser = domImplLS.createLSParser(1,nullSchemaType);
      
	}
	domConfig = lsParser.domConfig;

      canSetValidate = domConfig.canSetParameter("validate",true);
      
	if(
	canSetValidate
	) {
	domConfig.setParameter("validate", true);
	 
	}
	canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	canSetXMLSchema
	) {
	domConfig.setParameter("schema-type", xsdNS);
	 
	}
	domConfig.setParameter("datatype-normalization", false);
	 resourceURI = getResourceURI("datatype_normalization2");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","code");
      element = elemList.item(1);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assertEquals("content2","EMP  0001",childValue);
       
},
/**
* 
Parsing a document with a doctype should throw a PARSE_ERR if disallow-doctype is true.
is false.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-disallow-doctype
*/
disallowdoctype01 : function () {
   var success;
    if(checkInitialization(builder, "disallowdoctype01") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsParser;
      var resourceURI;
      var canSet;
      var nullSchemaLanguage = null;

      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var severity;
      var type;
      var errorCount = 0;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaLanguage);
      domConfig = lsParser.domConfig;

      canSet = domConfig.canSetParameter("disallow-doctype",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("disallow-doctype", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 resourceURI = getResourceURI("barfoo");
      
	{
		success = false;
		try {
            doc = lsParser.parseURI(resourceURI);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 81);
		}
		assertTrue("throw_PARSE_ERR",success);
	}
errors = errorMonitor.allErrors;
for(var indexN1008E = 0;indexN1008E < errors.length; indexN1008E++) {
      error = errors[indexN1008E];
      severity = error.severity;

      type = error.type;

      
	if(
	
	(severity > 1)

	) {
	assertEquals("isFatalError",3,severity);
       assertEquals("isDoctypeNotAllowed","doctype-not-allowed",type);
       errorCount += 1;

	}
	
	}
   assertEquals("oneError",1,errorCount);
       
	}
	
},
/**
* 
Default attributes should be not be serialized if discard-default-content is true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-discard-default-content
*/
discarddefaultcontent01 : function () {
   var success;
    if(checkInitialization(builder, "discarddefaultcontent01") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsSerializer;
      var docType = null;

      var docElem;
      var newNode;
      var output;
      var retNode;
      var canSet;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domConfig = lsSerializer.domConfig;

      domConfig.setParameter("discard-default-content", true);
	 output = lsSerializer.writeToString(doc);
      
			{
			assertFalse("noDirAttr",(output.indexOf("dir=") >= 0));
}
},
/**
* 
Default attributes should be explicitly serialized if discard-default-content is false.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-discard-default-content
*/
discarddefaultcontent02 : function () {
   var success;
    if(checkInitialization(builder, "discarddefaultcontent02") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsSerializer;
      var docType = null;

      var docElem;
      var newNode;
      var output;
      var retNode;
      var canSet;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      
      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      domConfig = lsSerializer.domConfig;

      domConfig.setParameter("discard-default-content", false);
	 output = lsSerializer.writeToString(doc);
      	assertTrue("hasDirAttr",
      (output.indexOf("dir=") >= 0));

},
/**
* 
Load a document with element-content-whitespace = false and validation = true and check that
element content whitespace is eliminated.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-element-content-whitespace
*/
elementcontentwhitespace01 : function () {
   var success;
    if(checkInitialization(builder, "elementcontentwhitespace01") != null) return;
    var doc;
      var elem;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var canSetValidate;
      var canSetWhitespace;
      var elemList;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetWhitespace = domConfig.canSetParameter("element-content-whitespace",false);
      
	if(
	
	(canSetValidate && canSetWhitespace)

	) {
	domConfig.setParameter("validate", true);
	 domConfig.setParameter("element-content-whitespace", false);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      node = elem.firstChild;

      nodeType = node.nodeType;

      assertEquals("nodeIsElem",1,nodeType);
       
	}
	
},
/**
* 
Load a document with element-content-whitespace and validate = true and check that
element content whitespace is not eliminated.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-element-content-whitespace
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-validate
*/
elementcontentwhitespace02 : function () {
   var success;
    if(checkInitialization(builder, "elementcontentwhitespace02") != null) return;
    var doc;
      var elem;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var canSet;
      var elemList;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSet = domConfig.canSetParameter("validate",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("validate", true);
	 
	}
	domConfig.setParameter("element-content-whitespace", true);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      node = elem.firstChild;

      nodeType = node.nodeType;

      assertEquals("nodeIsText",3,nodeType);
       
},
/**
* 
Serialize a document when element-content-whitespace is false, element content whitespace should be eliminated. 

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-element-content-whitespace
*/
elementcontentwhitespace03 : function () {
   var success;
    if(checkInitialization(builder, "elementcontentwhitespace03") != null) return;
    var doc;
      var domConfig;
      var serializerDomConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var lsSerializer;
      var output;
      var canSetValidate;
      var canSetWhitespace;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      domConfig = lsSerializer.domConfig;

      canSetValidate = domConfig.canSetParameter("validate",true);
      lsSerializer = domImplLS.createLSSerializer();
      serializerDomConfig = lsSerializer.domConfig;

      canSetWhitespace = serializerDomConfig.canSetParameter("element-content-whitespace",false);
      
	if(
	
	(canSetValidate && canSetWhitespace)

	) {
	domConfig.setParameter("validate", true);
	 lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("validate", false);
	 resourceURI = getResourceURI("test3");
      doc = lsParser.parseURI(resourceURI);
      serializerDomConfig.setParameter("element-content-whitespace", false);
	 output = lsSerializer.writeToString(doc);
      	assertTrue("noWhitespace",
      (output.indexOf("&lt;elt0>&lt;elt1>") >= 0));

	}
	
},
/**
* 
createLSOutput should create an LSOutput, encoding should be mutable.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-DOMImplementationLS-createLSOutput
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSOutput-encoding
*/
encoding01 : function () {
   var success;
    if(checkInitialization(builder, "encoding01") != null) return;
    var domImplLS;
      var lsOutput;
      var encoding;
      domImplLS = getImplementation();
lsOutput = domImplLS.createLSOutput();
      encoding = lsOutput.encoding;

      lsOutput.encoding = "ISO-8859-1";

      encoding = lsOutput.encoding;

      assertEquals("isLatin1","ISO-8859-1".toLowerCase(),encoding.toLowerCase());
       
},
/**
* 
Load a document with entities = false and see that entity references are not present in
the element content.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-entities
*/
entities01 : function () {
   var success;
    if(checkInitialization(builder, "entities01") != null) return;
    var doc;
      var docElem;
      var elemList;
      var elem;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("entities", false);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(1);
      node = elem.firstChild;

      nodeType = node.nodeType;

      assertEquals("acrContentIsText",3,nodeType);
       
},
/**
* 
Load a document with entities = false and see that entity references are not present in
attribute content.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-entities
*/
entities02 : function () {
   var success;
    if(checkInitialization(builder, "entities02") != null) return;
    var doc;
      var docElem;
      var elemList;
      var elem;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var attributes;
      var docType;
      var entities;
      var entity;
      var classAttr;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("entities", false);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(3);
      attributes = elem.attributes;

      classAttr = attributes.getNamedItem("class");
      node = classAttr.lastChild;

      assertNotNull("classAttrChildNotNull",classAttr);
nodeType = node.nodeType;

      assertEquals("classAttrChildIsText",3,nodeType);
       
},
/**
* 
Load a document with entities = false and see that entity definitions are preserved.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-entities
*/
entities03 : function () {
   var success;
    if(checkInitialization(builder, "entities03") != null) return;
    var doc;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var docType;
      var entities;
      var entity;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("entities", false);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      docType = doc.doctype;

      assertNotNull("docTypeNotNull",docType);
entities = docType.entities;

      entity = entities.getNamedItem("alpha");
      assertNotNull("entityNotNull",entity);

},
/**
* 
Load a document with entities = true and see that entity references are present in
the element content.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-entities
*/
entities04 : function () {
   var success;
    if(checkInitialization(builder, "entities04") != null) return;
    var doc;
      var docElem;
      var elemList;
      var elem;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("entities", true);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(1);
      node = elem.firstChild;

      nodeType = node.nodeType;

      assertEquals("acrContentIsEntRef",5,nodeType);
       
},
/**
* 
Load a document with entities = true and see that entity references are present in
attribute content.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-entities
*/
entities05 : function () {
   var success;
    if(checkInitialization(builder, "entities05") != null) return;
    var doc;
      var docElem;
      var elemList;
      var elem;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var attributes;
      var docType;
      var entities;
      var entity;
      var classAttr;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("entities", true);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(3);
      attributes = elem.attributes;

      classAttr = attributes.getNamedItem("class");
      node = classAttr.lastChild;

      assertNotNull("classAttrChildNotNull",classAttr);
nodeType = node.nodeType;

      assertEquals("classAttrChildIsEntRef",5,nodeType);
       
},
/**
* 
Load a document with entities = true and see that entity definitions are preserved.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-entities
*/
entities06 : function () {
   var success;
    if(checkInitialization(builder, "entities06") != null) return;
    var doc;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var docType;
      var entities;
      var entity;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("entities", true);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      docType = doc.doctype;

      assertNotNull("docTypeNotNull",docType);
entities = docType.entities;

      entity = entities.getNamedItem("alpha");
      assertNotNull("entityNotNull",entity);

},
/**
* 
A warning should be dispatched if the base URI of a processing instruction can not be preserved.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-entities
*/
entities07 : function () {
   var success;
    if(checkInitialization(builder, "entities07") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsParser;
      var resourceURI;
      var canSet;
      var nullSchemaLanguage = null;

      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var severity;
      var type;
      var warningCount = 0;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaLanguage);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("entities", false);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 resourceURI = getResourceURI("pibase");
      doc = lsParser.parseURI(resourceURI);
      assertNotNull("docNotNull",doc);
errors = errorMonitor.allErrors;
for(var indexN10081 = 0;indexN10081 < errors.length; indexN10081++) {
      error = errors[indexN10081];
      severity = error.severity;

      type = error.type;

      
	if(
	("pi-base-uri-not-preserved" == type)
	) {
	assertEquals("isError",1,severity);
       warningCount += 1;

	}
	
	}
   assertEquals("hadWarning",1,warningCount);
       
},
/**
* 
Entity references should be preserved when entities is true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-entities
*/
entities08 : function () {
   var success;
    if(checkInitialization(builder, "entities08") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsSerializer;
      var output;
      domImplLS = getImplementation();

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      lsSerializer = domImplLS.createLSSerializer();
      domConfig = lsSerializer.domConfig;

      domConfig.setParameter("entities", true);
	 output = lsSerializer.writeToString(doc);
      	assertTrue("hasEntRef",
      (output.indexOf("ent4;") >= 0));

},
/**
* 
Entity references should be expanded when entities is false.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-entities
*/
entities09 : function () {
   var success;
    if(checkInitialization(builder, "entities09") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsSerializer;
      var output;
      domImplLS = getImplementation();

      var docRef = null;
      if (typeof(this.doc) != 'undefined') {
        docRef = this.doc;
      }
      doc = load(docRef, "doc", "hc_staff");
      lsSerializer = domImplLS.createLSSerializer();
      domConfig = lsSerializer.domConfig;

      domConfig.setParameter("entities", false);
	 output = lsSerializer.writeToString(doc);
      
			{
			assertFalse("noEntRef",(output.indexOf("ent4;") >= 0));
	assertTrue("entDef",
      (output.indexOf("!ENTITY") >= 0));
}
},
/**
* 
Load a document with a DTD that doesn't match content with infoset=true, should load without complaint.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-infoset
*/
infoset01 : function () {
   var success;
    if(checkInitialization(builder, "infoset01") != null) return;
    var doc;
      var elem;
      var node;
      var nodeName;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("infoset", true);
	 resourceURI = getResourceURI("validate1");
      doc = lsParser.parseURI(resourceURI);
      assertNotNull("docNotNull",doc);
elem = doc.documentElement;

      assertNotNull("docElemNotNull",elem);
nodeName = elem.nodeName;

      assertEquals("docElemName","elt0",nodeName);
       
},
/**
* 
Load a document with entities = false and see that entity references are not present in
the element content.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-infoset
*/
infoset02 : function () {
   var success;
    if(checkInitialization(builder, "infoset02") != null) return;
    var doc;
      var docElem;
      var elemList;
      var elem;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("infoset", true);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagName("acronym");
      elem = elemList.item(1);
      node = elem.firstChild;

      nodeType = node.nodeType;

      assertEquals("acrContentIsText",3,nodeType);
       
},
/**
* 
Parse document with infoset set to true.  
Check if string values were not normalized per an explicit whitespace=collapse.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-datatype-normalization
*/
infoset03 : function () {
   var success;
    if(checkInitialization(builder, "infoset03") != null) return;
    var doc;
      var elemList;
      var element;
      var domConfig;
      var str;
      var canSetValidate;
      var canSetXMLSchema;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      var childNode;
      var childValue;
      var domImplLS;
      var lsParser;
      var resourceURI;
      var nullSchemaType = null;

      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,xsdNS);
      
	if(
	
	(lsParser == null)

	) {
	lsParser = domImplLS.createLSParser(1,nullSchemaType);
      
	}
	domConfig = lsParser.domConfig;

      canSetValidate = domConfig.canSetParameter("validate",true);
      
	if(
	canSetValidate
	) {
	domConfig.setParameter("validate", true);
	 
	}
	canSetXMLSchema = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	canSetXMLSchema
	) {
	domConfig.setParameter("schema-type", xsdNS);
	 
	}
	domConfig.setParameter("infoset", true);
	 resourceURI = getResourceURI("datatype_normalization2");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagNameNS("http://www.w3.org/1999/xhtml","code");
      element = elemList.item(1);
      childNode = element.firstChild;

      childValue = childNode.nodeValue;

      assertEquals("content2","EMP  0001",childValue);
       
},
/**
* 
Load a document with infoset = true and see that CDATASection are not present in
the parsed document.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-infoset
*/
infoset04 : function () {
   var success;
    if(checkInitialization(builder, "infoset04") != null) return;
    var doc;
      var elem;
      var node;
      var nodeType;
      var domConfig;
      var pList;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("infoset", true);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      pList = doc.getElementsByTagName("strong");
      elem = pList.item(1);
      node = elem.lastChild;

      nodeType = node.nodeType;

      assertEquals("childIsText",3,nodeType);
       
},
/**
* 
Load a document with infoset = true and see that attributes for namespace declarations are present.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-infoset
*/
infoset05 : function () {
   var success;
    if(checkInitialization(builder, "infoset05") != null) return;
    var doc;
      var docElem;
      var elemList;
      var elem;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("infoset", true);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      node = elem.getAttributeNode("xmlns:dmstc");
      assertNotNull("nsAttrNotNull",node);

},
/**
* 
Load a document with infoset and validate = true and check that
element content whitespace is not eliminated.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-infoset
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-validate
*/
infoset06 : function () {
   var success;
    if(checkInitialization(builder, "infoset06") != null) return;
    var doc;
      var elem;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var canSet;
      var elemList;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSet = domConfig.canSetParameter("validate",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("validate", true);
	 
	}
	domConfig.setParameter("infoset", true);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      node = elem.firstChild;

      nodeType = node.nodeType;

      assertEquals("nodeIsText",3,nodeType);
       
},
/**
* 
Load a document with infoset = true and see that comments are present in
the parsed document.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-infoset
*/
infoset07 : function () {
   var success;
    if(checkInitialization(builder, "infoset07") != null) return;
    var doc;
      var docElem;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("infoset", true);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      docElem = doc.documentElement;

      node = docElem.previousSibling;

      nodeType = node.nodeType;

      assertEquals("nodeIsDocType",8,nodeType);
       
},
/**
* 
Attempt to load a namespace invalid document with infoset = true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-infoset
*/
infoset08 : function () {
   var success;
    if(checkInitialization(builder, "infoset08") != null) return;
    var doc;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("infoset", true);
	 resourceURI = getResourceURI("namespaces1");
      
	{
		success = false;
		try {
            doc = lsParser.parseURI(resourceURI);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 81);
		}
		assertTrue("throw_PARSE_ERR",success);
	}

},
/**
* 
Load a document with namespace-declarations = false and see that attributes 
for namespace declarations are not present.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-namespace-declarations
*/
namespacedeclarations01 : function () {
   var success;
    if(checkInitialization(builder, "namespacedeclarations01") != null) return;
    var doc;
      var docElem;
      var elemList;
      var elem;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("namespace-declarations", false);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      node = elem.getAttributeNode("xmlns:dmstc");
      assertNull("nsAttrNull",node);
    
},
/**
* 
Load a document with namespace-declarations = true and see that attributes for namespace declarations are present.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-namespace-declarations
*/
namespacedeclarations02 : function () {
   var success;
    if(checkInitialization(builder, "namespacedeclarations02") != null) return;
    var doc;
      var docElem;
      var elemList;
      var elem;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("namespace-declarations", true);
	 resourceURI = getResourceURI("hc_staff");
      doc = lsParser.parseURI(resourceURI);
      elemList = doc.getElementsByTagName("p");
      elem = elemList.item(0);
      node = elem.getAttributeNode("xmlns:dmstc");
      assertNotNull("nsAttrNotNull",node);

},
/**
* 
Attempt to load a namespace invalid document with namespaces = true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-namespaces
*/
namespaces01 : function () {
   var success;
    if(checkInitialization(builder, "namespaces01") != null) return;
    var doc;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("namespaces", true);
	 resourceURI = getResourceURI("namespaces1");
      
	{
		success = false;
		try {
            doc = lsParser.parseURI(resourceURI);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 81);
		}
		assertTrue("throw_PARSE_ERR",success);
	}

},
/**
* 
Attempt to load a namespace invalid document with namespaces = false.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-namespaces
*/
namespaces02 : function () {
   var success;
    if(checkInitialization(builder, "namespaces02") != null) return;
    var doc;
      var node;
      var nodeType;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var canSet;
      var docElem;
      var tagName;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSet = domConfig.canSetParameter("namespaces",false);
      
	if(
	canSet
	) {
	domConfig.setParameter("namespaces", false);
	 resourceURI = getResourceURI("namespaces1");
      doc = lsParser.parseURI(resourceURI);
      docElem = doc.documentElement;

      tagName = docElem.tagName;

      assertEquals("tagName","bad:ns:tag",tagName);
       
	}
	
},
/**
* 
LSSerializer.newLine should contain the platform default new line.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-DOMImplementationLS-createLSSerializer
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-newLine
*/
newline01 : function () {
   var success;
    if(checkInitialization(builder, "newline01") != null) return;
    var domImplLS;
      var lsSerializer;
      var newLine;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      newLine = lsSerializer.newLine;

      assertNotNull("newLineNotNull",newLine);

},
/**
* 
Setting LSSerializer.newLine should change the value retrieved subsequent calls.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-DOMImplementationLS-createLSSerializer
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-newLine
*/
newline02 : function () {
   var success;
    if(checkInitialization(builder, "newline02") != null) return;
    var domImplLS;
      var lsSerializer;
      var newLine;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      lsSerializer.newLine = "crlf";

      newLine = lsSerializer.newLine;

      assertEquals("newLine","crlf",newLine);
       
},
/**
* 
Setting LSSerializer.newLine to null should reset the default value.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-DOMImplementationLS-createLSSerializer
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-newLine
*/
newline03 : function () {
   var success;
    if(checkInitialization(builder, "newline03") != null) return;
    var domImplLS;
      var lsSerializer;
      var newLine;
      var origNewLine;
      var nullString = null;

      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      origNewLine = lsSerializer.newLine;

      lsSerializer.newLine = nullString;

      newLine = lsSerializer.newLine;

      assertEquals("newLine",origNewLine,newLine);
       
},
/**
* 
Parsing using an uninitialized LSInput should result in a PARSE_ERR.
is false.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parse
*/
noinputspecified01 : function () {
   var success;
    if(checkInitialization(builder, "noinputspecified01") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsParser;
      var lsInput;
      var nullSchemaLanguage = null;

      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var severity;
      var type;
      var errorCount = 0;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaLanguage);
      lsInput = domImplLS.createLSInput();
      domConfig = lsParser.domConfig;

      domConfig.setParameter("error-handler", errorMonitor.handleError);
	 
	{
		success = false;
		try {
            doc = lsParser.parse(lsInput);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 81);
		}
		assertTrue("throw_PARSE_ERR",success);
	}
errors = errorMonitor.allErrors;
for(var indexN10077 = 0;indexN10077 < errors.length; indexN10077++) {
      error = errors[indexN10077];
      severity = error.severity;

      type = error.type;

      
	if(
	
	(severity > 1)

	) {
	assertEquals("isFatalError",3,severity);
       assertEquals("noInputSpecified","no-input-specified",type);
       errorCount += 1;

	}
	
	}
   assertEquals("oneError",1,errorCount);
       
},
/**
* 
Writing to an uninitialized LSOutput should result in a SERIALIZATION_ERR.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-write
*/
nooutputspecified01 : function () {
   var success;
    if(checkInitialization(builder, "nooutputspecified01") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsSerializer;
      var lsOutput;
      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var severity;
      var type;
      var errorCount = 0;
      var docType = null;

      var retval;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      lsOutput = domImplLS.createLSOutput();
      doc = domImplLS.createDocument("http://www.w3.org/1999/xhtml","html",docType);
      domConfig = lsSerializer.domConfig;

      domConfig.setParameter("error-handler", errorMonitor.handleError);
	 
	{
		success = false;
		try {
            retval = lsSerializer.write(doc,lsOutput);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 82);
		}
		assertTrue("throw_SERIALIZE_ERR",success);
	}
errors = errorMonitor.allErrors;
for(var indexN10081 = 0;indexN10081 < errors.length; indexN10081++) {
      error = errors[indexN10081];
      severity = error.severity;

      type = error.type;

      
	if(
	
	(severity > 1)

	) {
	assertEquals("isFatalError",3,severity);
       assertEquals("noOutputSpecified","no-output-specified",type);
       errorCount += 1;

	}
	
	}
   assertEquals("oneError",1,errorCount);
       
},
/**
* 
Parsing a non-Unicode normalized document not have characters normalized if normalize-characters is false.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-normalize-characters
*/
normalizecharacters01 : function () {
   var success;
    if(checkInitialization(builder, "normalizecharacters01") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsParser;
      var resourceURI;
      var nullSchemaLanguage = null;

      var docElem;
      var tagName;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaLanguage);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("normalize-characters", false);
	 resourceURI = getResourceURI("characternormalization1");
      doc = lsParser.parseURI(resourceURI);
      assertNotNull("docNotNull",doc);
docElem = doc.documentElement;

      tagName = docElem.tagName;

      assertEquals("notNormalized","suçon",tagName);
       
},
/**
* 
Parsing a non-Unicode normalized document should result in Unicode-normalized content if normalize-characters is true..

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-normalize-characters
*/
normalizecharacters02 : function () {
   var success;
    if(checkInitialization(builder, "normalizecharacters02") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsParser;
      var resourceURI;
      var canSet;
      var nullSchemaLanguage = null;

      var docElem;
      var tagName;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaLanguage);
      domConfig = lsParser.domConfig;

      canSet = domConfig.canSetParameter("normalize-characters",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("normalize-characters", true);
	 resourceURI = getResourceURI("characternormalization1");
      doc = lsParser.parseURI(resourceURI);
      assertNotNull("docNotNull",doc);
docElem = doc.documentElement;

      tagName = docElem.tagName;

      assertEquals("charNormalized","suçon",tagName);
       
	}
	
},
/**
* 
Characters should be normalized on serialization if normalize-characters is true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-normalize-characters
*/
normalizecharacters03 : function () {
   var success;
    if(checkInitialization(builder, "normalizecharacters03") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsSerializer;
      var docType = null;

      var docElem;
      var newNode;
      var output;
      var retNode;
      var canSet;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      domConfig = lsSerializer.domConfig;

      canSet = domConfig.canSetParameter("normalize-characters",true);
      
	if(
	canSet
	) {
	doc = domImplLS.createDocument("http://www.example.org","suçon",docType);
      docElem = doc.documentElement;

      domConfig.setParameter("normalize-characters", true);
	 output = lsSerializer.writeToString(doc);
      	assertTrue("notNormalized",
      (output.indexOf("suçon") >= 0));

	}
	
},
/**
* 
Characters should be not normalized on serialization if normalize-characters is false.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-normalize-characters
*/
normalizecharacters04 : function () {
   var success;
    if(checkInitialization(builder, "normalizecharacters04") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsSerializer;
      var docType = null;

      var docElem;
      var newNode;
      var output;
      var retNode;
      var canSet;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      domConfig = lsSerializer.domConfig;

      canSet = domConfig.canSetParameter("normalize-characters",false);
      doc = domImplLS.createDocument("http://www.example.org","suçon",docType);
      docElem = doc.documentElement;

      domConfig.setParameter("normalize-characters", true);
	 output = lsSerializer.writeToString(doc);
      	assertTrue("notNormalized",
      (output.indexOf("suçon") >= 0));

},
/**
* 
Validate a document with no DTD against an externally specified schema that matches its content.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-schema-location
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-schema-type
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-validate
*/
schemalocation01 : function () {
   var success;
    if(checkInitialization(builder, "schemalocation01") != null) return;
    var doc;
      var elem;
      var node;
      var nodeName;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var canSetValidate;
      var canSetSchemaType;
      var canSetSchemaLocation;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetSchemaType = domConfig.canSetParameter("schema-type",xsdNS);
      resourceURI = getResourceURI("validateschema1");
      canSetSchemaLocation = domConfig.canSetParameter("schema-location",resourceURI);
      
	if(
	
	(canSetValidate && canSetSchemaType && canSetSchemaLocation)

	) {
	domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("schema-location", resourceURI);
	 resourceURI = getResourceURI("validate1");
      doc = lsParser.parseURI(resourceURI);
      assertNotNull("docNotNull",doc);
elem = doc.documentElement;

      assertNotNull("docElemNotNull",elem);
nodeName = elem.nodeName;

      assertEquals("docElemName","elt0",nodeName);
       
	}
	
},
/**
* 
Validate a document with no DTD against an externally specified schema that does not match its content.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-schema-location
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-schema-type
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-validate
*/
schemalocation02 : function () {
   var success;
    if(checkInitialization(builder, "schemalocation02") != null) return;
    var doc;
      var elem;
      var node;
      var nodeName;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var canSetValidate;
      var canSetSchemaType;
      var canSetSchemaLocation;
      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var severity;
      var errorCount = 0;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetSchemaType = domConfig.canSetParameter("schema-type",xsdNS);
      resourceURI = getResourceURI("validateschema1");
      canSetSchemaLocation = domConfig.canSetParameter("schema-location",resourceURI);
      
	if(
	
	(canSetValidate && canSetSchemaType && canSetSchemaLocation)

	) {
	domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("schema-location", resourceURI);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 resourceURI = getResourceURI("test3");
      
	{
		success = false;
		try {
            doc = lsParser.parseURI(resourceURI);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 81);
		}
		assertTrue("throw_PARSE_ERR",success);
	}
errors = errorMonitor.allErrors;
for(var indexN100CE = 0;indexN100CE < errors.length; indexN100CE++) {
      error = errors[indexN100CE];
      severity = error.severity;

      
	if(
	(2 == severity)
	) {
	errorCount += 1;

	}
	
	}
   	assertTrue("atLeastOneError",
      
	(errorCount > 0)
);

	}
	
},
/**
* 
Serialize a document with no DTD against an externally specified schema that matches its content.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-schema-location
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-schema-type
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-validate
*/
schemalocation03 : function () {
   var success;
    if(checkInitialization(builder, "schemalocation03") != null) return;
    var doc;
      var elem;
      var node;
      var nodeName;
      var domConfig;
      var domImplLS;
      var resourceURI;
      var canSetValidate;
      var canSetSchemaType;
      var canSetSchemaLocation;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      var lsSerializer;
      var nullNS = null;

      var doctype = null;

      var output;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      domConfig = lsSerializer.domConfig;

      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetSchemaType = domConfig.canSetParameter("schema-type",xsdNS);
      resourceURI = getResourceURI("validateschema1");
      canSetSchemaLocation = domConfig.canSetParameter("schema-location",resourceURI);
      
	if(
	
	(canSetValidate && canSetSchemaType && canSetSchemaLocation)

	) {
	domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("schema-location", resourceURI);
	 doc = domImplLS.createDocument(nullNS,"elt0",doctype);
      output = lsSerializer.writeToString(doc);
      
	}
	
},
/**
* 
Serialize a document with no DTD against an externally specified schema that matches its content.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-schema-location
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-schema-type
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-validate
*/
schemalocation04 : function () {
   var success;
    if(checkInitialization(builder, "schemalocation04") != null) return;
    var doc;
      var elem;
      var node;
      var nodeName;
      var domConfig;
      var domImplLS;
      var resourceURI;
      var canSetValidate;
      var canSetSchemaType;
      var canSetSchemaLocation;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      var lsSerializer;
      var nullNS = null;

      var doctype = null;

      var output;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      domConfig = lsSerializer.domConfig;

      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetSchemaType = domConfig.canSetParameter("schema-type",xsdNS);
      resourceURI = getResourceURI("validateschema1");
      canSetSchemaLocation = domConfig.canSetParameter("schema-location",resourceURI);
      
	if(
	
	(canSetValidate && canSetSchemaType && canSetSchemaLocation)

	) {
	domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("schema-location", resourceURI);
	 doc = domImplLS.createDocument(nullNS,"elt2",doctype);
      
	{
		success = false;
		try {
            output = lsSerializer.writeToString(doc);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 82);
		}
		assertTrue("throw_SERIALIZE_ERR",success);
	}

	}
	
},
/**
* 
Specify schema validation for a document with a DTD but no specified schema.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-schema-type
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-validate
*/
schematype01 : function () {
   var success;
    if(checkInitialization(builder, "schematype01") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var canSetValidate;
      var canSetSchemaType;
      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var severity;
      var errorCount = 0;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetSchemaType = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetValidate && canSetSchemaType)

	) {
	domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 resourceURI = getResourceURI("test3");
      
	{
		success = false;
		try {
            doc = lsParser.parseURI(resourceURI);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 81);
		}
		assertTrue("throw_PARSE_ERR",success);
	}
errors = errorMonitor.allErrors;
for(var indexN100A8 = 0;indexN100A8 < errors.length; indexN100A8++) {
      error = errors[indexN100A8];
      severity = error.severity;

      
	if(
	(2 == severity)
	) {
	errorCount += 1;

	}
	
	}
   	assertTrue("atLeastOneError",
      
	(errorCount > 0)
);

	}
	
},
/**
* 
Specify DTD validation for a document with a matching DTD.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-schema-type
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-validate
*/
schematype02 : function () {
   var success;
    if(checkInitialization(builder, "schematype02") != null) return;
    var doc;
      var elem;
      var node;
      var nodeName;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var canSetValidate;
      var canSetSchemaType;
      var dtdNS = "http://www.w3.org/TR/REC-xml";
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetSchemaType = domConfig.canSetParameter("schema-type",dtdNS);
      
	if(
	
	(canSetValidate && canSetSchemaType)

	) {
	domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", dtdNS);
	 resourceURI = getResourceURI("test3");
      doc = lsParser.parseURI(resourceURI);
      assertNotNull("docNotNull",doc);
elem = doc.documentElement;

      assertNotNull("docElemNotNull",elem);
nodeName = elem.nodeName;

      assertEquals("docElemName","elt0",nodeName);
       
	}
	
},
/**
* 
Specify schema validation for a document with no DTD but schema location hints.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-schema-type
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-validate
*/
schematype03 : function () {
   var success;
    if(checkInitialization(builder, "schematype03") != null) return;
    var doc;
      var elem;
      var node;
      var nodeName;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var canSetValidate;
      var canSetSchemaType;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetSchemaType = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetValidate && canSetSchemaType)

	) {
	domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 resourceURI = getResourceURI("schematype1");
      doc = lsParser.parseURI(resourceURI);
      assertNotNull("docNotNull",doc);
elem = doc.documentElement;

      assertNotNull("docElemNotNull",elem);
nodeName = elem.nodeName;

      assertEquals("docElemName","elt0",nodeName);
       
	}
	
},
/**
* 
Serialize a document with schema validation but no available schema.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-schema-type
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-validate
*/
schematype04 : function () {
   var success;
    if(checkInitialization(builder, "schematype04") != null) return;
    var doc;
      var elem;
      var node;
      var nodeName;
      var domConfig;
      var domImplLS;
      var resourceURI;
      var canSetValidate;
      var canSetSchemaType;
      var xsdNS = "http://www.w3.org/2001/XMLSchema";
      var lsSerializer;
      var nullNS = null;

      var doctype = null;

      var output;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      domConfig = lsSerializer.domConfig;

      canSetValidate = domConfig.canSetParameter("validate",true);
      canSetSchemaType = domConfig.canSetParameter("schema-type",xsdNS);
      
	if(
	
	(canSetValidate && canSetSchemaType)

	) {
	domConfig.setParameter("validate", true);
	 domConfig.setParameter("schema-type", xsdNS);
	 doc = domImplLS.createDocument(nullNS,"elt0",doctype);
      
	{
		success = false;
		try {
            output = lsSerializer.writeToString(doc);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 82);
		}
		assertTrue("throw_SERIALIZE_ERR",success);
	}

	}
	
},
/**
* 
CDATASections containing unrepresentable characters should be split when split-cdata-sections is true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-split-cdata-sections
*/
splitcdatasections01 : function () {
   var success;
    if(checkInitialization(builder, "splitcdatasections01") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsSerializer;
      var docType = null;

      var docElem;
      var newNode;
      var output;
      var retNode;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      doc = domImplLS.createDocument("http://www.example.org","test",docType);
      docElem = doc.documentElement;

      newNode = doc.createCDATASection("this is not ]]> good");
      retNode = docElem.appendChild(newNode);
      domConfig = lsSerializer.domConfig;

      domConfig.setParameter("split-cdata-sections", true);
	 domConfig.setParameter("cdata-sections", true);
	 output = lsSerializer.writeToString(doc);
      
			{
			assertFalse("notNaive",(output.indexOf("this is not ]]> good") >= 0));
}
},
/**
* 
CDATASections containing unrepresentable characters raise a SERIALIZE_ERR when 
split-cdata-sections is false and well-formed is true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-split-cdata-sections
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-well-formed
*/
splitcdatasections02 : function () {
   var success;
    if(checkInitialization(builder, "splitcdatasections02") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsSerializer;
      var docType = null;

      var docElem;
      var newNode;
      var output;
      var retNode;
      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var severity;
      var type;
      var errorCount = 0;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      doc = domImplLS.createDocument("http://www.example.org","test",docType);
      docElem = doc.documentElement;

      newNode = doc.createCDATASection("this is not ]]> good");
      retNode = docElem.appendChild(newNode);
      domConfig = lsSerializer.domConfig;

      domConfig.setParameter("split-cdata-sections", false);
	 domConfig.setParameter("cdata-sections", true);
	 domConfig.setParameter("well-formed", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 
	{
		success = false;
		try {
            output = lsSerializer.writeToString(doc);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 82);
		}
		assertTrue("throw_SERIALIZE_ERR",success);
	}
errors = errorMonitor.allErrors;
for(var indexN100A7 = 0;indexN100A7 < errors.length; indexN100A7++) {
      error = errors[indexN100A7];
      severity = error.severity;

      type = error.type;

      
	if(
	("wf-invalid-character" == type)
	) {
	assertEquals("severityError",2,severity);
       errorCount += 1;

	}
	
	}
   	assertTrue("hasWfErrors",
      
	(errorCount > 0)
);

},
/**
* 
Parsing a document with a unsupported encoding should raise a PARSE_ERR and dispatch a "unsupported-encoding"
DOM error.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
*/
unsupportedencoding01 : function () {
   var success;
    if(checkInitialization(builder, "unsupportedencoding01") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsParser;
      var resourceURI;
      var nullSchemaLanguage = null;

      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var severity;
      var type;
      var errorCount = 0;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaLanguage);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("error-handler", errorMonitor.handleError);
	 resourceURI = getResourceURI("unsupportedencoding1");
      
	{
		success = false;
		try {
            doc = lsParser.parseURI(resourceURI);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 81);
		}
		assertTrue("throw_PARSE_ERR",success);
	}
errors = errorMonitor.allErrors;
for(var indexN10078 = 0;indexN10078 < errors.length; indexN10078++) {
      error = errors[indexN10078];
      severity = error.severity;

      type = error.type;

      
	if(
	("unsupported-encoding".toUpperCase() == type.toUpperCase())
	) {
	assertEquals("isError",3,severity);
       errorCount += 1;

	}
	
	}
   assertEquals("oneError",1,errorCount);
       
},
/**
* 
Load a document without a DTD with validate=false, should load without complaint.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-validate
*/
validate01 : function () {
   var success;
    if(checkInitialization(builder, "validate01") != null) return;
    var doc;
      var elem;
      var node;
      var nodeName;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("validate", false);
	 resourceURI = getResourceURI("test0");
      doc = lsParser.parseURI(resourceURI);
      assertNotNull("docNotNull",doc);
elem = doc.documentElement;

      assertNotNull("docElemNotNull",elem);
nodeName = elem.nodeName;

      assertEquals("docElemName","elt0",nodeName);
       
},
/**
* 
Load a document without a DTD with validate=true, should throw PARSE_ERR.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-validate
*/
validate02 : function () {
   var success;
    if(checkInitialization(builder, "validate02") != null) return;
    var doc;
      var elem;
      var node;
      var nodeName;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      errorMonitor = new DOMErrorMonitor();
      
      var canSet;
      var errors = new Array();

      var error;
      var errorCount = 0;
      var severity;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSet = domConfig.canSetParameter("validate",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("validate", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 resourceURI = getResourceURI("test0");
      
	{
		success = false;
		try {
            doc = lsParser.parseURI(resourceURI);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 81);
		}
		assertTrue("throw_PARSE_ERR",success);
	}
errors = errorMonitor.allErrors;
for(var indexN10096 = 0;indexN10096 < errors.length; indexN10096++) {
      error = errors[indexN10096];
      severity = error.severity;

      
	if(
	(2 == severity)
	) {
	errorCount += 1;

	}
	
	}
   	assertTrue("atLeastOneError",
      
	(errorCount > 0)
);

	}
	
},
/**
* 
Load a document with a DTD that doesn't match content with validate=false, should load without complaint.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-validate
*/
validate03 : function () {
   var success;
    if(checkInitialization(builder, "validate03") != null) return;
    var doc;
      var elem;
      var node;
      var nodeName;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("validate", false);
	 resourceURI = getResourceURI("validate1");
      doc = lsParser.parseURI(resourceURI);
      assertNotNull("docNotNull",doc);
elem = doc.documentElement;

      assertNotNull("docElemNotNull",elem);
nodeName = elem.nodeName;

      assertEquals("docElemName","elt0",nodeName);
       
},
/**
* 
Load a document with mismatched DTD with validate=true, should throw PARSE_ERR.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-validate
*/
validate04 : function () {
   var success;
    if(checkInitialization(builder, "validate04") != null) return;
    var doc;
      var elem;
      var node;
      var nodeName;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      errorMonitor = new DOMErrorMonitor();
      
      var canSet;
      var errors = new Array();

      var error;
      var errorCount = 0;
      var severity;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSet = domConfig.canSetParameter("validate",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("validate", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 resourceURI = getResourceURI("validate1");
      
	{
		success = false;
		try {
            doc = lsParser.parseURI(resourceURI);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 81);
		}
		assertTrue("throw_PARSE_ERR",success);
	}
errors = errorMonitor.allErrors;
for(var indexN10096 = 0;indexN10096 < errors.length; indexN10096++) {
      error = errors[indexN10096];
      severity = error.severity;

      
	if(
	(2 == severity)
	) {
	errorCount += 1;

	}
	
	}
   	assertTrue("atLeastOneError",
      
	(errorCount > 0)
);

	}
	
},
/**
* 
A document without a DTD should serialize without complaint if validate is false.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-validate
*/
validate05 : function () {
   var success;
    if(checkInitialization(builder, "validate05") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsSerializer;
      var docType = null;

      var output;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      doc = domImplLS.createDocument("http://www.example.org","test",docType);
      domConfig = lsSerializer.domConfig;

      domConfig.setParameter("validate", false);
	 output = lsSerializer.writeToString(doc);
      
},
/**
* 
A document without a DTD should throw a SERIALIZE_ERR if validate is true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-validate
*/
validate06 : function () {
   var success;
    if(checkInitialization(builder, "validate06") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsSerializer;
      var docType = null;

      var output;
      var canSet;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      doc = domImplLS.createDocument("http://www.example.org","test",docType);
      domConfig = lsSerializer.domConfig;

      canSet = domConfig.canSetParameter("validate",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("validate", true);
	 
	{
		success = false;
		try {
            output = lsSerializer.writeToString(doc);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 82);
		}
		assertTrue("throw_SERIALIZE_ERR",success);
	}

	}
	
},
/**
* 
Load and serialize a document with a DTD that doesn't match content with validate=false, should load and serialize without complaint.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-validate
*/
validate07 : function () {
   var success;
    if(checkInitialization(builder, "validate07") != null) return;
    var doc;
      var elem;
      var node;
      var nodeName;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var lsSerializer;
      var output;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("validate", false);
	 resourceURI = getResourceURI("validate1");
      doc = lsParser.parseURI(resourceURI);
      assertNotNull("docNotNull",doc);
elem = doc.documentElement;

      assertNotNull("docElemNotNull",elem);
nodeName = elem.nodeName;

      assertEquals("docElemName","elt0",nodeName);
       lsSerializer = domImplLS.createLSSerializer();
      domConfig = lsSerializer.domConfig;

      domConfig.setParameter("validate", false);
	 output = lsSerializer.writeToString(doc);
      
},
/**
* 
Load a document with a DTD that doesn't match content, then attempt to serialize when validate is true which
should result in a SERIALIZE_ERR.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-validate
*/
validate08 : function () {
   var success;
    if(checkInitialization(builder, "validate08") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      var lsSerializer;
      var output;
      var canSet;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      domConfig = lsSerializer.domConfig;

      canSet = domConfig.canSetParameter("validate",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("validate", true);
	 lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("validate", false);
	 resourceURI = getResourceURI("validate1");
      doc = lsParser.parseURI(resourceURI);
      
	{
		success = false;
		try {
            output = lsSerializer.writeToString(doc);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 82);
		}
		assertTrue("throw_SERIALIZE_ERR",success);
	}

	}
	
},
/**
* 
Load a document without a DTD with validate-if-schema=false, should load without complaint.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-validate-if-schema
*/
validateifschema01 : function () {
   var success;
    if(checkInitialization(builder, "validateifschema01") != null) return;
    var doc;
      var elem;
      var node;
      var nodeName;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("validate-if-schema", false);
	 resourceURI = getResourceURI("test0");
      doc = lsParser.parseURI(resourceURI);
      assertNotNull("docNotNull",doc);
elem = doc.documentElement;

      assertNotNull("docElemNotNull",elem);
nodeName = elem.nodeName;

      assertEquals("docElemName","elt0",nodeName);
       
},
/**
* 
Load a document without a DTD with validate-if-schema=true should successfully complete.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-validate-if-schema
*/
validateifschema02 : function () {
   var success;
    if(checkInitialization(builder, "validateifschema02") != null) return;
    var doc;
      var elem;
      var node;
      var nodeName;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      errorMonitor = new DOMErrorMonitor();
      
      var canSet;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSet = domConfig.canSetParameter("validate-if-schema",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("validate-if-schema", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 resourceURI = getResourceURI("test0");
      doc = lsParser.parseURI(resourceURI);
      assertNotNull("docNotNull",doc);
errorMonitor.assertLowerSeverity("noErrors", 2);
     elem = doc.documentElement;

      assertNotNull("docElemNotNull",elem);
nodeName = elem.nodeName;

      assertEquals("docElemName","elt0",nodeName);
       
	}
	
},
/**
* 
Load a document with a DTD that doesn't match content with validate-if-schema=false, should load without complaint.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-validate-if-schema
*/
validateifschema03 : function () {
   var success;
    if(checkInitialization(builder, "validateifschema03") != null) return;
    var doc;
      var elem;
      var node;
      var nodeName;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("validate-if-schema", false);
	 resourceURI = getResourceURI("validate1");
      doc = lsParser.parseURI(resourceURI);
      assertNotNull("docNotNull",doc);
elem = doc.documentElement;

      assertNotNull("docElemNotNull",elem);
nodeName = elem.nodeName;

      assertEquals("docElemName","elt0",nodeName);
       
},
/**
* 
Load a document with mismatched DTD with validate-if-schema=true, should throw PARSE_ERR.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-validate-if-schema
*/
validateifschema04 : function () {
   var success;
    if(checkInitialization(builder, "validateifschema04") != null) return;
    var doc;
      var elem;
      var node;
      var nodeName;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      errorMonitor = new DOMErrorMonitor();
      
      var canSet;
      var errors = new Array();

      var error;
      var errorCount = 0;
      var severity;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      canSet = domConfig.canSetParameter("validate-if-schema",true);
      
	if(
	canSet
	) {
	domConfig.setParameter("validate-if-schema", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 resourceURI = getResourceURI("validate1");
      
	{
		success = false;
		try {
            doc = lsParser.parseURI(resourceURI);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 81);
		}
		assertTrue("throw_PARSE_ERR",success);
	}
errors = errorMonitor.allErrors;
for(var indexN10096 = 0;indexN10096 < errors.length; indexN10096++) {
      error = errors[indexN10096];
      severity = error.severity;

      
	if(
	(2 == severity)
	) {
	errorCount += 1;

	}
	
	}
   	assertTrue("atLeastOneError",
      
	(errorCount > 0)
);

	}
	
},
/**
* 
Load a document with an invalid character in a tagname.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-well-formed
*/
wellformed01 : function () {
   var success;
    if(checkInitialization(builder, "wellformed01") != null) return;
    var doc;
      var elem;
      var node;
      var nodeName;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var errorCount = 0;
      var severity;
      var type;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("well-formed", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 resourceURI = getResourceURI("wellformed1");
      
	{
		success = false;
		try {
            doc = lsParser.parseURI(resourceURI);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 81);
		}
		assertTrue("throw_PARSE_ERR",success);
	}
errors = errorMonitor.allErrors;
for(var indexN1008C = 0;indexN1008C < errors.length; indexN1008C++) {
      error = errors[indexN1008C];
      type = error.type;

      severity = error.severity;

      
	if(
	
	(severity > 1)

	) {
	assertEquals("type","wf-invalid-character-in-node-name",type);
       assertEquals("severityError",2,severity);
       errorCount += 1;

	}
	
	}
   assertEquals("oneWFError",1,errorCount);
       
},
/**
* 
Load a document with an invalid character in an attribute name.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-well-formed
*/
wellformed02 : function () {
   var success;
    if(checkInitialization(builder, "wellformed02") != null) return;
    var doc;
      var elem;
      var node;
      var nodeName;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var errorCount = 0;
      var severity;
      var type;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("well-formed", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 resourceURI = getResourceURI("wellformed2");
      
	{
		success = false;
		try {
            doc = lsParser.parseURI(resourceURI);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 81);
		}
		assertTrue("throw_PARSE_ERR",success);
	}
errors = errorMonitor.allErrors;
for(var indexN1008C = 0;indexN1008C < errors.length; indexN1008C++) {
      error = errors[indexN1008C];
      type = error.type;

      severity = error.severity;

      
	if(
	
	(severity > 1)

	) {
	assertEquals("type","wf-invalid-character-in-node-name",type);
       assertEquals("severityError",2,severity);
       errorCount += 1;

	}
	
	}
   assertEquals("oneWFError",1,errorCount);
       
},
/**
* 
Load a document with an invalid character in an attribute value, should throw a PARSE_ERR and 
dispatch a DOMError with type 'wf-invalid-character'.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSParser-parseURI
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-Core-20031107/core#parameter-well-formed
*/
wellformed03 : function () {
   var success;
    if(checkInitialization(builder, "wellformed03") != null) return;
    var doc;
      var elem;
      var node;
      var nodeName;
      var domConfig;
      var domImplLS;
      var lsParser;
      var nullSchemaType = null;

      var resourceURI;
      errorMonitor = new DOMErrorMonitor();
      
      var errors = new Array();

      var error;
      var errorCount = 0;
      var severity;
      var type;
      domImplLS = getImplementation();
lsParser = domImplLS.createLSParser(1,nullSchemaType);
      domConfig = lsParser.domConfig;

      domConfig.setParameter("well-formed", true);
	 domConfig.setParameter("error-handler", errorMonitor.handleError);
	 resourceURI = getResourceURI("wellformed3");
      
	{
		success = false;
		try {
            doc = lsParser.parseURI(resourceURI);
        }
		catch(ex) {            
      success = (typeof(ex.code) != 'undefined' && ex.code == 81);
		}
		assertTrue("throw_PARSE_ERR",success);
	}
errors = errorMonitor.allErrors;
for(var indexN1008C = 0;indexN1008C < errors.length; indexN1008C++) {
      error = errors[indexN1008C];
      type = error.type;

      severity = error.severity;

      
	if(
	("wf-invalid-character" == type)
	) {
	assertEquals("severityError",2,severity);
       errorCount += 1;

	}
	
	}
   assertEquals("oneWFError",1,errorCount);
       
},
/**
* Writes a document to a URL for a temporary file 
    using LSSerializer.writeToURI and rereads the document.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToURI
*/
writeToURI1 : function () {
   var success;
    if(checkInitialization(builder, "writeToURI1") != null) return;
    var testDoc;
      var domImpl;
      var output;
      var serializer;
      var systemId;
      var checkSystemId;
      var status;
      var input;
      var parser;
      var checkDoc;
      var docElem;
      var docElemName;
      var NULL_SCHEMA_TYPE = null;

      
      var testDocRef = null;
      if (typeof(this.testDoc) != 'undefined') {
        testDocRef = this.testDoc;
      }
      testDoc = load(testDocRef, "testDoc", "test0");
      domImpl = getImplementation();
fail("Unrecognized method or attribute createTempURI");

      serializer = domImpl.createLSSerializer();
      status = serializer.writeToURI(testDoc,systemId);
      assertTrue("writeStatus",status);
input = domImpl.createLSInput();
      input.systemId = systemId;

      parser = domImpl.createLSParser(1,NULL_SCHEMA_TYPE);
      checkDoc = parser.parse(input);
      assertNotNull("checkNotNull",checkDoc);
docElem = checkDoc.documentElement;

      docElemName = docElem.nodeName;

      assertEquals("checkDocElemName","elt0",docElemName);
       
},
/**
* Writes a document to a URL for a http server 
    using LSSerializer.writeToURI and rereads the document.
* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToURI
*/
writeToURI2 : function () {
   var success;
    if(checkInitialization(builder, "writeToURI2") != null) return;
    var testDoc;
      var domImpl;
      var output;
      var serializer;
      var systemId;
      var checkSystemId;
      var status;
      var input;
      var parser;
      var checkDoc;
      var docElem;
      var docElemName;
      var NULL_SCHEMA_TYPE = null;

      
      var testDocRef = null;
      if (typeof(this.testDoc) != 'undefined') {
        testDocRef = this.testDoc;
      }
      testDoc = load(testDocRef, "testDoc", "test0");
      domImpl = getImplementation();
fail("Unrecognized method or attribute createTempURI");

      serializer = domImpl.createLSSerializer();
      status = serializer.writeToURI(testDoc,systemId);
      assertTrue("writeStatus",status);
input = domImpl.createLSInput();
      input.systemId = systemId;

      parser = domImpl.createLSParser(1,NULL_SCHEMA_TYPE);
      checkDoc = parser.parse(input);
      assertNotNull("checkNotNull",checkDoc);
docElem = checkDoc.documentElement;

      docElemName = docElem.nodeName;

      assertEquals("checkDocElemName","elt0",docElemName);
       
},
/**
* 
XML declarations should be serialized if xml-declaration is true.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-xml-declaration
*/
xmldeclaration01 : function () {
   var success;
    if(checkInitialization(builder, "xmldeclaration01") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsSerializer;
      var docType = null;

      var output;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      doc = domImplLS.createDocument("http://www.example.org","test",docType);
      domConfig = lsSerializer.domConfig;

      domConfig.setParameter("xml-declaration", true);
	 output = lsSerializer.writeToString(doc);
      	assertTrue("containsXMLDecl",
      (output.indexOf("<?xml") >= 0));
	assertTrue("containsUTF16",
      (output.indexOf("UTF-16") >= 0));
	assertTrue("contains1_0",
      (output.indexOf("1.0") >= 0));

},
/**
* 
XML declarations should not be serialized if xml-declaration is false.

* @author Curt Arnold
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#LS-LSSerializer-writeToString
* @see http://www.w3.org/TR/2003/CR-DOM-Level-3-LS-20031107/load-save#parameter-xml-declaration
*/
xmldeclaration02 : function () {
   var success;
    if(checkInitialization(builder, "xmldeclaration02") != null) return;
    var doc;
      var domConfig;
      var domImplLS;
      var lsSerializer;
      var docType = null;

      var output;
      domImplLS = getImplementation();
lsSerializer = domImplLS.createLSSerializer();
      doc = domImplLS.createDocument("http://www.example.org","test",docType);
      domConfig = lsSerializer.domConfig;

      domConfig.setParameter("xml-declaration", false);
	 output = lsSerializer.writeToString(doc);
      
			{
			assertFalse("containsXMLDecl",(output.indexOf("<?xml") >= 0));

			{
			assertFalse("containsUTF16",(output.indexOf("UTF-16") >= 0));

			{
			assertFalse("contains1_0",(output.indexOf("1.0") >= 0));
}
}
}
}}
