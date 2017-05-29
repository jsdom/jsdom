// Modified JSDOM to allow `super` on `HTMLElement`.
const { JSDOM } = require('./');
const { window } = new JSDOM('<!doctype html>')

// FIXME Necessary for now to get MyShinyComponent in the shared JSDOM window.
global.window = window;

// Web Components on the way...!
const { HTMLElement, document, customElements } = window;

// Plain ole Custom Element...
class WebComponent extends HTMLElement {
  constructor(props = { someMessage: 'From innerHTML' }) {
    super();

    this.innerHTML = `<span>Hello ${props.someMessage}</span>`;
  }

  connectedCallback() {
    console.log('Called from innerHTML code path');
  }

  attributeChangedCallback(...args) {
    console.log(args);
  }
}

// Define into the internal JSDOM CustomElementsRegistry
customElements.define('web-component', WebComponent);

// Helper function to create a regular DOM Node or upgraded Custom Element.
function makeElement(tagName, props) {
  const Constructor = customElements.get(tagName);

  if (Constructor) {
    return new Constructor(props);
  }
  else {
    document.createElement(tagName);
  }
}

const el = makeElement('web-component', { someMessage: 'From New' });

debugger;
el.setAttribute('test', 'attributeChangedCallback');
console.log(el.outerHTML);
el.removeAttribute('test');

console.log(el.outerHTML);

document.body.innerHTML = '<web-component></web-component>';

console.log(document.body.innerHTML);
