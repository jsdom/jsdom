# Research: Replacing ResourceLoader with Undici Dispatchers

## Current State

### ResourceLoader API

The current `ResourceLoader` class provides:

```js
const resourceLoader = new jsdom.ResourceLoader({
  userAgent: "Custom UA",
  dispatcher: new ProxyAgent("http://proxy:8080")
});

const dom = new JSDOM(``, { resources: resourceLoader });
```

Users can subclass to customize:

```js
class CustomLoader extends jsdom.ResourceLoader {
  fetch(url, { element, cookieJar, referrer, signal, ...options }) {
    console.log(`${element?.localName} fetching ${url}`);
    return super.fetch(url, options);
  }
}
```

Key features:
- `element` parameter tells you which DOM element initiated the fetch
- `cookieJar` for cookie handling (tough-cookie)
- Handles `data:`, `file:`, `http:`, `https:` URL schemes
- Manual redirect following with cookie capture at each hop
- Default headers (User-Agent, Accept, etc.)

---

## Undici Dispatcher Hierarchy

```
Dispatcher (base class, extends EventEmitter)
  ├── Agent (multi-origin, uses factory pattern for Pool/Client per origin)
  │     ├── ProxyAgent (routes through HTTP/HTTPS proxy)
  │     └── RetryAgent (wraps another dispatcher with retry logic)
  ├── Client (single origin, single connection)
  ├── Pool (single origin, multiple connections)
  └── MockAgent (for testing)
```

### Key APIs

**dispatch()** - Low-level callback-based API:
```js
dispatcher.dispatch(options, handler)
// options: { origin, path, method, headers, body, ... }
// handler: { onRequestStart, onResponseStart, onResponseData, onResponseEnd, onResponseError }
```

**compose()** - Chain interceptors:
```js
const dispatcher = new Agent().compose(
  interceptorA,  // called last (wraps innermost)
  interceptorB,  // called second
  interceptorC   // called first (outermost)
);
```

**Interceptor pattern**:
```js
const myInterceptor = dispatch => (opts, handler) => {
  // Modify opts, wrap handler, etc.
  return dispatch(opts, handler);
};
```

---

## The Core Challenge

The fundamental tension:

1. **DOM element context**: jsdom needs to tell users which element initiated a fetch
2. **Undici's design**: Dispatchers don't have a standard way to carry arbitrary context
3. **User customization**: Users want to make routing decisions based on element type

If we eliminate ResourceLoader, we need another mechanism for element-aware customization.

---

## Approach 1: AsyncLocalStorage for Context

jsdom uses Node.js AsyncLocalStorage to propagate request context:

```js
// lib/jsdom/browser/jsdom-context.js
const { AsyncLocalStorage } = require('async_hooks');
const jsdomContext = new AsyncLocalStorage();

module.exports = { jsdomContext };
```

### Internal usage:

```js
// Inside PerDocumentResourceLoader.fetch()
const { jsdomContext } = require('./jsdom-context');

fetch(url, { element, onLoad, onError }) {
  const context = {
    element: idlUtils.wrapperForImpl(element),
    document: this._document,
    cookieJar: this._document._cookieJar
  };

  return jsdomContext.run(context, () => {
    return globalFetch(url, { dispatcher: this._dispatcher });
  });
}
```

### User interceptor:

```js
const { jsdomContext } = require('jsdom');

const elementAwareInterceptor = dispatch => (opts, handler) => {
  const ctx = jsdomContext.getStore();

  if (ctx?.element?.localName === 'script') {
    console.log('Script loading:', opts.path);
  }

  return dispatch(opts, handler);
};

const dom = new JSDOM(``, {
  dispatcher: new Agent().compose(elementAwareInterceptor)
});
```

### Pros:
- Clean separation - dispatchers don't need jsdom-specific knowledge
- Standard Node.js pattern
- Context propagates through entire async chain

### Cons:
- Users must understand AsyncLocalStorage
- Extra import from jsdom
- Slight overhead (though minimal)

---

## Approach 2: Custom Dispatch Options (Fragile)

Pass element through dispatch options:

```js
// jsdom internal - adds element to fetch options
const response = await fetch(url, {
  dispatcher,
  // Non-standard property - undici might ignore or reject
  jsdomElement: element
});
```

### User interceptor:

```js
const myInterceptor = dispatch => (opts, handler) => {
  console.log('Element:', opts.jsdomElement);
  return dispatch(opts, handler);
};
```

### Pros:
- Simple, no extra APIs

### Cons:
- **Fragile**: Relies on undici not validating/stripping unknown options
- Could break in future undici versions
- Not a supported pattern

---

## Approach 3: Keep ResourceLoader, Simplify It

ResourceLoader becomes a thin wrapper for element context:

```js
class ResourceLoader {
  constructor({ dispatcher, userAgent } = {}) {
    this._dispatcher = dispatcher;
    this._userAgent = userAgent;
  }

  // Users override this - signature stays the same
  fetch(url, { element, cookieJar, referrer, signal }) {
    // Default implementation delegates to dispatcher
    return fetch(url, {
      dispatcher: this._dispatcher,
      headers: { 'User-Agent': this._userAgent },
      signal
    });
  }
}
```

