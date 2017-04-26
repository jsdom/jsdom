const jsdom = require("../../../../../lib/old-api.js");

// Our XML parser is not namespace aware so we can't just parse the string

exports.staffNS = function() {
  var bootstrapDoc = jsdom.jsdom(undefined, { parsingMode: "xml" });
  var doctype = bootstrapDoc.implementation.createDocumentType("staff", "STAFF", "staffNS.dtd");
  var doc = bootstrapDoc.implementation.createDocument(null, "staff", doctype);
  var staff = doc.documentElement;

  var employee, address, name, position,gender,id, salary;

  /************************************
  *          EMPLOYEEE 1              *
  ************************************/
  employee = doc.createElementNS("http://www.nist.gov","employee");
  address  = doc.createElementNS("http://www.nist.gov","address");
  name     = doc.createElementNS("http://www.nist.gov","name");
  position = doc.createElementNS("http://www.nist.gov","position");
  gender   = doc.createElementNS("http://www.nist.gov","gender");
  id       = doc.createElementNS("http://www.nist.gov","employeeId");
  salary   = doc.createElementNS("http://www.nist.gov","salary");

  employee.appendChild(id);
  employee.appendChild(name);
  employee.appendChild(position);
  employee.appendChild(salary);
  employee.appendChild(gender);
  employee.appendChild(address);
  staff.appendChild(employee);

  employee.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.nist.gov");
  employee.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:dmstc", "http://www.usa.com");

  id.appendChild(doc.createTextNode("EMP0001"));
  salary.appendChild(doc.createTextNode("56,000"));
  address.appendChild(doc.createTextNode('1230 North Ave. Dallas, Texas 98551'));
  address.setAttributeNS("http://www.usa.com", "dmstc:domestic", "Yes");
  name.appendChild(doc.createTextNode("Margaret Martin"));
  gender.appendChild(doc.createTextNode("Female"));
  position.appendChild(doc.createTextNode("Accountant"));

  /************************************
  *          EMPLOYEEE 2              *
  ************************************/
  employee = doc.createElementNS(null,"employee");
  address  = doc.createElementNS(null,"address");
  name     = doc.createElementNS(null,"name");
  position = doc.createElementNS(null,"position");
  gender   = doc.createElementNS(null,"gender");
  id       = doc.createElementNS(null,"employeeId");
  salary   = doc.createElementNS(null,"salary");

  employee.appendChild(id);
  employee.appendChild(name);
  employee.appendChild(position);
  employee.appendChild(salary);
  employee.appendChild(gender);
  employee.appendChild(address);
  staff.appendChild(employee);

  employee.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:dmstc", "http://www.usa.com");
  id.appendChild(doc.createTextNode("EMP0002"));
  salary.appendChild(doc.createTextNode("35,000"));
  address.setAttributeNS("http://www.usa.com", "dmstc:domestic", "Yes");
  address.setAttributeNS(null, "street", "Yes");
  address.appendChild(doc.createTextNode("&ent2; Dallas, &ent3;\n 98554"));

  name.appendChild(doc.createTextNode("Martha Raynolds\n<![CDATA[This is a CDATASection with EntityReference number 2 &ent2;]]>\n<![CDATA[This is an adjacent CDATASection with a reference to a tab &tab;]]>"));
  gender.appendChild(doc.createTextNode("Female"));
  position.appendChild(doc.createTextNode("Secretary"));


  /************************************
  *          EMPLOYEEE 3              *
  ************************************/
  employee = doc.createElementNS(null,"employee");
  address  = doc.createElementNS(null,"address");
  name     = doc.createElementNS(null,"name");
  position = doc.createElementNS(null,"position");
  gender   = doc.createElementNS(null,"gender");
  id       = doc.createElementNS(null,"employeeId");
  salary   = doc.createElementNS(null,"salary");

  employee.appendChild(id);
  employee.appendChild(name);
  employee.appendChild(position);
  employee.appendChild(salary);
  employee.appendChild(gender);
  employee.appendChild(address);
  staff.appendChild(employee);
  employee.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:dmstc", "http://www.netzero.com");
  id.appendChild(doc.createTextNode("EMP0003"));
  salary.appendChild(doc.createTextNode("100,000"));
  address.setAttributeNS("http://www.netzero.com", "dmstc:domestic", "Yes");
  address.setAttribute("street", "No");
  address.appendChild(doc.createTextNode("PO Box 27 Irving, texas 98553"));
  name.appendChild(doc.createTextNode("Roger\n Jones")) ;
  gender.appendChild(doc.createTextNode("&ent4;"));
  position.appendChild(doc.createTextNode("Department Manager"));

  /************************************
  *          EMPLOYEEE 4              *
  ************************************/
  employee = doc.createElementNS("http://www.nist.gov", "emp:employee");
  address  = doc.createElementNS("http://www.nist.gov", "emp:address");
  name     = doc.createElementNS("http://www.altavista.com", "nm:name");
  position = doc.createElementNS("http://www.nist.gov", "emp:position");
  gender   = doc.createElementNS("http://www.nist.gov", "emp:gender");
  id       = doc.createElementNS("http://www.nist.gov", "emp:employeeId");
  salary   = doc.createElementNS("http://www.nist.gov", "emp:salary");

  employee.appendChild(id);
  employee.appendChild(name);
  employee.appendChild(position);
  employee.appendChild(salary);
  employee.appendChild(gender);
  employee.appendChild(address);
  staff.appendChild(employee);

  employee.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:emp", "http://www.nist.gov");
  employee.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns:nm", "http://www.altavista.com");

  id.appendChild(doc.createTextNode("EMP0004"));
  salary.appendChild(doc.createTextNode("95,000"));
  address.setAttributeNS("http://www.nist.gov", "emp:domestic", "Yes");
  address.setAttributeNS(null, "street", "Y&ent1;");


  // This behavior appears to be undefined!
  address.setAttributeNS("http://www.nist.gov", "emp:zone", "CANADA");
  address.setAttributeNS("http://www.nist.gov", "id", "CANADA");

  address.setAttributeNS("http://www.nist.gov", "emp:district", "DISTRICT");
  address.setAttributeNS("http://www.nist.gov", "emp:local1", "TRUE");

  address.appendChild(doc.createTextNode("27 South Road. Dallas, texas 98556"));
  name.appendChild(doc.createTextNode("Jeny Oconnor"));
  gender.appendChild(doc.createTextNode("Female"));
  position.appendChild(doc.createTextNode("Personal Director"));

  /************************************
  *          EMPLOYEEE 5              *
  ************************************/
  employee = doc.createElementNS(null,"employee");
  address  = doc.createElementNS("http://www.nist.gov","address");
  name     = doc.createElementNS(null,"name");
  position = doc.createElementNS(null,"position");
  gender   = doc.createElementNS(null,"gender");
  id       = doc.createElementNS(null,"employeeId");
  salary   = doc.createElementNS(null,"salary");

  employee.appendChild(id);
  employee.appendChild(name);
  employee.appendChild(position);
  employee.appendChild(salary);
  employee.appendChild(gender);
  employee.appendChild(address);
  staff.appendChild(employee);

  id.appendChild(doc.createTextNode("EMP0005"));
  salary.appendChild(doc.createTextNode("90,000"));
  address.setAttribute("street", "Yes");
  address.setAttributeNS("http://www.w3.org/2000/xmlns/", "xmlns", "http://www.nist.gov");
  address.appendChild(doc.createTextNode("1821 Nordic. Road, Irving Texas 98558"));
  name.appendChild(doc.createTextNode("Robert Myers"));
  gender.appendChild(doc.createTextNode("male"));
  position.appendChild(doc.createTextNode("Computer Specialist"));

  doc.appendChild(doc.createProcessingInstruction("TEST-STYLE", "PIDATA"));
  doc.appendChild(doc.createComment(" This is comment number 1."));

  doc.normalize();
  return doc;
};
