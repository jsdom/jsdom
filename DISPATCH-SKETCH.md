# Sketch: Using dispatch() with opaque for Element Context

## The Idea

Instead of using `fetch()`, jsdom calls `dispatcher.dispatch()` directly, passing element context via `opaque`:

```js
dispatcher.dispatch({
  origin: 'https://example.com',
  path: '/script.js',
  method: 'GET',
  headers: { ... },
  opaque: { element, cookieJar, document }
}, handler);
```

Interceptors receive `opts.opaque` and can access the element:

```js
const myInterceptor = dispatch => (opts, handler) => {
  console.log('Element:', opts.opaque?.element?.localName);
  return dispatch(opts, handler);
};
```

## Internal Implementation

### Core fetch function

```js
// lib/jsdom/browser/resources/fetch.js

/**
 * Fetch a URL using the dispatcher, with jsdom context in opaque.
 * Returns a Promise<{ response, body }> similar to fetch() but using dispatch().
 */
function jsdomFetch(url, { dispatcher, method = 'GET', headers, body, signal, opaque }) {
  return new Promise((resolve, reject) => {
    const parsedURL = new URL(url);

    if (signal?.aborted) {
      reject(signal.reason ?? new DOMException('Aborted', 'AbortError'));
      return;
    }

    const chunks = [];
    let responseHeaders;
    let statusCode;
    let statusText;

    const handler = {
      onRequestStart(controller) {
        // Could attach abort signal here
      },

      onResponseStart(controller, status, rawHeaders, statusMessage) {
        statusCode = status;
        statusText = statusMessage || '';
        responseHeaders = parseHeaders(rawHeaders);
      },

      onResponseData(controller, chunk) {
        chunks.push(chunk);
      },

      onResponseEnd(controller, trailers) {
        const body = Buffer.concat(chunks);
        resolve({
          status: statusCode,
          statusText,
          headers: responseHeaders,
          body,
          url  // Final URL after redirects
        });
      },

      onResponseError(controller, error) {
        reject(error);
      }
    };

    dispatcher.dispatch({
      origin: parsedURL.origin,
      path: parsedURL.pathname + parsedURL.search,
      method,
      headers: formatHeaders(headers),
      body,
      opaque
    }, handler);
  });
}

// Note: In modern undici, headers in handlers are Record<string, string | string[]>
// with lowercase keys - no parsing needed

function formatHeaders(headers) {
  if (!headers) return [];
  if (headers instanceof Headers) {
    const result = [];
    headers.forEach((value, name) => {
      result.push(name, value);
    });
    return result;
  }
  // Object form
  const result = [];
  for (const [name, value] of Object.entries(headers)) {
    result.push(name, value);
  }
  return result;
}

module.exports = { jsdomFetch };
```

### ResourceLoader using dispatch()

```js
// lib/jsdom/browser/resources/resource-loader.js

const { jsdomFetch } = require('./fetch');

class ResourceLoader {
  constructor({ dispatcher, userAgent = DEFAULT_USER_AGENT } = {}) {
    this._dispatcher = dispatcher ?? new Agent();
    this._userAgent = userAgent;
  }

  async fetch(url, { method, headers, body, referrer, signal, cookieJar, element } = {}) {
    const urlRecord = parseURL(url);
    if (!urlRecord) {
      throw new Error(`Invalid URL: ${url}`);
    }

    switch (urlRecord.scheme) {
      case 'data':
        return this._handleDataURL(urlRecord);
      case 'file':
        return this._handleFileURL(url, signal);
      case 'http':
      case 'https':
        return this._fetchHTTP(url, { method, headers, body, referrer, signal, cookieJar, element });
      default:
        throw new TypeError(`Unsupported URL scheme: ${urlRecord.scheme}`);
    }
  }

  async _fetchHTTP(url, { method, headers, body, referrer, signal, cookieJar, element }) {
    // Build headers
    const requestHeaders = new Headers(headers);
    if (!requestHeaders.has('User-Agent')) {
      requestHeaders.set('User-Agent', this._userAgent);
    }
    if (!requestHeaders.has('Accept')) {
      requestHeaders.set('Accept', '*/*');
    }
    if (referrer && !requestHeaders.has('Referer')) {
      requestHeaders.set('Referer', referrer);
    }

    // The opaque context - available to all interceptors
    const opaque = { element, cookieJar, referrer };

    const result = await jsdomFetch(url, {
      dispatcher: this._dispatcher,
      method,
      headers: requestHeaders,
      body,
      signal,
      opaque
    });

    // Convert to Response for compatibility
    return new Response(result.body, {
      status: result.status,
      statusText: result.statusText,
      headers: result.headers
    });
  }
}
```

## User-Facing API

### Simple case - just a dispatcher

```js
const { JSDOM } = require('jsdom');
const { ProxyAgent } = require('undici');

const dom = new JSDOM(`...`, {
  dispatcher: new ProxyAgent('http://proxy:8080')
});
```

