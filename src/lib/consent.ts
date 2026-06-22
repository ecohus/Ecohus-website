// Site-wide cookie-consent helpers.
//
// The banner (components/CookieConsent.tsx) records the visitor's choice and
// then calls applyConsent(), which propagates it to every tracker: the Meta
// Pixel (Meta Consent Mode) and Google Analytics (Google Consent Mode v2).

import { setPixelConsent, CONSENT_STORAGE_KEY } from "@/lib/meta-pixel";

export { CONSENT_STORAGE_KEY };

declare global {
  interface Window {
    dataLayer?: unknown[];
    gtag?: (...args: unknown[]) => void;
  }
}

/**
 * Update Google Analytics / Ads consent (Google Consent Mode v2). The page-load
 * default is set denied in app/layout.tsx; this grants/revokes on the banner
 * choice. No-ops until gtag exists.
 */
export function setAnalyticsConsent(granted: boolean) {
  if (typeof window === "undefined" || typeof window.gtag !== "function") return;
  const value = granted ? "granted" : "denied";
  window.gtag("consent", "update", {
    ad_storage: value,
    analytics_storage: value,
    ad_user_data: value,
    ad_personalization: value,
  });
}

/** Apply the visitor's choice to every tracker (Meta Pixel + Google Analytics). */
export function applyConsent(granted: boolean) {
  setPixelConsent(granted);
  setAnalyticsConsent(granted);
}
