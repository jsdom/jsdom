// META: title=XMLHttpRequest: abort() still works when error thrown internally

      var test = async_test();

      test.step(function() {
        var client = new XMLHttpRequest();

        client.open("GET", "invalid-protocol://example.com", true);
        client.onabort = test.step_func(function() {
          test.done();
        });
        
        client.send(null);
        client.abort();
      });
