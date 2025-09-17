const { JSDOM } = require("../../../lib/api");

const dom = new JSDOM(`
  <div>
    <span id="s1">Actions</span>
    <ul>
      <li>
        <a href="/">
          <span id="s2">Link</span>
        </a>
      </li>
    </ul>
  </div>
`);
const document = dom.window.document;
const anchor = document.querySelector("a");
// console.log(anchor); // Uncomment this and it works?!
const span = anchor.querySelector("span");
console.log(span.innerHTML);
