"use strict";
const jsdom = require("../..");

export["parses text/html"] = t => {
  const parser = new DOMParser();
  const html = '<div>hello world</div>'
  const doc = parser.parseFromString(html, 'text/html')
  // TODO validate `doc` somehow
  t.done();
}

export["parses text/xml"] = t => {
  const parser = new DOMParser();
  const xml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <root>
      <parent attr="val">
        <child attribute="value"></child>
        <child attribute="value"></child>
      </parent>
    </root>
  `;
  const doc = parser.parseFromString(xml, 'text/xml')
  // TODO validate `doc` somehow
  t.done();
}

export["parses application/xml"] = t => {
  const parser = new DOMParser();
  const xml = `
    <?xml version="1.0" encoding="UTF-8"?>
    <root>
      <parent attr="val">
        <child attribute="value"></child>
        <child attribute="value"></child>
      </parent>
    </root>
  `;
  const doc = parser.parseFromString(xml, 'application/xml')
  // TODO validate `doc` somehow
  t.done();
}

export["parses application/xhtml+xml"] = t => {
  const parser = new DOMParser();
  const xhtml = `
    <!DOCTYPE html PUBLIC "-//W3C//DTD XHTML 1.0 Transitional//EN" "http://www.w3.org/TR/xhtml1/DTD/xhtml1-transitional.dtd">
    <html xmlns="http://www.w3.org/1999/xhtml">
      <head>
        <title>The title</title>
      </head>
      <body>The body</body>
    </html>
  `;
  const doc = parser.parseFromString(xhtml, 'application/xhtml+xml')
  // TODO validate `doc` somehow
  t.done();
}

export["parses image/svg+xml"] = t => {
  const parser = new DOMParser()
  const svg = `
    <?xml version="1.0"?>
    <svg viewBox="0 0 120 120" version="1.1" xmlns="http://www.w3.org/2000/svg">
      <circle cx="60" cy="60" r="50"/>
    </svg>
  `;
  const doc = parser.parseFromString(svg, 'image/svg+xml')
  // TODO validate `doc` somehow
  t.done();
}
