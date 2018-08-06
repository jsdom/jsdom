"use strict";
const { JSDOM } = require("../../../../..");

exports.hc_staff = function () {
  return (new JSDOM(`

<!DOCTYPE html PUBLIC "-//W3C//DTD HTML 4.01//EN"
    "http://www.w3.org/TR/html4/strict.dtd" >
<!-- This is comment number 1.-->
<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"><title>hc_staff</title></head><body>
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
`)).window.document;
};
