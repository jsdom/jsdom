# Code Sketches: Dispatcher-Based Approaches

## Sketch A: Minimal Change - Just Accept `dispatcher` Option

The simplest change: allow passing a dispatcher directly to JSDOM, with ResourceLoader handling the rest internally.

```js
// User code - simple proxy
const dom = new JSDOM(``, {
  dispatcher: new ProxyAgent("http://proxy:8080")
});

// User code - proxy with retry
const dom = new JSDOM(``, {
  dispatcher: new RetryAgent(new ProxyAgent("http://proxy:8080"))
});

// User code - still works
const dom = new JSDOM(``, {
  resources: new jsdom.ResourceLoader({ userAgent: "Custom" })
});

// User code - combine both
const dom = new JSDOM(``, {
  resources: new jsdom.ResourceLoader({ userAgent: "Custom" }),
  dispatcher: new ProxyAgent("http://proxy:8080")
});
```

### Implementation

```js
// lib/api.js
function normalizeOptions(options) {
  // ...existing code...

  if (options.dispatcher && !options.resources) {
    // Create a default ResourceLoader using the provided dispatcher
    options.resources = new ResourceLoader({ dispatcher: options.dispatcher });
  } else if (options.dispatcher && options.resources) {
    // Inject dispatcher into existing ResourceLoader if it doesn't have one
    if (!options.resources._dispatcher) {
      options.resources._dispatcher = options.dispatcher;
    }
  }

  // ...
}
```

### Pros
- Backward compatible
- Very simple change
- Users get composition benefits for simple cases

### Cons
- Doesn't address element context for interceptors
- Two parallel config paths could be confusing

---

## Sketch B: AsyncLocalStorage Context Provider

jsdom exports a context provider that interceptors can use.

### jsdom internal implementation

```js
// lib/jsdom/browser/resources/fetch-context.js
const { AsyncLocalStorage } = require('async_hooks');

const fetchContext = new AsyncLocalStorage();

/**
 * @typedef {Object} FetchContext
 * @property {Element|null} element - The DOM element that initiated the fetch
 * @property {Document} document - The document
 * @property {CookieJar} cookieJar - The tough-cookie jar
 * @property {string} referrer - The referrer URL
 */

/**
 * Get the current fetch context (for use in interceptors)
 * @returns {FetchContext|undefined}
 */
function getContext() {
  return fetchContext.getStore();
}

/**
 * Run a function with fetch context (internal use)
 * @param {FetchContext} context
 * @param {Function} fn
 */
function runWithContext(context, fn) {
  return fetchContext.run(context, fn);
}

module.exports = { getContext, runWithContext };
```

### Updated PerDocumentResourceLoader

```js
// lib/jsdom/browser/resources/per-document-resource-loader.js
const { runWithContext } = require('./fetch-context');

class PerDocumentResourceLoader {
  fetch(url, { element, onLoad, onError }) {
    const context = {
      element: idlUtils.wrapperForImpl(element),
      document: this._document,
      cookieJar: this._document._cookieJar,
      referrer: this._document.URL
    };

    // Wrap the fetch in context
    return runWithContext(context, () => {
      return this._resourceLoader.fetch(url, {
        cookieJar: context.cookieJar,
        referrer: context.referrer,
        signal: this._abortController.signal,
        element: context.element  // Still pass for ResourceLoader subclasses
      });
    });
  }
}
```

### User interceptor example

```js
const { getContext } = require('jsdom');
const { Agent } = require('undici');

// Log all script loads
const scriptLogger = dispatch => (opts, handler) => {
  const ctx = getContext();
  if (ctx?.element?.localName === 'script') {
    console.log(`Loading script: ${opts.origin}${opts.path}`);
    console.log(`  from document: ${ctx.document.URL}`);
  }
  return dispatch(opts, handler);
};

// Block images from certain domains
const imageBlocker = (blockedDomains) => dispatch => (opts, handler) => {
  const ctx = getContext();
  if (ctx?.element?.localName === 'img') {
    const host = new URL(opts.origin).hostname;
    if (blockedDomains.some(d => host.endsWith(d))) {
      // Return empty response
      handler.onResponseStart?.(null, 200, { 'content-type': 'image/gif' });
      handler.onResponseData?.(null, Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
      handler.onResponseEnd?.(null, {});
      return true;
    }
  }
  return dispatch(opts, handler);
};

const dom = new JSDOM(``, {
  dispatcher: new Agent().compose(
    scriptLogger,
    imageBlocker(['ads.example.com', 'tracker.evil.com'])
  )
});
```

