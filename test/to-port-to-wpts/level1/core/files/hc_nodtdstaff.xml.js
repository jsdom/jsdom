"use strict";
const { JSDOM } = require("../../../../..");

exports.hc_nodtdstaff = function () {
  return (new JSDOM(`
<html><head><meta http-equiv="Content-Type" content="text/html; charset=UTF-8"/><title>hc_nodtdstaff</title></head><body>
 <p>
  <em>EMP0001</em>
  <strong>Margaret Martin</strong>
  <code>Accountant</code>
  <sup>56,000</sup>
  <var>Female</var>

  <acronym title="Yes">1230 North Ave. Dallas, Texas 98551</acronym>
 </p>
</body></html>
`, { contentType: "application/xml" })).window.document;
};