### Pros:
- Backward compatible
- `element` is explicitly available
- No AsyncLocalStorage complexity

### Cons:
- Still have a jsdom-specific class to learn
- Less composable with standard undici patterns

---

## Approach 4: jsdom-Provided Interceptors

jsdom exports helper interceptors that users can compose:

```js
const { interceptors } = require('jsdom');
const { Agent, interceptors: undiciInterceptors } = require('undici');

const dispatcher = new Agent().compose(
  undiciInterceptors.retry({ maxRetries: 3 }),
  interceptors.cookies(cookieJar),
  interceptors.defaults({ userAgent: 'MyBot/1.0' }),
  interceptors.elementLogger()  // Uses AsyncLocalStorage internally
);

const dom = new JSDOM(``, { dispatcher });
```

### jsdom interceptor implementations:

```js
// interceptors/cookies.js
function cookies(cookieJar) {
  return dispatch => async (opts, handler) => {
    // Add cookies to request
    const cookieString = await cookieJar.getCookieString(opts.origin + opts.path);
    if (cookieString) {
      opts.headers = { ...opts.headers, cookie: cookieString };
    }

    // Wrap handler to capture Set-Cookie
    const wrappedHandler = {
      ...handler,
      onResponseStart(controller, statusCode, headers) {
        // Store cookies from response
        const setCookie = headers['set-cookie'];
        if (setCookie) {
          // Note: headers format varies - need to handle array
          for (const cookie of [].concat(setCookie)) {
            cookieJar.setCookie(cookie, opts.origin + opts.path);
          }
        }
        return handler.onResponseStart?.(controller, statusCode, headers);
      }
    };

    return dispatch(opts, wrappedHandler);
  };
}
```

```js
// interceptors/defaults.js
function defaults({ userAgent, acceptLanguage = 'en' } = {}) {
  return dispatch => (opts, handler) => {
    opts.headers = {
      'user-agent': userAgent,
      'accept-language': acceptLanguage,
      'accept': '*/*',
      'accept-encoding': 'gzip, deflate',
      ...opts.headers  // User headers override defaults
    };
    return dispatch(opts, handler);
  };
}
```

```js
// interceptors/element-logger.js
const { jsdomContext } = require('../jsdom-context');

function elementLogger() {
  return dispatch => (opts, handler) => {
    const ctx = jsdomContext.getStore();
    if (ctx?.element) {
      console.log(`[${ctx.element.localName}] ${opts.method || 'GET'} ${opts.origin}${opts.path}`);
    }
    return dispatch(opts, handler);
  };
}
```

### Pros:
- Highly composable with standard undici patterns
- Users can pick and choose which behaviors they want
- Clear separation of concerns

### Cons:
- More verbose setup for common cases
- Users need to understand interceptor composition
- Cookie handling across redirects is complex in interceptor form

---

## Comparison: User Code for Common Scenarios

### Scenario 1: Simple Proxy

**Current (ResourceLoader)**:
```js
const resourceLoader = new jsdom.ResourceLoader({
  dispatcher: new ProxyAgent("http://proxy:8080"),
});
const dom = new JSDOM(``, { resources: resourceLoader });
```

**Dispatcher-only**:
```js
const dom = new JSDOM(``, {
  dispatcher: new ProxyAgent("http://proxy:8080"),
});
```

**Winner**: Dispatcher-only (simpler)

---

### Scenario 2: Custom User-Agent

**Current (ResourceLoader)**:
```js
const resourceLoader = new jsdom.ResourceLoader({
  userAgent: "MyBot/1.0",
});
const dom = new JSDOM(``, { resources: resourceLoader });
```

**Dispatcher-only with jsdom interceptor**:
```js
const dom = new JSDOM(``, {
  dispatcher: new Agent().compose(
    jsdom.interceptors.defaults({ userAgent: "MyBot/1.0" })
  ),
});
```

**Winner**: ResourceLoader (more concise for simple case)

---

### Scenario 3: Mock Specific URLs

**Current (ResourceLoader)**:
```js
class MockLoader extends jsdom.ResourceLoader {
  fetch(url, options) {
    if (url === "https://example.com/script.js") {
      return Promise.resolve(new Response("window.x = 1;", {
        headers: { "Content-Type": "application/javascript" }
      }));
    }
    return super.fetch(url, options);
  }
}
```

**Dispatcher-only with interceptor** (complex - callback-based):
```js
const mockInterceptor = dispatch => (opts, handler) => {
  if (opts.origin === "https://example.com" && opts.path === "/script.js") {
    // Must call handler methods directly - no Response object
    handler.onRequestStart?.();
    handler.onResponseStart?.(null, 200, {
      'content-type': 'application/javascript'
    });
    handler.onResponseData?.(null, Buffer.from("window.x = 1;"));
    handler.onResponseEnd?.(null, {});
    return true;
  }
  return dispatch(opts, handler);
};
```

