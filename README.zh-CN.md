<h1 align="center">
    <img width="100" height="100" src="logo.svg" alt=""><br>
    jsdom
</h1>
<p align="center"><a href="./README.md"><b>English</b></a> | <b>简体中文</b></p>

jsdom 是许多 Web 标准的纯 JavaScript 实现，尤其是 WHATWG 的 [DOM](https://dom.spec.whatwg.org/) 和 [HTML](https://html.spec.whatwg.org/multipage/) 标准，供 Node.js 使用。总体而言，本项目的目标是模拟 Web 浏览器的足够子集，以便对真实的 Web 应用进行测试和抓取。

最新版本的 jsdom 需要较新的 Node.js 版本；详情请参阅 `package.json` 中的 `"engines"` 字段。

## 基本用法

```js
const jsdom = require("jsdom");
const { JSDOM } = jsdom;
```

使用 jsdom 时，你主要会使用 `JSDOM` 构造函数，它是 jsdom 主模块的命名导出。给构造函数传入一个字符串，你会得到一个 `JSDOM` 对象，它有许多有用的属性，特别是 `window`：

```js
const dom = new JSDOM(`<!DOCTYPE html><p>Hello world</p>`);
console.log(dom.window.document.querySelector("p").textContent); // "Hello world"
```

（请注意，jsdom 会像浏览器一样解析你传入的 HTML，包括隐式生成的 `<html>`、`<head>` 和 `<body>` 标签。）

得到的对象是 `JSDOM` 类的实例，除了 `window` 之外还包含许多有用的属性和方法。一般来说，它可以用于从"外部"操作 jsdom，做一些普通 DOM API 无法做到的事情。对于不需要这些功能的简单场景，我们推荐这样的编码模式：

```js
const { window } = new JSDOM(`...`);
// or even
const { document } = (new JSDOM(`...`)).window;
```

关于 `JSDOM` 类所有功能的完整文档见下方"`JSDOM` 对象 API"一节。

## 定制 jsdom

`JSDOM` 构造函数接受第二个参数，可通过以下方式定制你的 jsdom。

### 简单选项

```js
const dom = new JSDOM(``, {
  url: "https://example.org/",
  referrer: "https://example.com/",
  contentType: "text/html",
  includeNodeLocations: true,
  storageQuota: 10000000
});
```

- `url` 设置 `window.location`、`document.URL` 和 `document.documentURI` 返回的值，并影响文档内相对 URL 的解析、同源限制以及获取子资源时使用的 referrer。默认为 `"about:blank"`。
- `referrer` 只影响从 `document.referrer` 读到的值。默认为无 referrer（反映为空字符串）。
- `contentType` 影响从 `document.contentType` 读到的值，以及文档如何被解析：作为 HTML 还是 XML。不属于 [HTML MIME 类型](https://mimesniff.spec.whatwg.org/#html-mime-type) 或 [XML MIME 类型](https://mimesniff.spec.whatwg.org/#xml-mime-type) 的值会抛出异常。默认为 `"text/html"`。如果存在 `charset` 参数，它会影响[二进制数据处理](#编码嗅探)。
- `includeNodeLocations` 保留 HTML 解析器产生的位置信息，使你能够通过 `nodeLocation()` 方法（见下文）获取它。它还确保在 `<script>` 元素内运行的代码在异常堆栈跟踪中报告的行号是正确的。默认为 `false` 以获得最佳性能，且不能与 XML 内容类型一起使用，因为我们的 XML 解析器不支持位置信息。
- `storageQuota` 是 `localStorage` 和 `sessionStorage` 各自存储区域的最大容量（以代码单元计）。尝试存储超过此限制的数据将抛出 `DOMException`。默认受 HTML 规范启发，设为每个源 5,000,000 代码单元。

请注意，`url` 和 `referrer` 在使用前都会被规范化，因此例如你传入 `"https:example.com"`，jsdom 会按你传入 `"https://example.com/"` 来解读。如果你传入无法解析的 URL，调用将抛出异常。（URL 的解析和序列化遵循 [URL 标准](https://url.spec.whatwg.org/)。）

### 执行脚本

jsdom 最强大的能力是可以在 jsdom 内部执行脚本。这些脚本可以修改页面内容，并访问 jsdom 实现的所有 Web 平台 API。

然而，在处理不受信任的内容时，这也非常危险。jsdom 沙箱并非万无一失，在 DOM 的 `<script>` 中运行的代码如果足够努力，就能访问 Node.js 环境，进而访问你的机器。因此，执行 HTML 中嵌入脚本的能力默认是关闭的：

```js
const dom = new JSDOM(`<body>
  <div id="content"></div>
  <script>document.getElementById("content").append(document.createElement("hr"));</script>
</body>`);

// The script will not be executed, by default:
console.log(dom.window.document.getElementById("content").children.length); // 0
```

要启用页面内脚本执行，可以使用 `runScripts: "dangerously"` 选项：

```js
const dom = new JSDOM(`<body>
  <div id="content"></div>
  <script>document.getElementById("content").append(document.createElement("hr"));</script>
</body>`, { runScripts: "dangerously" });

// The script will be executed and modify the DOM:
console.log(dom.window.document.getElementById("content").children.length); // 1
```

我们再次强调，只在你确信代码安全时才使用它。如果你对任意用户提供的代码或来自互联网的代码使用它，实际上就等于在运行不受信任的 Node.js 代码，你的机器可能被攻破。

如果你想执行_外部_脚本（通过 `<script src="">` 引入的），还需要确保它们会被加载。为此，请添加 `resources: "usable"` 选项（[见下文](#加载子资源)）。（出于那里讨论的原因，你可能还需要设置 `url` 选项。）

当 HTML 或 XML 文档遇到需要等待资源的阻塞脚本时，解析会暂停。因此 `JSDOM` 构造函数可能返回一个仅部分构建的文档；后面的元素要等解析恢复后才可用。这同样适用于 `JSDOM.fromURL()` 和 `JSDOM.fromFile()` 返回的文档。等待 `DOMContentLoaded` 来检查完整的树，或等待 `load` 事件，以同时等待这些会阻塞加载的资源——先检查 `document.readyState`，以防事件已经触发。

像 `<div onclick="">` 这样的事件处理属性同样受此设置约束；除非将 `runScripts` 设为 `"dangerously"`，否则它们不会生效。（不过，像 `div.onclick = ...` 这样的事件处理_属性_无论 `runScripts` 如何设置都会生效。）请注意，此保证仅覆盖 jsdom 处理的 Web 内容，不涵盖宿主 Node.js 环境本身被攻破的场景（例如通过原型污染）。更多详情见[安全策略](https://github.com/jsdom/.github/blob/master/SECURITY.md)。

如果你只是想"从外部"执行脚本，而不是让 `<script>` 元素和事件处理属性"从内部"运行，可以使用 `runScripts: "outside-only"` 选项，它会在 `window` 上安装 JavaScript 规范提供的所有全局对象的新副本。这包括 `window.Array`、`window.Promise` 等。其中特别值得注意的是 `window.eval`，它允许运行脚本，但以 jsdom 的 `window` 作为全局对象：

```js
const dom = new JSDOM(`<body>
  <div id="content"></div>
  <script>document.getElementById("content").append(document.createElement("hr"));</script>
</body>`, { runScripts: "outside-only" });

// run a script outside of JSDOM:
dom.window.eval('document.getElementById("content").append(document.createElement("p"));');

console.log(dom.window.document.getElementById("content").children.length); // 1
console.log(dom.window.document.getElementsByTagName("hr").length); // 0
console.log(dom.window.document.getElementsByTagName("p").length); // 1
```

该选项默认出于性能原因关闭，但启用是安全的。

请注意，在默认配置下（未设置 `runScripts`），`window.Array`、`window.eval` 等的值与外部 Node.js 环境提供的相同。也就是说 `window.eval === eval` 成立，因此 `window.eval` 不会以有用的方式运行脚本。

我们强烈建议不要尝试把 jsdom 和 Node 的全局环境混在一起（例如执行 `global.window = dom.window`）来"执行脚本"，然后在 Node 全局环境中运行脚本或测试代码。相反，你应该像对待浏览器一样对待 jsdom，把所有需要访问 DOM 的脚本和测试放在 jsdom 环境内运行，使用 `window.eval` 或 `runScripts: "dangerously"`。例如，这可能需要创建一个 browserify 打包文件，作为 `<script>` 元素来执行——就像你在浏览器中做的那样。

最后，对于高级用例，你可以使用下面有文档说明的 `dom.getInternalVMContext()` 方法。

### 伪装成可视化浏览器

jsdom 不具备渲染可视化内容的能力，默认表现得像一个无头浏览器。它通过 `document.hidden` 等 API 向网页提示其内容不可见。

当 `pretendToBeVisual` 选项设为 `true` 时，jsdom 会假装正在渲染和显示内容。具体做法是：

- 让 `document.hidden` 返回 `false` 而不是 `true`
- 让 `document.visibilityState` 返回 `"visible"` 而不是 `"prerender"`
- 启用 `window.requestAnimationFrame()` 和 `window.cancelAnimationFrame()` 方法（否则它们不存在）

```js
const window = (new JSDOM(``, { pretendToBeVisual: true })).window;

window.requestAnimationFrame(timestamp => {
  console.log(timestamp > 0);
});
```

请注意，jsdom 仍然[不做任何布局或渲染](#web-平台中未实现的部分)，所以这真的只是_假装_可视化，而不是实现真正的可视化 Web 浏览器会实现的那部分平台。

### 加载子资源

#### 基本选项

默认情况下，jsdom 不会加载任何子资源，例如脚本、样式表、图片或 iframe。如果你希望 jsdom 加载这类资源，可以传入 `resources: "usable"` 选项，它会加载所有可用的资源，包括：

- 通过 `<frame>` 和 `<iframe>` 加载框架
- 通过 `<link rel="stylesheet">` 加载样式表
- 通过 `<script>` 加载脚本，但仅当同时设置了 `runScripts: "dangerously"`
- 通过 `<img>` 加载图片，但仅当同时安装了 `canvas` npm 包（见下方"[Canvas 支持](#canvas-支持)"）

在尝试加载资源时，请记住 `url` 选项的默认值是 `"about:blank"`，这意味着通过相对 URL 引入的任何资源都会加载失败（把 URL `/something` 基于 `about:blank` 解析的结果是错误）。因此，这种情况下你多半需要为 `url` 选项设置非默认值，或使用会自动设置的[便捷 API](#便捷-api)之一。

#### 高级配置

要更全面地定制 jsdom 的资源加载行为，包括 [`JSDOM.fromURL()`](#fromurl) 发出的初始请求，以及使用 `dom.window.XMLHttpRequest` 或 `dom.window.WebSocket` 发出的任何请求，你可以给 `resources` 选项传一个选项对象。这样做会以上述 `resources: "usable"` 行为作为基线，在此之上叠加你的定制。

可用选项如下：

- `userAgent` 影响发送的 `User-Agent` 请求头，从而影响 `navigator.userAgent` 的值。默认为 <code>\`Mozilla/5.0 (${process.platform || "unknown OS"}) AppleWebKit/537.36 (KHTML, like Gecko) jsdom/${jsdomVersion}\`</code>。

- `dispatcher` 可以设为自定义的 [undici `Dispatcher`](https://undici.nodejs.org/#/docs/api/Dispatcher)，用于高级用例，例如配置代理或自定义 TLS 设置。例如，要使用代理，可以使用 undici 的 `ProxyAgent`。

- `interceptors` 可以设为 [`undici` 拦截器函数](https://undici.nodejs.org/#/docs/api/Dispatcher?id=parameter-interceptor)数组。拦截器可用于修改请求或响应，而无需编写一个全新的 `Dispatcher`。

对于检查传入请求或返回合成响应这种简单场景，你可以使用 jsdom 的 `requestInterceptor()` 辅助函数，它接收一个 [`Request`](https://developer.mozilla.org/en-US/docs/Web/API/Request) 对象和上下文，并可以返回一个 [`Response`](https://developer.mozilla.org/en-US/docs/Web/API/Response)：

```js
const { JSDOM, requestInterceptor } = require("jsdom");

const dom = new JSDOM(`<script src="https://example.com/some-specific-script.js"></script>`, {
  url: "https://example.com/",
  runScripts: "dangerously",
  resources: {
    userAgent: "Mellblomenator/9000",
    dispatcher: new ProxyAgent("http://127.0.0.1:9001"),
    interceptors: [
      requestInterceptor((request, context) => {
        // Override the contents of this script to do something unusual.
        if (request.url === "https://example.com/some-specific-script.js") {
          return new Response("window.someGlobal = 5;", {
            headers: { "Content-Type": "application/javascript" }
          });
        }
        // Return undefined to let the request proceed normally
      })
    ]
  }
});
```

传给拦截器的上下文对象包含 `element`（发起请求的 DOM 元素，对于非 DOM 元素发起的请求则为 `null`）。例如：

```js
requestInterceptor((request, { element }) => {
  if (element) {
    console.log(`Element ${element.localName} is requesting ${request.url}`);
  }
  // Return undefined to let the request proceed normally
})
```

为了说清流程：当 jsdom 中的某些东西获取资源时，请求先由 jsdom 设置，然后按给定顺序经过各个 `interceptors`，最后到达提供的 `dispatcher`（默认为 [undici 的全局 dispatcher](https://undici.nodejs.org/#/?id=undicigetglobaldispatcher)）。如果你使用 jsdom 的 `requestInterceptor()` 并返回一个以 `Response` 兑现的 Promise，后续的拦截器都不会运行，也不会到达基础 dispatcher。

> [!WARNING]
> 当 jsdom 内部的脚本使用同步 `XMLHttpRequest` 时，所有资源加载定制都会被忽略。这是一个技术限制，因为我们无法跨进程边界传递 dispatcher 或拦截器。

### 虚拟控制台

与 Web 浏览器一样，jsdom 也有"控制台"的概念。它既记录页面直接发送的信息（通过在文档内执行的脚本使用 `window.console` API），也记录来自 jsdom 实现本身的信息。我们把用户可控制的控制台称为"虚拟控制台"，以区别于 Node.js 的 `console` API 和页面内的 `window.console` API。

默认情况下，`JSDOM` 构造函数会返回一个实例，其虚拟控制台把所有输出转发到 Node.js 控制台。这既包括 jsdom 的输出（例如未实现警告或 CSS 解析错误），也包括页面内 `window.console` 的调用。

要创建自己的虚拟控制台并传给 jsdom，可以通过以下方式覆盖此默认行为：

```js
const virtualConsole = new jsdom.VirtualConsole();
const dom = new JSDOM(``, { virtualConsole });
```

这样的代码会创建一个没有任何行为的虚拟控制台。你可以通过为所有可能的控制台方法添加事件监听器来赋予它行为：

```js
virtualConsole.on("error", () => { ... });
virtualConsole.on("warn", () => { ... });
virtualConsole.on("info", () => { ... });
virtualConsole.on("dir", () => { ... });
// ... etc. See https://console.spec.whatwg.org/#logging
```

（请注意，最好在调用 `new JSDOM()` _之前_设置好这些事件监听器，因为错误或调用控制台的脚本可能在解析期间就出现了。）

如果你只是想把虚拟控制台的输出重定向到另一个控制台，比如默认的 Node.js 控制台，可以这样做：

```js
virtualConsole.forwardTo(console);
```

还有一个特殊事件 `"jsdomError"`，它会携带错误对象触发，用于报告来自 jsdom 本身的错误。这类似于 Web 浏览器控制台中常见的错误消息显示方式，即使它们不是由 `console.error` 发起的。

如上所述，jsdom 的默认行为是把这些发送到 Node.js 控制台。这是通过 `console.error(jsdomError.message)` 完成的，或者对于 jsdom 内脚本产生的 `"unhandled-exception"` 类型错误，通过 `console.error(jsdomError.cause.stack)`。使用 `forwardTo()` 会得到相同的行为。如果你想要非默认行为，可以通过以下方式定制：

```js
// Do not send any jsdom errors to the Node.js console:
virtualConsole.forwardTo(console, { jsdomErrors: "none" });

// Send only certain jsdom errors to the Node.js console, ignoring others:
virtualConsole.forwardTo(console, { jsdomErrors: ["unhandled-exception", "not-implemented"]});

// Customize the handling of all jsdom errors:
virtualConsole.forwardTo(console, { jsdomErrors: "none" });
virtualConsole.on("jsdomError", err => {
  switch (err.type) {
    case "unhandled-exception": {
      // ... process ...
      break;
    }
    case "css-parsing": {
      // ... process in some other way ...
      break;
    }
    // ... etc. ...
  }
});
```

每种类型的 jsdom 错误（通过其 `type` 属性区分）的详情如下：

- `"css-parsing"`：解析 CSS 样式表时出错
  - `cause`：来自我们的 CSS 解析器库 [`@acemir/cssom`](https://github.com/acemir/CSSOM) 的异常对象
  - `sheetText`：我们尝试解析的样式表完整文本
- `"not-implemented"`：调用[Web 平台中未实现部分](#web-平台中未实现的部分)的某些存根方法时发出的错误
- `"resource-loading"`：[加载资源](#加载子资源)时出错，例如网络错误或服务器返回了错误的状态码
  - `cause` 属性：jsdom 获取资源时内部 Node.js 网络调用的异常对象，或来自开发者自定义资源加载器的异常对象
  - `url` 属性：尝试获取的资源的 URL
- `"unhandled-exception"`：[脚本执行](#执行脚本)中未被 `Window` 的 `"error"` 事件监听器处理的错误
  - `cause` 属性：包含原始异常对象
- `"xml-parsing"`：文档异步恢复解析后遇到的 XML 语法错误
  - `cause` 属性：同步构造期间本会抛出的 `SyntaxError` 异常

### Cookie jars

与 Web 浏览器一样，jsdom 也有 cookie jar 的概念，用于存储 HTTP cookie。与文档同域的 URL 设置的、且未标记为 HTTP-only 的 cookie，可以通过 `document.cookie` API 访问。此外，cookie jar 中的所有 cookie 都会影响子资源的获取。

默认情况下，`JSDOM` 构造函数会返回一个带有空 cookie jar 的实例。要创建自己的 cookie jar 并传给 jsdom，可以通过以下方式覆盖此默认行为：

```js
const cookieJar = new jsdom.CookieJar(store, options);
const dom = new JSDOM(``, { cookieJar });
```

如果你想在多个 jsdom 之间共享同一个 cookie jar，或提前给 cookie jar 预置某些值，这会很有用。

Cookie jar 由 [tough-cookie](https://www.npmjs.com/package/tough-cookie) 包提供。`jsdom.CookieJar` 构造函数是 tough-cookie cookie jar 的子类，默认设置 `looseMode: true` 选项，因为这[更符合浏览器的行为](https://github.com/whatwg/html/issues/804)。如果你想自己使用 tough-cookie 的工具和类，可以通过 `jsdom.toughCookie` 模块导出来访问 jsdom 内置的 tough-cookie 模块实例。

### 在解析前介入

jsdom 允许你很早就介入 jsdom 的创建：在 `Window` 和 `Document` 对象创建之后、但在解析任何 HTML 用节点填充文档之前：

```js
const dom = new JSDOM(`<p>Hello</p>`, {
  beforeParse(window) {
    window.document.childNodes.length === 0;
    window.someCoolAPI = () => { /* ... */ };
  }
});
```

如果你想以某种方式修改环境，例如为 jsdom 不支持的 Web 平台 API 添加 shim，这个功能特别有用。

## `JSDOM` 对象 API

一旦你构造了 `JSDOM` 对象，它将具有以下有用的能力：

### 属性

`window` 属性获取为你创建的 `Window` 对象。

`virtualConsole` 和 `cookieJar` 属性反映你传入的选项，或在未传入时为这些选项创建的默认值。

### 使用 `serialize()` 序列化文档

`serialize()` 方法会返回文档的 [HTML 序列化](https://html.spec.whatwg.org/#html-fragment-serialisation-algorithm)结果，包括 doctype：

```js
const dom = new JSDOM(`<!DOCTYPE html>hello`);

dom.serialize() === "<!DOCTYPE html><html><head></head><body>hello</body></html>";

// Contrast with:
dom.window.document.documentElement.outerHTML === "<html><head></head><body>hello</body></html>";
```

### 使用 `nodeLocation(node)` 获取节点的源位置

`nodeLocation()` 方法会找出 DOM 节点在源文档中的位置，返回该节点的 [parse5 位置信息](https://www.npmjs.com/package/parse5#options-locationinfo)：

```js
const dom = new JSDOM(
  `<p>Hello
    <img src="foo.jpg">
  </p>`,
  { includeNodeLocations: true }
);

const document = dom.window.document;
const bodyEl = document.body; // implicitly created
const pEl = document.querySelector("p");
const textNode = pEl.firstChild;
const imgEl = document.querySelector("img");

console.log(dom.nodeLocation(bodyEl));   // null; it's not in the source
console.log(dom.nodeLocation(pEl));      // { startOffset: 0, endOffset: 39, startTag: ..., endTag: ... }
console.log(dom.nodeLocation(textNode)); // { startOffset: 3, endOffset: 13 }
console.log(dom.nodeLocation(imgEl));    // { startOffset: 13, endOffset: 32 }
```

请注意，此功能仅在你设置了 `includeNodeLocations` 选项时有效；节点位置默认关闭，出于性能原因。

### 使用 `getInternalVMContext()` 与 Node.js `vm` 模块交互

Node.js 内置的 [`vm`](https://nodejs.org/api/vm.html) 模块是 jsdom 脚本运行魔法的基石。一些高级用例，例如预编译脚本然后多次运行，适合将 `vm` 模块与 jsdom 创建的 `Window` 直接配合使用。

要获取可与 `vm` API 配合使用的[上下文化全局对象](https://nodejs.org/api/vm.html#vm_what_does_it_mean_to_contextify_an_object)，可以使用 `getInternalVMContext()` 方法：

```js
const { Script } = require("node:vm");

const dom = new JSDOM(``, { runScripts: "outside-only" });
const script = new Script(`
  if (!this.ran) {
    this.ran = 0;
  }

  ++this.ran;
`);

const vmContext = dom.getInternalVMContext();

script.runInContext(vmContext);
script.runInContext(vmContext);
script.runInContext(vmContext);

console.assert(dom.window.ran === 3);
```

这是相当高级的功能，除非你有非常特定的需求，我们建议还是使用普通 DOM API（如 `window.eval()` 或 `document.createElement("script")`）。

请注意，如果 `JSDOM` 实例创建时未设置 `runScripts`，此方法会抛出异常。

### 使用 `reconfigure(settings)` 重新配置 jsdom

`window` 上的 `top` 属性在规范中被标记为 `[Unforgeable]`，意味着它是不可配置的自有属性，因此 jsdom 内运行的普通代码无法覆盖或遮蔽它，即使使用 `Object.defineProperty` 也不行。

同样，目前 jsdom 不处理导航（例如设置 `window.location.href = "https://example.com/"`）；这样做会让虚拟控制台发出一个 `"jsdomError"`，说明此功能未实现，并且什么都不改变：不会创建新的 `Window` 或 `Document` 对象，现有 `window` 的 `location` 对象仍会保持所有相同的属性值。

不过，如果你从 window 外部操作，例如在某个创建 jsdom 的测试框架中，你可以使用特殊的 `reconfigure()` 方法覆盖其中之一或两者：

```js
const dom = new JSDOM();

dom.window.top === dom.window;
dom.window.location.href === "about:blank";

dom.reconfigure({ windowTop: myFakeTopForTesting, url: "https://example.com/" });

dom.window.top === myFakeTopForTesting;
dom.window.location.href === "https://example.com/";
```

请注意，更改 jsdom 的 URL 会影响所有返回当前文档 URL 的 API，例如 `window.location`、`document.URL` 和 `document.documentURI`，以及文档内相对 URL 的解析、获取子资源时的同源检查和 referrer。但它不会对该 URL 的内容执行导航；DOM 的内容将保持不变，也不会创建新的 `Window`、`Document` 等实例。

## 便捷 API

### `fromURL()`

除了 `JSDOM` 构造函数本身，jsdom 还提供一个返回 Promise 的工厂方法，用于从 URL 构造 jsdom：

```js
JSDOM.fromURL("https://example.com/", options).then(dom => {
  console.log(dom.serialize());
});
```

如果 URL 有效且请求成功，返回的 Promise 会以 `JSDOM` 实例兑现。任何重定向都会被跟随到最终目的地。

传给 `fromURL()` 的选项与传给 `JSDOM` 构造函数的选项类似，但有以下额外限制和影响：

- 不能提供 `url` 和 `contentType` 选项。
- `referrer` 选项用作初始请求的 HTTP `Referer` 请求头。
- `resources` 选项也会影响初始请求；例如，如果你想配置代理（见上文），这很有用。
- 生成的 jsdom 的 URL、内容类型和 referrer 由响应决定。
- 通过 HTTP `Set-Cookie` 响应头设置的任何 cookie 都会存入 jsdom 的 cookie jar。同样，提供的 cookie jar 中已有的任何 cookie 都会作为 HTTP `Cookie` 请求头发送。

### `fromFile()`

与 `fromURL()` 类似，jsdom 还提供 `fromFile()` 工厂方法，用于从文件名构造 jsdom：

```js
JSDOM.fromFile("stuff.html", options).then(dom => {
  console.log(dom.serialize());
});
```

如果给定的文件可以打开，返回的 Promise 会以 `JSDOM` 实例兑现。与 Node.js API 的常规做法一样，文件名是相对于当前工作目录给出的。

传给 `fromFile()` 的选项与传给 `JSDOM` 构造函数的选项类似，但有以下额外默认值：

- `url` 选项会默认为对应给定文件名的文件 URL，而不是 `"about:blank"`。
- `contentType` 选项在给定文件名以 `.xht`、`.xhtml` 或 `.xml` 结尾时会默认为 `"application/xhtml+xml"`；否则仍默认为 `"text/html"`。

### `fragment()`

在最简单的场景中，你可能不需要一整个 `JSDOM` 实例及其全部能力。你甚至可能不需要 `Window` 或 `Document`！你只需要解析一些 HTML，然后得到一个可以操作的 DOM 对象。为此，我们提供了 `fragment()`，它从给定字符串创建 `DocumentFragment`：

```js
const frag = JSDOM.fragment(`<p>Hello</p><p><strong>Hi!</strong>`);

frag.childNodes.length === 2;
frag.querySelector("strong").textContent === "Hi!";
// etc.
```

这里的 `frag` 是一个 [`DocumentFragment`](https://developer.mozilla.org/en-US/docs/Web/API/DocumentFragment) 实例，其内容由解析提供的字符串创建。解析是使用 `<template>` 元素完成的，因此你可以包含任何元素（包括解析规则古怪的，如 `<td>`）。同样重要的是要注意，生成的 `DocumentFragment` 不会有[关联的浏览上下文](https://html.spec.whatwg.org/multipage/#concept-document-bc)：也就是说，元素的 `ownerDocument` 的 `defaultView` 属性为 null，资源不会加载，等等。

`fragment()` 工厂的所有调用都会得到共享同一个模板所有者 `Document` 的 `DocumentFragment`。这样可以零额外开销地多次调用 `fragment()`。但这也意味着 `fragment()` 的调用不能用任何选项定制。

请注意，对 `DocumentFragment` 做序列化不像对完整 `JSDOM` 对象那么容易。如果你需要序列化你的 DOM，或许应该更直接地使用 `JSDOM` 构造函数。但对于包含单个元素的片段这种特殊情况，通过常规手段很容易做到：

```js
const frag = JSDOM.fragment(`<p>Hello</p>`);
console.log(frag.firstChild.outerHTML); // logs "<p>Hello</p>"
```

## 其他值得一提的特性

### Canvas 支持

jsdom 支持使用 [`canvas`](https://www.npmjs.com/package/canvas) 包为任何 `<canvas>` 元素扩展 canvas API。要使其生效，你需要在项目中把 `canvas` 作为 `jsdom` 的对等依赖（peer dependency）引入。如果 jsdom 能找到 3.x 版本的 `canvas` 包，它会使用它；但如果不存在，`<canvas>` 元素的行为将像 `<div>` 一样。

### 编码嗅探

除了传入字符串，`JSDOM` 构造函数还可以传入二进制数据，形式可以是标准 JavaScript 二进制数据类型，如 `ArrayBuffer`、`Uint8Array`、`DataView` 等。这样做时，jsdom 会像浏览器一样从提供的字节中[嗅探编码](https://html.spec.whatwg.org/multipage/syntax.html#encoding-sniffing-algorithm)，扫描 `<meta charset>` 标签。

如果提供的 `contentType` 选项包含 `charset` 参数，该编码会覆盖嗅探到的编码——除非存在 UTF-8 或 UTF-16 BOM，此时 BOM 优先。（同样，这与浏览器的行为一致。）

这种编码嗅探同样适用于 `JSDOM.fromFile()` 和 `JSDOM.fromURL()`。在后者的情况下，响应携带的任何 `Content-Type` 头都会优先，方式与构造函数的 `contentType` 选项相同。

请注意，在许多情况下，以这种方式提供字节可能比提供字符串更好。例如，如果你尝试使用 Node.js 的 `buffer.toString("utf-8")` API，Node.js 不会移除任何前导 BOM。如果你再把这个字符串给 jsdom，jsdom 会按字面解释它，BOM 会保留下来。但 jsdom 的二进制数据解码代码会像浏览器一样移除前导 BOM；在这种情况下，直接提供 `buffer` 会得到期望的结果。

### 关闭 jsdom

jsdom 中的定时器（由 `window.setTimeout()` 或 `window.setInterval()` 设置）按定义会在将来于 window 的上下文中执行代码。由于没有办法在不保持进程存活的情况下在将来执行代码，未完成的 jsdom 定时器会让你的 Node.js 进程保持存活。同样，由于没有办法在不保持对象存活的情况下在对象的上下文中执行代码，未完成的 jsdom 定时器会阻止调度它们的 window 被垃圾回收。

如果你想确保关闭一个 jsdom window，请使用 `window.close()`，它会终止所有正在运行的定时器（并移除 window 和 document 上的所有事件监听器）。

### 使用 Chrome DevTools 调试 DOM

在 Node.js 中，你可以使用 Chrome DevTools 调试程序。入门方法见[官方文档](https://nodejs.org/en/learn/getting-started/debugging)。

默认情况下，jsdom 元素在控制台中显示为普通的 JS 对象。为了方便调试，你可以使用 [jsdom-devtools-formatter](https://github.com/jsdom/jsdom-devtools-formatter)，让你像检查真正的 DOM 元素一样检查它们。

## 注意事项

### 异步脚本加载

使用 jsdom 时，人们经常在异步脚本加载上遇到麻烦。许多页面异步加载脚本，但无法知道它们何时加载完成，也就不知道何时才是运行你的代码并检查生成的 DOM 结构的好时机。这是一个根本性的限制；我们无法预测网页上的脚本会做什么，因此无法告诉你它们何时加载完更多脚本。

有几种绕过的办法。如果你控制着相关页面，最好的办法是使用脚本加载器提供的机制来检测加载何时完成。例如，如果你在使用 RequireJS 这样的模块加载器，代码可以这样写：

```js
// On the Node.js side:
const window = (new JSDOM(...)).window;
window.onModulesLoaded = () => {
  console.log("ready to roll!");
};
```

```html
<!-- Inside the HTML you supply to jsdom -->
<script>
requirejs(["entry-module"], () => {
  window.onModulesLoaded();
});
</script>
```

如果你不控制该页面，可以尝试一些变通办法，例如轮询某个特定元素是否出现。

更多详情见 [#640](https://github.com/jsdom/jsdom/issues/640) 中的讨论，尤其是 [@matthewkastor](https://github.com/matthewkastor) 的[富有见地的评论](https://github.com/jsdom/jsdom/issues/640#issuecomment-22216965)。

### Web 平台中未实现的部分

尽管我们乐于为 jsdom 添加新功能并使其与最新 Web 规范保持同步，但它仍有许多缺失的 API。对于任何缺失的功能，欢迎随时提交 issue，但我们是个小团队且很忙，所以提个 pull request 可能效果更好。

jsdom 的某些功能由我们的依赖提供。这方面值得注意的文档包括我们的 CSS 选择器引擎 [`nwsapi`](https://github.com/dperini/nwsapi) 的[支持的 CSS 选择器](https://github.com/dperini/nwsapi/wiki/CSS-supported-selectors)列表。

除了我们还没来得及做的功能之外，目前还有两大功能在 jsdom 的范围之外。它们是：

- **导航**：在点击链接或赋值 `location.href` 等操作时改变全局对象及所有其他对象的能力。
- **布局**：根据 CSS 计算元素视觉布局位置的能力，它影响 `getBoundingClientRects()` 等方法或 `offsetTop` 等属性。

目前 jsdom 对这些功能的某些方面有占位行为，例如就导航向虚拟控制台发送"未实现"的 `"jsdomError"`，或让许多布局相关的属性返回零。通常你可以在代码中绕过这些限制，例如在抓取过程中为你"导航"到的每个页面创建新的 `JSDOM` 实例，或使用 `Object.defineProperty()` 改变各种布局相关的 getter 和方法返回的值。

请注意，同一领域的其他工具（如 PhantomJS）确实支持这些功能。在 wiki 上，我们有关于 [jsdom 与 PhantomJS 对比](https://github.com/jsdom/jsdom/wiki/jsdom-vs.-PhantomJS) 的更完整论述。

## 支持 jsdom

jsdom 是一个由[志愿者](https://github.com/orgs/jsdom/people)团队维护的社区驱动项目。你可以通过以下方式支持 jsdom：

- 作为 Tidelift 订阅的一部分，[获取 jsdom 的专业支持](https://tidelift.com/subscription/pkg/npm-jsdom?utm_source=npm-jsdom&utm_medium=referral&utm_campaign=readme)。Tidelift 帮助我们维持开源的可持续发展，同时为（订阅）团队提供维护、许可和安全方面的保证。
- [直接为项目做贡献](https://github.com/jsdom/jsdom/blob/main/Contributing.md)。

## 获取帮助

如果你需要 jsdom 方面的帮助，请随时使用以下任一渠道：

- [邮件列表](https://groups.google.com/group/jsdom)（最适合"怎么做"类问题）
- [issue 跟踪器](https://github.com/jsdom/jsdom/issues)（最适合错误报告）
- Matrix 房间：[#jsdom:matrix.org](https://matrix.to/#/#jsdom:matrix.org)
