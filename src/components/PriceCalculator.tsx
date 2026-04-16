"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { useSearchParams } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { calculatorLeadSchema } from "@/lib/validations";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { cn } from "@/lib/utils";
import { MOCK_MODELS } from "@/lib/mock-models";
import { CheckCircle2, ChevronRight, ChevronLeft, Loader2, AlertCircle, Home, BoxSelect, Droplets, ClipboardList, Lock, User } from "lucide-react";

type FormValues = z.infer<typeof calculatorLeadSchema>;

const ADDONS = [
  { id: "terrasse", title: "Overdækket terrasse (25m²)", price: 85000, desc: "Integreret overdækning i vinkel." },
  { id: "varmepumpe", title: "Luft/vand varmepumpe", price: 110000, desc: "Energivenlig og fremtidssikret opvarmning." },
  { id: "solceller", title: "Solcelleanlæg (6 kW)", price: 95000, desc: "Producer din egen strøm med skjulte paneler." },
  { id: "udekoekken", title: "Udekøkken integration", price: 45000, desc: "Klar til vand og afløb på terrassen." },
  { id: "smart_home", title: "Smart Home Pakke", price: 35000, desc: "Intelligent styring af lys og varme." },
  { id: "brændeovn", title: "Indbygningsbrændeovn", price: 42000, desc: "Centralt placeret for maksimal hygge." }
];

const FOUNDATIONS = [
  { id: "skrue", title: "Skruefundament", priceMin: 65000, priceMax: 95000, desc: "Hurtig, miljøvenlig og ingen jordvæk." },
  { id: "stoebt", title: "Støbt fundament", priceMin: 85000, priceMax: 150000, desc: "Traditionelt stribefundament (afhænger af jordbund)." },
  { id: "ved_ikke", title: "Jeg ved det ikke endnu", priceMin: 75000, priceMax: 120000, desc: "Vi regner med et gennemsnitligt fundament." }
];

