### Basic info:

- **Node.js version:** <!-- only v18 and above are supported -->
- **jsdom version:** <!-- only v23 and above are supported -->

### Minimal reproduction case

<!--
Please create a minimal repro. Any reports involving third party libraries
will be closed, as we cannot debug third-party library interactions for you.

Please do not use syntax that is not supported in Node.js, such as JSX. If
we cannot run the code in Node.js, we will close the issue, as we cannot
debug whatever toolchain you are using.

TO BE CLEAR: your example needs to be self-contained enough that we can
copy-paste it into a file named `test.js`, and then run it using
`node test.js`. *No* Jest or similar.

IF YOU DO NOT FOLLOW THESE INSTRUCTIONS WE WILL CLOSE THE ISSUE.
-->

```js
const { JSDOM } = require("jsdom");

const options = {
  ... your options here ...
};
const dom = new JSDOM(`
  ... your HTML here ...
`, options);

... your code that reproduces the problem here, probably using dom.window ...
```


### How does similar code behave in browsers?

(Link to a jsbin or similar strongly suggested.)
