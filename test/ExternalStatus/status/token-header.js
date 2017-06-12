const test = require("ava");
const nock = require("nock");
const random = require("lodash.random");
const ExternalStatus = require("../../../ExternalStatus");

const token = "testing";

test("passes 'token' parameter as a header", t => {
  const origin = `https://domain${random(1000, 10000)}.com`;
  const status = new ExternalStatus();
  let tokenHeader;
  const scope = nock(origin)
    .matchHeader("PRIVATE-TOKEN", (t) => { tokenHeader = t; return true; })
    .filteringPath(() => "/")
    .post("/", () => true)
    .reply(200);
  return status
    .status({ gitlab: origin, token })
    .then(() => {
      t.true(scope.isDone());
      t.is(tokenHeader, token);
    });
});
