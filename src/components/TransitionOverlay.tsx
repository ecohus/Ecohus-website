"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";

export function TransitionOverlay() {
  const router = useRouter();
  const overlayRef = useRef<HTMLDivElement>(null);
  const isAnimating = useRef(false);

  useEffect(() => {
    const handler = async (e: Event) => {
      if (isAnimating.current) return;
      isAnimating.current = true;

      const { to } = (e as CustomEvent<{ to: string }>).detail;
      const overlay = overlayRef.current;
      if (!overlay) return;

      // Phase 1: Curtain sweeps IN from left
      overlay.style.transition = "transform 0.4s cubic-bezier(0.76, 0, 0.24, 1)";
      overlay.style.transform = "translateX(0%)";

      await new Promise((r) => setTimeout(r, 420));

      // Phase 2: Navigate while screen is covered
      router.push(to);

      await new Promise((r) => setTimeout(r, 80));

      // Phase 3: Curtain exits to the RIGHT, revealing new world
      overlay.style.transition = "transform 0.45s cubic-bezier(0.76, 0, 0.24, 1)";
      overlay.style.transform = "translateX(105%)";

      await new Promise((r) => setTimeout(r, 480));

      // Reset for next use
      overlay.style.transition = "none";
      overlay.style.transform = "translateX(-105%)";
      isAnimating.current = false;
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