---

## Sketch C: jsdom Interceptor Helpers

jsdom provides pre-built interceptors for common use cases.

### Interceptor implementations

```js
// lib/jsdom/browser/resources/interceptors/index.js

const { getContext } = require('../fetch-context');

/**
 * Add default headers to requests
 */
function defaults({ userAgent, acceptLanguage = 'en', accept = '*/*' } = {}) {
  return dispatch => (opts, handler) => {
    const headers = { ...opts.headers };

    if (userAgent && !headers['user-agent']) {
      headers['user-agent'] = userAgent;
    }
    if (!headers['accept-language']) {
      headers['accept-language'] = acceptLanguage;
    }
    if (!headers['accept']) {
      headers['accept'] = accept;
    }
    if (!headers['accept-encoding']) {
      headers['accept-encoding'] = 'gzip, deflate';
    }

    // Add referrer from context if available
    const ctx = getContext();
    if (ctx?.referrer && !headers['referer']) {
      headers['referer'] = ctx.referrer;
    }

    return dispatch({ ...opts, headers }, handler);
  };
}

/**
 * Handle cookies using tough-cookie
 * Note: This simple version doesn't handle cookies across redirects
 */
function cookies(cookieJar) {
  return dispatch => async (opts, handler) => {
    const url = opts.origin + opts.path;

    // Get cookies for this request
    const cookieString = await cookieJar.getCookieString(url);
    const headers = { ...opts.headers };
    if (cookieString) {
      headers['cookie'] = cookieString;
    }

    // Wrap handler to capture Set-Cookie
    const wrappedHandler = createCookieCapturingHandler(handler, cookieJar, url);

    return dispatch({ ...opts, headers }, wrappedHandler);
  };
}

function createCookieCapturingHandler(handler, cookieJar, url) {
  return {
    onRequestStart: handler.onRequestStart?.bind(handler),
    onRequestUpgrade: handler.onRequestUpgrade?.bind(handler),
    onResponseStart(controller, statusCode, headers, statusMessage) {
      // Capture Set-Cookie headers
      const setCookie = headers['set-cookie'];
      if (setCookie) {
        const cookies = Array.isArray(setCookie) ? setCookie : [setCookie];
        for (const cookie of cookies) {
          cookieJar.setCookie(cookie, url, { ignoreError: true }).catch(() => {});
        }
      }
      return handler.onResponseStart?.(controller, statusCode, headers, statusMessage);
    },
    onResponseData: handler.onResponseData?.bind(handler),
    onResponseEnd: handler.onResponseEnd?.bind(handler),
    onResponseError: handler.onResponseError?.bind(handler),
  };
}

/**
 * Log requests with element context
 */
function logger(logFn = console.log) {
  return dispatch => (opts, handler) => {
    const ctx = getContext();
    const element = ctx?.element?.localName || 'unknown';
    logFn(`[${element}] ${opts.method || 'GET'} ${opts.origin}${opts.path}`);
    return dispatch(opts, handler);
  };
}

/**
 * Filter requests by element type
 */
function elementFilter(predicate, alternateDispatch) {
  return dispatch => (opts, handler) => {
    const ctx = getContext();
    if (ctx?.element && !predicate(ctx.element)) {
      if (alternateDispatch) {
        return alternateDispatch(opts, handler);
      }
      // Block the request
      handler.onResponseError?.(null, new Error('Request blocked by element filter'));
      return true;
    }
    return dispatch(opts, handler);
  };
}

module.exports = { defaults, cookies, logger, elementFilter };
```

