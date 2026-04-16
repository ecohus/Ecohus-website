import { getSiteSettings, getHouseModels } from "@/lib/sanity";
import { ContactForm } from "@/components/ContactForm";
import { Mail, MapPin, Phone, Building2 } from "lucide-react";
import { Suspense } from "react";

export const revalidate = 3600;

export default async function KontaktPage() {
  const [settings, models] = await Promise.all([
    getSiteSettings().catch(() => null),
    getHouseModels().catch(() => []),
  ]);

  const contactInfo = {
    phone: settings?.phone || "+45 55 25 55 10",
    email: settings?.email || "kontakt@ecohus.dk",
    address: settings?.address || "Thrigesvej 37A, 7430 Ikast",
    company: settings?.company_name || "Ecohus",
  };

  const modelOptions = models.map((m: any) => ({ name: m.name }));

  return (
    <div className="flex flex-col min-h-screen bg-background border-t">
      <div className="container mx-auto px-4 md:px-8 py-16 md:py-24">
        <div className="text-center max-w-3xl mx-auto mb-20">
          <h1 className="text-4xl md:text-5xl font-medium mb-6 text-foreground">Lad os tage en snak</h1>
          <p className="text-lg md:text-xl text-muted-foreground leading-relaxed">
            Overvejer du at bygge et nyt sommerhus? Udfyld formularen nedenfor, så ringer vi dig op til en uforpligtende drøftelse af dine ønsker.
          </p>
        </div>

        <div className="flex flex-col lg:flex-row gap-16 max-w-6xl mx-auto">
          
          {/* Form Side */}
          <div className="flex-1 bg-background p-0 lg:pr-8">
            <h2 className="text-2xl font-medium mb-8">Send en besked</h2>
            <Suspense fallback={<div className="h-[400px] rounded-xl border-2 border-border/50 animate-pulse bg-muted/20" />}>
              <ContactForm models={modelOptions} />
            </Suspense>
          </div>

          {/* Info Side */}
          <div className="w-full lg:w-[400px] shrink-0">
            <div className="bg-secondary rounded-3xl p-8 sticky top-32 shadow-sm border border-border/50">
              <h2 className="text-2xl font-medium mb-8">Kontakt os direkte</h2>
              
              <div className="flex flex-col gap-8">
                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-primary shrink-0 border shadow-sm">
                    <Phone className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Telefon</h3>
                    <a href={`tel:${contactInfo.phone.replace(/\\s+/g,"")}`} className="text-muted-foreground hover:text-primary transition-colors text-lg">
                      {contactInfo.phone}
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">Hverdage kl. 09.00 - 15.00</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-primary shrink-0 border shadow-sm">
                    <Mail className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">E-mail</h3>
                    <a href={`mailto:${contactInfo.email}`} className="text-muted-foreground hover:text-primary transition-colors text-lg break-all">
                      {contactInfo.email}
                    </a>
                    <p className="text-sm text-muted-foreground mt-1">Vi svarer typisk indenfor 24 timer</p>
                  </div>
                </div>

                <div className="flex items-start gap-4">
                  <div className="w-12 h-12 rounded-full bg-background flex items-center justify-center text-primary shrink-0 border shadow-sm">
                    <Building2 className="w-5 h-5" />
                  </div>
                  <div>
                    <h3 className="font-medium text-foreground mb-1">Hovedkontor</h3>
                    <p className="text-foreground font-medium mb-1">{contactInfo.company}</p>
                    <address className="text-muted-foreground not-italic text-base leading-relaxed">
                      {contactInfo.address.split(",").map((line: string, i: number) => (
                        <span key={i} className="block">{line.trim()}</span>
                      ))}
                    </address>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
