import { getGalleryImages } from "@/lib/sanity";
import { GalleryGrid } from "@/components/GalleryGrid";

export const revalidate = 300;

export default async function GalleriPage() {
  const images = await getGalleryImages().catch(() => []);

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
        <GalleryGrid initialImages={images} />
      </div>
    </div>
  );
}
