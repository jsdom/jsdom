const { JSDOM } = require("../../../../..");

exports.staffNS = function() {
  return (new JSDOM(`\
<!DOCTYPE staff PUBLIC "STAFF" "staffNS.dtd">
<staff><employee xmlns="http://www.nist.gov" xmlns:dmstc="http://www.usa.com"><employeeId>EMP0001</employeeId><name>Margaret Martin</name><position>Accountant</position><salary>56,000</salary><gender>Female</gender><address dmstc:domestic="Yes">1230 North Ave. Dallas, Texas 98551</address></employee><employee xmlns:dmstc="http://www.usa.com"><employeeId>EMP0002</employeeId><name>Martha Raynolds
&lt;![CDATA[This is a CDATASection with EntityReference number 2 &amp;ent2;]]&gt;
&lt;![CDATA[This is an adjacent CDATASection with a reference to a tab &amp;tab;]]&gt;</name><position>Secretary</position><salary>35,000</salary><gender>Female</gender><address dmstc:domestic="Yes" street="Yes">&amp;ent2; Dallas, &amp;ent3;
 98554</address></employee><employee xmlns:dmstc="http://www.netzero.com"><employeeId>EMP0003</employeeId><name>Roger
 Jones</name><position>Department Manager</position><salary>100,000</salary><gender>&amp;ent4;</gender><address dmstc:domestic="Yes" street="No">PO Box 27 Irving, texas 98553</address></employee><emp:employee xmlns:emp="http://www.nist.gov" xmlns:nm="http://www.altavista.com"><emp:employeeId>EMP0004</emp:employeeId><nm:name>Jeny Oconnor</nm:name><emp:position>Personal Director</emp:position><emp:salary>95,000</emp:salary><emp:gender>Female</emp:gender><emp:address emp:domestic="Yes" street="Y&amp;ent1;" emp:zone="CANADA" id="CANADA" emp:district="DISTRICT" emp:local1="TRUE">27 South Road. Dallas, texas 98556</emp:address></emp:employee><employee><employeeId>EMP0005</employeeId><name>Robert Myers</name><position>Computer Specialist</position><salary>90,000</salary><gender>male</gender><address street="Yes" xmlns="http://www.nist.gov">1821 Nordic. Road, Irving Texas 98558</address></employee></staff>`, { contentType: "application/xml" })).window.document;
};
