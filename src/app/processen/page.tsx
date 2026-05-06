import Link from "next/link";
import { getFaqItems } from "@/lib/sanity";
import { buttonVariants } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { LazyVideo } from "@/components/LazyVideo";
import { 
  MessageSquare, FileText, Factory, Truck, Wrench, Key, CreditCard, 
  CheckCircle2, Banknote, ShieldCheck, ClipboardList, ArrowRight, ArrowDown, Star, Clock
} from "lucide-react";

export const revalidate = 3600;

export default async function ProcessenPage() {
  const faqs = await getFaqItems().catch(() => []);

  const steps = [
    {
      num: 1,
      icon: MessageSquare,
      title: "Uforpligtende samtale",
      duration: "~1 uge",
      desc: "Vi starter med en indledende dialog, hvor vi afklarer dine ønsker, behov og budget. Her taler vi om placering af huset, størrelse, indretning og særlige ønsker som fx solceller eller helårsisolation.",
      highlight: "På baggrund af samtalen sender vi et konkret oplæg med plantegninger, pris og tidsplan."
    },
    {
      num: 2,
      icon: FileText,
      title: "Projektering og tilladelser",
      duration: "~4–8 uger",
      desc: "Vi står for alle de praktiske opgaver, så du slipper for bøvl og papirarbejde. Det betyder, at vi:",
      bullets: [
        "Indhenter byggetilladelse",
        "Koordinerer med myndigheder og forsyninger (el, vand, kloak)",
        "Udarbejder og godkender de endelige tegninger"
      ],
      highlight: "Kort sagt: vi sørger for, at alt det formelle er på plads, før dit hus bygges."
    },
    {
      num: 3,
      icon: Factory,
      title: "Produktion af huset",
      duration: "~3–4 uger",
      desc: "Når projektet er godkendt, går vi i gang med at bygge dit sommerhus på vores fabrik. Det sikrer:",
      bullets: [
        "Høj præcision og kvalitet under kontrollerede forhold",
        "Kortere byggetid sammenlignet med traditionelt byggeri",
        "Mindre spild og lavere CO₂-aftryk"
      ],
      highlight: "Sommerhuset kan rejses på få dage og står typisk klar til indflytning efter ca. 4 måneder."
    },
    {
      num: 4,
      icon: Wrench,
      title: "Klargøring af grunden",
      duration: "Parallelt med produktion",
      desc: "Samtidig med at huset bygges, sørger vi for, at din grund er klar til montagen. I samarbejde med lokale fagfolk etableres fundament, tilslutninger og eventuelle udearealer. Når huset er færdigt på fabrikken, står grunden klar til at modtage det."
    },
    {
      num: 5,
      icon: Truck,
      title: "Transport og montering",
      duration: "~3–5 dage",
      desc: "Dit hus leveres i elementer eller som en samlet enhed, afhængigt af projektets størrelse. Vores montører samler huset på din grund hurtigt og effektivt.",
      highlight: "Hele logistikken styres af os, så du kan være tryg i, at alt forløber gnidningsfrit."
    },
    {
      num: 6,
      icon: Key,
      title: "Aflevering og nøgle",
      duration: "Afleveringsdag",
      desc: "Inden indflytning gennemgår vi sommerhuset sammen med dig. Vi afleverer et fuldt færdigt og nøgleklart sommerhus, kvalitetssikret og klar til brug fra dag ét.",
      highlight: "Som ekstra tryghed tilbyder vi et gratis eftersyn 12 måneder efter afleveringen."
    },
    {
      num: 7,
      icon: CreditCard,
      title: "Tryg betaling i rater",
      duration: "Gennem hele forløbet",
      desc: "Med vores betalingsmodel betaler du i takt med, at arbejdet skrider frem. Du betaler rate for rate når faser er godkendt.",
      highlight: "På den måde betaler du kun for det, der allerede er leveret – ingen store forudbetalinger og ingen skjulte omkostninger."
    }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background border-t">
      {/* GLOBAL HERO FOR THE PAGE */}
      <div className="container mx-auto px-4 md:px-8 py-20 max-w-4xl text-center">
        <p className="text-sm font-medium tracking-[0.15em] text-primary uppercase mb-4">SÅDAN ARBEJDER VI</p>
        <h1 className="text-4xl md:text-5xl font-medium mb-6 text-foreground text-balance">Processen fra drøm til virkelighed</h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-2xl mx-auto">
          Et byggeprojekt skal ikke være uoverskueligt. Hos Ecohus har vi sat processen i system, så du trygt kan følge med fra første skridt til indflytning.
        </p>
      </div>

      <section className="py-24 bg-secondary border-b relative">
        {/* Subtle Blueprint grid background */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:24px_24px]"></div>
        
        <div className="container mx-auto px-4 md:px-8 relative z-10">
          <div className="max-w-4xl mx-auto flex flex-col pb-[30vh]">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div 
                  key={i} 
                  className="bg-background md:bg-background/95 md:backdrop-blur-3xl rounded-3xl border border-border/80 shadow-sm transition-all p-5 md:p-12 sticky mb-[40vh] h-[70vh] md:h-[450px] lg:h-[420px] flex flex-col justify-start overflow-hidden" 
                  style={{ top: `calc(15vh + ${i * 12}px)`, zIndex: i }}
                >
                  <div className="flex flex-col md:flex-row gap-5 md:gap-12">
                    <div className="shrink-0 flex flex-row items-center justify-between md:flex-col md:items-start md:w-32 border-b md:border-b-0 md:border-r border-border/40 pb-4 md:pb-0 md:pr-8">
                      <div className="w-12 h-12 md:w-16 md:h-16 rounded-xl md:rounded-2xl bg-[#2C5F3E] text-white flex items-center justify-center shadow-lg">
                        <Icon className="w-6 h-6 md:w-8 md:h-8" strokeWidth={1.5} />
                      </div>
                      <div className="text-right md:text-left mt-0 md:mt-4">
                        <span className="text-sm text-muted-foreground uppercase tracking-widest font-bold">Trin {step.num}</span>
                        <div className="text-sm font-semibold text-primary mt-0.5 md:mt-1 flex flex-col items-end md:items-start">
                          {step.duration}
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 mt-2 md:mt-0">
                      <h4 className="text-2xl font-bold mb-2 md:mb-4 text-foreground tracking-tight">{step.title}</h4>
                      <p className="text-muted-foreground leading-relaxed text-lg">{step.desc}</p>
                      {step.bullets && step.bullets.length > 0 && (
                        <ul className="mt-4 md:mt-6 grid gap-2 md:gap-3">
                          {step.bullets.map((bullet, bi) => (
                            <li key={bi} className="flex items-start gap-2 md:gap-3 text-muted-foreground text-[15px]">
                              <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5 text-primary mt-px shrink-0" strokeWidth={2} />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                      )}
                      {step.highlight && (
                         <div className="mt-4 md:mt-6 p-3 md:p-4 rounded-xl font-medium text-foreground border-l-4 border-primary bg-primary/5 text-[15px]">
                           {step.highlight}
                         </div>
                      )}
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* --- REMAINDER OF THE PAGE (Trust Badges updated) --- */}
      <section className="py-24 bg-muted border-b">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-medium">Hvorfor bygge med Ecohus?</h2>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8 text-center max-w-6xl mx-auto">
            {/* 1. Fast pris */}
            <div className="flex flex-col items-center gap-5 bg-background p-8 rounded-3xl shadow-sm border border-border/40 hover:shadow-md hover:-translate-y-1 hover:border-primary/30 transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Banknote className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h4 className="text-xl font-medium mb-2">Fast pris</h4>
                <p className="text-muted-foreground text-[15px] leading-relaxed">Ingen overraskelser undervejs. Prisen ligger fast fra aftalen er underskrevet.</p>
              </div>
            </div>
            
            {/* 2. Bygget i tørvejr */}
            <div className="flex flex-col items-center gap-5 bg-background p-8 rounded-3xl shadow-sm border border-border/40 hover:shadow-md hover:-translate-y-1 hover:border-primary/30 transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Factory className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h4 className="text-xl font-medium mb-2">Bygget i tørvejr</h4>
                <p className="text-muted-foreground text-[15px] leading-relaxed">Produceret indendørs under optimale forhold, hvilket fuldstændigt eliminerer risikoen for fugt under opførslen.</p>
              </div>
            </div>

            {/* 3. Hurtig levering */}
            <div className="flex flex-col items-center gap-5 bg-background p-8 rounded-3xl shadow-sm border border-border/40 hover:shadow-md hover:-translate-y-1 hover:border-primary/30 transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <Clock className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h4 className="text-xl font-medium mb-2">Hurtig levering</h4>
                <p className="text-muted-foreground text-[15px] leading-relaxed">Dit nøglefærdige sommerhus står klar på få måneder i stedet for de klassiske 1-2 år.</p>
              </div>
            </div>
            
            {/* 4. Hjælp til tilladelser */}
            <div className="flex flex-col items-center gap-5 bg-background p-8 rounded-3xl shadow-sm border border-border/40 hover:shadow-md hover:-translate-y-1 hover:border-primary/30 transition-all group">
              <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center group-hover:bg-primary/20 transition-colors">
                <ClipboardList className="w-8 h-8 text-primary" />
              </div>
              <div>
                <h4 className="text-xl font-medium mb-2">Hjælp til tilladelser</h4>
                <p className="text-muted-foreground text-[15px] leading-relaxed">Alt det kedelige papirarbejde klarer vores rådgivere for dig, så du slipper for bøvl.</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* FAQ */}
      {faqs && faqs.length > 0 && (
        <section className="py-24 bg-background">
          <div className="container mx-auto px-4 md:px-8 max-w-3xl">
            <h2 className="text-3xl md:text-4xl font-medium mb-12 text-center text-foreground">Ofte stillede spørgsmål</h2>
            <Accordion className="w-full">
              {faqs.map((faq: any) => (
                <AccordionItem key={faq._id} value={faq._id} className="border-b border-border/50 py-2">
                  <AccordionTrigger className="text-lg font-medium text-left hover:text-primary">{faq.question}</AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed text-base pt-2 pb-6">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              ))}
            </Accordion>
          </div>
        </section>
      )}

      {/* Video */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-8 max-w-4xl">
          <div className="text-center mb-10">
            <h2 className="text-3xl md:text-4xl font-medium mb-4 text-foreground">Se processen i praksis</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Fra fabrik til færdigt hus — se hvordan vi bygger og monterer dit Ecohus.
            </p>
          </div>
          <div className="rounded-2xl overflow-hidden shadow-xl border border-border/40">
            <LazyVideo
              src="/ecohus.mp4"
              className="w-full aspect-video"
            />
          </div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-[#2C5F3E] text-white">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
          <h2 className="text-4xl font-medium mb-6 text-white">Start din proces i dag</h2>
          <p className="text-lg text-white/80 mb-10 leading-relaxed max-w-2xl mx-auto">
            Den gennemsnitlige byggetid for et traditionelt sommerhus er over et år. Hos Ecohus er I fremme meget hurtigere og uden ubehagelige overraskelser.
          </p>
          <div className="flex flex-col sm:flex-row gap-4 justify-center">
            <Link 
              href="/kontakt" 
              className={cn(
                buttonVariants({ variant: "secondary", size: "lg" }), 
                "text-base px-10 h-14 font-medium shadow-xl hover:scale-105 transition-transform bg-white text-[#2C5F3E] hover:bg-white/90"
              )}
            >
              Bliv ringet op nu
            </Link>
            <Link 
              href="/plantegninger" 
              className={cn(
                buttonVariants({ variant: "outline", size: "lg" }), 
                "text-base px-10 h-14 font-medium border-white/40 text-white hover:bg-white/10"
              )}
            >
              Se vores modeller <ArrowRight className="ml-2 w-4 h-4" />
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
}
