"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";

export function ThemeProvider() {
  const pathname = usePathname();

  useEffect(() => {
    if (pathname.startsWith("/renovering")) {
      document.body.setAttribute("data-theme", "renovering");
    } else {
      document.body.removeAttribute("data-theme");
    }
  }, [pathname]);

  return null;
}
