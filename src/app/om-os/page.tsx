import Image from "next/image";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getSiteSettings, getTeamMembers } from "@/lib/sanity";

export const revalidate = 60;

export default async function OmOsPage() {
  const [settings, team] = await Promise.all([
    getSiteSettings().catch(() => null),
    getTeamMembers().catch(() => []),
  ]);

  const stats = [
    { label: settings?.stat_1_label || "Leverede huse", value: settings?.stat_1_value || "120+" },
    { label: settings?.stat_2_label || "Års erfaring", value: settings?.stat_2_value || "15" },
    { label: settings?.stat_3_label || "Garanti", value: settings?.stat_3_value || "10 år" },
  ];

  return (
    <div className="flex flex-col min-h-screen">
      {/* Hero */}
      <section className="bg-secondary py-20 md:py-32">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-3xl">
          <h1 className="text-4xl md:text-5xl lg:text-6xl font-medium mb-6 text-foreground">
            Om Ecohus
          </h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Vi bygger fremtidens sommerhuse. Med rødder i solidt dansk håndværk og moderne produktionsteknologi.
          </p>
        </div>
      </section>

      {/* Story */}
      <section className="py-20 bg-background">
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
              Vi går ikke på kompromis med kvaliteten. Hvert eneste Ecohus er bygget med fokus på bæredygtighed,
              gedigne materialer og et tidløst design, der ældes med ynde.
            </p>
          </div>
        </div>
      </section>

      {/* Stats */}
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

      {/* Team */}
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

      {/* CTA */}
      <section className="py-24 bg-secondary">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-2xl">
          <h2 className="text-3xl md:text-4xl font-medium mb-6 text-foreground">Skal vi bygge dit fristed?</h2>
          <p className="text-lg text-muted-foreground mb-10">
            Lad os tage en uforpligtende snak om dine muligheder.
          </p>
          <Link href="/kontakt" className={cn(buttonVariants({ size: "lg" }), "w-full sm:w-auto text-lg px-10 h-14 shadow-xl hover:scale-105 transition-transform")}>
            Book en gratis samtale
          </Link>
        </div>
      </section>
    </div>
  );
}
