/**
 * Shared verdict shape for browser-smoke.mjs.
 * Pure helpers so unit tests can assert without launching Chromium.
 */
export function emptyVerdict() {
  return {
    desktop: { ok: false, blank: true, errors: [], screenshot: null },
    mobile: { ok: false, blank: true, errors: [], screenshot: null },
    brand: { ok: true, warnings: [] },
  };
}

export function finalizeVerdict(v) {
  const desktopOk = v.desktop.ok && !v.desktop.blank && v.desktop.errors.length === 0;
  const mobileOk = v.mobile.ok && !v.mobile.blank && v.mobile.errors.length === 0;
  return {
    ...v,
    ok: desktopOk && mobileOk && v.brand.ok,
    desktopOk,
    mobileOk,
  };
}
