/**
 * Shared plan for sign-out behaviour used by the auth UI and tests.
 * Gate sessions (Grok zero-click) must not show a sign-out control because
 * the next request re-materializes the session from x-grok-identity.
 */
export function shouldShowSignOut({ hasUser, hasGateMarker }) {
  if (!hasUser) return false;
  if (hasGateMarker) return false;
  return true;
}

export function signOutPlan({ hasUser, hasGateMarker }) {
  return {
    show: shouldShowSignOut({ hasUser, hasGateMarker }),
    reason: !hasUser
      ? "no-user"
      : hasGateMarker
        ? "gate-session"
        : "normal-session",
  };
}
