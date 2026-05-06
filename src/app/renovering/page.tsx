"use client";

import Link from "next/link";
import { Home, Bath, Layers, Building2, ChevronDown, ArrowRight, Star, Clock, Users } from "lucide-react";
import { useState } from "react";

// ─── Before/After Slider ───────────────────────────────────────────────────
function BeforeAfterSlider({
  title,
  location,
  beforeLabel = "Før",
  afterLabel = "Efter",
}: {
  title: string;
  location: string;
  beforeLabel?: string;
  afterLabel?: string;
}) {
  const [value, setValue] = useState(50);

  return (
    <div className="renov-card overflow-hidden rounded-2xl group">
      <div className="relative h-72 select-none cursor-col-resize">
        {/* BEFORE (full width, desaturated) */}
        <div
          className="absolute inset-0"
          style={{
            background: "linear-gradient(135deg, #A2BDAA 0%, #87A190 50%, #65806D 100%)",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-white/40 text-xs tracking-widest uppercase font-mono">Billede kommer snart</p>
          </div>
        </div>

        {/* AFTER (clipped reveal) */}
        <div
          className="absolute inset-0"
          style={{
            clipPath: `inset(0 ${100 - value}% 0 0)`,
            background: "linear-gradient(135deg, #F3F5F4 0%, #BBD1C2 50%, #87A190 100%)",
          }}
        >
          <div className="absolute inset-0 flex items-center justify-center">
            <p className="text-[#1E2B22]/30 text-xs tracking-widest uppercase font-mono">Renoveret</p>
          </div>
        </div>

        {/* Divider line */}
        <div
          className="absolute top-0 bottom-0 w-0.5 bg-white/90 shadow-lg"
          style={{ left: `${value}%`, transform: "translateX(-50%)" }}
        >
          <div className="absolute top-1/2 -translate-y-1/2 -translate-x-1/2 w-9 h-9 rounded-full bg-white shadow-xl flex items-center justify-center border border-[#A2BDAA]/40">
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M5 8L2 8M2 8L4 6M2 8L4 10" stroke="#587F66" strokeWidth="1.5" strokeLinecap="round"/>
              <path d="M11 8H14M14 8L12 6M14 8L12 10" stroke="#587F66" strokeWidth="1.5" strokeLinecap="round"/>
            </svg>
          </div>
        </div>

        {/* Labels */}
        <span className="absolute top-4 left-4 bg-black/50 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
          {beforeLabel}
        </span>
        <span className="absolute top-4 right-4 bg-[#587F66]/80 text-white text-xs px-2.5 py-1 rounded-full backdrop-blur-sm">
          {afterLabel}
        </span>

        {/* Range input */}
        <input
          type="range"
          min={0}
          max={100}
          value={value}
          onChange={(e) => setValue(Number(e.target.value))}
          className="absolute inset-0 w-full h-full opacity-0 cursor-col-resize"
          style={{ margin: 0, padding: 0 }}
        />
      </div>

      <div className="p-5 bg-[#E4EBE6]">
        <p className="font-semibold text-[#1E2B22] text-lg" style={{ fontFamily: "var(--font-cormorant)", fontStyle: "italic" }}>
          {title}
        </p>
        <p className="text-sm text-[#65806D] mt-0.5">{location}</p>
      </div>
    </div>
  );
}

// ─── Section: Hero ─────────────────────────────────────────────────────────
function HeroSection() {
  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden">
      {/* Warm placeholder background */}
      <div
        className="absolute inset-0"
        style={{
          background:
            "linear-gradient(160deg, #2C3E33 0%, #3A4F41 30%, #4A6050 60%, #1E2B22 100%)",
        }}
      />
      {/* Texture overlay */}
      <div
        className="absolute inset-0 opacity-20"
        style={{
          backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='1'/%3E%3C/svg%3E")`,
        }}
      />
      {/* Warm gradient vignette */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#1E2B22]/70 via-transparent to-[#1E2B22]/30" />

      <div className="relative z-10 container mx-auto px-4 md:px-8 text-center text-white max-w-4xl">
        {/* Eyebrow */}
        <p
          className="text-[#A2BDAA] text-sm tracking-[0.3em] uppercase mb-8 opacity-0 animate-[fadeInUp_0.6s_ease_0.1s_forwards]"
        >
          Ecohus Renovering
        </p>

        {/* Headline */}
        <h1
          className="text-white opacity-0 animate-[fadeInUp_0.7s_ease_0.25s_forwards]"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "clamp(3rem, 8vw, 6.5rem)",
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            fontStyle: "italic",
          }}
        >
          Vi fornyer<br />det du elsker
        </h1>

        {/* Subline */}
        <p
          className="mt-8 text-white/70 max-w-xl mx-auto leading-relaxed opacity-0 animate-[fadeInUp_0.7s_ease_0.4s_forwards]"
          style={{ fontFamily: "var(--font-dm-sans)", fontSize: "1.1rem" }}
        >
          Professionel renovering med respekt for dit hjem. Fra idé til færdigt resultat — vi håndterer alt.
        </p>

        {/* CTAs */}
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4 opacity-0 animate-[fadeInUp_0.7s_ease_0.55s_forwards]">
          <a
            href="#projekter"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#587F66] text-white font-medium hover:bg-[#456952] transition-all duration-300 shadow-xl hover:shadow-[#587F66]/30"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Se vores projekter
            <ArrowRight className="w-4 h-4" />
          </a>
          <Link
            href="/renovering/kontakt"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-white/30 text-white hover:bg-white/10 transition-all duration-300 backdrop-blur-sm"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Bliv ringet op
          </Link>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/40 opacity-0 animate-[fadeInUp_0.7s_ease_0.8s_forwards]">
          <span className="text-xs tracking-widest uppercase" style={{ fontFamily: "var(--font-dm-sans)" }}>Scroll</span>
          <ChevronDown className="w-4 h-4 animate-bounce" />
        </div>
      </div>
    </section>
  );
}