export function PriceCalculator({ models: sanityModels }: { models: any[] }) {
  // Use mock fallback when Sanity has no models yet
  const models = sanityModels && sanityModels.length > 0 ? sanityModels : MOCK_MODELS;

  const searchParams = useSearchParams();

  const [step, setStep] = useState(1);
  const [selectedModelIndex, setSelectedModelIndex] = useState<number | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [selectedFoundation, setSelectedFoundation] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [isRevealed, setIsRevealed] = useState(false);

  // Pre-select model from URL param (e.g. ?model=61-150-v1)
  useEffect(() => {
    const modelSlug = searchParams.get("model");
    if (modelSlug) {
      const idx = models.findIndex((m: any) => m.slug?.current === modelSlug || m.name === modelSlug);
      if (idx !== -1) setSelectedModelIndex(idx);
    }
  }, [searchParams, models]);


  const model = selectedModelIndex !== null ? models[selectedModelIndex] : null;

  // Pricing calculations
  const basePrice = model?.price_from || 0;
  const addonsPrice = selectedAddons.reduce((acc, addonId) => {
    const addon = ADDONS.find((a) => a.id === addonId);
    return acc + (addon?.price || 0);
  }, 0);
  const foundation = FOUNDATIONS.find((f) => f.id === selectedFoundation) || FOUNDATIONS[2];

  const estimatedTotalMin = basePrice + addonsPrice + foundation.priceMin;
  const estimatedTotalMax = basePrice + addonsPrice + foundation.priceMax;

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(calculatorLeadSchema),
  });

  const onSubmitLead = async (data: FormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    const payload = {
      ...data,
      model_selected: model?.name || "Ingen",
      options: {
        addons: selectedAddons,
        foundation: selectedFoundation,
      },
      estimated_price_from: estimatedTotalMin,
      estimated_price_to: estimatedTotalMax,
    };

    try {
      const res = await fetch("/api/calculator-lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const err = await res.json();
        setServerError(err.error || "Der opstod en fejl");
      } else {
      setIsRevealed(true);
        setStep(5);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setServerError("Netværksfejl. Prøv igen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsConfig = [
    { title: "Model", icon: Home },
    { title: "Tilvalg", icon: BoxSelect },
    { title: "Fundament", icon: Droplets },
    { title: "Oplysninger", icon: User },
    { title: "Oversigt", icon: ClipboardList },
  ];

  // No more early isSuccess return — step 5 handles the summary

  return (
    <div className="flex flex-col md:flex-row min-h-[600px]">
      {/* Sidebar Navigation */}
      <div className="w-full md:w-64 bg-muted/40 p-6 md:p-8 border-r shrink-0 hidden sm:block">
        <div className="flex flex-col gap-8">
          {stepsConfig.map((s, i) => (
            <div key={i} className={cn("flex items-center gap-4 transition-colors", step > i + 1 ? "text-primary" : step === i + 1 ? "text-foreground font-medium" : "text-muted-foreground opacity-50")}>
              <div className={cn("w-10 h-10 rounded-full flex items-center justify-center shrink-0 border-2", step >= i + 1 ? "border-primary bg-primary/10" : "border-muted-foreground/30")}>
                <s.icon className="w-5 h-5" />
              </div>
              <span className="text-lg">{s.title}</span>
            </div>
          ))}
        </div>

        {/* Live Total — no blur, step-aware */}
        <div className="mt-auto pt-16">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Estimeret pris</p>
          {step === 4 ? (
            // Step 4: don't show the number, just prompt
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>Udfyld info</span>
            </div>
          ) : (
            <div className="text-2xl font-medium text-primary">
              {estimatedTotalMin > 0 ? (
                <>kr. {estimatedTotalMin.toLocaleString("da-DK")} <span className="opacity-50 text-base block mt-1">{step < 5 ? "+" : ""}</span></>
              ) : "—"}
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 md:p-12 flex flex-col">
        {/* Mobile Header indicator */}
        <div className="sm:hidden flex items-center justify-between mb-8 pb-4 border-b">
          <span className="font-medium text-primary">Trin {step} af 5: {stepsConfig[step - 1]?.title}</span>
          <span className="text-sm text-muted-foreground">{step < 4 ? `${estimatedTotalMin.toLocaleString("da-DK")} kr.` : step === 4 ? "Udfyld info" : ""}</span>
        </div>

        {serverError && (
          <div className="mb-6 p-4 bg-destructive/10 text-destructive rounded-lg border border-destructive/20 flex items-center gap-3">
            <AlertCircle className="w-5 h-5 shrink-0" />
            <p className="text-sm font-medium">{serverError}</p>
          </div>
        )}

        <div className="flex-1">
          {step === 1 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-medium mb-6">1. Vælg din basis model</h2>
              {models.length === 0 ? (
                <p className="text-muted-foreground">Ingen modeller fundet.</p>
              ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                  {models.map((m, idx) => (
                    <div
                      key={m._id}
                      onClick={() => setSelectedModelIndex(idx)}
                      className={cn(
                        "cursor-pointer rounded-2xl border-2 overflow-hidden transition-all hover:shadow-md",
                        selectedModelIndex === idx ? "border-primary ring-2 ring-primary/20" : "border-border/50 hover:border-primary/50"
                      )}
                    >
                      <div className="aspect-[16/10] bg-white relative flex items-center justify-center p-4">
                        {m.image_url ? (
                          <Image
                            src={m.image_url}
                            alt={m.name}
                            fill
                            className="object-contain p-3"
                            sizes="(max-width: 768px) 100vw, 300px"
                          />
                        ) : (
                          <div className="text-muted-foreground/30 text-sm">Plantegning</div>
                        )}
                      </div>
                      <div className="p-4 flex items-center justify-between bg-background">
                        <div>
                          <h3 className="font-medium text-lg text-foreground">{m.name}</h3>
                          <p className="text-sm text-muted-foreground">{m.size_m2} m² • fra {m.price_from?.toLocaleString("da-DK")} kr.</p>
                        </div>
                        <div className={cn("w-6 h-6 rounded-full border-2 flex items-center justify-center", selectedModelIndex === idx ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground")}>
                          {selectedModelIndex === idx && <CheckCircle2 className="w-4 h-4" />}
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          )}

          {step === 2 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-medium mb-2">2. Vælg tilvalg (valgfrit)</h2>
              <p className="text-muted-foreground mb-8">Markér de tilvalg du foretrækker for at justere det samlede prisoverslag.</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {ADDONS.map((addon) => {
                  const isSelected = selectedAddons.includes(addon.id);
                  return (
                    <div 
                      key={addon.id}
                      onClick={() => {
                        if (isSelected) {
                          setSelectedAddons(selectedAddons.filter((id) => id !== addon.id));
                        } else {
                          setSelectedAddons([...selectedAddons, addon.id]);
                        }
                      }}
                      className={cn(
                        "cursor-pointer p-5 rounded-2xl border-2 transition-all flex items-start gap-4",
                        isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/40 bg-background"
                      )}
                    >
                      <div className={cn("w-6 h-6 rounded-md border-2 shrink-0 flex items-center justify-center mt-0.5", isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/50")}>
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div>
                        <h3 className="font-medium text-foreground mb-1">{addon.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-3">{addon.desc}</p>
                        <p className="text-sm font-medium text-primary">+ kr. {addon.price.toLocaleString("da-DK")}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 3 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-medium mb-2">3. Vælg fundament</h2>
              <p className="text-muted-foreground mb-8">Et sommerhus kræver et solidt fundament. Typen afhænger ofte af grunden.</p>
              <div className="flex flex-col gap-4 max-w-2xl">
                {FOUNDATIONS.map((f) => {
                  const isSelected = selectedFoundation === f.id;
                  return (
                    <div 
                      key={f.id}
                      onClick={() => setSelectedFoundation(f.id)}
                      className={cn(
                        "cursor-pointer p-6 rounded-2xl border-2 transition-all flex items-center gap-6",
                        isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/40 bg-background"
                      )}
                    >
                      <div className={cn("w-6 h-6 rounded-full border-2 shrink-0 flex items-center justify-center", isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/50")}>
                        {isSelected && <div className="w-2.5 h-2.5 bg-background rounded-full" />}
                      </div>
                      <div className="flex-1">
                        <h3 className="font-medium text-lg text-foreground">{f.title}</h3>
                        <p className="text-sm text-muted-foreground">{f.desc}</p>
                      </div>
                      <div className="text-right shrink-0 hidden sm:block">
                        <p className="text-sm text-muted-foreground">Estimeret</p>
                        <p className="font-medium text-foreground">{f.priceMin.toLocaleString("da-DK")} - {f.priceMax.toLocaleString("da-DK")} kr.</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-lg">
              <h2 className="text-2xl font-medium mb-2">4. Dine oplysninger</h2>
              <p className="text-muted-foreground mb-8">
                Udfyld dine kontaktoplysninger for at modtage dit prisoverslag.
              </p>

              <form onSubmit={handleSubmit(onSubmitLead)} className="space-y-4 bg-background border p-7 rounded-2xl shadow-sm mb-8">
                <div className="space-y-1.5">
                  <Label htmlFor="calc-name">Navn</Label>
                  <Input id="calc-name" placeholder="Jens Jensen" {...register("name")} disabled={isSubmitting} />
                  {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="calc-email">E-mail</Label>
                  <Input id="calc-email" type="email" placeholder="jens@example.com" {...register("email")} disabled={isSubmitting} />
                  {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
                </div>
                <div className="space-y-1.5">
                  <Label htmlFor="calc-phone">Telefon</Label>
                  <Input id="calc-phone" type="tel" placeholder="+45 12 34 56 78" {...register("phone")} disabled={isSubmitting} />
                  {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
                </div>
                <Button type="submit" size="lg" className="w-full text-base h-12 mt-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Behandler...</>
                  ) : (
                    <>Se dit prisoverslag <ChevronRight className="w-5 h-5 ml-2" /></>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center pt-1">
                  Ingen forpligtelser · Vi kontakter dig inden for 1–2 hverdage
                </p>
              </form>

              {/* Blurred price teaser — creates suspense */}
              {estimatedTotalMin > 0 && (
                <div className="bg-primary/8 border border-primary/25 rounded-2xl p-6 relative overflow-hidden">
                  <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">Din estimerede pakke</p>
                  <div className="relative">
                    <div className="text-4xl font-bold text-primary blur-lg select-none pointer-events-none leading-none">
                      kr. {estimatedTotalMin.toLocaleString("da-DK")}–{estimatedTotalMax.toLocaleString("da-DK")}
                    </div>
                    <div className="absolute inset-0 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm font-semibold text-primary">Udfyld info for at se din pris</span>
                    </div>
                  </div>
                  <p className="text-xs text-primary/60 mt-4">Ekskl. grundkøb og tinglysning</p>
                  {/* Decorative green shimmer */}
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                </div>
              )}
            </div>
          )}

          {step === 5 && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-medium leading-tight">Tak! Her er din oversigt</h2>
                  <p className="text-muted-foreground text-sm">Vi kontakter dig inden for 1–2 hverdage</p>
                </div>
              </div>

              <div className="bg-secondary rounded-2xl border p-7 mb-6">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-5">Din konfiguration</h3>
                <div className="flex flex-col divide-y divide-border/50">
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="font-medium text-foreground">{model?.name}</span>
                    <span className="font-medium text-foreground tabular-nums whitespace-nowrap">kr. {basePrice.toLocaleString("da-DK")}</span>
                  </div>
                  {selectedAddons.map(id => {
                    const addon = ADDONS.find(a => a.id === id);
                    return (
                      <div key={id} className="flex items-center justify-between gap-4 py-3">
                        <span className="text-sm text-muted-foreground">+ {addon?.title}</span>
                        <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">kr. {addon?.price.toLocaleString("da-DK")}</span>
                      </div>
                    );
                  })}
                  <div className="flex items-center justify-between gap-4 py-3">
                    <span className="text-sm text-muted-foreground">{foundation.title}</span>
                    <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">kr. {foundation.priceMin.toLocaleString("da-DK")}–{foundation.priceMax.toLocaleString("da-DK")}</span>
                  </div>
                </div>

                {/* Revealed total */}
                <div className="mt-5 pt-5 border-t flex items-center justify-between gap-4">
                  <span className="text-lg font-medium text-foreground">Estimeret total</span>
                  <span className="text-xl font-semibold text-primary tabular-nums whitespace-nowrap">
                    kr. {estimatedTotalMin.toLocaleString("da-DK")}–{estimatedTotalMax.toLocaleString("da-DK")}
                  </span>
                </div>
                <p className="text-xs text-muted-foreground mt-2 text-right">Uforpligtende estimat · ekskl. grundkøb og tinglysning</p>
              </div>

              <Button size="lg" className="w-full sm:w-auto" onClick={() => window.location.href = "/"}>
                Gå til forsiden
              </Button>
            </div>
          )}



        </div>

        {/* Form Navigation — only visible on steps 1–3 */}
        {step <= 3 && (
          <div className="mt-12 flex items-center justify-between border-t pt-6">
            <Button
              variant="ghost"
              onClick={() => setStep((s) => Math.max(1, s - 1))}
              disabled={step === 1 || isSubmitting}
              className={step === 1 ? "invisible" : ""}
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Tilbage
            </Button>

            <Button
              size="lg"
              className="px-8 shadow-sm"
              onClick={() => {
                if (step === 1 && selectedModelIndex === null) {
                  alert("Vælg venligst en model først.");
                  return;
                }
                if (step === 3 && selectedFoundation === null) {
                  alert("Vælg venligst en fundamentstype.");
                  return;
                }
                setStep((s) => Math.min(5, s + 1));
              }}
            >
              Næste Trin
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {step === 4 && (
          <div className="mt-8 flex items-center border-t pt-6">
            <Button
              variant="ghost"
              onClick={() => setStep(3)}
              disabled={isSubmitting}
            >
              <ChevronLeft className="w-5 h-5 mr-1" />
              Tilbage
            </Button>
          </div>
        )}

      </div>
    </div>
  );
}
