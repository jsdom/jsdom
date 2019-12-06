"use strict";
const { assert } = require("chai");
const { describe, specify } = require("mocha-sugar-free");
const utils = require("../../lib/jsdom/living/helpers/dates-and-times");

describe("Living Helpers: dates-and-times.js", () => {
  specify("serializeDateByType to serialize a Date object to formatted ISO 8061 date string based on the type", () => {
    assert.equal(utils.serializeDateByType(null, "date"), "");
    assert.equal(utils.serializeDateByType(new Date(2019, 2, 1), "date"), "2019-03-01");
    assert.equal(utils.serializeDateByType(new Date(2019, 7, 1), "month"), "2019-08");
    assert.equal(utils.serializeDateByType(new Date(2019, 0, 1), "week"), "2019-W01");
    assert.equal(utils.serializeDateByType(new Date(2019, 0, 1, 2, 23, 5, 1), "time"), "02:23:05.001");
  });
  specify("parseDateByType to properly parse a Date string to a formatted date string based on the type", () => {
    assert.equal(utils.parseDateByType(null, "date"), null);

    assert.equal(utils.parseDateByType("209-32-1", "date"), null);
    const dateResults = utils.parseDateByType("2019-11-23", "date");
    const dateExpectedResults = new Date(2019, 10, 23, 2);
    assert.equal(dateResults.getFullYear(), dateExpectedResults.getFullYear());
    assert.equal(dateResults.getMonth(), dateExpectedResults.getMonth());
    assert.equal(dateResults.getDate(), dateExpectedResults.getDate());
    assert.equal(dateResults.getHours(), dateExpectedResults.getHours());
    assert.equal(dateResults.getMinutes(), dateExpectedResults.getMinutes());
    assert.equal(dateResults.getSeconds(), dateExpectedResults.getSeconds());
    assert.equal(dateResults.getMilliseconds(), dateExpectedResults.getMilliseconds());

    assert.equal(utils.parseDateByType("2019-13", "month"), null);
    const monthResults = utils.parseDateByType("2019-10", "month");
    const monthExpectedResults = new Date(2019, 9, 1);
    assert.equal(monthResults.getFullYear(), monthExpectedResults.getFullYear());
    assert.equal(monthResults.getMonth(), monthExpectedResults.getMonth());
    assert.equal(monthResults.getDate(), monthExpectedResults.getDate());

    assert.equal(utils.parseDateByType("2020-W70", "week"), null);
    const weekResults = utils.parseDateByType("2020-W01", "week");
    const weekExpectedResults = new Date(2019, 11, 31);
    assert.equal(weekResults.getFullYear(), weekExpectedResults.getFullYear());
    assert.equal(weekResults.getMonth(), weekExpectedResults.getMonth());
    assert.equal(weekResults.getDate(), weekExpectedResults.getDate());
    assert.equal(weekResults.getHours(), weekExpectedResults.getHours());
    assert.equal(weekResults.getMinutes(), weekExpectedResults.getMinutes());
    assert.equal(weekResults.getSeconds(), weekExpectedResults.getSeconds());
    assert.equal(weekResults.getMilliseconds(), weekExpectedResults.getMilliseconds());

    assert.equal(utils.parseDateByType("25:22:22.132", "time"), null);
    const timeResults = utils.parseDateByType("02:22:22.132", "time");
    const timeExpectedResults = new Date(1970, 0, 1, 2, 22, 22, 132);
    assert.equal(timeResults.getFullYear(), timeExpectedResults.getFullYear());
    assert.equal(timeResults.getMonth(), timeExpectedResults.getMonth());
    assert.equal(timeResults.getDate(), timeExpectedResults.getDate());
    assert.equal(timeResults.getHours(), timeExpectedResults.getHours());
    assert.equal(timeResults.getMinutes(), timeExpectedResults.getMinutes());
    assert.equal(timeResults.getSeconds(), timeExpectedResults.getSeconds());
    assert.equal(timeResults.getMilliseconds(), timeExpectedResults.getMilliseconds());
  });
  specify("getWeekNumber from a date object", () => {
    assert.deepEqual(utils.getWeekNumber(new Date(2019, 0, 1)), { year: 2019, week: 1 });
    assert.deepEqual(utils.getWeekNumber(new Date(2019, 11, 25)), { year: 2019, week: 52 });
    assert.deepEqual(utils.getWeekNumber(new Date(2019, 11, 31)), { year: 2020, week: 1 });
  });
  specify("getDateOfWeek from a week formatted string", () => {
    const lastWeekDate = new Date(2019, 11, 23);
    const firstWeekResults = utils.getDateOfWeek(52, 2019);
    assert.equal(firstWeekResults.getFullYear(), lastWeekDate.getFullYear());
    assert.equal(firstWeekResults.getMonth(), lastWeekDate.getMonth());
    assert.equal(firstWeekResults.getDate(), lastWeekDate.getDate());
    assert.equal(firstWeekResults.getHours(), lastWeekDate.getHours());
    assert.equal(firstWeekResults.getMinutes(), lastWeekDate.getMinutes());
    assert.equal(firstWeekResults.getSeconds(), lastWeekDate.getSeconds());
    assert.equal(firstWeekResults.getMilliseconds(), lastWeekDate.getMilliseconds());
    assert.equal(utils.getDateOfWeek(76, 2019), null);
  });
});
