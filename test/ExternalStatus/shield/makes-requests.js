const test = require("ava");
const nock = require("nock");
const random = require("lodash.random");
const ExternalStatus = require("../../../ExternalStatus");

test("makes requests to domain", t => {
  const domain = `https://example${random(1000, 10000)}.com`;
  const scope = nock(domain)
    .filteringPath(() => "/")
    .post("/", () => true)
    .reply(200);
  const status = new ExternalStatus({ gitlab: domain });
  return status
    .shield()
    .then(() => {
      t.true(scope.isDone());
    });
});
