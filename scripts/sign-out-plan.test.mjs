import assert from "node:assert/strict";
import { shouldShowSignOut, signOutPlan } from "./sign-out-plan.mjs";

assert.equal(shouldShowSignOut({ hasUser: false, hasGateMarker: false }), false);
assert.equal(shouldShowSignOut({ hasUser: true, hasGateMarker: true }), false);
assert.equal(shouldShowSignOut({ hasUser: true, hasGateMarker: false }), true);

assert.deepEqual(signOutPlan({ hasUser: false, hasGateMarker: false }), {
  show: false,
  reason: "no-user",
});
assert.deepEqual(signOutPlan({ hasUser: true, hasGateMarker: true }), {
  show: false,
  reason: "gate-session",
});
assert.deepEqual(signOutPlan({ hasUser: true, hasGateMarker: false }), {
  show: true,
  reason: "normal-session",
});

console.log("sign-out-plan.test.mjs: ok");
