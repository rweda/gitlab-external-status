const test = require("ava");
const nock = require("nock");
const random = require("lodash.random");
const ExternalStatus = require("../../../ExternalStatus");

function postMacro(t, type) {
  t.plan(3);
  const domain = `domain${random(1000, 10000)}.com`;
  const origin = `https://${domain}`;
  const path = `${origin}/dummy-path/foo.html`;
  const parts = { domain, origin, path };
  if(!parts[type]) { throw new Error(`Unknown domain type: ${type}`); }
  const status = new ExternalStatus();
  let url;
  const scope = nock(origin)
    .filteringPath((u) => { url = u; return "/"; })
    .post("/", () => true)
    .reply(200);
  return status
    .status({ gitlab: parts[type] })
    .then(() => {
      t.true(scope.isDone());
      t.true(url.indexOf("api") >= 0);
      t.true(url.indexOf("dummy-path") === -1);
    });
}
postMacro.title = (title, domain) => `${title} ${domain}`.trim();

test(postMacro, "origin");
test(postMacro, "path");