**Winner**: ResourceLoader (much simpler API)

---

### Scenario 4: Element-Based Routing

**Current (ResourceLoader)**:
```js
class RoutingLoader extends jsdom.ResourceLoader {
  fetch(url, { element, ...options }) {
    if (element?.localName === 'img') {
      return this._imageProxy.fetch(url, options);
    }
    return super.fetch(url, options);
  }
}
```

**Dispatcher-only with AsyncLocalStorage**:
```js
const routingInterceptor = dispatch => (opts, handler) => {
  const ctx = jsdom.jsdomContext.getStore();
  if (ctx?.element?.localName === 'img') {
    // Route to different origin? Change opts?
    // This is awkward - can't easily delegate to different dispatcher
  }
  return dispatch(opts, handler);
};
```

**Winner**: ResourceLoader (cleaner access to element)

---

### Scenario 5: Proxy + Retry Composition

**Current (ResourceLoader)**: Not easily possible

**Dispatcher-only**:
```js
const dom = new JSDOM(``, {
  dispatcher: new RetryAgent(new ProxyAgent("http://proxy:8080"), {
    maxRetries: 3
  }),
});
```

**Winner**: Dispatcher-only (composition is the strength)

---

## Handling data: and file: URLs

Undici dispatchers only handle HTTP(S). jsdom currently handles `data:` and `file:` URLs in ResourceLoader.

### Option A: jsdom wraps dispatcher internally

```js
// Internal to jsdom
class InternalFetcher {
  constructor(dispatcher) {
    this._dispatcher = dispatcher;
  }

  async fetch(url, options) {
    const parsed = new URL(url);

    switch (parsed.protocol) {
      case 'data:':
        return this._handleDataURL(url);
      case 'file:':
        return this._handleFileURL(url, options.signal);
      default:
        return fetch(url, { ...options, dispatcher: this._dispatcher });
    }
  }
}
```

### Option B: jsdom provides a wrapping dispatcher

```js
const { schemeDispatcher } = require('jsdom');

// Wraps user's dispatcher, handles data:/file: internally
const dispatcher = schemeDispatcher(new ProxyAgent("http://proxy:8080"));
```

---

## Cookie Jar Handling

The current ResourceLoader captures cookies at each redirect hop. This is tricky with interceptors because:

1. Undici's redirect interceptor doesn't expose intermediate responses
2. We'd need to handle redirects ourselves to capture cookies

### Option A: jsdom's cookie interceptor handles redirects

```js
function cookiesWithRedirects(cookieJar, maxRedirects = 20) {
  return dispatch => async (opts, handler) => {
    // Disable automatic redirects
    opts.maxRedirections = 0;

    // Handle redirects manually with cookie capture
    // ... complex implementation ...
  };
}
```

### Option B: Use a separate redirect interceptor that exposes hooks

Would require changes to undici or a custom implementation.

### Option C: Keep cookie handling in jsdom's internal layer

```js
// jsdom internally wraps fetch
async function jsdomFetch(url, { dispatcher, cookieJar, ...options }) {
  // Handle redirects manually with cookie capture
  // Similar to current ResourceLoader._fetchHTTP
}
```

---

## Recommendations

### Conservative Approach: Keep ResourceLoader

1. Keep `ResourceLoader` for backward compatibility
2. Document that users can use `dispatcher` option for simple proxy/retry composition
3. Subclassing remains the way to customize element-based behavior

### Progressive Approach: Dual API

1. Keep `ResourceLoader` as the primary API
2. Add `jsdom.interceptors.*` as composable building blocks
3. Add `jsdom.jsdomContext` for AsyncLocalStorage-based element access
4. Allow passing raw `dispatcher` for simple cases

### Aggressive Approach: Full Dispatcher Migration

1. Remove `ResourceLoader` class
2. Require users to use interceptors for customization
3. Provide `jsdom.interceptors.defaults()`, `jsdom.interceptors.cookies()`, etc.
4. Use AsyncLocalStorage for element context

---

## Key Questions

1. **How important is element-based routing?** If users rarely need it, dispatcher-only could work.

2. **Is callback-based mocking acceptable?** The interceptor pattern is more complex for response mocking.

3. **Should cookie handling be automatic?** Users might want to opt out or use different cookie stores.

4. **How do we handle composition?** E.g., user wants both their custom interceptor AND jsdom's cookie handling.

---

## References

- [Undici Dispatcher docs](https://github.com/nodejs/undici/blob/main/docs/docs/api/Dispatcher.md)
- [Undici compose() and interceptors](https://blog.platformatic.dev/undici-v7-is-here)
- [Undici MockAgent](https://github.com/nodejs/undici/blob/main/docs/docs/api/MockAgent.md)
- [AsyncLocalStorage](https://nodejs.org/api/async_context.html)
- [Mocking with Undici](https://stateful.com/blog/undici-mocking)
