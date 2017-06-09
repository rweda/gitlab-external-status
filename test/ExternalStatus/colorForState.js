const test = require("ava");
const ExternalStatus = require("../../ExternalStatus");

test("returns entries from _stateColors", t => {
  const status = new ExternalStatus();
  const state = Object.keys(status._stateColors)[0];
  t.is(status.colorForState(state), status._stateColors[state]);
});
