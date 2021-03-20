// META: title=Access-Control-Allow-Headers supports *
"use strict";

async_test(t => {
  const xhr = new XMLHttpRequest();

  xhr.open("GET", corsURL("resources/access-control-preflight-request-allow-headers-returns-star.py"));

  xhr.setRequestHeader("X-Test", "foobar");

  xhr.onerror = t.unreached_func("Error occurred.");

  xhr.onload = t.step_func_done(() => {
    assert_equals(xhr.status, 200);
    assert_equals(xhr.responseText, "PASS");
  });

  xhr.send();
});

function corsURL(path) {
  const url = new URL(path, location.href);
  url.hostname = "www1." + url.hostname;
  return url.href;
}