### With custom interceptor accessing element

```js
const { JSDOM } = require('jsdom');
const { Agent } = require('undici');

const logByElement = dispatch => (opts, handler) => {
  const { element } = opts.opaque || {};
  console.log(`[${element?.localName || 'unknown'}] ${opts.method} ${opts.origin}${opts.path}`);
  return dispatch(opts, handler);
};

const dom = new JSDOM(`...`, {
  dispatcher: new Agent().compose(logByElement)
});
```

### Blocking certain element types

```js
const blockImages = dispatch => (opts, handler) => {
  const { element } = opts.opaque || {};
  if (element?.localName === 'img') {
    // Return 1x1 transparent GIF
    handler.onResponseStart?.(null, 200, ['content-type', 'image/gif']);
    handler.onResponseData?.(null, Buffer.from('R0lGODlhAQABAIAAAAAAAP///yH5BAEAAAAALAAAAAABAAEAAAIBRAA7', 'base64'));
    handler.onResponseEnd?.(null, []);
    return true;
  }
  return dispatch(opts, handler);
};
```

### Cookie handling interceptor

```js
const cookies = dispatch => async (opts, handler) => {
  const { cookieJar } = opts.opaque || {};
  const url = opts.origin + opts.path;

  // Add cookies to request
  if (cookieJar) {
    const cookieString = await cookieJar.getCookieString(url);
    if (cookieString) {
      // Inject cookie header
      opts.headers = opts.headers || [];
      opts.headers.push('cookie', cookieString);
    }
  }

  // Wrap handler to capture Set-Cookie
  const wrappedHandler = {
    ...handler,
    onResponseStart(controller, status, rawHeaders, statusMessage) {
      if (cookieJar) {
        // Extract Set-Cookie headers
        for (let i = 0; i < rawHeaders.length; i += 2) {
          if (rawHeaders[i].toString().toLowerCase() === 'set-cookie') {
            cookieJar.setCookie(rawHeaders[i + 1].toString(), url, { ignoreError: true });
          }
        }
      }
      return handler.onResponseStart?.(controller, status, rawHeaders, statusMessage);
    }
  };

  return dispatch(opts, wrappedHandler);
};
```

## What jsdom Would Export

```js
// lib/api.js
module.exports = {
  JSDOM,
  VirtualConsole,
  CookieJar,

  // Helper interceptors
  interceptors: {
    cookies,      // Cookie jar handling
    defaults,     // Default headers (User-Agent, etc.)
    logger,       // Log requests with element context
  }
};
```

## User Code: Complete Example

```js
const { JSDOM, interceptors, CookieJar } = require('jsdom');
const { Agent, RetryAgent, ProxyAgent, interceptors: undici } = require('undici');

const cookieJar = new CookieJar();

// Compose interceptors
const dispatcher = new RetryAgent(
  new ProxyAgent('http://proxy:8080')
).compose(
  undici.redirect({ maxRedirections: 10 }),
  interceptors.cookies,           // jsdom's cookie handling (reads from opaque.cookieJar)
  interceptors.defaults({ userAgent: 'MyBot/1.0' }),
  interceptors.logger             // logs with element info from opaque.element
);

const dom = new JSDOM(`
  <script src="app.js"></script>
  <img src="photo.jpg">
`, {
  url: 'https://example.com/',
  dispatcher,
  cookieJar,  // Passed to opaque
  runScripts: 'dangerously'
});
```

## Redirects and Cookies

One complexity: to capture cookies at each redirect hop, we need to either:

1. **Disable automatic redirects** and handle them in an interceptor
2. **Use undici's redirect interceptor** but hook into it somehow
3. **Accept that cookies are only captured on final response** (simpler but less correct)

For option 1, jsdom's cookie interceptor could handle redirects:

```js
const cookiesWithRedirects = (maxRedirects = 20) => dispatch => async (opts, handler) => {
  const { cookieJar } = opts.opaque || {};
  let redirectCount = 0;
  let currentOpts = { ...opts };

  const doRequest = () => {
    // Add cookies
    const url = currentOpts.origin + currentOpts.path;
    // ... add cookie header ...

    const redirectHandler = {
      ...handler,
      onResponseStart(controller, status, rawHeaders, statusMessage) {
        // Capture cookies
        // ...

        // Check for redirect
        if (status >= 300 && status < 400) {
          const location = getHeader(rawHeaders, 'location');
          if (location && redirectCount < maxRedirects) {
            redirectCount++;
            // Update currentOpts for new location
            // Call doRequest() again
            return;
          }
        }

        return handler.onResponseStart?.(controller, status, rawHeaders, statusMessage);
      }
    };

    return dispatch(currentOpts, redirectHandler);
  };

  return doRequest();
};
```

## Mocking Helper

