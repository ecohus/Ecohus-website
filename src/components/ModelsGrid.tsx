"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  BedDouble,
  Bath,
  Car,
  Home,
  ChevronDown,
  ChevronUp,
  X,
  ArrowRight,
  Download,
} from "lucide-react";
import urlBuilder from "@sanity/image-url";
import { client } from "@/lib/sanity";
import { MOCK_MODELS } from "@/lib/mock-models";

const builder = urlBuilder(client);
function urlFor(source: any) {
  if (!source) return null;
  return builder.image(source).auto("format").fit("max").url();
}

export function ModelsGrid({ initialModels }: { initialModels: any[] }) {
  const router = useRouter();
  const searchParams = useSearchParams();

  const absoluteModels = initialModels && initialModels.length > 0 ? initialModels : MOCK_MODELS;

  const initialSize = searchParams.get("size") || "all";
  const initialRooms = searchParams.get("rooms") || "all";
  const initialGarage = searchParams.get("garage") || "all";

  const [sizeFilter, setSizeFilter] = useState(initialSize);
  const [roomsFilter, setRoomsFilter] = useState(initialRooms);
  const [garageFilter, setGarageFilter] = useState(initialGarage);

  const initialModelSlug = searchParams.get("model");
  const initialExpandedModelId = initialModelSlug
    ? absoluteModels.find((m: any) => m.slug.current === initialModelSlug)?._id
    : null;

  const [expandedModelId, setExpandedModelId] = useState<string | null>(
    initialExpandedModelId || null
  );
  const expandedCardsRef = React.useRef<{ [key: string]: HTMLDivElement | null }>({});

  useEffect(() => {
    if (initialExpandedModelId) {
      setTimeout(() => {
        const el = expandedCardsRef.current[initialExpandedModelId];
        if (el) {
          const y = el.getBoundingClientRect().top + window.scrollY - 200;
          window.scrollTo({ top: y, behavior: "smooth" });
        }
      }, 500);
    }
  }, [initialExpandedModelId]);

  useEffect(() => {
    const params = new URLSearchParams();
    if (sizeFilter !== "all") params.set("size", sizeFilter);
    if (roomsFilter !== "all") params.set("rooms", roomsFilter);
    if (garageFilter !== "all") params.set("garage", garageFilter);
    router.replace(`/plantegninger?${params.toString()}`, { scroll: false });
  }, [sizeFilter, roomsFilter, garageFilter, router]);

  const filteredModels = absoluteModels.filter((model: any) => {
    let match = true;
    if (sizeFilter !== "all") {
      const parts = sizeFilter.split("-");
      if (parts.length === 2) {
        const min = parseInt(parts[0]);
        const max = parseInt(parts[1]);
        if (model.size_m2 < min || model.size_m2 > max) match = false;
      } else if (sizeFilter === "150+") {
        if (model.size_m2 < 150) match = false;
      }
    }
    if (roomsFilter !== "all") {
      if (roomsFilter === "6+") { if (model.rooms < 6) match = false; }
      else { if (model.rooms !== parseInt(roomsFilter)) match = false; }
    }
    if (garageFilter !== "all") {
      const wantsGarage = garageFilter === "true";
      if (model.has_garage !== wantsGarage) match = false;
    }
    return match;
  });

  const resetFilters = () => { setSizeFilter("all"); setRoomsFilter("all"); setGarageFilter("all"); };
  const hasActiveFilters = sizeFilter !== "all" || roomsFilter !== "all" || garageFilter !== "all";

  const selectClass = "bg-transparent border border-white/30 rounded-lg px-4 py-2 w-full md:w-auto outline-none transition-colors hover:bg-white/10 text-white text-sm cursor-pointer focus:ring-1 focus:ring-white/40";

  return (
    <div className="flex flex-col gap-8 w-full pt-2 relative">

      {/* Filter bar */}
      <div className="bg-[#2C5F3E] px-4 py-5 md:px-8 w-full flex flex-col md:flex-row items-center justify-center gap-3 sticky top-[80px] z-30 shadow-md">
        <div className="flex flex-col sm:flex-row items-center gap-3 w-full md:w-auto">
          <select
            value={sizeFilter}
            onChange={(e) => setSizeFilter(e.target.value)}
            className={selectClass}
            aria-label="Filtrer efter størrelse"
          >
            <option value="all" className="text-foreground bg-white">Alle størrelser</option>
            <option value="0-60" className="text-foreground bg-white">0–60 m²</option>
            <option value="60-100" className="text-foreground bg-white">60–100 m²</option>
            <option value="100-150" className="text-foreground bg-white">100–150 m²</option>
            <option value="150+" className="text-foreground bg-white">150+ m²</option>
          </select>

          <select
            value={roomsFilter}
            onChange={(e) => setRoomsFilter(e.target.value)}
            className={selectClass}
            aria-label="Filtrer efter antal værelser"
          >
            <option value="all" className="text-foreground bg-white">Alle værelser</option>
            {[1, 2, 3, 4, 5].map((n) => (
              <option key={n} value={String(n)} className="text-foreground bg-white">{n} værelser</option>
            ))}
            <option value="6+" className="text-foreground bg-white">6+ værelser</option>
          </select>

          <select
            value={garageFilter}
            onChange={(e) => setGarageFilter(e.target.value)}
            className={selectClass}
            aria-label="Filtrer efter garage"
          >
            <option value="all" className="text-foreground bg-white">Garage: alle</option>
            <option value="true" className="text-foreground bg-white">Med garage</option>
            <option value="false" className="text-foreground bg-white">Uden garage</option>
          </select>
        </div>

        {hasActiveFilters && (
          <button
            onClick={resetFilters}
            className="flex items-center gap-1.5 text-white/70 hover:text-white transition-colors text-sm underline-offset-2 hover:underline md:ml-4"
          >
            <X className="w-3.5 h-3.5" />
            Nulstil filtre
          </button>
        )}
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between px-1">
        <p className="text-muted-foreground text-sm">
          <span className="font-medium text-foreground">{filteredModels.length}</span>{" "}
          {filteredModels.length === 1 ? "model" : "modeller"}
        </p>
      </div>

      {/* Grid */}
      <div className="w-full pb-16">
        {filteredModels.length === 0 ? (
          <div className="w-full py-20 text-center bg-secondary rounded-2xl border border-dashed border-border flex flex-col items-center gap-3">
            <p className="text-lg font-medium text-foreground">Ingen resultater matcher dit filter</p>
            <p className="text-muted-foreground text-sm">Prøv at ændre eller nulstille dine kriterier.</p>
            <button onClick={resetFilters} className={cn(buttonVariants({ variant: "outline" }), "mt-2")}>
              Nulstil filtre
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 gap-y-8">
            {filteredModels.map((model: any) => {
              const imgUrl = model.floorplan_png ? urlFor(model.floorplan_png) : model.image_url;
              const isExpanded = expandedModelId === model._id;

              return (
                <React.Fragment key={model._id}>
                  <div
                    className={cn(
                      "group bg-card overflow-hidden transition-all duration-200 flex flex-col cursor-pointer border border-border/50 rounded-xl hover:shadow-lg hover:-translate-y-0.5",
                      isExpanded ? "ring-2 ring-primary shadow-md" : ""
                    )}
                    onClick={() => {
                      if (isExpanded) {
                        setExpandedModelId(null);
                      } else {
                        setExpandedModelId(model._id);
                        setTimeout(() => {
                          const el = expandedCardsRef.current[model._id];
                          if (el) {
                            const y = el.getBoundingClientRect().top + window.scrollY - 200;
                            window.scrollTo({ top: y, behavior: "smooth" });
                          }
                        }, 100);
                      }
                    }}
                  >
                    {/* Floor plan */}
                    <div className="bg-white p-6 h-[260px] flex items-center justify-center w-full">
                      {imgUrl ? (
                        <div className="relative w-full h-full max-w-[240px]">
                          <Image
                            src={imgUrl}
                            alt={model.name}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 280px"
                          />
                        </div>
                      ) : (
                        <div className="text-muted-foreground/30 text-sm">Billede mangler</div>
                      )}
                    </div>

                    {/* Info bar */}
                    <div className="bg-[#2C5F3E] text-white px-5 py-4 flex flex-col gap-2">
                      <div className="flex items-start justify-between gap-2">
                        <div>
                          <h3 className="text-base font-medium text-white/90 leading-tight">{model.name}</h3>
                          <p className="text-white/55 text-xs mt-0.5">{model.size_m2} m²{model.covered_area_m2 > 0 ? ` · ${model.covered_area_m2} m² overdækket` : ""}</p>
                        </div>
                        {isExpanded
                          ? <ChevronUp className="w-4 h-4 text-white/50 shrink-0 mt-0.5" />
                          : <ChevronDown className="w-4 h-4 text-white/40 group-hover:text-white/70 shrink-0 mt-0.5 transition-colors" />
                        }
                      </div>

                      <p className="text-white font-medium text-sm">
                        Fra {model.price_from?.toLocaleString("da-DK")} kr.
                      </p>

                      <div className="flex items-center gap-2 pt-1 border-t border-white/15">
                        <div className="flex items-center gap-1 text-white/60 text-xs">
                          <Home className="w-3 h-3" /><span>{model.rooms} vær.</span>
                        </div>
                        <span className="text-white/25">·</span>
                        <div className="flex items-center gap-1 text-white/60 text-xs">
                          <Bath className="w-3 h-3" /><span>{model.bathrooms} bad</span>
                        </div>
                        {model.has_garage && (
                          <>
                            <span className="text-white/25">·</span>
                            <div className="flex items-center gap-1 text-white/60 text-xs">
                              <Car className="w-3 h-3" /><span>Garage</span>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  </div>

                  {/* Expanded content */}
                  {isExpanded && (
                    <div
                      ref={(el) => { expandedCardsRef.current[model._id] = el; }}
                      className="col-span-1 sm:col-span-2 lg:col-span-3 xl:col-span-4 bg-[#2C5F3E] rounded-xl overflow-hidden shadow-inner animate-in slide-in-from-top-6 fade-in duration-300 mb-4"
                    >
                      <div className="flex items-center justify-between px-6 py-4 border-b border-white/15">
                        <h4 className="text-base font-medium text-white">
                          {model.name} — alle visninger
                        </h4>
                        <button
                          onClick={(e) => { e.stopPropagation(); setExpandedModelId(null); }}
                          className="text-white/50 hover:text-white transition-colors p-1"
                          aria-label="Luk"
                        >
                          <X className="w-5 h-5" />
                        </button>
                      </div>

                      <div className="p-6">
                        {model.images && model.images.length > 0 ? (
                          <div className="flex gap-5 overflow-x-auto snap-x pb-3 custom-scrollbar">
                            {model.images.map((img: string, idx: number) => (
                              <div
                                key={idx}
                                className="relative shrink-0 bg-white rounded-lg snap-center shadow-md overflow-hidden"
                                style={{ width: "clamp(260px, 35vw, 480px)", height: "clamp(180px, 25vw, 340px)" }}
                              >
                                <Image
                                  src={img}
                                  alt={`${model.name} visning ${idx + 1}`}
                                  fill
                                  className="object-contain p-4"
                                  sizes="(max-width: 768px) 260px, 480px"
                                  loading="lazy"
                                />
                              </div>
                            ))}
                          </div>
                        ) : (
                          <div className="text-center text-white/40 py-8 text-sm">
                            Ingen yderligere billeder tilgængelige.
                          </div>
                        )}

                        <div className="flex flex-col sm:flex-row gap-3 mt-6">
                          <Link
                            href={`/plantegninger/${model.slug.current}`}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white text-[#2C5F3E] hover:bg-white/90 font-medium px-8 py-2.5 rounded-lg text-sm transition-all flex items-center justify-center gap-2 shadow-sm"
                          >
                            Se fuld model
                            <ArrowRight className="w-4 h-4" />
                          </Link>
                          <Link
                            href={`/kontakt?model=${encodeURIComponent(model.name)}`}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white/10 text-white hover:bg-white/20 font-medium px-8 py-2.5 rounded-lg border border-white/20 text-sm transition-all flex items-center justify-center gap-2"
                          >
                            Book samtale
                          </Link>
                          <Link
                            href={`/prisberegner?model=${model.slug.current}`}
                            onClick={(e) => e.stopPropagation()}
                            className="bg-white/10 text-white hover:bg-white/20 font-medium px-8 py-2.5 rounded-lg border border-white/20 text-sm transition-all flex items-center justify-center gap-2"
                          >
                            Beregn pris
                          </Link>
                        </div>
                      </div>
                    </div>
                  )}
                </React.Fragment>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
