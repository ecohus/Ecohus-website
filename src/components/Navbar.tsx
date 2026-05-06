"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { Button, buttonVariants } from "@/components/ui/button";
import {
  Sheet,
  SheetContent,
  SheetTrigger,
} from "@/components/ui/sheet";
import { cn } from "@/lib/utils";
import { useEffect, useState, useCallback } from "react";

const mainNavLinks = [
  { href: "/plantegninger", label: "Modeller" },
  { href: "/galleri", label: "Galleri" },
  { href: "/processen", label: "Processen" },
  { href: "/om-os", label: "Om os" },
  { href: "/kontakt", label: "Kontakt" },
];

const renovNavLinks = [
  { href: "/om-os", label: "Om os" },
  { href: "/renovering/kontakt", label: "Kontakt" },
];

export function Navbar() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);

  const isRenovering = pathname.startsWith("/renovering");
  const isHome = pathname === "/" || pathname === "/renovering";
  const navLinks = isRenovering ? renovNavLinks : mainNavLinks;

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 60);
    };
    handleScroll();
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const isTransparent = isHome && !scrolled;

  // Fire the curtain transition when the toggle is clicked
  const handleToggle = useCallback(() => {
    const target = isRenovering ? "/" : "/renovering";
    window.dispatchEvent(
      new CustomEvent("ecohus-transition", { detail: { to: target } })
    );
  }, [isRenovering]);

  // Toggle Pill component
  const TogglePill = ({ compact = false }: { compact?: boolean }) => (
    <button
      onClick={handleToggle}
      aria-label={isRenovering ? "Gå til sommerhus-siden" : "Gå til renoveringssiden"}
      className={cn(
        "flex items-center gap-2.5 group",
        compact ? "py-2" : ""
      )}
    >
      <span
        className={cn(
          "text-sm font-medium transition-colors duration-200",
          isRenovering
            ? "text-[#587F66]"
            : isTransparent
            ? "text-white/80 group-hover:text-white"
            : "text-muted-foreground group-hover:text-foreground"
        )}
        style={isRenovering ? { fontFamily: "var(--font-dm-sans)" } : undefined}
      >
        Renovering
      </span>

      {/* Pill */}
      <div
        className={cn(
          "relative w-11 h-6 rounded-full transition-all duration-300 flex-shrink-0",
          isRenovering ? "bg-[#587F66]" : isTransparent ? "bg-white/25" : "bg-muted"
        )}
      >
        <div
          className={cn(
            "absolute top-0.5 w-5 h-5 rounded-full bg-white shadow-sm transition-all duration-300",
            isRenovering ? "translate-x-[1.25rem]" : "translate-x-0.5"
          )}
        />
      </div>
    </button>
  );

  return (
    <header
      className={cn(
        "sticky top-0 z-50 w-full border-b transition-all duration-300 backdrop-blur-md",
        isTransparent
          ? "border-white/10 bg-black/20"
          : isRenovering
          ? "border-[#BBD1C2]/40 bg-[#F3F5F4]/80 supports-[backdrop-filter]:bg-[#F3F5F4]/70 shadow-sm"
          : "border-border/40 bg-white/75 supports-[backdrop-filter]:bg-white/60 shadow-sm"
      )}
    >
      <div className="container mx-auto flex h-20 items-center justify-between px-4 md:px-8">
        {/* Logo */}
        <Link
          href={isRenovering ? "/renovering" : "/"}
          className="flex items-center shrink-0"
        >
          <Image
            src="/logo.png"
            alt="Ecohus"
            width={260}
            height={70}
            className={cn(
              "object-contain h-16 w-auto transition-all duration-300",
              isTransparent ? "brightness-0 invert" : "brightness-0"
            )}
            priority
          />
        </Link>

        {/* Desktop Nav */}
        <nav className="hidden md:flex items-center gap-8">
          {navLinks.map((link) => (
            <Link
              key={link.href}
              href={link.href}
              className={cn(
                "text-sm font-medium transition-colors relative group",
                pathname === link.href
                  ? isTransparent
                    ? "text-white"
                    : isRenovering
                    ? "text-[#587F66]"
                    : "text-primary"
                  : isTransparent
                  ? "text-white/80 hover:text-white"
                  : isRenovering
                  ? "text-[#65806D] hover:text-[#1E2B22]"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
              <span
                className={cn(
                  "absolute -bottom-1 left-0 w-0 h-0.5 transition-all duration-200 group-hover:w-full",
                  pathname === link.href ? "w-full" : "",
                  isTransparent
                    ? "bg-white"
                    : isRenovering
                    ? "bg-[#587F66]"
                    : "bg-primary"
                )}
              />
            </Link>
          ))}

          {/* Divider */}
          <div
            className={cn(
              "w-px h-5",
              isTransparent ? "bg-white/20" : "bg-border"
            )}
          />

          {/* Toggle pill */}
          <TogglePill />

          {/* CTA — hidden on renovation side */}
          {!isRenovering && (
            <Link
              href="/prisberegner"
              className={cn(
                buttonVariants({ variant: "default" }),
                "font-medium text-sm ml-2 shadow-sm"
              )}
            >
              Beregn din pris
            </Link>
          )}
        </nav>

        {/* Mobile Nav */}
        <div className="md:hidden">
          <Sheet>
            <SheetTrigger
              render={
                <Button
                  variant="ghost"
                  size="icon"
                  className={cn(
                    "h-10 w-10",
                    isTransparent ? "text-white hover:bg-white/10" : ""
                  )}
                />
              }
            >
              <Menu className="h-6 w-6" />
              <span className="sr-only">Åbn menu</span>
            </SheetTrigger>
            <SheetContent
              side="right"
              className={cn(
                "w-[300px] sm:w-[380px] p-0",
                isRenovering ? "bg-[#F3F5F4]" : ""
              )}
            >
              <div className="flex flex-col h-full">
                {/* Mobile header */}
                <div
                  className={cn(
                    "flex items-center justify-between px-6 py-5 border-b",
                    isRenovering ? "border-[#BBD1C2]/50" : "border-border/50"
                  )}
                >
                  <Link href={isRenovering ? "/renovering" : "/"} className="flex items-center">
                    <Image
                      src="/logo.png"
                      alt="Ecohus"
                      width={200}
                      height={54}
                      className="object-contain h-12 w-auto brightness-0"
                    />
                  </Link>
                </div>

                {/* Mobile nav links */}
                <nav className="flex flex-col px-6 py-8 gap-1 flex-1">
                  {navLinks.map((link) => (
                    <Link
                      key={link.href}
                      href={link.href}
                      className={cn(
                        "text-base font-medium py-3 px-3 rounded-lg transition-colors",
                        pathname === link.href
                          ? isRenovering
                            ? "text-[#587F66] bg-[#E4EBE6]"
                            : "text-primary bg-primary/5"
                          : isRenovering
                          ? "text-[#65806D] hover:text-[#587F66] hover:bg-[#E4EBE6]"
                          : "text-foreground hover:text-primary hover:bg-muted"
                      )}
                    >
                      {link.label}
                    </Link>
                  ))}

                  {/* Mobile toggle */}
                  <div className="px-3 py-4 mt-4 border-t border-border/30">
                    <TogglePill compact />
                  </div>
                </nav>

                {/* Mobile CTAs */}
                <div className="px-6 pb-8 flex flex-col gap-3">
                  {isRenovering ? (
                    <Link
                      href="/kontakt"
                      className="inline-flex items-center justify-center w-full px-6 py-3 rounded-lg bg-[#587F66] text-white font-medium text-sm hover:bg-[#456952] transition-colors"
                    >
                      Book en renovering
                    </Link>
                  ) : (
                    <>
                      <Link
                        href="/prisberegner"
                        className={cn(buttonVariants({ variant: "default", size: "lg" }), "w-full font-medium")}
                      >
                        Beregn din pris
                      </Link>
                      <Link
                        href="/kontakt"
                        className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full font-medium")}
                      >
                        Bliv ringet op
                      </Link>
                    </>
                  )}
                </div>
              </div>
            </SheetContent>
          </Sheet>
        </div>
      </div>
    </header>
  );
}
