"use client";

import { useState, useEffect, useCallback } from "react";
import Image from "next/image";
import { cn } from "@/lib/utils";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { ChevronLeft, ChevronRight, X, ImageOff } from "lucide-react";
import urlBuilder from "@sanity/image-url";
import { client } from "@/lib/sanity";

const builder = urlBuilder(client);
function urlFor(source: any) {
  if (!source) return null;
  return builder.image(source).auto("format").fit("max").url();
}

const TABS = ["Alle", "Eksteriør", "Interiør", "Byggefase"] as const;

export function GalleryGrid({ initialImages }: { initialImages: any[] }) {
  const [activeTab, setActiveTab] = useState<string>("Alle");
  const [lightboxOpen, setLightboxOpen] = useState(false);
  const [currentIndex, setCurrentIndex] = useState(0);

  const filteredImages = initialImages.filter(
    (img) =>
      activeTab === "Alle" ||
      img.category?.toLowerCase() === activeTab.toLowerCase()
  );

  const openLightbox = (index: number) => {
    setCurrentIndex(index);
    setLightboxOpen(true);
  };

  const showNext = useCallback(() => {
    setCurrentIndex((prev) => (prev + 1) % filteredImages.length);
  }, [filteredImages.length]);

  const showPrev = useCallback(() => {
    setCurrentIndex((prev) => (prev - 1 + filteredImages.length) % filteredImages.length);
  }, [filteredImages.length]);

  useEffect(() => {
    if (!lightboxOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "ArrowRight") showNext();
      if (e.key === "ArrowLeft") showPrev();
      if (e.key === "Escape") setLightboxOpen(false);
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [lightboxOpen, showNext, showPrev]);

  const currentImage = filteredImages[currentIndex];

  return (
    <div className="flex flex-col gap-10">
      {/* Filter tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2">
        {TABS.map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setCurrentIndex(0); }}
            className={cn(
              "px-5 py-2 rounded-full text-sm font-medium transition-all duration-150 border",
              activeTab === tab
                ? "bg-primary text-primary-foreground border-primary shadow-sm"
                : "bg-background text-foreground hover:bg-muted border-border/60"
            )}
          >
            {tab}
          </button>
        ))}
      </div>

      {/* Grid */}
      {filteredImages.length === 0 ? (
        <div className="w-full py-24 text-center bg-secondary rounded-2xl border border-dashed border-border flex flex-col items-center gap-3">
          <ImageOff className="w-10 h-10 text-muted-foreground/30" />
          <p className="text-foreground font-medium">Billeder i denne kategori tilføjes snart</p>
        </div>
      ) : (
        <div className="columns-1 sm:columns-2 lg:columns-3 gap-5 [column-fill:_balance]">
          {filteredImages.map((img: any, index: number) => {
            const imgUrl = img.image ? urlFor(img.image) : null;
            return (
              <div
                key={img._id || index}
                className="break-inside-avoid mb-5 relative rounded-xl overflow-hidden cursor-zoom-in group border border-border/40 shadow-sm hover:shadow-md transition-all duration-200"
                onClick={() => openLightbox(index)}
              >
                <div className="relative w-full bg-muted" style={{ paddingBottom: "75%" }}>
                  {imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={img.alt || `Galleri billede ${index + 1}`}
                      fill
                      className="object-cover transition-transform duration-300 group-hover:scale-[1.02]"
                      sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                      loading="lazy"
                    />
                  ) : (
                    <div className="absolute inset-0 flex items-center justify-center text-muted-foreground/30 text-sm bg-muted">
                      Billede mangler
                    </div>
                  )}
                  {/* Hover overlay */}
                  <div className="absolute inset-0 bg-black/0 group-hover:bg-black/10 transition-colors duration-200" />
                </div>
                {img.alt && (
                  <div className="absolute bottom-0 left-0 right-0 px-3 py-2 bg-gradient-to-t from-black/60 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <p className="text-white text-xs font-medium truncate">{img.alt}</p>
                  </div>
                )}
              </div>
            );
          })}
        </div>
      )}

      {/* Lightbox */}
      <Dialog open={lightboxOpen} onOpenChange={setLightboxOpen}>
        <DialogContent
          className="max-w-[100vw] h-[100vh] w-full p-0 border-none shadow-none flex flex-col justify-center items-center rounded-none [&>button]:hidden"
          style={{ background: "rgba(0,0,0,0.95)" }}
        >
          {currentImage && (
            <>
              {/* Close */}
              <button
                onClick={() => setLightboxOpen(false)}
                className="absolute top-5 right-5 z-50 p-2.5 text-white/60 hover:text-white transition-colors bg-white/10 rounded-full hover:bg-white/20"
                aria-label="Luk"
              >
                <X className="w-6 h-6" />
              </button>

              {/* Counter */}
              <div className="absolute top-5 left-1/2 -translate-x-1/2 z-50 text-white/50 text-sm font-medium">
                {currentIndex + 1} / {filteredImages.length}
              </div>

              {/* Prev */}
              <button
                onClick={(e) => { e.stopPropagation(); showPrev(); }}
                className="absolute left-4 md:left-6 top-1/2 -translate-y-1/2 z-50 p-3 text-white/60 hover:text-white transition-colors bg-white/10 rounded-full hover:bg-white/20"
                aria-label="Forrige"
              >
                <ChevronLeft className="w-7 h-7" />
              </button>

              {/* Image */}
              <div className="relative w-full h-[90vh] flex items-center justify-center px-16 md:px-24">
                {(() => {
                  const imgUrl = currentImage.image ? urlFor(currentImage.image) : null;
                  return imgUrl ? (
                    <Image
                      src={imgUrl}
                      alt={currentImage.alt || "Galleri billede"}
                      fill
                      className="object-contain"
                      sizes="100vw"
                    />
                  ) : (
                    <p className="text-white/40">{currentImage.alt || "Billede ikke tilgængeligt"}</p>
                  );
                })()}
              </div>

              {/* Caption */}
              {currentImage.alt && (
                <div className="absolute bottom-6 left-1/2 -translate-x-1/2 text-white/50 text-sm font-medium text-center px-4 max-w-xl">
                  {currentImage.alt}
                </div>
              )}

              {/* Next */}
              <button
                onClick={(e) => { e.stopPropagation(); showNext(); }}
                className="absolute right-4 md:right-6 top-1/2 -translate-y-1/2 z-50 p-3 text-white/60 hover:text-white transition-colors bg-white/10 rounded-full hover:bg-white/20"
                aria-label="Næste"
              >
                <ChevronRight className="w-7 h-7" />
              </button>
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