The callback-based handler is awkward for mocking. jsdom could provide a helper:

```js
const { interceptors } = require('jsdom');

// User-friendly: return Response or null to pass through
const mockInterceptor = interceptors.mock((url, { element, method }) => {
  if (url === 'https://example.com/analytics.js') {
    return new Response('/* disabled */', {
      headers: { 'content-type': 'application/javascript' }
    });
  }
  return null; // pass through to real network
});

const dom = new JSDOM(`...`, {
  dispatcher: new Agent().compose(mockInterceptor)
});
```

### Implementation of mock() helper

```js
function mock(handler) {
  return dispatch => async (opts, dispatchHandler) => {
    const url = opts.origin + opts.path;
    const { element } = opts.opaque || {};

    const mockResponse = await handler(url, {
      method: opts.method || 'GET',
      headers: opts.headers,
      element
    });

    if (mockResponse instanceof Response) {
      // Convert Response to dispatch handler calls
      const headers = {};
      mockResponse.headers.forEach((v, k) => { headers[k] = v; });

      dispatchHandler.onResponseStart?.(null, mockResponse.status, headers, mockResponse.statusText);

      if (mockResponse.body) {
        const reader = mockResponse.body.getReader();
        while (true) {
          const { done, value } = await reader.read();
          if (done) break;
          dispatchHandler.onResponseData?.(null, value);
        }
      }

      dispatchHandler.onResponseEnd?.(null, {});
      return true;
    }

    return dispatch(opts, dispatchHandler);
  };
}
```

## Summary: What Users Would Learn

Instead of ResourceLoader, users learn:

1. **Pass a `dispatcher` to JSDOM** - any undici Dispatcher works
2. **Compose interceptors** with `dispatcher.compose(a, b, c)`
3. **Access jsdom context** via `opts.opaque.element`, `opts.opaque.cookieJar`
4. **Use jsdom helpers** like `interceptors.mock()`, `interceptors.cookies`

The conceptual model:
- Dispatchers handle the network
- Interceptors customize behavior
- `opaque` carries jsdom context through the chain

## Questions

1. **Is dispatch() stable enough?** The handler interface changed between undici versions.

2. **Should jsdom provide a default Agent?** Or require users to always provide one?

3. **How to handle the cookieJar option?** Should it be a top-level JSDOM option that gets injected into opaque?

4. **What about ResourceLoader subclasses?** Users who subclassed ResourceLoader would need migration path.

5. **Should jsdom re-export common undici classes?** Like `Agent`, `ProxyAgent` for convenience?

## Migration from ResourceLoader

### Before (ResourceLoader)

```js
class MyLoader extends jsdom.ResourceLoader {
  fetch(url, { element, ...options }) {
    if (url.includes('analytics')) {
      return Promise.resolve(new Response(''));
    }
    console.log(`${element?.localName} loading ${url}`);
    return super.fetch(url, options);
  }
}

const dom = new JSDOM(`...`, {
  resources: new MyLoader({ userAgent: 'Bot/1.0' })
});
```

### After (Dispatcher + Interceptors)

```js
const { Agent } = require('undici');
const { interceptors } = require('jsdom');

const myInterceptor = dispatch => (opts, handler) => {
  const url = opts.origin + opts.path;
  const { element } = opts.opaque || {};

  // Mock analytics
  if (url.includes('analytics')) {
    handler.onResponseStart?.(null, 200, { 'content-type': 'text/plain' });
    handler.onResponseEnd?.(null, {});
    return true;
  }

  // Log
  console.log(`${element?.localName} loading ${url}`);

  return dispatch(opts, handler);
};

const dom = new JSDOM(`...`, {
  dispatcher: new Agent().compose(
    interceptors.defaults({ userAgent: 'Bot/1.0' }),
    myInterceptor
  )
});
```

### Or using the mock() helper

```js
const dom = new JSDOM(`...`, {
  dispatcher: new Agent().compose(
    interceptors.defaults({ userAgent: 'Bot/1.0' }),
    interceptors.mock((url, { element }) => {
      console.log(`${element?.localName} loading ${url}`);
      if (url.includes('analytics')) {
        return new Response('');
      }
      return null;
    })
  )
});
```

## What's Essential vs Nice-to-Have

### Essential (must ship)

- Use `dispatch()` internally with `opaque` for context
- Accept `dispatcher` option on JSDOM
- Pass `{ element, cookieJar, document }` in `opaque`

### Nice-to-Have (can add later)

- `interceptors.mock()` - makes mocking easier
- `interceptors.defaults()` - sets User-Agent etc.
- `interceptors.cookies` - cookie jar handling
- `interceptors.logger()` - debugging helper
- Re-exporting undici classes

### Probably Not Needed

- `createDispatcher()` convenience function - users can compose themselves
- Automatic redirect+cookie handling - let users choose their interceptor stack
