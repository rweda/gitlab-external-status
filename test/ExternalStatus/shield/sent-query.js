const test = require("ava");
const nock = require("nock");
const random = require("lodash.random");
const { URL } = require("url");
const ExternalStatus = require("../../../ExternalStatus");

function queryMacro(t, param, val, opts) {
  t.plan(3);
  const domain = `http://example${random(1000, 10000)}`;
  let url;
  const scope = nock(domain)
    .filteringPath(u => { url = u; return "/"; })
    .post("/", () => true)
    .reply(200);
  const status = new ExternalStatus({ gitlab: domain });
  return status
    .shield(opts)
    .then(() => {
      t.true(scope.isDone());
      const query = new URL(`${domain}${url}`).searchParams;
      t.true(query.has(param), `URL query (${domain}${url}) should have ${param}`);
      t.is(query.get(param), val);
    });
}
queryMacro.title = (title, param, val) => `${title} '${param}'='${val}'`.trim();

test("passes options through", queryMacro, "state", "success", {
  state: "success",
});

test("from 'shield-*' options,", queryMacro, "target_url", "https://img.shields.io/badge/Test-Message-orange.svg", {
  shieldLabel: "Test",
  shieldStatus: "Message",
  shieldColor: "orange",
});

test("defaults from standard options,", queryMacro, "target_url",
  "https://img.shields.io/badge/Test-Message-brightgreen.svg",
  {
    name: "Test",
    desc: "Message",
    state: "success",
  }
);
