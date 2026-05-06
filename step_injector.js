const fs = require('fs');

const stepsContent = `
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
                      <div>
                        <h3 className="font-medium text-foreground mb-1">{addon.title}</h3>
                        <p className="text-xs text-muted-foreground leading-relaxed mb-1">{addon.desc}</p>
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

              {/* Blurred price teaser */}
              {!isCustomBuild && estimatedTotalMin > 0 && (
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
                  <h2 className="text-2xl font-medium leading-tight">Tak! Her er din oversigt</h2>
                  <p className="text-muted-foreground text-sm">Vi kontakter dig inden for 1–2 hverdage</p>
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
                    </>
                  )}
                </div>

                {/* Revealed total */}
                {!isCustomBuild ? (
                  <div className="mt-5 pt-5 border-t flex items-center justify-between gap-4">
                    <span className="text-lg font-medium text-foreground">Estimeret total</span>
                    <span className="text-xl font-semibold text-primary tabular-nums whitespace-nowrap">
                      kr. {estimatedTotalMin.toLocaleString("da-DK")}–{estimatedTotalMax.toLocaleString("da-DK")}
                    </span>
                  </div>
                ) : (
                  <div className="mt-5 pt-5 border-t flex items-center justify-between gap-4">
                    <span className="text-lg font-medium text-foreground">Estimeret total</span>
                    <span className="text-sm font-medium text-primary">Beregnes individuelt</span>
                  </div>
                )}
                <p className="text-xs text-muted-foreground mt-2 text-right">Uforpligtende estimat · ekskl. grundkøb og tinglysning</p>
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
`;

let content = fs.readFileSync('src/components/PriceCalculator.tsx', 'utf8');
content = content.replace('// REPLACED', stepsContent);
fs.writeFileSync('src/components/PriceCalculator.tsx', content);