### User code with helpers

```js
const { JSDOM, interceptors } = require('jsdom');
const { Agent, interceptors: undiciInterceptors } = require('undici');
const { CookieJar } = require('tough-cookie');

const cookieJar = new CookieJar();

const dispatcher = new Agent().compose(
  // Undici's retry for resilience
  undiciInterceptors.retry({ maxRetries: 3 }),

  // jsdom's cookie handling
  interceptors.cookies(cookieJar),

  // jsdom's default headers
  interceptors.defaults({ userAgent: 'MyBot/1.0' }),

  // jsdom's logging
  interceptors.logger(),

  // Only allow scripts from same origin
  interceptors.elementFilter(el => {
    if (el.localName !== 'script') return true;
    return el.src.startsWith(el.ownerDocument.location.origin);
  })
);

const dom = new JSDOM(`<script src="..."></script>`, {
  url: 'https://example.com/',
  dispatcher,
  runScripts: 'dangerously'
});
```

---

## Sketch D: Response Mocking Helper

Since interceptor-based mocking is complex, provide a helper.

```js
// lib/jsdom/browser/resources/interceptors/mock.js

/**
 * Create a mocking interceptor that can return custom responses
 *
 * @param {Function} handler - (url, context) => Response | null
 *   Return a Response to mock, or null/undefined to pass through
 */
function mock(handler) {
  return dispatch => async (opts, dispatchHandler) => {
    const { getContext } = require('../fetch-context');
    const ctx = getContext();
    const url = opts.origin + opts.path;

    const mockResponse = await handler(url, {
      method: opts.method || 'GET',
      headers: opts.headers,
      element: ctx?.element,
      document: ctx?.document
    });

    if (mockResponse instanceof Response) {
      return sendMockResponse(mockResponse, dispatchHandler);
    }

    return dispatch(opts, dispatchHandler);
  };
}

async function sendMockResponse(response, handler) {
  // Convert Response to dispatch handler callbacks
  const headers = {};
  response.headers.forEach((value, key) => {
    headers[key.toLowerCase()] = value;
  });

  handler.onRequestStart?.();
  handler.onResponseStart?.(null, response.status, headers, response.statusText);

  if (response.body) {
    const reader = response.body.getReader();
    while (true) {
      const { done, value } = await reader.read();
      if (done) break;
      handler.onResponseData?.(null, value);
    }
  }

  handler.onResponseEnd?.(null, {});
  return true;
}

module.exports = { mock };
```

### User code for mocking

```js
const { JSDOM, interceptors } = require('jsdom');
const { Agent } = require('undici');

const dispatcher = new Agent().compose(
  interceptors.mock((url, { element }) => {
    // Mock a specific script
    if (url === 'https://example.com/analytics.js') {
      return new Response('/* analytics disabled */', {
        headers: { 'Content-Type': 'application/javascript' }
      });
    }

    // Mock all images with a placeholder
    if (element?.localName === 'img') {
      return new Response(Buffer.from('R0lGODlhAQABAIAAAP///wAAACH5BAEAAAAALAAAAAABAAEAAAICRAEAOw==', 'base64'), {
        headers: { 'Content-Type': 'image/gif' }
      });
    }

    // Pass through to real network
    return null;
  })
);

const dom = new JSDOM(`...`, { dispatcher });
```

---

## Sketch E: Complete Example - Full Dispatcher Approach

What it looks like if we go all-in on dispatchers.

### jsdom changes

