// Modified JSDOM to allow `super` on `HTMLElement`.
const { JSDOM } = require('./');
const { window } = new JSDOM('<!doctype html>')

// FIXME Necessary for now to get MyShinyComponent in the shared JSDOM window.
global.window = window;

// Web Components on the way...!
const { HTMLElement, document, customElements } = window;

// Plain ole Custom Element...
class MyShinyComponent extends HTMLElement {
  constructor(props = { someMessage: 'Set via innerHTML' }) {
    super();

    this.innerHTML = `<span>${props.someMessage}</span>`;
  }
}

// Define into the internal JSDOM CustomElementsRegistry
customElements.define('my-shiny-component', MyShinyComponent);

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

//console.log(
//  makeElement('my-shiny-component', { someMessage: 'Hello World' }).outerHTML
//);

document.body.innerHTML = '<my-shiny-component></my-shiny-component>';

/**
 *
 *
 * @return
 */
console.log(document.body.outerHTML);
