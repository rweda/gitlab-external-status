const test = require("ava");
const ExternalStatus = require("../../ExternalStatus");

test("escapes a standard string", t => {
  t.is(ExternalStatus.shieldEscape("Lint_1 1-2-3"), "Lint__1%201--2--3");
});

test("uses querystring escaping", t => {
  t.is(ExternalStatus.shieldEscape("20%"), "20%25");
});
