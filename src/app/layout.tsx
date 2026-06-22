import type { Metadata } from "next";
import { Plus_Jakarta_Sans, Cormorant_Garamond, DM_Sans } from "next/font/google";
import { GoogleAnalytics } from '@next/third-parties/google';
import Script from "next/script";
import "./globals.css";
import { cn } from "@/lib/utils";
import { Navbar } from "@/components/Navbar";
import { Footer } from "@/components/Footer";
import { CookieConsent } from "@/components/CookieConsent";
import { ThemeProvider } from "@/components/ThemeProvider";
import { TransitionOverlay } from "@/components/TransitionOverlay";
import { MetaPixel } from "@/components/MetaPixel";
import { CONSENT_STORAGE_KEY } from "@/lib/consent";

const plusJakartaSans = Plus_Jakarta_Sans({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-sans",
  display: "swap",
});

const cormorantGaramond = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  style: ["normal", "italic"],
  variable: "--font-cormorant",
  display: "swap",
});

const dmSans = DM_Sans({
  subsets: ["latin"],
  weight: ["400", "500", "600"],
  variable: "--font-dm-sans",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Ecohus Sommerhus",
  description: "Færdigbyggede huse direkte til din grund",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="da" className={cn("font-sans", plusJakartaSans.variable, cormorantGaramond.variable, dmSans.variable)}>
      <head>
      </head>
      <body className="antialiased min-h-screen flex flex-col relative pb-[env(safe-area-inset-bottom)]">
        {/* Google Consent Mode v2 — deny tracking storage by default, before
            gtag loads. Returning visitors who already accepted are granted. */}
        <Script id="google-consent-default" strategy="beforeInteractive">
          {`
            window.dataLayer = window.dataLayer || [];
            function gtag(){dataLayer.push(arguments);}
            var ecohusConsent = 'denied';
            try {
              if (localStorage.getItem('${CONSENT_STORAGE_KEY}') === 'accepted') ecohusConsent = 'granted';
            } catch (e) {}
            gtag('consent', 'default', {
              ad_storage: ecohusConsent,
              analytics_storage: ecohusConsent,
              ad_user_data: ecohusConsent,
              ad_personalization: ecohusConsent,
            });
          `}
        </Script>
        <ThemeProvider />
        <TransitionOverlay />
        <Navbar />
        <main className="flex-1">
          {children}
        </main>
        <Footer />
        <CookieConsent />
        <MetaPixel />
        <GoogleAnalytics gaId={process.env.NEXT_PUBLIC_GA_ID || 'G-XXXXXXXXXX'} />
      </body>
    </html>
  );
}
