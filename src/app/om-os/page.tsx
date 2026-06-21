import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSiteSettings, getTeamMembers } from "@/lib/sanity";
import { Leaf, Hammer, Lightbulb, ShieldCheck, Clock, Banknote } from "lucide-react";

export const revalidate = 60;

export default async function OmOsPage() {
  const [settings, team] = await Promise.all([
    getSiteSettings().catch(() => null),
    getTeamMembers().catch(() => []),
  ]);

  const stats = [
    { label: settings?.stat_1_label || "Leverede huse", value: settings?.stat_1_value || "15+" },
    { label: settings?.stat_2_label || "Års erfaring",  value: settings?.stat_2_value || "15"  },
    { label: settings?.stat_3_label || "Glade kunder",  value: settings?.stat_3_value || "15+" },
  ];

  const values = [
    {
      icon: ShieldCheck,
      title: "Lang levetid",
      img: "/galleri/eksterioer.png",
      desc: "Vores huse produceres indendørs under kontrollerede forhold med fokus på gedigne materialer og holdbare konstruktioner, så dit sommerhus kan stå smukt i generationer.",
    },
    {
      icon: Hammer,
      title: "Kvalitet",
      img: "/galleri/byggeprocess.png",
      desc: "Vi går ikke på kompromis. Hvert hus bygges med præcision og faglig stolthed – fra design og materialevalg til montering og finish. Alt kontrolleres og kvalitetssikres, så du får et produkt, der holder i mange år.",
    },
    {
      icon: Lightbulb,
      title: "Innovation",
      img: "/galleri/eksterioer-2.png",
      desc: "Vi kombinerer moderne arkitektur med avanceret produktionsteknologi. Vores byggeproces er effektiv og digitaliseret, så vi kan levere dit sommerhus smartere, hurtigere og med uovertruffen præcision.",
    },
  ];

  const reasons = [
    { icon: ShieldCheck, title: "Fast pris – ingen overraskelser", desc: "Prisen er låst fra kontrakten underskrives. Du ved præcis, hvad du betaler, fra dag ét." },
    { icon: Clock,       title: "Kort byggetid",                   desc: "Vores fabriksproduktion betyder, at dit hus typisk er klar til indflytning på ca. 4 måneder." },
    { icon: Banknote,    title: "Betaling i rater",                desc: "Du betaler kun i takt med fremgang. Ingen store forudbetalinger – fuld tryghed hele vejen." },
  ];

  return (
    <div className="flex flex-col min-h-screen">

      {/* 1 · Om Ecohus – Hero */}
      <section className="bg-secondary py-10 md:py-16">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6 text-foreground">
            Om Ecohus
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Vi bygger fremtidens sommerhuse. Med rødder i solidt dansk håndværk og moderne produktionsteknologi.
          </p>
        </div>
      </section>

      {/* 2 · Hvem er vi */}
      <section className="py-20 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-12 md:gap-20 items-center">
            <div>
              <h2 className="text-3xl md:text-4xl font-medium mb-6 text-foreground">Hvem er vi?</h2>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Med over 30 års erfaring i byggebranchen gør vi processen enkel og effektiv. Vi samarbejder med erfarne arkitekter og leverer præfabrikerede elementer direkte fra fabrikken, hvilket sparer både tid og penge.
              </p>
              <p className="text-muted-foreground leading-relaxed mb-5">
                Uanset om du skal bruge én bolig eller et helt projekt, hjælper vi dig med at realisere dit drømmehus, hurtigt og professionelt.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Vi tilbyder både færdige husdesigns og muligheden for at bygge ud fra dine egne tegninger. Ønsker du et helt unikt hjem, udvikler vi gerne et personligt design i tæt samarbejde med vores arkitekter.
              </p>
            </div>
            <div className="relative w-full aspect-[4/3] rounded-2xl overflow-hidden shadow-lg">
              <Image
                src="/om-os-image.png"
                alt="Ecohus - hvem er vi"
                fill
                className="object-cover object-top"
                sizes="(max-width: 768px) 100vw, 50vw"
              />
            </div>
          </div>
        </div>
      </section>

      {/* 3 · Mission quote */}
      <section className="py-20 bg-secondary">
        <div className="container mx-auto px-4 md:px-8 max-w-3xl">
          <div className="prose prose-lg mx-auto text-muted-foreground">
            <p className="text-2xl text-foreground font-medium mb-8 leading-relaxed italic border-l-4 border-primary pl-6">
              "Vores mission er at gøre det nemt og trygt at bygge et nyt sommerhus, uden ubehagelige overraskelser."
            </p>
            <p className="mb-6">
              Ecohus opstod ud fra en simpel idé: Hvorfor skal det være komplekst, langsommeligt og dyrt at bygge sommerhus?
              Ved at flytte byggeprocessen ind i tørre, kontrollerede fabriksrammer, har vi elimineret vejrbetingede
              forsinkelser og minimeret spild.
            </p>
            <p className="mb-6">
              Vores huse leveres færdigsamlede direkte til din grund. Det betyder, at vi kan sætte et hus op på få dage, og
              kort tid efter kan du holde ferie i dit nye fristed.
            </p>
            <p>
              Vi går ikke på kompromis med kvaliteten. Hvert eneste Ecohus er bygget med fokus på høj kvalitet,
              gedigne materialer og et tidløst design, der ældes med ynde.
            </p>
          </div>
        </div>
      </section>

      {/* 4 · Vores vision og værdier */}
      <section className="py-24 bg-background">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-4 text-foreground">Vores vision og værdier</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto leading-relaxed">
              Hos Ecohus stræber vi efter at skabe gennemtænkte og innovative boligkoncepter, der opfylder dine behov og holder i mange årtier. Vi arbejder ud fra tre kerneværdier.
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            {values.map((v) => (
              <div key={v.title} className="flex flex-col">
                <div className="relative w-full aspect-[4/3] rounded-xl overflow-hidden mb-6 shadow-sm">
                  <Image
                    src={v.img}
                    alt={v.title}
                    fill
                    className="object-cover"
                    sizes="(max-width: 768px) 100vw, 33vw"
                  />
                </div>
                <div className="flex items-center gap-2 mb-3">
                  <v.icon className="w-5 h-5 text-primary shrink-0" />
                  <h3 className="text-xl font-medium text-foreground">{v.title}</h3>
                </div>
                <p className="text-muted-foreground leading-relaxed text-sm">{v.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 5 · Stats */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-8">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 divide-y md:divide-y-0 md:divide-x divide-primary-foreground/20 text-center">
            {stats.map((stat, i) => (
              <div key={i} className="flex flex-col items-center pt-8 md:pt-0">
                <p className="text-5xl md:text-6xl font-medium mb-4">{stat.value}</p>
                <p className="text-lg text-primary-light uppercase tracking-wider font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* 6 · Hvorfor vælge Ecohus + Allan video */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-8 max-w-5xl">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-4xl font-medium mb-4 text-foreground">Hvorfor vælge Ecohus?</h2>
            <p className="text-muted-foreground text-lg max-w-xl mx-auto">
              Vi gør det enkelt, gennemsigtigt og trygt at investere i dit drømmehus.
            </p>
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-8">
            {reasons.map((r) => (
              <div key={r.title} className="bg-background rounded-2xl p-8 border border-border/50 shadow-sm flex flex-col gap-4">
                <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                  <r.icon className="w-6 h-6 text-primary" />
                </div>
                <h3 className="text-lg font-medium text-foreground">{r.title}</h3>
                <p className="text-muted-foreground text-sm leading-relaxed">{r.desc}</p>
              </div>
            ))}
          </div>

          {/* Allan 1x1 video */}
          <div className="mt-16 max-w-sm mx-auto">
            <div className="rounded-2xl overflow-hidden shadow-xl border border-border/40">
              <video
                src="/allan-1x1.mp4"
                controls
                playsInline
                className="w-full h-auto"
              />
            </div>
            <p className="text-center text-muted-foreground text-sm mt-4 italic">
              "Vi gør hele processen enkel og tryg — fra første samtale til nøgleoverdragelse."
            </p>
          </div>
        </div>
      </section>

      {/* 7 · Mød holdet (hidden) */}
      {false && (
      <section className="py-32 bg-background">
        <div className="container mx-auto px-4 md:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl md:text-4xl font-medium mb-6 text-foreground">Mød holdet bag Ecohus</h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Vi er et dedikeret team af tømrere, arkitekter og byggerådgivere,
              der alle brænder for at levere dit drømmehus.
            </p>
          </div>
          {team.length === 0 ? (
            <div className="w-full max-w-2xl mx-auto p-16 text-center bg-secondary rounded-2xl border border-dashed border-border text-muted-foreground font-medium text-lg">
              Medarbejdere tilføjes snart
            </div>
          ) : (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-10">
              {team.map((member: any) => (
                <div key={member._id} className="group text-center flex flex-col items-center">
                  <div className="relative w-48 h-48 mb-6 rounded-full overflow-hidden bg-secondary border-4 border-background shadow-md">
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground bg-secondary text-sm">
                      Billede
                    </div>
                  </div>
                  <h3 className="text-xl font-medium text-foreground mb-1">{member.name}</h3>
                  <p className="text-primary font-medium text-sm uppercase tracking-wide mb-4">{member.title}</p>
                  {member.bio && <p className="text-muted-foreground text-sm leading-relaxed max-w-xs">{member.bio}</p>}
                </div>
              ))}
            </div>
          )}
        </div>
      </section>
      )}

      {/* 8 · CTA */}
      <section className="py-24 bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-medium mb-6">Skal vi bygge dit fristed?</h2>
          <p className="text-lg opacity-90 mb-10 leading-relaxed">
            Lad os tage en uforpligtende snak om dine muligheder. Vi svarer inden for 24 timer.
          </p>
          <Link
            href="/kontakt"
            className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "w-full sm:w-auto text-lg px-10 h-14 shadow-xl hover:scale-105 transition-transform")}
          >
            Book en gratis samtale
          </Link>
        </div>
      </section>

    </div>
  );
}
