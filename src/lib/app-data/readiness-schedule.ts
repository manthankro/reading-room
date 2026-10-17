/**
 * Shared schedule for waiting on connector readiness.
 * Kept pure so unit tests can assert timing without React.
 */
export const CONNECTOR_READY_POLL_MS = 1500;
export const CONNECTOR_READY_TIMEOUT_MS = 30_000;
