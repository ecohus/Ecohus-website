import { GalleryGrid } from "@/components/GalleryGrid";

// Static local images from public/galleri
const localImages = [
  // Eksteriør
  { _id: "e1", src: "/galleri/exterioer.png",   alt: "Eksteriør",   category: "Eksteriør" },
  { _id: "e2", src: "/galleri/eksterioer.png",  alt: "Eksteriør",   category: "Eksteriør" },
  { _id: "e3", src: "/galleri/eksterioer-2.png",alt: "Eksteriør 2", category: "Eksteriør" },
  { _id: "e4", src: "/galleri/eksterioer-3.png",alt: "Eksteriør 3", category: "Eksteriør" },
  { _id: "e5", src: "/galleri/eksterioer-4.png",alt: "Eksteriør 4", category: "Eksteriør" },
  { _id: "e6", src: "/galleri/eksterioer-5.png",alt: "Eksteriør 5", category: "Eksteriør" },
  // Interiør
  { _id: "i1",  src: "/galleri/interioer-1.png",  alt: "Interiør 1",  category: "Interiør" },
  { _id: "i2",  src: "/galleri/interioer-2.png",  alt: "Interiør 2",  category: "Interiør" },
  { _id: "i3",  src: "/galleri/interioer-3.png",  alt: "Interiør 3",  category: "Interiør" },
  { _id: "i4",  src: "/galleri/interioer-4.png",  alt: "Interiør 4",  category: "Interiør" },
  { _id: "i6",  src: "/galleri/interioer-6.png",  alt: "Interiør 6",  category: "Interiør" },
  { _id: "i7",  src: "/galleri/interioer-7.png",  alt: "Interiør 7",  category: "Interiør" },
  { _id: "i8",  src: "/galleri/interioer-8.png",  alt: "Interiør 8",  category: "Interiør" },
  { _id: "i9",  src: "/galleri/interioer-9.png",  alt: "Interiør 9",  category: "Interiør" },
  { _id: "i10", src: "/galleri/interioer-10.png", alt: "Interiør 10", category: "Interiør" },
  { _id: "i11", src: "/galleri/interioer-11.png", alt: "Interiør 11", category: "Interiør" },
  { _id: "i12", src: "/galleri/interioer-12.png", alt: "Interiør 12", category: "Interiør" },
  { _id: "i13", src: "/galleri/interioer-13.png", alt: "Interiør 13", category: "Interiør" },
  // Byggefase
  { _id: "b1", src: "/galleri/byggeprocess.png",   alt: "Byggeproces 1", category: "Byggefase" },
  { _id: "b2", src: "/galleri/byggeprocess-2.png", alt: "Byggeproces 2", category: "Byggefase" },
  { _id: "b3", src: "/galleri/byggeprocess-3.png", alt: "Byggeproces 3", category: "Byggefase" },
];

export default function GalleriPage() {
  return (
    <div className="flex flex-col min-h-screen bg-background pt-12 pb-24 border-t">
      <div className="container mx-auto px-4 md:px-8">
        <div className="text-center mb-16 max-w-2xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-medium mb-4 text-foreground">Galleri</h1>
          <p className="text-lg text-muted-foreground">
            Gå på opdagelse i vores tidligere byggerier. Få inspiration til dit eget
            sommerhus, uanset om du vil se færdige huse eller følge med i byggeprocessen.
          </p>
        </div>
        <GalleryGrid initialImages={localImages} />
      </div>
    </div>
  );
}
