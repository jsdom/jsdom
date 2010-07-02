var sys = require("sys");
exports.staff2 = function() {
 var doc = new Document("staff2");
  
  var implementation = new DOMImplementation(doc, {
    "XML" : "1.0"
  });

  var notations = new NotationNodeMap(
    doc,
    doc.createNotationNode("notation1","notation1File", null),
    doc.createNotationNode("notation2",null, "notation2File")
  );



//<entElement domestic='Yes'>Element data</entElement><?PItarget PIdata?>  
  var entElement = doc.createElement("entElement");
  entElement.setAttribute("domestic", "Yes");
  entElement.appendChild(doc.createTextNode("Element data"));
  var procElement = doc.createProcessingInstruction("PItarget", "PfIdata");
  var ent4 = doc.createEntityNode("ent4",entElement, procElement);

  var ent5 = doc.createEntityNode("ent5");
  ent5.publicId = "entityURI";
  ent5.systemId = "entityFile";
  ent5.notationName = "notation1";
  
  var entities = new EntityNodeMap(
    doc,
    doc.createEntityNode("ent1", doc.createTextNode("es")),
    doc.createEntityNode("ent2",doc.createTextNode("1900 Dallas Road")),
    doc.createEntityNode("ent3",doc.createTextNode("Texas")),
    ent4,
    ent5
  );



  // Setup the DTD/Default Attribute Values

/*
<!ATTLIST entElement 
          attr1 CDATA "Attr">
<!ATTLIST address
          domestic CDATA #IMPLIED 
          street CDATA "Yes">
<!ATTLIST entElement 
          domestic CDATA "MALE" >
*/
  
  var defaultAttributes = new NamedNodeMap(doc);
  var entElement = doc.createElement("entElement");
  entElement.setAttribute("attr1", "Attr");
  entElement.setAttribute("domestic", "MALE");
  defaultAttributes.setNamedItem(entElement);    

  var defaultAddress = doc.createElement("address");
  defaultAddress.setAttribute("street", "Yes");
  defaultAttributes.setNamedItem(defaultAddress);

  doc.doctype = new DocumentType(doc, "staff", entities, notations, defaultAttributes);
  
  doc.implementation = implementation;  
  
  var staff     = doc.createElement("staff");
  var employees = [];
  var addresses = [];
  var names     = [];
  var positions = [];
  var genders   = [];
  var ids       = [];
  var salaries  = [];
  
  // create 5 employees
  for (var i=0; i<5; i++)
  {
    var employee = doc.createElement("employee");
    var address  = doc.createElement("address");
    var name     = doc.createElement("name");
    var position = doc.createElement("position");
    var gender   = doc.createElement("gender");
    var id       = doc.createElement("employeeId");
    var salary   = doc.createElement("salary");
    
    employee.appendChild(id);
    employee.appendChild(name);
    employee.appendChild(position);
    employee.appendChild(salary);
    employee.appendChild(gender);
    employee.appendChild(address);
    staff.appendChild(employee);

    names.push(name);
    employees.push(employee);
    addresses.push(address);	
    genders.push(gender);
    positions.push(position);
    ids.push(id);
    salaries.push(salary);
  }

  // Employee #1
  employee.setAttribute("xmlns", "http://www.nist.gov");
  employee.setAttributeNS("http://www.nist.gov", "dmstc", "http://www.usa.com");
  ids[0].appendChild(doc.createTextNode("EMP0001"));
  salaries[0].appendChild(doc.createTextNode("56,000"));
  addresses[0].setAttribute("domestic", "Yes");
  addresses[0].appendChild(doc.createTextNode('1230 North Ave. Dallas, Texas 98551'));
  names[0].appendChild(doc.createTextNode("Margaret Martin"));
  genders[0].appendChild(doc.createTextNode("Female"));
  positions[0].appendChild(doc.createTextNode("Accountant"));


  // Employee #2
  employee.setAttribute("xmlns", "http://www.nist.gov");
  employee.setAttributeNS("http://www.nist.gov", "dmstc", "http://www.usa.com");  
  ids[1].appendChild(doc.createTextNode("EMP0002"));
  salaries[1].appendChild(doc.createTextNode("35,000"));
  
  addresses[1].setAttribute("domestic", "Yes");
  addresses[1].setAttribute("street", "Yes");
  addresses[1].appendChild(doc.createEntityReference("ent2"));
  addresses[1].appendChild(doc.createTextNode(" Dallas, "));
  addresses[1].appendChild(doc.createEntityReference("ent3"));
  addresses[1].appendChild(doc.createTextNode("\n 98554"));
  
  names[1].appendChild(doc.createTextNode("Martha Raynolds"));
  names[1].appendChild(doc.createCDATASection("This is a CDATASection with EntityReference number 2 &ent2;"));
  names[1].appendChild(doc.createTextNode("\r\n"));
  names[1].appendChild(doc.createCDATASection("This is an adjacent CDATASection with a reference to a tab &tab;"));  
  genders[1].appendChild(doc.createTextNode("Female"));
  positions[1].appendChild(doc.createTextNode("Secretary"));


  // Employee #3
  employee.setAttribute("xmlns", "http://www.nist.gov");
  employee.setAttributeNS("http://www.nist.gov", "dmstc", "http://www.usa.com");  
  ids[2].appendChild(doc.createTextNode("EMP0003"));
  salaries[2].appendChild(doc.createTextNode("100,000"));
  addresses[2].setAttribute("domestic", "Yes");
  addresses[2].setAttribute("street", "No");
  addresses[2].appendChild(doc.createTextNode("PO Box 27 Irving, texas 98553"));
  names[2].appendChild(doc.createTextNode("Roger\n Jones")) ;
  genders[2].appendChild(doc.createEntityReference("ent4"));//Text("&ent4"));
  positions[2].appendChild(doc.createTextNode("Department Manager"));

  // Employee #4
  employee.setAttribute("xmlns", "http://www.nist.gov");
  employee.setAttributeNS("http://www.nist.gov", "dmstc", "http://www.usa.com");  
  ids[3].appendChild(doc.createTextNode("EMP0004"));
  salaries[3].appendChild(doc.createTextNode("95,000"));
  addresses[3].setAttribute("domestic", "Yes");
  addresses[3].setAttribute("street", "Y");
  var ent1Ref = doc.createEntityReference("ent1");
 // addresses[3].attributes.getNamedItem("street").childNodes.push(ent1Ref);
  addresses[3].appendChild(doc.createTextNode("27 South Road. Dallas, Texas 98556"));
  names[3].appendChild(doc.createTextNode("Jeny Oconnor"));
  genders[3].appendChild(doc.createTextNode("Female"));
  positions[3].appendChild(doc.createTextNode("Personal Director"));

  // Employee #5
  employee.setAttribute("xmlns", "http://www.nist.gov");
  employee.setAttributeNS("http://www.nist.gov", "dmstc", "http://www.usa.com");  
  ids[4].appendChild(doc.createTextNode("EMP0005"));
  salaries[4].appendChild(doc.createTextNode("90,000"));  
  addresses[4].setAttribute("street", "Yes");
  addresses[4].appendChild(doc.createTextNode("1821 Nordic. Road, Irving Texas 98558"));
  names[4].appendChild(doc.createTextNode("Robert Myers"));
  genders[4].appendChild(doc.createTextNode("male"));
  positions[4].appendChild(doc.createTextNode("Computer Specialist"));
  
  doc.appendChild(doc.createProcessingInstruction("TEST-STYLE", "PIDATA"));

  doc.appendChild(doc.createComment(" This is comment number 1."));
  doc.appendChild(staff);
  
  doc.normalize();  
  return doc;
};
