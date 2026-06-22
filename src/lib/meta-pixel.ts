// Client-side helpers for the Meta (Facebook) Pixel.
//
// The base pixel and the initial PageView are loaded in
// components/MetaPixel.tsx. These helpers let individual components report
// conversions (e.g. a completed contact form) without each one re-implementing
// the `window.fbq` plumbing.

declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

/** localStorage key holding the visitor's cookie-consent choice ("accepted" | "declined"). */
export const CONSENT_STORAGE_KEY = "ecohus-cookie-consent";

/**
 * Grant or revoke Meta Pixel consent (Meta's Consent Mode). While revoked, the
 * pixel queues events without sending them; granting flushes and enables them.
 * Safe to call anywhere — it no-ops on the server or before the pixel loads.
 */
export function setPixelConsent(granted: boolean) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("consent", granted ? "grant" : "revoke");
}

/**
 * Fire a Meta Pixel standard event (e.g. "Lead", "Contact").
 * Safe to call anywhere — it no-ops on the server or before the pixel loads.
 */
export function trackPixelEvent(event: string, params?: Record<string, unknown>) {
  if (typeof window === "undefined" || typeof window.fbq !== "function") return;
  window.fbq("track", event, params);
}

type LeadOptions = {
  /** Human-readable name of the form, shown in Meta Events Manager. */
  contentName: string;
  /** Short, stable key used to tell the forms apart (and reflected in the URL). */
  source: string;
  /** Optional estimated value of the lead, for ROAS reporting. */
  value?: number;
  /** Currency for `value`. Defaults to DKK. */
  currency?: string;
};

/**
 * Report a completed lead / contact form to the Meta Pixel.
 *
 * Does two things so the conversion can be picked up either way in Meta:
 *  1. Reflects the submission in the URL (?submitted=<source>) without leaving
 *     the page — a visible signal that also lets URL-based rules work.
 *  2. Fires the "Lead" standard event (the reliable, recommended signal).
 */
export function trackLead({ contentName, source, value, currency = "DKK" }: LeadOptions) {
  if (typeof window !== "undefined") {
    try {
      const url = new URL(window.location.href);
      if (url.searchParams.get("submitted") !== source) {
        url.searchParams.set("submitted", source);
        // replaceState keeps the user on the same page — no reload, no new
        // history entry. We preserve the existing state so Next.js' router
        // (which stores routing info there) keeps working.
        window.history.replaceState(window.history.state, "", url.toString());
      }
    } catch {
      // Ignore — the URL update is a nice-to-have; the Lead event is what matters.
    }
  }

  trackPixelEvent("Lead", {
    content_name: contentName,
    content_category: source,
    ...(value && value > 0 ? { value, currency } : {}),
  });
}
