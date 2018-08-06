"use strict";
const { JSDOM } = require("../../../../..");

exports.staff = function () {
  // NB: removed "<?PItarget PIdata?>" from ent4 because it breaks htmlparser2     https://github.com/fb55/htmlparser2/issues/117
  // NB: removed newline after <?TEST-STYLE PIDATA?> because it breaks htmlparser2 https://github.com/fb55/htmlparser2/issues/118
  return (new JSDOM(`<?xml version="1.0"?><?TEST-STYLE PIDATA?><!DOCTYPE staff SYSTEM "staff.dtd" [
   <!ENTITY ent1 "es">
   <!ENTITY ent2 "1900 Dallas Road">
   <!ENTITY ent3 "Texas">
   <!ENTITY ent4 "<entElement domestic='Yes'>Element data</entElement>">
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
 </staff>
`, { contentType: "application/xml" })).window.document;
};
