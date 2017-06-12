const test = require("ava");
const nock = require("nock");
const { URL } = require("url");
const random = require("lodash.random");
const ExternalStatus = require("../../../ExternalStatus");

const origin = `https://domain${random(1000, 10000)}.com`;

const opts = {
  gitlab: origin,
  project: "test",
  commit: "a-random-commit",
};

const targetURL = `${origin}/api/v4/projects/${opts.project}/statuses/${opts.commit}`;

function postMacro(t, constructorOpts, statusOpts) {
  t.plan(2);
  const status = new ExternalStatus(constructorOpts);
  let url;
  const scope = nock(origin)
    .filteringPath((u) => { url = new URL(`${origin}${u}`); return "/"; })
    .post("/", () => true)
    .reply(200);
  return status
    .status(statusOpts)
    .then(() => {
      t.true(scope.isDone());
      t.is(targetURL, `${url.origin}${url.pathname}`);
    });
}

test("uses parameters from constructor", postMacro, {}, opts);
test("uses parameters given to method", postMacro, opts, {});
