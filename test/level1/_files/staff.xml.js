var sys = require("sys");
exports.staff = function() {
  
  var implementation = new DOMImplementation({
    "XML" : "1.0"
  });
  
  var notations = new NamedNodeMap();
  notations.setNamedItem(new Notation("notation1","notation1File", null));
  notations.setNamedItem(new Notation("notation2",null, "notation2File"));
  
  var entities = new NamedNodeMap();
  
  var ent1 = new Entity("ent1");
  ent1.appendChild(new Text("es"));
  entities.setNamedItem(ent1);
  entities.setNamedItem(new Entity("ent2", "1900 Dallas Road"));
  
  var ent3 = new Entity("ent3", null, null, "notation name?", new Text("Texas"));
  entities.setNamedItem(ent3);
  
  var entElement = new Element("entElement");
  entElement.setAttribute("domestic", "Yes");
  //entElement.appendChild();
  entElement.appendChild(new ProcessingInstruction("PItarget", "PfIdata"));
  var ent4 = new Entity("ent4", null, null, "notation name?", new Text("Element data"));
  
  entities.setNamedItem(ent4);
  
  entities.setNamedItem(new Entity("ent5", "entityURI"));
  
  var doctype = new DocumentType("staff", entities, notations);
  var doc = new Document("staff", doctype, implementation);

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

  ids[0].appendChild(new Text("EMP0001"));
  salaries[0].appendChild(new Text("56,000"));
  addresses[0].setAttribute("domestic", "Yes");
  addresses[0].appendChild(new Text('1230 North Ave. Dallas, Texas 98551'));
  names[0].appendChild(new Text("Margaret Martin"));
  genders[0].appendChild(new Text("Female"));
  positions[0].appendChild(new Text("Accountant"));


  ids[1].appendChild(new Text("EMP0002"));
  salaries[1].appendChild(new Text("35,000"));
  addresses[1].setAttribute("domestic", "Yes");
  addresses[1].setAttribute("street", "Yes");
  addresses[1].appendChild(new Text("&ent2; Dallas, &ent3; \n98554"));
  names[1].appendChild(new Text("Martha Raynolds"));
  names[1].appendChild(new CDATASection("This is a CDATASection with EntityReference number 2 &ent2;"));
  names[1].appendChild(new CDATASection("This is an adjacent CDATASection with a reference to a tab &tab;"));  
  genders[1].appendChild(new Text("Female"));
  positions[1].appendChild(new Text("Secretary"));


  ids[2].appendChild(new Text("EMP0003"));
  salaries[2].appendChild(new Text("100,000"));
  addresses[2].setAttribute("domestic", "Yes");
  addresses[2].setAttribute("street", "No");
  addresses[2].appendChild(new Text("PO Box 27 Irving, texas 98553"));
  names[2].appendChild(new Text("Roger\n Jones")) ;
  genders[2].appendChild(doc.createEntityReference("ent42"));//Text("&ent4"));
  positions[2].appendChild(new Text("Department Manager"));

  
  ids[3].appendChild(new Text("EMP0004"));
  salaries[3].appendChild(new Text("95,000"));
  addresses[3].setAttribute("domestic", "Yes");
  addresses[3].setAttribute("street", "Y&ent1;");
  addresses[3].appendChild(new Text("27 South Road. Dallas, Texas 98556"));
  names[3].appendChild(new Text("Jeny Oconnor"));
  genders[3].appendChild(new Text("Female"));
  positions[3].appendChild(new Text("Personal Director"));
  

  ids[4].appendChild(new Text("EMP0005"));
  salaries[4].appendChild(new Text("90,000"));  
  addresses[4].setAttribute("street", "Yes");
  addresses[4].appendChild(new Text("1821 Nordic. Road, Irving Texas 98558"));
  names[4].appendChild(new Text("Robert Myers"));
  genders[4].appendChild(new Text("male"));
  positions[4].appendChild(new Text("Computer Specialist"));
  
  doc.appendChild(doc.createProcessingInstruction("TEST-STYLE", "PIDATA"));

  /*<?xml version="1.0"?>
  <?TEST-STYLE PIDATA?>
  <!DOCTYPE staff SYSTEM "staff.dtd" [
  <!ENTITY ent1 "es">
  <!ENTITY ent2 "1900 Dallas Road">
  <!ENTITY ent3 "Texas">
  <!ENTITY ent4 "<entElement domestic='Yes'>Element data</entElement><?PItarget PIdata?>">
  <!ENTITY ent5 PUBLIC "entityURI" "entityFile" NDATA notation1>
  <!ENTITY ent1 "This entity should be discarded">
  <!NOTATION notation1 PUBLIC "notation1File">
  <!NOTATION notation2 SYSTEM "notation2File">
  ]>

  <!-- This is comment number 1.-->
  <staff>
  <employee>
  <employeeId>EMP0001</employeeId>
  <name>Margaret Martin</name>
  <position>Accountant</position>           
  <salary>56,000</salary>
  <gender>Female</gender>
  <address domestic="Yes">1230 North Ave. Dallas, Texas 98551</address>
  </employee>

  <employee>
  <employeeId>EMP0002</employeeId>
  <name>Martha Raynolds<![CDATA[This is a CDATASection with EntityReference number 2 &ent2;]]>
  <![CDATA[This is an adjacent CDATASection with a reference to a tab &tab;]]></name>
  <position>Secretary</position>
  <salary>35,000</salary>
  <gender>Female</gender>
  <address domestic="Yes" street="Yes">&ent2; Dallas, &ent3;
  98554</address>
  </employee>
  
  <employee>
  <employeeId>EMP0003</employeeId>
  <name>Roger
  Jones</name>
  <position>Department Manager</position>
  <salary>100,000</salary>
  <gender>&ent4;</gender>
  <address domestic="Yes" street="No">PO Box 27 Irving, texas 98553</address>
  </employee>
  
  <employee>
  <employeeId>EMP0004</employeeId>
  <name>Jeny Oconnor</name>
  <position>Personnel Director</position>
  <salary>95,000</salary>
  <gender>Female</gender>

  <address domestic="Yes" street="Y&ent1;">27 South Road. Dallas, Texas 98556</address>
  </employee>
  <employee>
  <employeeId>EMP0005</employeeId>
  <name>Robert Myers</name>
  <position>Computer Specialist</position>
  <salary>90,000</salary>

  <gender>male</gender>
  <address street="Yes">1821 Nordic. Road, Irving Texas 98558</address>
  </employee>
  </staff>*/

  doc.appendChild(new Comment(" This is comment number 1."));
  doc.appendChild(staff);
  
  return doc;
};
