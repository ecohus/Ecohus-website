import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getFeaturedHouseModels, getTestimonials } from "@/lib/sanity";
import {
  CheckCircle2,
  Truck,
  Wrench,
  Home,
  BedDouble,
  Bath,
  Factory,
  ArrowRight,
  Star,
} from "lucide-react";
import { MOCK_MODELS } from "@/lib/mock-models";
import urlBuilder from "@sanity/image-url";
import { client } from "@/lib/sanity";

const builder = urlBuilder(client);
function urlFor(source: any) {
  if (!source) return null;
  return builder.image(source).auto("format").fit("max").url();
}

export const revalidate = 60;

const VALUE_PROPS = [
  { icon: "💰", title: "Fast pris", desc: "Ingen overraskelser. Prisen ligger fast fra aftalen er skrevet under." },
  { icon: "⚡", title: "Hurtig levering", desc: "Fra produktion til nøgle på 8–16 uger — ikke 12–18 måneder." },
  { icon: "🌿", title: "Bæredygtige valg", desc: "Gennemtænkte materialevalg med fokus på lavt klimaaftryk." },
  { icon: "🏭", title: "Fabrikskvalitet", desc: "Bygget indendørs under kontrollerede forhold. Aldrig fugtskader." },
  { icon: "📋", title: "Hjælp til tilladelser", desc: "Vi klarer al kontakt med kommunen og indhentet byggetilladelse." },
];

const PROCESS_STEPS = [
  { icon: Factory, num: "01", title: "Produktion", desc: "Huset bygges fra bunden i vores lukkede, tørre fabrikshal under optimale forhold." },
  { icon: Truck, num: "02", title: "Transport", desc: "Det færdige hus køres sikkert til din grund på et specialkøretøj." },
  { icon: Wrench, num: "03", title: "Opsætning", desc: "Vores montagehold sætter huset op og lukker taget i løbet af få dage." },
  { icon: CheckCircle2, num: "04", title: "Nøgleoverdragelse", desc: "Vi gennemgår huset med dig og afleverer nøglerne. Klar til indflytning." },
];

