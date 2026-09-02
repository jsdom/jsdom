"use strict";
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

const MUTATIONS_PER_QUEUE_RUN = 100;
const RECORDS_PER_DELIVERY_RUN = 1000;
const recordsPerDeliveryValues = [1, 10, 100, 1000];

module.exports = () => {
  const bench = new Bench();

  addQueueBenchmark(bench, "queue 100 attribute records, no observers", () => []);
  addQueueBenchmark(bench, "queue 100 attribute records, one observer", (window, ancestor, target) => {
    const observer = new window.MutationObserver(() => {});
    observer.observe(target, { attributes: true });
    return [observer];
  });
  addQueueBenchmark(
    bench,
    "queue 100 attribute records, one observer on target and ancestor",
    (window, ancestor, target) => {
      const observer = new window.MutationObserver(() => {});
      observer.observe(target, { attributes: true });
      observer.observe(ancestor, { attributes: true, attributeOldValue: true, subtree: true });
      return [observer];
    }
  );
  addQueueBenchmark(bench, "queue 100 attribute records, two observers", (window, ancestor, target) => {
    const targetObserver = new window.MutationObserver(() => {});
    targetObserver.observe(target, { attributes: true });

    const ancestorObserver = new window.MutationObserver(() => {});
    ancestorObserver.observe(ancestor, { attributes: true, attributeOldValue: true, subtree: true });
    return [targetObserver, ancestorObserver];
  });

  for (const recordsPerDelivery of recordsPerDeliveryValues) {
    addDeliveryBenchmark(bench, recordsPerDelivery);
  }

  return bench;
};

function addQueueBenchmark(bench, name, setupObservers) {
  const { window } = new JSDOM();
  const ancestor = window.document.createElement("div");
  const target = ancestor.appendChild(window.document.createElement("div"));
  window.document.body.append(ancestor);
  const observers = setupObservers(window, ancestor, target);

  bench.add(name, () => {
    for (let i = 0; i < MUTATIONS_PER_QUEUE_RUN; ++i) {
      target.setAttribute("data-value", i & 1 ? "a" : "b");
    }
  }, {
    afterEach() {
      for (const observer of observers) {
        observer.takeRecords();
      }
    }
  });
}

function addDeliveryBenchmark(bench, recordsPerDelivery) {
  const { document, MutationObserver } = (new JSDOM()).window;
  const target = document.createElement("div");
  document.body.append(target);
  const deliveryCount = RECORDS_PER_DELIVERY_RUN / recordsPerDelivery;

  let resolveDelivery;
  const observer = new MutationObserver(() => {
    resolveDelivery();
  });
  observer.observe(target, { attributes: true });

  let value = 0;
  bench.add(`queue and deliver ${RECORDS_PER_DELIVERY_RUN} records, ${recordsPerDelivery} per callback`, async () => {
    for (let batch = 0; batch < deliveryCount; ++batch) {
      const delivery = Promise.withResolvers();
      resolveDelivery = delivery.resolve;

      for (let i = 0; i < recordsPerDelivery; ++i) {
        target.setAttribute("data-value", String(value++));
      }

      await delivery.promise;
    }
  });
}
