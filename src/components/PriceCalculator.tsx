"use client";

import { useState, useEffect, useRef } from "react";
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
import { ADDONS, FOUNDATIONS, type AddonOption } from "@/lib/spec";
import { CheckCircle2, ChevronRight, ChevronLeft, Loader2, AlertCircle, Home, BoxSelect, Droplets, ClipboardList, Lock, User, Phone } from "lucide-react";

type FormValues = z.infer<typeof calculatorLeadSchema>;

const CUSTOM_ROOFS = [
  { id: "ensidig", title: "Ensidet hældning", desc: "Moderne og stilrent look." },
  { id: "saddeltag", title: "Saddeltag", desc: "Klassisk sommerhus-følelse." },
  { id: "fladt", title: "Fladt tag", desc: "Minimalistisk og funktionelt." }
];

const CUSTOM_TIERS = [
  { id: "budget", title: "Budget / Lavstandard", desc: "Fokus på de mest nødvendige løsninger." },
  { id: "standard", title: "Standard", desc: "Vores anbefalede, langtidsholdbare løsning." },
  { id: "premium", title: "Premium / Højstandard", desc: "Eksklusive materialer og detaljer overalt." }
];

export function PriceCalculator({ models: sanityModels }: { models: any[] }) {
  // Use mock fallback when Sanity has no models yet
  const models = sanityModels && sanityModels.length > 0 ? sanityModels : MOCK_MODELS;

  const searchParams = useSearchParams();
  const containerRef = useRef<HTMLDivElement>(null);

  const [step, setStep] = useState(1);
  const [isCustomBuild, setIsCustomBuild] = useState(false);
  const [customM2, setCustomM2] = useState<string>("");
  const [customFile, setCustomFile] = useState<File | null>(null);
  const [selectedRoof, setSelectedRoof] = useState<string | null>(null);
  const [selectedTier, setSelectedTier] = useState<string | null>(null);
  const [selectedModelIndex, setSelectedModelIndex] = useState<number | null>(null);
  const [selectedAddons, setSelectedAddons] = useState<string[]>([]);
  const [addonAreas, setAddonAreas] = useState<Record<string, number>>({});
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

  const prevStep = useRef(step);

  // Scroll to top of section on step change, but skip initial load (and strict mode double invoke)
  useEffect(() => {
    if (prevStep.current !== step) {
      prevStep.current = step;
      if (containerRef.current) {
        const y = containerRef.current.getBoundingClientRect().top + window.scrollY - 100;
        window.scrollTo({ top: y, behavior: "smooth" });
      }
    }
  }, [step]);

  const model = selectedModelIndex !== null ? models[selectedModelIndex] : null;

  // Pricing calculations — everything is a "fra"-pris / estimate.
  const basePrice = model?.price_from || 0;
  const addonsPrice = selectedAddons.reduce((acc, addonId) => {
    const addon = ADDONS.find((a) => a.id === addonId);
    if (!addon) return acc;
    if (addon.pricePerM2) return acc + addon.pricePerM2 * (addonAreas[addonId] || 0);
    if (addon.custom) return acc; // priced individually — not part of the estimate
    return acc + (addon.price || 0);
  }, 0);
  // Foundation is informational only — a standard cast foundation is included
  // in the price, so the choice does not change the estimate.
  const foundation = FOUNDATIONS.find((f) => f.id === selectedFoundation) || FOUNDATIONS[0];

  const estimatedTotal = basePrice + addonsPrice;
  // True when the selection contains tilvalg priced by area or individually.
  const hasVariableAddon = selectedAddons.some((id) => {
    const a = ADDONS.find((x) => x.id === id);
    return !!a && (a.custom || (!!a.pricePerM2 && !(addonAreas[id] > 0)));
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<FormValues>({
    resolver: zodResolver(calculatorLeadSchema),
    defaultValues: {
      name: "",
      email: "",
      phone: "",
      call_consent: false,
    },
  });

  const onSubmitLead = async (data: FormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    const formData = new FormData();
    formData.append("name", data.name);
    formData.append("email", data.email);
    formData.append("phone", data.phone);
    formData.append("call_consent", data.call_consent.toString());
    formData.append("is_custom_build", isCustomBuild.toString());
    
    if (isCustomBuild) {
      if (customM2) formData.append("custom_m2", customM2);
      if (selectedRoof) formData.append("custom_roof", selectedRoof);
      if (selectedTier) formData.append("custom_tier", selectedTier);
      if (selectedFoundation) formData.append("options", JSON.stringify({ foundation: selectedFoundation }));
      if (customFile) formData.append("file", customFile);
    } else {
      const modelLabel = model?.display_name ? `${model.display_name} (${model.name})` : model?.name;
      formData.append("model_selected", modelLabel || "Ingen");
      formData.append("options", JSON.stringify({ addons: selectedAddons, foundation: selectedFoundation }));
      formData.append("estimated_price_from", estimatedTotal.toString());
      formData.append("estimated_price_to", estimatedTotal.toString());
    }

    try {
      const res = await fetch("/api/calculator-lead", {
        method: "POST",
        body: formData,
      });

      if (!res.ok) {
        const err = await res.json();
        setServerError(err.error || "Der opstod en fejl");
      } else {
      setIsRevealed(true);
        setStep(isCustomBuild ? 6 : 5);
        window.scrollTo({ top: 0, behavior: "smooth" });
      }
    } catch {
      setServerError("Netværksfejl. Prøv igen.");
    } finally {
      setIsSubmitting(false);
    }
  };

  const stepsConfig = isCustomBuild ? [
    { title: "Plantegning", icon: Home },
    { title: "Fundament", icon: Droplets },
    { title: "Tag-type", icon: BoxSelect },
    { title: "Prisklasse", icon: BoxSelect },
    { title: "Oplysninger", icon: User },
    { title: "Oversigt", icon: ClipboardList },
  ] : [
    { title: "Model", icon: Home },
    { title: "Tilvalg", icon: BoxSelect },
    { title: "Fundament", icon: Droplets },
    { title: "Oplysninger", icon: User },
    { title: "Oversigt", icon: ClipboardList },
  ];

  // No more early isSuccess return — step 5 handles the summary

  return (
    <div ref={containerRef} className="flex flex-col md:flex-row min-h-[600px]">
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

        {/* Live Total — hidden until step 5 */}
        <div className="mt-auto pt-16">
          <p className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-2">Estimeret pris</p>
          {(isCustomBuild ? step < 6 : step < 5) ? (
            <div className="flex items-center gap-1.5 text-muted-foreground text-sm font-medium">
              <Lock className="w-3.5 h-3.5" />
              <span>Estimat beregnes</span>
            </div>
          ) : (
            <div className="text-2xl font-medium text-primary">
              {isCustomBuild ? (
                <span className="text-base text-muted-foreground">Beregnes individuelt</span>
              ) : estimatedTotal > 0 ? (
                <>fra kr. {estimatedTotal.toLocaleString("da-DK")}</>
              ) : "—"}
            </div>
          )}
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-6 md:p-12 flex flex-col">
        {/* Mobile Header indicator */}
        <div className="sm:hidden flex items-center justify-between mb-8 pb-4 border-b">
          <span className="font-medium text-primary">Trin {step} af {isCustomBuild ? 6 : 5}: {stepsConfig[step - 1]?.title}</span>
          <span className="text-sm text-muted-foreground">{(isCustomBuild ? step < 6 : step < 5) ? (
            <span className="flex items-center gap-1"><Lock className="w-3 h-3"/> Beregnes</span>
          ) : ""}</span>
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
              <div className="flex bg-muted/50 p-1.5 rounded-xl mb-8 max-w-fit mx-auto sm:mx-0">
                <button 
                  onClick={() => { setIsCustomBuild(false); setStep(1); }} 
                  className={cn("px-5 py-2.5 rounded-lg text-sm font-medium transition-all", !isCustomBuild ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                >
                  Vores Modeller
                </button>
                <button 
                  onClick={() => { setIsCustomBuild(true); setStep(1); }} 
                  className={cn("px-5 py-2.5 rounded-lg text-sm font-medium transition-all", isCustomBuild ? "bg-background shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground")}
                >
                  Egen Plantegning
                </button>
              </div>

              {!isCustomBuild ? (
                <>
                  <h2 className="text-2xl font-medium mb-6">1. Vælg din basis model</h2>
                  {models.length === 0 ? (
                    <p className="text-muted-foreground">Ingen modeller fundet.</p>
                  ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4">
                      {models.map((m: any, idx: number) => (
                        <div
                          key={m._id || idx}
                          onClick={() => {
                            setSelectedModelIndex(idx);
                            setTimeout(() => setStep(2), 250);
                          }}
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
                              <h3 className="font-medium text-lg text-foreground">
                                {m.display_name || m.name}
                                {m.display_name && <span className="text-muted-foreground font-normal text-sm ml-2">{m.name}</span>}
                              </h3>
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
                </>
              ) : (
                <>
                  <h2 className="text-2xl font-medium mb-2">1. Upload din plantegning</h2>
                  <p className="text-muted-foreground mb-8">Vedhæft et billede eller en PDF af din plantegning, og angiv cirka hvor mange kvadratmeter huset er.</p>
                  
                  <div className="space-y-6 max-w-lg">
                    <div className="space-y-2">
                      <Label htmlFor="custom-file" className="text-base">Upload skitse / plantegning (valgfrit)</Label>
                      <div className="mt-2 flex items-center gap-4">
                        <Input 
                          id="custom-file" 
                          type="file" 
                          accept="image/*,.pdf"
                          onChange={(e) => setCustomFile(e.target.files?.[0] || null)}
                          className="file:bg-primary/10 file:text-primary file:border-0 file:rounded-md file:px-4 file:py-1 file:mr-4 file:font-medium file:cursor-pointer"
                        />
                      </div>
                      {customFile && <p className="text-sm text-primary mt-2">Valgt fil: {customFile.name}</p>}
                    </div>

                    <div className="space-y-2 pt-4">
                      <Label htmlFor="custom-m2" className="text-base">Forventet størrelse (m²)</Label>
                      <div className="relative">
                        <Input 
                          id="custom-m2" 
                          type="number" 
                          placeholder="F.eks. 120" 
                          value={customM2}
                          onChange={(e) => setCustomM2(e.target.value)}
                          className="pl-4 pr-12 text-lg h-12"
                        />
                        <div className="absolute inset-y-0 right-4 flex items-center text-muted-foreground">m²</div>
                      </div>
                    </div>
                  </div>
                </>
              )}
            </div>
          )}

          {step === 2 && !isCustomBuild && (
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
                        if (isSelected) setSelectedAddons(selectedAddons.filter((id) => id !== addon.id));
                        else setSelectedAddons([...selectedAddons, addon.id]);
                      }}
                      className={cn(
                        "cursor-pointer p-5 rounded-2xl border-2 transition-all flex items-start gap-4",
                        isSelected ? "border-primary bg-primary/5 shadow-sm" : "border-border hover:border-primary/40 bg-background"
                      )}
                    >
                      <div className={cn("w-6 h-6 rounded-md border-2 shrink-0 flex items-center justify-center mt-0.5", isSelected ? "border-primary bg-primary text-primary-foreground" : "border-muted-foreground/50")}>
                        {isSelected && <CheckCircle2 className="w-4 h-4" />}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-foreground mb-1 break-words hyphens-auto">{addon.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-1">{addon.desc}</p>
                        {isSelected && addon.pricePerM2 && (
                          <div className="mt-3 flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                            <Label htmlFor={`area-${addon.id}`} className="text-xs text-muted-foreground">Antal m²</Label>
                            <Input
                              id={`area-${addon.id}`}
                              type="number"
                              min={0}
                              inputMode="numeric"
                              placeholder="0"
                              value={addonAreas[addon.id] ?? ""}
                              onChange={(e) => setAddonAreas((prev) => ({ ...prev, [addon.id]: Math.max(0, Number(e.target.value) || 0) }))}
                              className="h-9 w-24"
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(step === 3 && !isCustomBuild) || (step === 2 && isCustomBuild) ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-medium mb-2">{isCustomBuild ? "2" : "3"}. Vælg fundament</h2>
              <p className="text-muted-foreground mb-8">Et almindeligt støbt fundament er inkluderet i standardprisen. Dit valg påvirker ikke estimatet — det er bare godt at få afklaret inden samtalen.</p>
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
                    </div>
                  );
                })}
              </div>
            </div>
          ) : null}

          {step === 3 && isCustomBuild && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-medium mb-2">3. Tag-type</h2>
              <p className="text-muted-foreground mb-8">Vælg den type tag du ønsker til dit byggeri.</p>
              <div className="flex flex-col gap-4 max-w-2xl">
                {CUSTOM_ROOFS.map((f) => {
                  const isSelected = selectedRoof === f.id;
                  return (
                    <div 
                      key={f.id}
                      onClick={() => setSelectedRoof(f.id)}
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
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {step === 4 && isCustomBuild && (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <h2 className="text-2xl font-medium mb-2">4. Prisklasse</h2>
              <p className="text-muted-foreground mb-8">Vælg den overordnede kvalitet/prisklasse for materialer og finish.</p>
              <div className="flex flex-col gap-4 max-w-2xl">
                {CUSTOM_TIERS.map((f) => {
                  const isSelected = selectedTier === f.id;
                  return (
                    <div 
                      key={f.id}
                      onClick={() => setSelectedTier(f.id)}
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
                    </div>
                  );
                })}
              </div>
            </div>
          )}

          {(step === 4 && !isCustomBuild) || (step === 5 && isCustomBuild) ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500 max-w-lg">
              <h2 className="text-2xl font-medium mb-2">{isCustomBuild ? "5" : "4"}. Dine oplysninger</h2>
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
                <div className="space-y-1.5 pt-1">
                  <label htmlFor="calc-consent" className="flex items-start gap-3 cursor-pointer">
                    <input
                      id="calc-consent"
                      type="checkbox"
                      {...register("call_consent")}
                      disabled={isSubmitting}
                      className="mt-1 h-4 w-4 shrink-0 rounded border-2 border-muted-foreground/50 text-primary accent-primary cursor-pointer"
                    />
                    <span className="text-sm text-muted-foreground leading-relaxed">
                      Ja tak, I må gerne ringe mig op for at give mig et specifikt tilbud.
                    </span>
                  </label>
                  {errors.call_consent && <p className="text-sm text-destructive">{errors.call_consent.message}</p>}
                </div>
                <Button type="submit" size="lg" className="w-full text-base h-12 mt-2" disabled={isSubmitting}>
                  {isSubmitting ? (
                    <><Loader2 className="w-5 h-5 mr-2 animate-spin" /> Behandler...</>
                  ) : (
                    <>Se dit prisoverslag <ChevronRight className="w-5 h-5 ml-2" /></>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center pt-1">
                  Ingen forpligtelser · Vi ringer dig op inden for 2 hverdage med et specifikt tilbud
                </p>
              </form>

              {/* Blurred price teaser */}
              {!isCustomBuild && estimatedTotal > 0 && (
                <div className="bg-primary/8 border border-primary/25 rounded-2xl p-6 relative overflow-hidden">
                  <p className="text-xs font-medium text-primary uppercase tracking-widest mb-3">Din estimerede pakke</p>
                  <div className="relative">
                    <div className="text-4xl font-bold text-primary blur-lg select-none pointer-events-none leading-none">
                      kr. 1.234.567–1.890.123
                    </div>
                    <div className="absolute inset-0 flex items-center gap-2">
                      <Lock className="w-4 h-4 text-primary shrink-0" />
                      <span className="text-sm font-semibold text-primary">Udfyld info for at se din pris</span>
                    </div>
                  </div>
                  <p className="text-xs text-primary/60 mt-4">Ekskl. grundkøb og tinglysning</p>
                  <div className="absolute -right-8 -top-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl pointer-events-none" />
                </div>
              )}
            </div>
          ) : null}

          {(step === 5 && !isCustomBuild) || (step === 6 && isCustomBuild) ? (
            <div className="animate-in fade-in slide-in-from-right-4 duration-500">
              <div className="flex items-center gap-3 mb-8">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <CheckCircle2 className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <h2 className="text-2xl font-medium leading-tight">Tak! Her er dit estimat</h2>
                  <p className="text-muted-foreground text-sm">Vi ringer dig op inden for 2 hverdage med et specifikt tilbud</p>
                </div>
              </div>

              <div className="bg-secondary rounded-2xl border p-7 mb-6">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-5">Din konfiguration</h3>
                <div className="flex flex-col divide-y divide-border/50">
                  {isCustomBuild ? (
                    <>
                      <div className="flex items-center justify-between gap-4 py-3">
                        <span className="font-medium text-foreground">Byg Selv - Egen plantegning</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 py-3">
                        <span className="text-sm text-muted-foreground">Kvadratmeter</span>
                        <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">{customM2 || "Ikke angivet"} m²</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 py-3">
                        <span className="text-sm text-muted-foreground">Tag-type</span>
                        <span className="text-sm text-muted-foreground">{CUSTOM_ROOFS.find(r => r.id === selectedRoof)?.title || "Ikke valgt"}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 py-3">
                        <span className="text-sm text-muted-foreground">Prisklasse</span>
                        <span className="text-sm text-muted-foreground">{CUSTOM_TIERS.find(t => t.id === selectedTier)?.title || "Ikke valgt"}</span>
                      </div>
                      <div className="flex items-center justify-between gap-4 py-3">
                        <span className="text-sm text-muted-foreground">Fundament</span>
                        <span className="text-sm text-muted-foreground">{FOUNDATIONS.find(f => f.id === selectedFoundation)?.title || "Ikke valgt"}</span>
                      </div>
                    </>
                  ) : (
                    <>
                      <div className="flex items-center justify-between gap-4 py-3">
                        <span className="font-medium text-foreground">
                          {model?.display_name || model?.name}
                          <span className="block text-xs text-muted-foreground font-normal">Inkl. standardopbygning, varmepumpe og støbt fundament</span>
                        </span>
                        <span className="font-medium text-foreground tabular-nums whitespace-nowrap">Fra kr. {basePrice.toLocaleString("da-DK")}</span>
                      </div>
                      {selectedAddons.map(id => {
                        const addon = ADDONS.find(a => a.id === id);
                        if (!addon) return null;
                        let amount: string;
                        if (addon.pricePerM2) {
                          const m2 = addonAreas[id] || 0;
                          amount = m2 > 0
                            ? `Fra kr. ${(addon.pricePerM2 * m2).toLocaleString("da-DK")} (${m2} m²)`
                            : `Fra ${addon.pricePerM2.toLocaleString("da-DK")} kr./m²`;
                        } else if (addon.custom) {
                          amount = "Pris oplyses";
                        } else {
                          amount = `Fra kr. ${(addon.price ?? 0).toLocaleString("da-DK")}`;
                        }
                        return (
                          <div key={id} className="flex items-center justify-between gap-4 py-3">
                            <span className="text-sm text-muted-foreground">+ {addon.title}</span>
                            <span className="text-sm text-muted-foreground tabular-nums whitespace-nowrap">{amount}</span>
                          </div>
                        );
                      })}
                      <div className="flex items-center justify-between gap-4 py-3">
                        <span className="text-sm text-muted-foreground">Fundament</span>
                        <span className="text-sm text-muted-foreground whitespace-nowrap">{foundation.title}</span>
                      </div>
                    </>
                  )}
                </div>

                {/* Revealed total */}
                {!isCustomBuild ? (
                  <div className="mt-5 pt-5 border-t flex items-center justify-between gap-4">
                    <span className="text-lg font-medium text-foreground">Estimeret pris fra</span>
                    <span className="text-xl font-semibold text-primary tabular-nums whitespace-nowrap">
                      kr. {estimatedTotal.toLocaleString("da-DK")}
                    </span>
                  </div>
                ) : (
                  <div className="mt-5 pt-5 border-t flex items-center justify-between gap-4">
                    <span className="text-lg font-medium text-foreground">Estimeret total</span>
                    <span className="text-sm font-medium text-primary">Beregnes individuelt</span>
                  </div>
                )}
                {!isCustomBuild && hasVariableAddon && (
                  <p className="text-xs text-muted-foreground mt-2 text-right">+ tilvalg, der prissættes efter areal eller individuelt</p>
                )}
                <p className="text-xs text-muted-foreground mt-2 text-right">Vejledende fra-priser · uforpligtende estimat · ekskl. grundkøb og tinglysning</p>
              </div>

              <div className="bg-primary/8 border border-primary/25 rounded-2xl p-6 mb-6 flex items-start gap-4">
                <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center shrink-0">
                  <Phone className="w-5 h-5 text-primary" />
                </div>
                <div>
                  <p className="font-medium text-foreground">Vi ringer dig op inden for 2 hverdage med et specifikt tilbud</p>
                  <p className="text-sm text-muted-foreground mt-1">
                    Ovenstående er et uforpligtende estimat. En af vores rådgivere kontakter dig på telefon for at gennemgå dine ønsker og give dig et konkret, personligt tilbud.
                  </p>
                </div>
              </div>

              <Button size="lg" className="w-full sm:w-auto" onClick={() => window.location.href = "/"}>
                Gå til forsiden
              </Button>
            </div>
          ) : null}
        </div>

        {/* Form Navigation — only visible on steps 1–(4 or 5) */}
        {(isCustomBuild ? step <= 4 : step <= 3) && (
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
                if (!isCustomBuild) {
                  if (step === 1 && selectedModelIndex === null) {
                    alert("Vælg venligst en model først.");
                    return;
                  }
                  if (step === 3 && selectedFoundation === null) {
                    alert("Vælg venligst en fundamentstype.");
                    return;
                  }
                } else {
                  if (step === 1 && !customM2) {
                    alert("Indtast venligst kvadratmeter.");
                    return;
                  }
                  if (step === 2 && selectedFoundation === null) {
                    alert("Vælg venligst en fundamentstype.");
                    return;
                  }
                  if (step === 3 && selectedRoof === null) {
                    alert("Vælg venligst en tag-type.");
                    return;
                  }
                  if (step === 4 && selectedTier === null) {
                    alert("Vælg venligst en prisklasse.");
                    return;
                  }
                }
                setStep((s) => Math.min(isCustomBuild ? 6 : 5, s + 1));
              }}
            >
              Næste Trin
              <ChevronRight className="w-5 h-5 ml-2" />
            </Button>
          </div>
        )}

        {(isCustomBuild ? step === 5 : step === 4) && (
          <div className="mt-8 flex items-center border-t pt-6">
            <Button
              variant="ghost"
              onClick={() => setStep(isCustomBuild ? 4 : 3)}
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
