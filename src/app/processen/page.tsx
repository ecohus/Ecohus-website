import Link from "next/link";
import { getFaqItems } from "@/lib/sanity";
import { buttonVariants } from "@/components/ui/button";
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion";
import { cn } from "@/lib/utils";
import { CheckCircle2 } from "lucide-react";

export const revalidate = 3600;

export default async function ProcessenPage() {
  const faqs = await getFaqItems().catch(() => []);

  const steps = [
    { num: 1, title: "Samtale & valg", duration: "~1 uge", desc: "Vi tager en uforpligtende snak om dine muligheder. Sammen finder vi den rette husmodel og gennemgår mulige tilvalg og overflader, så det matcher dine drømme." },
    { num: 2, title: "Projektering & myndighedsbehandling", duration: "~4–8 uger", desc: "Vi står for indhentning af byggetilladelse hos kommunen, laver landmålerarbejde og faste tegninger. Du skal bare læne dig tilbage." },
    { num: 3, title: "Produktion i fabrikshal", duration: "~3–4 uger", desc: "Selve huset bygges fra bunden i vores lukkede, tørre produktion. Det sikrer høj kvalitet året rundt, helt uden risiko for fugtskader under byggeriet." },
    { num: 4, title: "Levering & opsætning", duration: "3 dage", desc: "Når huset er færdigt, køres det sikkert til din grund. Vores montagehold hejser det på plads, samler modulerne og sørger for at taget lukkes med det samme." },
    { num: 5, title: "Eftersyn & nøgleoverdragelse", duration: "Dag 4", desc: "Vi gennemgår huset sammen med dig, afleverer nøglerne og fejrer, at dit nye fristed er klar til brug." }
  ];

  return (
    <div className="flex flex-col min-h-screen bg-background border-t">
      <div className="container mx-auto px-4 md:px-8 py-20 max-w-4xl text-center">
        <h1 className="text-4xl md:text-5xl font-medium mb-6 text-foreground">Processen fra drøm til virkelighed</h1>
        <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
          Et byggeprojekt skal ikke være uoverskueligt. Hos Ecohus har vi sat processen i system, så du trygt kan følge med fra første skridt til indflytning.
        </p>
      </div>

      {/* Timeline */}
      <section className="py-12 relative max-w-4xl mx-auto px-4 md:px-8 w-full">
        <div className="absolute left-8 md:left-1/2 top-12 bottom-12 w-0.5 bg-border md:-translate-x-1/2 hidden sm:block" />
        
        <div className="flex flex-col gap-12 relative z-10">
          {steps.map((step, i) => (
            <div key={i} className={cn("flex flex-col sm:flex-row items-start sm:items-center gap-8 sm:gap-16", i % 2 !== 0 ? "sm:flex-row-reverse sm:text-right" : "")}>
              <div className="hidden sm:block sm:flex-1" />
              
              <div className="w-12 h-12 rounded-full bg-primary text-primary-foreground flex items-center justify-center font-medium text-lg shrink-0 z-10 shadow-md ring-8 ring-background mx-auto sm:mx-0">
                {step.num}
              </div>
              
              <div className="flex-1 bg-secondary p-8 rounded-2xl border shadow-sm relative w-full text-left">
                <div className="flex items-start sm:items-center justify-between gap-4 mb-4 flex-col xl:flex-row">
                  <h3 className="text-2xl font-medium text-foreground">{step.title}</h3>
                  <span className="bg-primary/10 text-primary px-3 py-1 rounded-full text-sm font-medium whitespace-nowrap">
                    {step.duration}
                  </span>
                </div>
                <p className="text-muted-foreground leading-relaxed text-left">{step.desc}</p>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Trust Badges */}
      <section className="py-24 bg-muted mt-20">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8 text-center max-w-4xl mx-auto">
            <div className="flex flex-col items-center gap-4 bg-background p-8 rounded-2xl shadow-sm border border-border/50">
              <CheckCircle2 className="w-10 h-10 text-primary" />
              <h4 className="text-xl font-medium">Fast pris</h4>
              <p className="text-muted-foreground text-sm">Ingen overraskelser undervejs. Prisen ligger fast fra aftalen er underskrevet.</p>
            </div>
            <div className="flex flex-col items-center gap-4 bg-background p-8 rounded-2xl shadow-sm border border-border/50">
              <CheckCircle2 className="w-10 h-10 text-primary" />
              <h4 className="text-xl font-medium">1-årig garanti</h4>
              <p className="text-muted-foreground text-sm">Vi gennemgår huset et år efter indflytning og retter eventuelle fejl og mangler gratis.</p>
            </div>
            <div className="flex flex-col items-center gap-4 bg-background p-8 rounded-2xl shadow-sm border border-border/50">
              <CheckCircle2 className="w-10 h-10 text-primary" />
              <h4 className="text-xl font-medium">Hjælp til tilladelser</h4>
              <p className="text-muted-foreground text-sm">Alt det kedelige papirarbejde klarer vores rådgivere for dig.</p>
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

      {/* CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
          <h2 className="text-4xl font-medium mb-6">Start din proces i dag</h2>
          <p className="text-lg opacity-90 mb-10 text-primary-light leading-relaxed">
            Den gennemsnitlige byggetid for et traditionelt sommerhus er over et år. Hos Ecohus er I fremme meget hurtigere.
          </p>
          <Link href="/kontakt" className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "text-lg px-10 h-14 font-medium shadow-xl hover:scale-105 transition-transform")}>
            Book en samtale nu
          </Link>
        </div>
      </section>

    </div>
  );
}
