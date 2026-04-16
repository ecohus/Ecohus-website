"use client";

import { useEffect, useRef } from "react";
import { useRouter, usePathname } from "next/navigation";

export function TransitionOverlay() {
  const router = useRouter();
  const pathname = usePathname();
  const overlayRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);
  const targetPathnameRef = useRef<string | null>(null);

  // ── Prefetch the sibling route on idle so first-visit is instant ──────────
  useEffect(() => {
    const prefetchSibling = () => {
      // Prefetch whichever mode the user hasn't visited yet
      router.prefetch("/renovering");
      router.prefetch("/");
    };

    if ("requestIdleCallback" in window) {
      const id = (window as any).requestIdleCallback(prefetchSibling, { timeout: 3000 });
      return () => (window as any).cancelIdleCallback(id);
    } else {
      // Safari fallback
      const id = setTimeout(prefetchSibling, 2000);
      return () => clearTimeout(id);
    }
  }, [router]);

  // ── Watch for the pathname to change, then fire the reveal ────────────────
  useEffect(() => {
    if (
      targetPathnameRef.current !== null &&
      pathname === targetPathnameRef.current
    ) {
      targetPathnameRef.current = null;
      const overlay = overlayRef.current;
      if (!overlay) return;

      // Give React one more frame to commit/paint the new page before revealing
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          overlay.style.transition = "transform 0.45s cubic-bezier(0.76, 0, 0.24, 1)";
          overlay.style.transform = "translateX(105%)";

          setTimeout(() => {
            overlay.style.transition = "none";
            overlay.style.transform = "translateX(-105%)";
            isAnimating.current = false;
          }, 480);
        });
      });
    }
  }, [pathname]);

  // ── Curtain-in + navigate handler ─────────────────────────────────────────
  useEffect(() => {
    const handler = async (e: Event) => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      const { to } = (e as CustomEvent<{ to: string }>).detail;
      const overlay = overlayRef.current;
      if (!overlay) return;

      // Record where we're going so the pathname watcher knows when to reveal
      targetPathnameRef.current = to;

      // Phase 1: Curtain sweeps IN from left
      overlay.style.transition = "transform 0.4s cubic-bezier(0.76, 0, 0.24, 1)";
      overlay.style.transform = "translateX(0%)";

      // Wait for the sweep-in to finish, then navigate while screen is covered
      await new Promise((r) => setTimeout(r, 420));
      router.push(to);

      // Phase 2 & 3 are now handled reactively by the pathname useEffect above
      // (no more hardcoded 80ms guess — we wait for the real route change)
    };

    window.addEventListener("ecohus-transition", handler);
    return () => window.removeEventListener("ecohus-transition", handler);
  }, [router]);

  return (
    <div
      ref={overlayRef}
      aria-hidden="true"
      style={{
        position: "fixed",
        inset: 0,
        zIndex: 9999,
        backgroundColor: "#2A1F14",
        transform: "translateX(-105%)",
        pointerEvents: "none",
        willChange: "transform",
      }}
    />
  );
}
