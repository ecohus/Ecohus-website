"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";

export function Footer() {
  const pathname = usePathname();
  const isRenovering = pathname.startsWith("/renovering");
  const currentYear = new Date().getFullYear();

  const bgColor = isRenovering ? "#2A1F14" : "#1C1C1C";
  const accentColor = isRenovering ? "#8B4A2B" : "#2C5F3E";
  const subText = isRenovering
    ? "Professionel renovering med respekt for dit hjem — fra idé til færdigt resultat."
    : "Færdigbyggede sommerhuse af højeste kvalitet — leveret direkte til din grund. Vi tager os af hele processen fra tegning til nøgleoverdragelse.";

  const menuLinks = isRenovering
    ? [
        { href: "/om-os", label: "Om os" },
        { href: "/renovering/kontakt", label: "Kontakt" },
      ]
    : [
        { href: "/plantegninger", label: "Modeller" },
        { href: "/galleri", label: "Galleri" },
        { href: "/processen", label: "Processen" },
        { href: "/om-os", label: "Om os" },
        { href: "/kontakt", label: "Kontakt" },
      ];

  const infoLinks = isRenovering
    ? [
        { href: "/privatlivspolitik", label: "Privatlivspolitik" },
        { href: "/cookiepolitik", label: "Cookiepolitik" },
      ]
    : [
        { href: "/prisberegner", label: "Prisberegner" },
        { href: "/processen", label: "Processen" },
        { href: "/privatlivspolitik", label: "Privatlivspolitik" },
        { href: "/cookiepolitik", label: "Cookiepolitik" },
      ];

  return (
    <footer style={{ backgroundColor: bgColor }} className="text-white/80">
      <div className="container mx-auto px-4 md:px-8 pt-16 pb-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-8 pb-14 border-b border-white/10">

          {/* Brand col */}
          <div className="flex flex-col gap-5 md:col-span-1">
            <Link href={isRenovering ? "/renovering" : "/"} className="inline-flex items-center">
              <Image
                src="/logo.png"
                alt="Ecohus"
                width={100}
                height={30}
                className="object-contain h-8 w-auto brightness-0 invert"
              />
            </Link>
            <p className="text-sm text-white/50 leading-relaxed max-w-xs">
              {subText}
            </p>
            <div className="flex flex-col gap-1.5 text-sm text-white/50">
              <a href="tel:+4555255510" className="hover:text-white transition-colors">+45 55 25 55 10</a>
              <a href="mailto:kontakt@ecohus.dk" className="hover:text-white transition-colors">kontakt@ecohus.dk</a>
            </div>
          </div>

          {/* Menu */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-medium text-white/30 uppercase tracking-[0.15em]">Menu</h3>
            <nav className="flex flex-col gap-2.5">
              {menuLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/55 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>
          </div>

          {/* Contact */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-medium text-white/30 uppercase tracking-[0.15em]">Kontakt</h3>
            <address className="flex flex-col gap-2 text-sm text-white/55 not-italic">
              <p>Thrigesvej 37A</p>
              <p>7430 Ikast</p>
              <a href="tel:+4555255510" className="hover:text-white transition-colors mt-1">
                +45 55 25 55 10
              </a>
              <a href="mailto:kontakt@ecohus.dk" className="hover:text-white transition-colors">
                kontakt@ecohus.dk
              </a>
              <p className="text-white/35 text-xs mt-1">Hverdage kl. 09.00–15.00</p>
            </address>
          </div>

          {/* Info */}
          <div className="flex flex-col gap-4">
            <h3 className="text-xs font-medium text-white/30 uppercase tracking-[0.15em]">
              Information
            </h3>
            <nav className="flex flex-col gap-2.5">
              {infoLinks.map((link) => (
                <Link
                  key={link.href}
                  href={link.href}
                  className="text-sm text-white/55 hover:text-white transition-colors"
                >
                  {link.label}
                </Link>
              ))}
            </nav>

            {/* CTA */}
            <Link
              href={isRenovering ? "/renovering/kontakt" : "/kontakt"}
              className="mt-3 inline-flex items-center justify-center px-5 py-2.5 rounded-lg text-white text-sm font-medium transition-colors"
              style={{ backgroundColor: accentColor }}
            >
              {isRenovering ? "Book en renovering" : "Book en samtale"}
            </Link>
          </div>
        </div>

        {/* Bottom strip */}
        <div className="pt-6 flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-white/25">
          <p>© {currentYear} Ecohus. Alle rettigheder forbeholdes.</p>
          <p>Bygget af Sonorous Digital / Antigravity</p>
        </div>
      </div>
    </footer>
  );
}
