// @ts-check
/**
 * The sign-out sequence used by `src/lib/auth/client.ts`, kept here as a pure
 * module so its effects can be unit-tested.
 */

export const PREVIEW_SIGN_OUT_TIMEOUT_MS = 1500;
export const DEPLOYED_SIGN_OUT_TIMEOUT_MS = 10_000;

/**
 * @param {boolean} livePreview
 * @returns {number}
 */
export function signOutTimeoutMs(livePreview) {
  return livePreview ? PREVIEW_SIGN_OUT_TIMEOUT_MS : DEPLOYED_SIGN_OUT_TIMEOUT_MS;
}

/**
 * @param {() => unknown} start
 * @param {number} timeoutMs
 * @returns {Promise<"ok" | "failed" | "timeout">}
 */
export function settleWithin(start, timeoutMs) {
  return new Promise((resolve) => {
    let settled = false;
    const finish = (outcome) => {
      if (settled) return;
      settled = true;
      resolve(outcome);
    };
    const timer = setTimeout(() => finish("timeout"), timeoutMs);
    Promise.resolve()
      .then(() => start())
      .then(() => {
        clearTimeout(timer);
        finish("ok");
      })
      .catch(() => {
        clearTimeout(timer);
        finish("failed");
      });
  });
}

/**
 * @typedef {object} SignOutSteps
 * @property {boolean} livePreview
 * @property {boolean} hasBearer
 * @property {() => unknown} requestSignOut
 * @property {() => void} clearToken
 * @property {() => void} redirect
 * @property {number} [timeoutMs]
 */

/**
 * @param {SignOutSteps} steps
 * @returns {Promise<void>}
 */
export async function runSignOut({
  livePreview,
  hasBearer,
  requestSignOut,
  clearToken,
  redirect,
  timeoutMs,
}) {
  if (livePreview) {
    if (hasBearer) {
      await settleWithin(requestSignOut, timeoutMs ?? signOutTimeoutMs(livePreview));
    }
    clearToken();
    redirect();
    return;
  }

  const outcome = await settleWithin(requestSignOut, timeoutMs ?? signOutTimeoutMs(livePreview));
  if (outcome !== "ok") {
    throw new Error(
      outcome === "timeout"
        ? "Sign-out timed out — you are still signed in. Please try again."
        : "Sign-out failed — you are still signed in. Please try again.",
    );
  }
  clearToken();
  redirect();
}

/**
 * @typedef {object} PreSignInSteps
 * @property {boolean} livePreview
 * @property {boolean} hasBearer
 * @property {() => unknown} requestSignOut
 * @property {() => void} clearToken
 * @property {number} [timeoutMs]
 */

/**
 * @param {PreSignInSteps} steps
 * @returns {Promise<void>}
 */
export async function runPreSignInSignOut({
  livePreview,
  hasBearer,
  requestSignOut,
  clearToken,
  timeoutMs,
}) {
  if (hasBearer || !livePreview) {
    await settleWithin(requestSignOut, timeoutMs ?? signOutTimeoutMs(livePreview));
  }
  clearToken();
}

/** @param {{ hasUser: boolean, hasGateMarker: boolean }} input */
export function shouldShowSignOut({ hasUser, hasGateMarker }) {
  if (!hasUser) return false;
  if (hasGateMarker) return false;
  return true;
}

/** @param {{ hasUser: boolean, hasGateMarker: boolean }} input */
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
