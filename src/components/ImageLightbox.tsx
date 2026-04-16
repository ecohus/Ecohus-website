"use client";

import Image from "next/image";
import { Dialog, DialogContent, DialogTrigger } from "@/components/ui/dialog";
import { Maximize2 } from "lucide-react";

interface ImageLightboxProps {
  src: string;
  alt: string;
  className?: string;
}

export function ImageLightbox({ src, alt, className }: ImageLightboxProps) {
  if (!src) {
    return (
      <div className="relative w-full aspect-[4/3] bg-muted rounded-2xl flex items-center justify-center border shadow-sm text-muted-foreground/30 text-sm font-medium">
        Plantegning ikke tilgængelig
      </div>
    );
  }

  return (
    <Dialog>
      <DialogTrigger
        render={
          <button
            className={`relative w-full aspect-[4/3] bg-white overflow-hidden rounded-2xl group cursor-zoom-in border shadow-sm hover:border-primary/40 transition-all hover:shadow-md ${className ?? ""}`}
          />
        }
      >
        <Image
          src={src}
          alt={alt}
          fill
          className="object-contain p-4"
          sizes="(max-width: 768px) 100vw, 55vw"
        />
        {/* Zoom hint overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/5 transition-colors flex items-end justify-end p-4 pointer-events-none">
          <div className="bg-white/90 text-foreground text-xs font-medium px-3 py-1.5 rounded-lg flex items-center gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm">
            <Maximize2 className="w-3.5 h-3.5" />
            <span>Forstør</span>
          </div>
        </div>
      </DialogTrigger>

      <DialogContent className="max-w-5xl w-full p-2 bg-white border shadow-2xl rounded-2xl">
        <div className="relative w-full h-[85vh] flex items-center justify-center">
          <Image
            src={src}
            alt={alt}
            fill
            className="object-contain p-6"
            sizes="90vw"
          />
        </div>
      </DialogContent>
    </Dialog>
  );
}
