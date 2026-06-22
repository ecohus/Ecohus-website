"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { CONSENT_STORAGE_KEY, applyConsent } from "@/lib/consent";

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem(CONSENT_STORAGE_KEY);
    if (!consent) {
      setShow(true);
    }
  }, []);

  const accept = () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, "accepted");
    applyConsent(true);
    setShow(false);
  };

  const decline = () => {
    localStorage.setItem(CONSENT_STORAGE_KEY, "declined");
    applyConsent(false);
    setShow(false);
  };

  if (!show) return null;

  return (
    <div className="fixed bottom-0 left-0 right-0 z-50 p-4 sm:p-6 border-t bg-background/95 backdrop-blur shadow-[0_-4px_24px_rgba(0,0,0,0.05)]">
      <div className="container mx-auto max-w-7xl flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div className="flex-1 text-sm text-foreground pr-4">
          <p className="font-medium text-base mb-1">Vi bruger cookies</p>
          <p className="text-muted-foreground">
            Vi og vores partnere bruger cookies til at forbedre din oplevelse, analysere trafik og tilpasse indhold. 
            Læs mere i vores <a href="/cookiepolitik" className="underline hover:text-primary transition-colors">cookiepolitik</a>.
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-3 shrink-0 w-full sm:w-auto">
          <Button variant="outline" onClick={decline} className="w-full sm:w-auto">
            Kun nødvendige
          </Button>
          <Button onClick={accept} className="w-full sm:w-auto shadow-md">
            Accepter alle
          </Button>
        </div>
      </div>
    </div>
  );
}
