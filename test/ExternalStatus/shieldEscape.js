const test = require("ava");
const ExternalStatus = require("../../ExternalStatus");

test("escapes a standard string", t => {
  t.is(ExternalStatus.shieldEscape("Lint_1: 1-2"), "Lint__1:_1--2");
});
