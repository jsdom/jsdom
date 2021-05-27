// Copyright 2016 Google Inc.
//
// Licensed under the Apache License, Version 2.0 (the "License");
// you may not use this file except in compliance with the License.
// You may obtain a copy of the License at
//
//     http://www.apache.org/licenses/LICENSE-2.0
//
// Unless required by applicable law or agreed to in writing, software
// distributed under the License is distributed on an "AS IS" BASIS,
// WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
// See the License for the specific language governing permissions and
// limitations under the License.
'use strict';

const animateOptions = {
  duration: 100,
  fill: 'forwards',
  easing: 'ease'
};

customElements.define('view-source', class ViewSource extends HTMLElement {
  constructor() {
    super();
    this._built = false;

    const shadowRoot = this.attachShadow({mode: 'open'});

    shadowRoot.innerHTML = `
      <link rel=stylesheet href="resources/highlight-default.css">
      <style>
        :host { display: block; }
        button { width: 100%; text-align: left; }
        #spinny-arrow { display: inline-block; }
        #label { margin-left: 1em; }
        #source {
          overflow: hidden;
          height: 0;
          box-sizing: border-box;
          padding-top: 0;
          padding-bottom: 0;
          margin: 0;
        }
      </style>
      <button>
        <span id="spinny-arrow">▶</span>
        <span id="label">View source
      </button>
      <pre id="source"></pre>
    `;


    this._spinnyArrow = shadowRoot.querySelector('#spinny-arrow');
    this._label = shadowRoot.querySelector('#label');
    this._source = shadowRoot.querySelector('#source');

    const button = shadowRoot.querySelector('button');
    let shown = false;
    button.onclick = () => {
      if (shown) {
        this.hide();
        shown = false;
        return;
      }

      this.show();
      shown = true;
    };
  }

  hide() {
    this._spinnyArrow.animate({
      transform: ['rotate(90deg)', 'rotate(0deg)']
    }, animateOptions);

    const currentHeight = this._source.clientHeight;
    this._source.animate({
      height: [`${currentHeight}px`, '0px'],
      paddingTop: ['0.5em', '0'],
      paddingBottom: ['0.5em', '0']
    }, animateOptions);
  }

  show() {
    this._spinnyArrow.animate({
      transform: ['rotate(0deg)', 'rotate(90deg)']
    }, animateOptions);

    const currentHeight = this._source.clientHeight;
    this._source.style.overflow = 'hidden';
    this._source.animate({
      height: ['0', 'auto'],
      paddingTop: ['0', '0.5em'],
      paddingBottom: ['0', '0.5em']
    }, animateOptions);
  }

  async connectedCallback() {
    if (this._built) {
      return;
    }

    const res = await fetch(location.href);
    const text = await res.text();

    const [,snippedText] = /\/\/ BEGIN SOURCE TO VIEW([\s\S]+)\/\/ END SOURCE TO VIEW/.exec(text);

    this._source.textContent = snippedText.trim();
    hljs.highlightBlock(this._source);
    this._built = true;
  }
});