```js
// lib/api.js exports
module.exports = {
  JSDOM,
  ResourceLoader,  // Keep for backward compat
  VirtualConsole,
  CookieJar,

  // New exports
  interceptors: require('./jsdom/browser/resources/interceptors'),
  getContext: require('./jsdom/browser/resources/fetch-context').getContext,

  // Helper to create a fully-configured dispatcher
  createDispatcher({ userAgent, cookieJar, proxy, retry } = {}) {
    const { Agent, ProxyAgent, RetryAgent, interceptors: undici } = require('undici');

    let dispatcher = proxy ? new ProxyAgent(proxy) : new Agent();

    if (retry) {
      dispatcher = new RetryAgent(dispatcher, retry);
    }

    const jsdomInterceptors = require('./jsdom/browser/resources/interceptors');
    const composedInterceptors = [];

    if (cookieJar) {
      composedInterceptors.push(jsdomInterceptors.cookies(cookieJar));
    }

    if (userAgent) {
      composedInterceptors.push(jsdomInterceptors.defaults({ userAgent }));
    }

    if (composedInterceptors.length > 0) {
      dispatcher = dispatcher.compose(...composedInterceptors);
    }

    return dispatcher;
  }
};
```

### User code - simple case

```js
const { JSDOM, createDispatcher, CookieJar } = require('jsdom');

// Simple - similar complexity to current ResourceLoader
const dom = new JSDOM(`...`, {
  dispatcher: createDispatcher({
    userAgent: 'MyBot/1.0',
    cookieJar: new CookieJar(),
    proxy: 'http://proxy:8080',
    retry: { maxRetries: 3 }
  })
});
```

### User code - advanced case

```js
const { JSDOM, interceptors, getContext, CookieJar } = require('jsdom');
const { Agent, interceptors: undici } = require('undici');

const cookieJar = new CookieJar();

// Custom interceptor using jsdom context
const securityInterceptor = dispatch => (opts, handler) => {
  const ctx = getContext();

  // Block cross-origin script loads
  if (ctx?.element?.localName === 'script') {
    const scriptOrigin = new URL(opts.origin).origin;
    const docOrigin = new URL(ctx.document.URL).origin;
    if (scriptOrigin !== docOrigin) {
      console.warn(`Blocked cross-origin script: ${opts.origin}${opts.path}`);
      handler.onResponseError?.(null, new Error('Cross-origin script blocked'));
      return true;
    }
  }

  return dispatch(opts, handler);
};

const dispatcher = new Agent().compose(
  undici.retry({ maxRetries: 2 }),
  interceptors.cookies(cookieJar),
  interceptors.defaults({ userAgent: 'SecureBot/1.0' }),
  securityInterceptor,
  interceptors.logger()
);

const dom = new JSDOM(`...`, {
  url: 'https://example.com/',
  dispatcher,
  runScripts: 'dangerously'
});
```

---

## Comparison Summary

| Approach | Element Access | Mocking | Composition | Backward Compat | Complexity |
|----------|----------------|---------|-------------|-----------------|------------|
| Current ResourceLoader | Easy (param) | Easy (Promise<Response>) | Hard | N/A | Low |
| A: Just add dispatcher option | N/A (use RL) | N/A | Easy | Yes | Very Low |
| B: AsyncLocalStorage | Medium (getContext) | Hard (callbacks) | Easy | Yes | Medium |
| C: jsdom interceptors | Medium (getContext) | Hard | Easy | Yes | Medium |
| D: Mock helper | Medium | Easy (Response) | Easy | Yes | Medium |
| E: Full dispatcher | Medium | Medium (with helper) | Easy | Partial | High |

---

## Recommended Path

1. **Phase 1**: Implement Sketch A (accept `dispatcher` option directly)
   - Very low risk, immediate benefit for proxy/retry users
   - No breaking changes

2. **Phase 2**: Add AsyncLocalStorage context (Sketch B)
   - Export `getContext()` for advanced users
   - Keep ResourceLoader working as before

3. **Phase 3**: Add helper interceptors (Sketch C + D)
   - `interceptors.cookies()`, `interceptors.defaults()`, `interceptors.mock()`
   - Document as advanced API

4. **Phase 4**: Consider `createDispatcher()` helper (Sketch E)
   - Only if there's demand
   - Would make simple cases easier without ResourceLoader

This incremental approach:
- Never breaks existing users
- Adds value at each phase
- Lets us learn what users actually need
