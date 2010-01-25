var sys = require("sys");
exports.hc_staff = function() {

  var implementation = new DOMImplementation({
    "XML" : "1.0"
  });

  var notations = new NamedNodeMap();
  notations.setNamedItem(new Notation("notation1","notation1File", null));
  notations.setNamedItem(new Notation("notation2",null, "notation2File"));
  
  var entities = new NamedNodeMap();
  
  entities.setNamedItem(new Entity("alpha", "&#945;"));
  entities.setNamedItem(new Entity("beta", "&#946;"));
  entities.setNamedItem(new Entity("gamma", "&#947;"));
  entities.setNamedItem(new Entity("delta", "&#948;"));
  entities.setNamedItem(new Entity("epsilon", "&#949;"));
  entities.setNamedItem(new Entity("alpha", "&#950;"));

  var doctype = new DocumentType("xhtml1-strict", entities, notations);
  var doc = new Document("html", doctype, implementation);
  
  doc.appendChild(new Comment(" This is comment number 1."));
  
  var html      = doc.createElement("html");
  var html      = doc.appendChild(html);
  
  var head      = doc.createElement("head");
  var head      = html.appendChild(head);
  
  var title     = doc.createElement("title").appendChild(new Text("hc_staff"));
  var title     = head.appendChild(title);

  var body      = doc.createElement("body");
  var staff     = html.appendChild(body);

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
    var employee = doc.createElement("p");
    var address  = doc.createElement("acronym");
    var name     = doc.createElement("strong");
    var position = doc.createElement("code");
    var gender   = doc.createElement("var");
    var id       = doc.createElement("em");
    var salary   = doc.createElement("sup");
    
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
  addresses[0].setAttribute("title", "Yes");
  addresses[0].appendChild(new Text('1230 North Ave. Dallas, Texas 98551'));
  names[0].appendChild(new Text("Margaret Martin"));
  genders[0].appendChild(new Text("Female"));
  positions[0].appendChild(new Text("Accountant"));

  ids[1].appendChild(new Text("EMP0002"));
  salaries[1].appendChild(new Text("35,000"));
  addresses[1].setAttribute("title", "Yes");
  addresses[1].setAttribute("class", "Yes");
  addresses[1].appendChild(new Text("&beta; Dallas, &gamma; \n98554"));
  names[1].appendChild(new Text("Martha Raynolds"));
  names[1].appendChild(new CDATASection("This is a CDATASection with EntityReference number 2 &amp;ent2;"));
  names[1].appendChild(new CDATASection("This is an adjacent CDATASection with a reference to a tab &amp;tab;"));  
  genders[1].appendChild(new Text("Female"));
  positions[1].appendChild(new Text("Secretary"));

  ids[2].appendChild(new Text("EMP0003"));
  salaries[2].appendChild(new Text("100,000"));
  addresses[2].setAttribute("title", "Yes");
  addresses[2].setAttribute("class", "No");
  addresses[2].appendChild(new Text("PO Box 27 Irving, texas 98553"));
  names[2].appendChild(new Text("Roger\n Jones")) ;
  genders[2].appendChild(doc.createEntityReference("&delta;"));//Text("&delta;"));
  positions[2].appendChild(new Text("Department Manager"));

  ids[3].appendChild(new Text("EMP0004"));
  salaries[3].appendChild(new Text("95,000"));
  addresses[3].setAttribute("title", "Yes");
  addresses[3].setAttribute("class", "Y&alpha;");
  addresses[3].appendChild(new Text("27 South Road. Dallas, Texas 98556"));
  names[3].appendChild(new Text("Jeny Oconnor"));
  genders[3].appendChild(new Text("Female"));
  positions[3].appendChild(new Text("Personal Director"));
  
  ids[4].appendChild(new Text("EMP0005"));
  salaries[4].appendChild(new Text("90,000"));  
  addresses[4].setAttribute("title", "Yes");
  addresses[4].appendChild(new Text("1821 Nordic. Road, Irving Texas 98558"));
  names[4].appendChild(new Text("Robert Myers"));
  genders[4].appendChild(new Text("male"));
  positions[4].appendChild(new Text("Computer Specialist"));

  doc.appendChild(doc.createProcessingInstruction("TEST-STYLE", "PIDATA"));
  
  return doc;
};

/*
<?xml version="1.0"?>
<?TEST-STYLE PIDATA?>
<!DOCTYPE html
   PUBLIC "-//W3C//DTD XHTML 1.0 Strict//EN"
   "xhtml1-strict.dtd" [
   <!ENTITY alpha "&#945;">
   <!ENTITY beta "&#946;">
   <!ENTITY gamma "&#947;">
   <!ENTITY delta "&#948;">
   <!ENTITY epsilon "&#949;">
   <!ENTITY alpha "&#950;">
   <!NOTATION notation1 PUBLIC "notation1File">
   <!NOTATION notation2 SYSTEM "notation2File">
   <!ATTLIST acronym dir CDATA "ltr">

]>
<!-- This is comment number 1.-->
<html xmlns='http://www.w3.org/1999/xhtml'>
<head>
	<meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/>
	<title>hc_staff</title>
</head>
<body>
 <p>
  <em>EMP0001</em>
  <strong>Margaret Martin</strong>
  <code>Accountant</code>           
  <sup>56,000</sup>

  <var>Female</var>
  <acronym title="Yes">1230 North Ave. Dallas, Texas 98551</acronym>
 </p>
 <p>
  <em>EMP0002</em>
  <strong>Martha RaynoldsThis is a CDATASection with EntityReference number 2 &amp;ent2;
This is an adjacent CDATASection with a reference to a tab &amp;tab;</strong>

  <code>Secretary</code>
  <sup>35,000</sup>
  <var>Female</var>
  <acronym title="Yes" class="Yes">&beta; Dallas, &gamma;
 98554</acronym>
 </p>

 <p>
  <em>EMP0003</em>
  <strong>Roger
 Jones</strong>
  <code>Department Manager</code>
  <sup>100,000</sup>
  <var>&delta;</var>
  <acronym title="Yes" class="No">PO Box 27 Irving, texas 98553</acronym>

 </p>
 <p>
  <em>EMP0004</em>
  <strong>Jeny Oconnor</strong>
  <code>Personnel Director</code>
  <sup>95,000</sup>
  <var>Female</var>

  <acronym title="Yes" class="Y&alpha;">27 South Road. Dallas, Texas 98556</acronym>
 </p>
 <p>
  <em>EMP0005</em>
  <strong>Robert Myers</strong>
  <code>Computer Specialist</code>
  <sup>90,000</sup>

  <var>male</var>
  <acronym title="Yes">1821 Nordic. Road, Irving Texas 98558</acronym>
 </p>
</body></html>
*/