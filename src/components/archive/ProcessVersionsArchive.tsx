import React from "react";
import { CheckCircle2 } from "lucide-react";
import { cn } from "@/lib/utils";

// This file serves as an archive for the rejected design versions (Version 1 and Version 3)
// of the processen page. It is not currently imported or rendered anywhere to ensure optimal performance.

export function ProcessVersion1({ steps }: { steps: any[] }) {
  return (
    <section className="py-24 bg-background border-t border-b">
      <div className="container mx-auto px-4 md:px-8">
        <div className="mb-16 text-center md:text-left">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">Version 1</span>
          <h2 className="text-3xl font-medium">Apple / Premium Layout</h2>
          <p className="text-muted-foreground mt-2">Minimalistisk, sticky scroll med fokus på ren tekst og smalle ikoner.</p>
        </div>
        
        <div className="flex flex-col md:flex-row gap-12 lg:gap-24 relative items-start">
          <div className="md:w-1/3 md:sticky md:top-32 hidden md:block">
            <h3 className="text-4xl font-medium mb-4">Trin-for-trin</h3>
            <p className="text-muted-foreground text-lg leading-relaxed">
              Fra den første tanke til nøglen drejes i døren. En gennemskuelig proces uden overraskelser.
            </p>
          </div>
          
          <div className="md:w-2/3 flex flex-col gap-12 md:gap-20">
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <div key={i} className="flex gap-6 lg:gap-10 group">
                  <div className="flex flex-col items-center">
                    <div className="w-12 h-12 lg:w-14 lg:h-14 rounded-full bg-secondary text-primary flex items-center justify-center font-medium text-lg shrink-0 border border-border/50 group-hover:border-primary/30 group-hover:scale-105 transition-all">
                      <Icon className="w-5 h-5 lg:w-6 lg:h-6" strokeWidth={1.5} />
                    </div>
                    {i !== steps.length - 1 && <div className="w-px h-full bg-border/50 mt-4" />}
                  </div>
                  <div className="pb-12 md:pb-0 pt-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-primary/70 mb-2 flex items-center gap-2">
                      Trin 0{step.num} — {step.duration}
                    </span>
                    <h4 className="text-2xl font-medium text-foreground mb-3 tracking-tight">{step.title}</h4>
                    <p className="text-muted-foreground leading-relaxed text-lg mb-5">{step.desc}</p>
                    {step.bullets && step.bullets.length > 0 && (
                      <ul className="space-y-3 mb-6">
                        {step.bullets.map((bullet: any, bi: any) => (
                          <li key={bi} className="flex items-start gap-3 text-muted-foreground">
                            <CheckCircle2 className="w-5 h-5 text-primary/60 mt-0.5 shrink-0" strokeWidth={1.5} />
                            <span>{bullet}</span>
                          </li>
                        ))}
                      </ul>
                    )}
                    {step.highlight && (
                       <div className="bg-secondary/40 p-5 rounded-2xl border border-border/40">
                         <p className="text-[15px] font-medium text-foreground/90 leading-relaxed">{step.highlight}</p>
                       </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}

export function ProcessVersion3({ steps }: { steps: any[] }) {
  return (
    <section className="py-32 bg-background border-b overflow-hidden relative">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-24 max-w-3xl mx-auto">
          <span className="inline-block py-1 px-3 rounded-full bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider mb-3">Version 3</span>
          <h2 className="text-5xl font-medium mb-6 text-balance">Det narrative Layout (Zigzag & Blobs)</h2>
          <p className="text-muted-foreground text-xl">Organisk zigzag-opsætning med varme "blobs" og overdimensionerede, venlige ikoner der illustrerer rejsen.</p>
        </div>
        
        <div className="max-w-5xl mx-auto relative">
          <div className="absolute top-0 bottom-0 left-1/2 w-0.5 bg-border/50 -translate-x-1/2 hidden md:block border-dashed" />
          
          <div className="flex flex-col gap-24 md:gap-40 relative z-10">
            {steps.map((step, i) => {
              const Icon = step.icon;
              const isEven = i % 2 !== 0; 
              return (
                <div key={i} className={cn("flex flex-col md:flex-row items-center gap-12 lg:gap-20", isEven ? "md:flex-row-reverse" : "")}>
                  
                  <div className="w-full md:w-1/2 flex justify-center">
                     <div className="relative w-64 h-64 md:w-80 md:h-80 flex items-center justify-center">
                       <div className={cn("absolute inset-0 opacity-[0.15] blur-[40px] rounded-[100px]", isEven ? "bg-amber-400" : "bg-[#2C5F3E]")} />
                       <div className={cn("absolute inset-4 rounded-[3rem] shadow-xl border border-border/50 flex items-center justify-center backdrop-blur-sm bg-background/80 overflow-hidden", isEven ? "rotate-2 hover:rotate-0" : "-rotate-2 hover:rotate-0", "transition-all duration-500")}>
                          <Icon className={cn("w-32 h-32 opacity-80 transition-transform hover:scale-110 duration-500", isEven ? "text-amber-500" : "text-[#2C5F3E]")} strokeWidth={1} />
                       </div>
                     </div>
                  </div>

                  <div className="w-full md:w-1/2 text-left bg-background/50 backdrop-blur-md p-6 md:p-0 rounded-3xl">
                     <span className={cn("px-4 py-1.5 rounded-full text-xs font-bold tracking-wider uppercase mb-6 inline-flex items-center gap-2", isEven ? "bg-amber-100 text-amber-800" : "bg-primary/10 text-primary")}>
                       Trin 0{step.num} — {step.duration}
                     </span>
                     <h4 className="text-3xl font-semibold mb-5 text-balance">{step.title}</h4>
                     <p className="text-muted-foreground leading-relaxed text-lg mb-6">{step.desc}</p>
                     
                     {step.bullets && step.bullets.length > 0 && (
                        <ul className="space-y-3 mb-6">
                          {step.bullets.map((bullet: any, bi: any) => (
                            <li key={bi} className="flex items-start gap-3 text-[15px] text-muted-foreground">
                              <CheckCircle2 className={cn("w-5 h-5 mt-px shrink-0", isEven ? "text-amber-500" : "text-primary")} strokeWidth={2} />
                              <span>{bullet}</span>
                            </li>
                          ))}
                        </ul>
                     )}
                     {step.highlight && (
                       <div className={cn("p-5 rounded-2xl border", isEven ? "bg-amber-50/50 border-amber-200 text-amber-900" : "bg-primary/5 border-primary/20 text-foreground")}>
                          <p className="text-[15px] font-medium leading-relaxed">
                            {step.highlight}
                          </p>
                       </div>
                     )}
                  </div>
                </div>
              )
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
