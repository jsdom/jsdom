"use strict";
const { Bench } = require("tinybench");
const { JSDOM } = require("../..");

const RECORDS_PER_RUN = 1000;
const recordsPerDeliveryValues = [1, 10, 100, 1000];

module.exports = () => {
  const bench = new Bench();

  for (const recordsPerDelivery of recordsPerDeliveryValues) {
    addDeliveryBenchmark(bench, recordsPerDelivery);
  }

  return bench;
};

function addDeliveryBenchmark(bench, recordsPerDelivery) {
  const { document, MutationObserver } = (new JSDOM()).window;
  const target = document.createElement("div");
  document.body.append(target);
  const deliveryCount = RECORDS_PER_RUN / recordsPerDelivery;

  let resolveDelivery;
  const observer = new MutationObserver(() => {
    resolveDelivery();
  });
  observer.observe(target, { attributes: true });

  let value = 0;
  bench.add(`queue and deliver ${RECORDS_PER_RUN} records, ${recordsPerDelivery} per callback`, async () => {
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