export default async function HomePage() {
  const [featuredModels, testimonials] = await Promise.all([
    getFeaturedHouseModels().catch(() => []),
    getTestimonials().catch(() => []),
  ]);

  const displayModels = featuredModels.length > 0
    ? featuredModels
    : [MOCK_MODELS[0], MOCK_MODELS[2], MOCK_MODELS[7]];

  return (
    <div className="flex flex-col min-h-screen">

      {/* ─── HERO ─── */}
      <section className="relative w-full h-[85vh] md:h-screen min-h-[560px] flex items-end md:items-center -mt-20">
        {/* Background image */}
        <div className="absolute inset-0 z-0">
          <Image
            src="/Hero image 2.png"
            alt="Moderne sommerhus fra Ecohus — nøglefærdigt og leveret til din grund"
            fill
            priority
            className="object-cover object-center"
          />
          {/* Layered gradient: dark bottom for text, lighter at top */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-black/10" />
        </div>

        <div className="container mx-auto relative z-10 px-4 md:px-8 pb-16 md:pb-0 text-white">
          <div className="max-w-2xl">
            {/* Eyebrow */}
            <p className="text-sm font-medium uppercase tracking-[0.15em] text-white/70 mb-5">
              Nøglefærdige sommerhuse i Danmark
            </p>

            <h1 className="text-white mb-6 text-balance">
              Færdigbyggede huse direkte til din grund
            </h1>

            <p className="text-lg md:text-xl text-white/85 mb-10 max-w-lg leading-relaxed">
              Et moderne, nøglefærdigt sommerhus af høj kvalitet — fremstillet
              under optimale forhold og klar på få måneder, ikke år.
            </p>

            <div className="flex flex-col sm:flex-row gap-4">
              <Link
                href="/kontakt"
                className={cn(
                  buttonVariants({ size: "lg" }),
                  "bg-white text-[#2C5F3E] hover:bg-white/90 font-medium text-base px-8 h-13 shadow-lg"
                )}
              >
                Book en samtale
              </Link>
              <Link
                href="/plantegninger"
                className={cn(
                  buttonVariants({ variant: "outline", size: "lg" }),
                  "bg-transparent text-white border-white/50 hover:bg-white/10 font-medium text-base px-8 h-13"
                )}
              >
                Se vores modeller
                <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
            </div>

            {/* Social proof strip */}
            <div className="flex items-center gap-6 mt-10 pt-10 border-t border-white/20">
              <div className="text-center">
                <p className="text-2xl font-medium text-white">120+</p>
                <p className="text-xs text-white/60 uppercase tracking-wide">Leverede huse</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-medium text-white">15</p>
                <p className="text-xs text-white/60 uppercase tracking-wide">Års erfaring</p>
              </div>
              <div className="w-px h-10 bg-white/20" />
              <div className="text-center">
                <p className="text-2xl font-medium text-white">10 år</p>
                <p className="text-xs text-white/60 uppercase tracking-wide">Garanti</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ─── 5 VALUE PROPS ─── */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-14">
            <h2 className="mb-3">5 gode grunde til at vælge Ecohus</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Vi har gjort det enkelt at bygge et flot sommerhus — fra første samtale til nøgleoverdragelse.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-5">
            {VALUE_PROPS.map((item, i) => (
              <div
                key={i}
                className="flex flex-col gap-4 bg-background p-7 rounded-2xl border border-border/50 hover:border-primary/30 hover:shadow-md transition-all duration-200 group"
              >
                <span className="text-3xl">{item.icon}</span>
                <div>
                  <p className="text-base font-medium text-foreground mb-1.5">{item.title}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{item.desc}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ─── PROCESS TEASER ─── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary uppercase tracking-[0.12em] mb-3">Sådan fungerer det</p>
            <h2 className="mb-4">Fra drøm til færdigt hus</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              En enkel, gennemsigtig proces — ingen ubehagelige overraskelser undervejs.
            </p>
          </div>

          <div className="relative">
            {/* Connecting line — desktop only */}
            <div className="hidden md:block absolute top-10 left-[calc(12.5%+32px)] right-[calc(12.5%+32px)] h-px bg-border z-0" />
            <div className="grid grid-cols-1 md:grid-cols-4 gap-10 md:gap-6 relative z-10">
              {PROCESS_STEPS.map((step, i) => (
                <div key={i} className="flex flex-col items-center text-center gap-5 group">
                  <div className="w-20 h-20 rounded-full bg-secondary border-[3px] border-background ring-1 ring-border flex items-center justify-center shadow-sm transition-all duration-200 group-hover:ring-primary/40 group-hover:shadow-md group-hover:scale-105 relative">
                    <step.icon className="w-7 h-7 text-primary" />
                    <span className="absolute -top-2 -right-2 w-6 h-6 rounded-full bg-primary text-primary-foreground text-xs font-medium flex items-center justify-center">
                      {i + 1}
                    </span>
                  </div>
                  <div className="px-2">
                    <h3 className="text-lg font-medium mb-2">{step.title}</h3>
                    <p className="text-muted-foreground text-sm leading-relaxed">{step.desc}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="text-center mt-12">
            <Link
              href="/processen"
              className={cn(buttonVariants({ variant: "outline" }), "text-sm font-medium")}
            >
              Læs mere om processen
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── FEATURED MODELS ─── */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-end mb-14 gap-6">
            <div>
              <p className="text-sm font-medium text-primary uppercase tracking-[0.12em] mb-3">Vores modeller</p>
              <h2 className="mb-3">Populære modeller</h2>
              <p className="text-muted-foreground text-lg max-w-md">
                Alle modeller kan tilpasses med forskellige tilvalg og overflader.
              </p>
            </div>
            <Link
              href="/plantegninger"
              className={cn(buttonVariants({ variant: "outline" }), "bg-background shrink-0 font-medium shadow-sm hover:text-primary")}
            >
              Se alle modeller
              <ArrowRight className="ml-2 h-4 w-4" />
            </Link>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7">
            {displayModels.map((model: any) => {
              const imgUrl = model.floorplan_png ? urlFor(model.floorplan_png) : model.image_url;
              return (
                <div
                  key={model._id}
                  className="group bg-card border border-border/50 overflow-hidden shadow-sm hover:shadow-lg transition-all duration-300 hover:-translate-y-1 flex flex-col rounded-xl"
                >
                  {/* Floor plan — links to detail page */}
                  <Link
                    href={`/plantegninger/${model.slug.current}`}
                    className="block bg-white p-8 h-[280px] flex items-center justify-center w-full"
                  >
                    {imgUrl ? (
                      <div className="relative w-full h-full max-w-[240px]">
                        <Image
                          src={imgUrl}
                          alt={model.name}
                          fill
                          className="object-contain"
                          sizes="(max-width: 768px) 100vw, 300px"
                        />
                      </div>
                    ) : (
                      <div className="text-muted-foreground/30 text-sm">Billede mangler</div>
                    )}
                  </Link>

                  {/* Info */}
                  <div className="p-6 flex flex-col gap-3 bg-[#2C5F3E] text-white flex-1">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <h3 className="text-lg font-medium text-white/90 tracking-tight">{model.name}</h3>
                        <p className="text-white/60 text-sm mt-0.5">
                          {model.size_m2} m² boligareal
                          {model.covered_area_m2 > 0 && ` · ${model.covered_area_m2} m² overdækket`}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="text-white font-medium">
                        Fra {model.price_from?.toLocaleString("da-DK")} kr.
                      </span>
                    </div>

                    <div className="flex items-center gap-2 pt-1 border-t border-white/15">
                      <div className="flex items-center gap-1 text-white/70 text-sm">
                        <Home className="w-3.5 h-3.5" />
                        <span>{model.rooms} vær.</span>
                      </div>
                      <span className="text-white/30">·</span>
                      <div className="flex items-center gap-1 text-white/70 text-sm">
                        <Bath className="w-3.5 h-3.5" />
                        <span>{model.bathrooms} bad</span>
                      </div>
                      {model.has_garage && (
                        <>
                          <span className="text-white/30">·</span>
                          <span className="text-white/70 text-sm">Garage</span>
                        </>
                      )}
                    </div>

                    {/* Dual CTAs */}
                    <div className="mt-auto pt-3 border-t border-white/15 flex items-center gap-4">
                      <Link
                        href={`/plantegninger/${model.slug.current}`}
                        className="text-xs font-medium text-white/80 hover:text-white underline-offset-2 hover:underline transition-colors flex items-center gap-1"
                      >
                        Se model <ArrowRight className="w-3 h-3" />
                      </Link>
                      <span className="text-white/20">|</span>
                      <Link
                        href={`/prisberegner?model=${model.slug.current}`}
                        className="text-xs font-medium text-white/80 hover:text-white underline-offset-2 hover:underline transition-colors"
                      >
                        Beregn pris →
                      </Link>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* ─── TESTIMONIALS ─── */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-16">
            <p className="text-sm font-medium text-primary uppercase tracking-[0.12em] mb-3">Kundeoplevelser</p>
            <h2>Hvad siger vores kunder?</h2>
          </div>

          {testimonials.length === 0 ? (
            <div className="w-full max-w-lg mx-auto p-16 text-center bg-secondary rounded-2xl border border-dashed border-border">
              <p className="text-muted-foreground font-medium">Anmeldelser tilføjes snart</p>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-7 text-left">
              {testimonials.map((t: any) => (
                <div key={t._id} className="bg-secondary p-8 rounded-2xl flex flex-col border border-border/40 hover:border-primary/20 transition-colors">
                  <div className="flex gap-1 mb-5">
                    {Array.from({ length: t.rating || 5 }).map((_, i) => (
                      <Star key={i} className="w-4 h-4 fill-amber-400 text-amber-400" />
                    ))}
                  </div>
                  <p className="text-base text-foreground/85 mb-6 italic leading-relaxed flex-1">
                    "{t.quote}"
                  </p>
                  <p className="font-medium text-primary text-sm">{t.name}</p>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* ─── CTA BANNER ─── */}
      <section className="py-28 bg-[#2C5F3E] text-white">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-2xl">
          <h2 className="text-white mb-5">Er du klar til dit nye sommerhus?</h2>
          <p className="text-lg text-white/80 mb-10 leading-relaxed">
            Book en uforpligtende samtale, hvor vi taler om dine drømme,
            mulighederne på din grund og økonomien i projektet.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link
              href="/kontakt"
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }),
                "text-base font-medium px-10 h-13 shadow-lg hover:scale-105 transition-transform"
              )}
            >
              Book en samtale
            </Link>
            <Link
              href="/prisberegner"
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }),
                "text-base font-medium px-10 h-13 bg-transparent text-white border-white/40 hover:bg-white/10"
              )}
            >
              Beregn din pris
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
}
