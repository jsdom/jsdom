"use strict";

/* globals describe, it */

const ResourceQueue = require("../../../lib/jsdom/browser/resource-queue");
const expect = require("chai").expect;

describe("ResourceQueue", () => {
  it("Resume empty queue", () => {
    const logs = [];
    const queue = new ResourceQueue();

    logs.push("before");
    queue.resume(() => {
      logs.push("end");
    });
    logs.push("after");

    expect(logs).to.deep.equal(["before", "end", "after"]);
  });
  it("Queue pushed items and resume", () => {
    const logs = [];
    const queue = new ResourceQueue();

    const item0 = queue.push(() => {
      logs.push("pushed-0");
    });
    expect(logs).to.deep.equal([]);
    item0();
    expect(logs).to.deep.equal(["pushed-0"]);

    const item1 = queue.push(() => {
      logs.push("pushed-1");
    });
    const item2 = queue.push(() => {
      logs.push("pushed-2");
    });
    const item3 = queue.push(() => {
      logs.push("pushed-3");
    });
    item2();
    expect(logs).to.deep.equal(["pushed-0"]);
    queue.resume(() => {
      logs.push("end");
    });
    expect(logs).to.deep.equal(["pushed-0"]);
    item1();
    expect(logs).to.deep.equal(["pushed-0", "pushed-1", "pushed-2"]);
    item3();
    expect(logs).to.deep.equal([
      "pushed-0", "pushed-1", "pushed-2", "pushed-3", "end"
    ]);
  });
  it("Queue async items and resume", () => {
    const logs = [];
    const queue = new ResourceQueue();

    const item0 = queue.async(() => {
      logs.push("asynced-0");
    });
    expect(logs).to.deep.equal([]);
    item0();
    expect(logs).to.deep.equal(["asynced-0"]);

    const item1 = queue.async(() => {
      logs.push("asynced-1");
    });
    const item2 = queue.async(() => {
      logs.push("asynced-2");
    });
    const item3 = queue.async(() => {
      logs.push("asynced-3");
    });

    item2();
    expect(logs).to.deep.equal(["asynced-0", "asynced-2"]);

    queue.resume(() => {
      logs.push("end");
    });
    expect(logs).to.deep.equal(["asynced-0", "asynced-2"]);

    item1();
    expect(logs).to.deep.equal(["asynced-0", "asynced-2", "asynced-1"]);

    item3();
    expect(logs).to.deep.equal([
      "asynced-0", "asynced-2", "asynced-1", "asynced-3", "end"
    ]);
  });
  it("Queue deferred items and resume", () => {
    const logs = [];
    const queue = new ResourceQueue();

    const item0 = queue.defer(() => {
      logs.push("deferred-0");
    });
    expect(logs).to.deep.equal([]);
    item0();

    const item1 = queue.defer(() => {
      logs.push("deferred-1");
    });
    const item2 = queue.defer(() => {
      logs.push("deferred-2");
    });
    const item3 = queue.defer(() => {
      logs.push("deferred-3");
    });
    expect(logs).to.deep.equal([]);

    item2();
    expect(logs).to.deep.equal([]);
    queue.resume(() => {
      logs.push("end");
    });

    item1();
    expect(logs).to.deep.equal(["deferred-0", "deferred-2", "deferred-1"]);

    item3();
    expect(logs).to.deep.equal([
      "deferred-0", "deferred-2", "deferred-1", "deferred-3", "end"
    ]);
  });
  it("Queue mixed items", () => {
    const logs = [];
    const queue = new ResourceQueue();

    const pushed0 = queue.push(() => {
      logs.push("pushed-0");
    });
    const deferred0 = queue.defer(() => {
      logs.push("deferred-0");
    });
    const pushed1 = queue.push(() => {
      logs.push("pushed-1");
    });
    const async0 = queue.async(() => {
      logs.push("async-0");
    });
    const deferred1 = queue.defer(() => {
      logs.push("deferred-1");
    });
    const pushed2 = queue.push(() => {
      logs.push("pushed-2");
    });
    const deferred2 = queue.defer(() => {
      logs.push("deferred-2");
    });
    const pushed3 = queue.push(() => {
      logs.push("pushed-3");
    });
    const async1 = queue.async(() => {
      logs.push("async-1");
    });
    const pushed4 = queue.push(() => {
      logs.push("pushed-4");
    });

    pushed0();
    deferred0();
    async1();
    pushed1();
    pushed4();
    pushed3();
    pushed2();
    deferred2();
    queue.resume(() => {
      logs.push("end");
    });
    async0();
    deferred1();

    expect(logs).to.deep.equal([
      "pushed-0",
      "async-1",
      "pushed-1",
      "pushed-2",
      "pushed-3",
      "pushed-4",
      "deferred-0",
      "deferred-2",
      "async-0",
      "deferred-1",
      "end"
    ]);
  });
  it("Queue pushed and soon items", () => {
    const logs = [];
    const queue = new ResourceQueue();

    const pushed0 = queue.push(() => {
      logs.push("pushed-0");
    });
    const soon0 = queue.soon(() => {
      logs.push("soon-0");
    });

    pushed0();
    expect(logs).to.deep.equal([]);

    soon0();
    expect(logs).to.deep.equal(["soon-0", "pushed-0"]);
  });
  it("Nest queued items (e.g. innerHTML in <script>)", () => {
    const logs = [];
    const queue = new ResourceQueue();

    const pushed0 = queue.push(() => {
      logs.push("pushed0");
    });
    const pushed1 = queue.push(() => {
      logs.push("pushed1");
      const unnest0 = queue.nest();
      const pushed2 = queue.push(() => {
        logs.push("pushed2");
        const unnest1 = queue.nest();
        const pushed3 = queue.push(() => {
          logs.push("pushed3");
        });
        const pushed4 = queue.push(() => {
          logs.push("pushed4");
        });
        pushed3();
        pushed4();
        unnest1();
      });
      const pushed5 = queue.push(() => {
        logs.push("pushed5");
      });
      pushed2();
      pushed5();
      unnest0();
    });

    const pushed6 = queue.push(() => {
      logs.push("pushed6");
    });
    const pushed7 = queue.push(() => {
      logs.push("pushed7");
    });

    pushed0();
    pushed1();
    pushed6();
    pushed7();

    expect(logs).to.deep.equal([
      "pushed0",
      "pushed1",
      "pushed2",
      "pushed3",
      "pushed4",
      "pushed5",
      "pushed6",
      "pushed7"
    ]);
  });
  it("Nest queued items (e.g. innerHTML in <script>) - 2", () => {
    const logs = [];
    const queue = new ResourceQueue();

    const pushed0 = queue.push(() => {
      logs.push("pushed0");
    });
    pushed0();

    const pushed1 = queue.push(() => {
      logs.push("pushed1");
      const unnest0 = queue.nest();
      const pushed2 = queue.push(() => {
        logs.push("pushed2");
      });
      pushed2();
      unnest0();
    });
    pushed1();
    queue.resume(() => {
      logs.push("end");
    });

    expect(logs).to.deep.equal([
      "pushed0",
      "pushed1",
      "pushed2",
      "end"
    ]);
  });
  it("Nest queued items (e.g. innerHTML in <script>) - 3", () => {
    const logs = [];
    const queue = new ResourceQueue();

    const pushed0 = queue.push(() => {
      logs.push("pushed0");
    });
    pushed0();

    const pushed1 = queue.push(() => {
      logs.push("pushed1");
      const unnest0 = queue.nest();
      const pushed2 = queue.push(() => {
        logs.push("pushed2");
      });
      pushed2();
      unnest0();
    });
    queue.resume(() => {
      logs.push("end");
    });
    pushed1();

    expect(logs).to.deep.equal([
      "pushed0",
      "pushed1",
      "pushed2",
      "end"
    ]);
  });
  it("Nest queued items (e.g. innerHTML in <script>) - 4", () => {
    const logs = [];
    const queue = new ResourceQueue();

    const pushed0 = queue.push(() => {
      logs.push("pushed0");
    });
    pushed0();

    const pushed1 = queue.push(() => {
      logs.push("pushed1");
      const unnest0 = queue.nest();
      const pushed2 = queue.push(() => {
        logs.push("pushed2");
      });
      pushed2();
      unnest0();
    });
    const pushed3 = queue.push(() => {
      logs.push("pushed3");
    });
    queue.resume(() => {
      logs.push("end");
    });
    pushed1();
    pushed3();

    expect(logs).to.deep.equal([
      "pushed0",
      "pushed1",
      "pushed2",
      "pushed3",
      "end"
    ]);
  });
});