// ─── Section: Services ─────────────────────────────────────────────────────
const services = [
  {
    icon: Home,
    title: "Køkkenrenovering",
    desc: "Fra klassisk til moderne — vi skaber køkkener der inviterer til fællesskab og glæde i hverdagen.",
  },
  {
    icon: Bath,
    title: "Baderenovering",
    desc: "Tidløst design møder praktisk funktionalitet. Vi renoverer dit badeværelse til en personlig oase.",
  },
  {
    icon: Layers,
    title: "Facade & Tag",
    desc: "Beskyt og forskøn dit hjem udefra. Vi arbejder med holdbare materialer og et skarpt blik for detaljen.",
  },
  {
    icon: Building2,
    title: "Totalrenovering",
    desc: "Komplet transformation fra kælder til kvist. Én samlet løsning, ét ansvarspunkt, ét team.",
  },
];

function ServicesSection() {
  return (
    <section className="py-32 bg-[#F3F5F4]">
      <div className="container mx-auto px-4 md:px-8">
        {/* Header */}
        <div className="max-w-2xl mb-20">
          <p className="text-[#587F66] text-sm tracking-[0.25em] uppercase mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Vores ydelser
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "#1E2B22",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              lineHeight: 1.1,
            }}
          >
            Håndværk du kan<br />stole på
          </h2>
        </div>

        {/* Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
          {services.map(({ icon: Icon, title, desc }) => (
            <div
              key={title}
              className="group p-8 rounded-2xl border border-[#BBD1C2] bg-white/60 hover:bg-white hover:shadow-xl hover:-translate-y-1 transition-all duration-300 cursor-default"
            >
              <div className="w-12 h-12 rounded-xl bg-[#E4EBE6] flex items-center justify-center mb-6 group-hover:bg-[#587F66] transition-colors duration-300">
                <Icon className="w-5 h-5 text-[#587F66] group-hover:text-white transition-colors duration-300" />
              </div>
              <h3
                className="text-[#1E2B22] mb-3"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1.4rem",
                  fontWeight: 500,
                }}
              >
                {title}
              </h3>
              <p className="text-[#65806D] text-sm leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)" }}>
                {desc}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Process ──────────────────────────────────────────────────────
const steps = [
  { num: "01", title: "Konsultation", desc: "Vi mødes og lytter. Forståelse af dit hjem og dine ønsker er fundamentet for alt vi gør." },
  { num: "02", title: "Tilbud & Plan", desc: "Præcist tilbud uden overraskelser. Vi planlægger hele processen ned til mindste detalje." },
  { num: "03", title: "Udførelse", desc: "Erfarne håndværkere udfører arbejdet professionelt og ryddeligt — med respekt for dit hjem." },
  { num: "04", title: "Aflevering", desc: "Vi gennemgår det afsluttede arbejde sammen. Ingen regning før du er 100% tilfreds." },
];

function ProcessSection() {
  return (
    <section className="py-32 bg-[#1E2B22]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-2xl mb-20">
          <p className="text-[#A2BDAA] text-sm tracking-[0.25em] uppercase mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Sådan arbejder vi
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "#F3F5F4",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              lineHeight: 1.1,
            }}
          >
            En tryg oplevelse<br />fra start til slut
          </h2>
        </div>

        <div className="relative grid grid-cols-1 md:grid-cols-4 gap-8 md:gap-6">
          {/* Connecting line (desktop) */}
          <div className="hidden md:block absolute top-8 left-[12.5%] right-[12.5%] h-px bg-[#A2BDAA]/20" />

          {steps.map(({ num, title, desc }) => (
            <div key={num} className="relative flex flex-col gap-5">
              {/* Step number circle */}
              <div className="w-16 h-16 rounded-full border border-[#A2BDAA]/30 bg-[#2C3E33] flex items-center justify-center flex-shrink-0">
                <span
                  className="text-[#A2BDAA]"
                  style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.2rem", fontStyle: "italic" }}
                >
                  {num}
                </span>
              </div>
              <div>
                <h3
                  className="text-[#F3F5F4] mb-2"
                  style={{ fontFamily: "var(--font-cormorant)", fontSize: "1.5rem", fontWeight: 500 }}
                >
                  {title}
                </h3>
                <p className="text-[#65806D] text-sm leading-relaxed" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  {desc}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Before/After Gallery ────────────────────────────────────────
function GallerySection() {
  return (
    <section id="projekter" className="py-32 bg-[#E4EBE6]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="max-w-2xl mb-20">
          <p className="text-[#587F66] text-sm tracking-[0.25em] uppercase mb-4" style={{ fontFamily: "var(--font-dm-sans)" }}>
            Vores projekter
          </p>
          <h2
            style={{
              fontFamily: "var(--font-cormorant)",
              fontWeight: 300,
              fontStyle: "italic",
              color: "#1E2B22",
              fontSize: "clamp(2.5rem, 5vw, 4rem)",
              lineHeight: 1.1,
            }}
          >
            Før & efter —<br />forvandlinger der taler
          </h2>
          <p className="mt-4 text-[#65806D] text-sm" style={{ fontFamily: "var(--font-dm-sans)" }}>
            (Afventer før/efter billedmateriale fra Krzysztof via Dropbox)
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <BeforeAfterSlider title="Køkken i Ikast" location="Totalrenovering · 2024" />
          <BeforeAfterSlider title="Badeværelse i Silkeborg" location="Baderenovering · 2024" />
          <BeforeAfterSlider title="Facade i Herning" location="Facaderenovering · 2023" />
        </div>
      </div>
    </section>
  );
}

// ─── Section: Trust Bar ────────────────────────────────────────────────────
const stats = [
  { icon: Clock, value: "15+", label: "Års erfaring" },
  { icon: Users, value: "70+", label: "Tilfredse kunder" },
  { icon: Star, value: "100%", label: "Kvalitetsgaranti" },
];

function TrustBar() {
  return (
    <section className="py-24 bg-[#587F66]">
      <div className="container mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
          {stats.map(({ icon: Icon, value, label }) => (
            <div key={label} className="flex flex-col md:flex-row items-center md:items-start gap-5 text-center md:text-left">
              <div className="w-12 h-12 rounded-xl bg-white/10 flex items-center justify-center flex-shrink-0">
                <Icon className="w-5 h-5 text-[#F3F5F4]" />
              </div>
              <div>
                <p
                  className="text-[#F3F5F4]"
                  style={{ fontFamily: "var(--font-cormorant)", fontSize: "3rem", fontWeight: 300, lineHeight: 1 }}
                >
                  {value}
                </p>
                <p className="text-white/60 text-sm mt-1" style={{ fontFamily: "var(--font-dm-sans)" }}>
                  {label}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

// ─── Section: Contact CTA ──────────────────────────────────────────────────
function ContactCTA() {
  return (
    <section className="py-32 bg-[#F3F5F4]">
      <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
        <p className="text-[#587F66] text-sm tracking-[0.25em] uppercase mb-6" style={{ fontFamily: "var(--font-dm-sans)" }}>
          Kom i gang
        </p>
        <h2
          style={{
            fontFamily: "var(--font-cormorant)",
            fontWeight: 300,
            fontStyle: "italic",
            color: "#1E2B22",
            fontSize: "clamp(2.5rem, 5vw, 4.5rem)",
            lineHeight: 1.1,
          }}
        >
          Klar til en forvandling?
        </h2>
        <p
          className="mt-6 text-[#65806D] max-w-xl mx-auto leading-relaxed"
          style={{ fontFamily: "var(--font-dm-sans)", fontSize: "1.05rem" }}
        >
          Fortæl os om dit projekt. Vi svarer inden for 24 timer og tilbyder altid en uforpligtende samtale.
        </p>
        <div className="mt-12 flex flex-col sm:flex-row items-center justify-center gap-4">
          <Link
            href="/renovering/kontakt"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full bg-[#587F66] text-white font-medium hover:bg-[#456952] transition-all duration-300 shadow-lg hover:shadow-[#587F66]/20"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Bliv ringet op
            <ArrowRight className="w-4 h-4" />
          </Link>
          <a
            href="tel:+4555255510"
            className="inline-flex items-center gap-2 px-8 py-4 rounded-full border border-[#BBD1C2] text-[#1E2B22] hover:border-[#587F66] hover:text-[#587F66] transition-all duration-300"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Ring til os
          </a>
        </div>
      </div>
    </section>
  );
}

// ─── Page ──────────────────────────────────────────────────────────────────
export default function RenoveringPage() {
  return (
    <>
      <HeroSection />
      <ServicesSection />
      <ProcessSection />
      <GallerySection />
      <TrustBar />
      <ContactCTA />
    </>
  );
}
