import { notFound } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { getHouseModelBySlug, getHouseModels } from "@/lib/sanity";
import { buttonVariants } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ImageLightbox } from "@/components/ImageLightbox";
import { CheckCircle2, ChevronLeft, Home, BedDouble, Bath, Car, ArrowRight, Plus } from "lucide-react";
import { MOCK_MODELS } from "@/lib/mock-models";
import { STANDARD_CONSTRUCTION, INCLUDED_IN_STANDARD, NOT_INCLUDED } from "@/lib/spec";
import urlBuilder from "@sanity/image-url";
import { client } from "@/lib/sanity";

const builder = urlBuilder(client);
function urlFor(source: any) {
  if (!source) return null;
  return builder.image(source).auto("format").fit("max").url();
}

export const revalidate = 300;

export async function generateStaticParams() {
  const models = await getHouseModels().catch(() => []);
  // Also include mock slugs so pages work in dev without Sanity
  const mockParams = MOCK_MODELS.map((m) => ({ slug: m.slug.current }));
  const sanityParams = models.map((model: any) => ({ slug: model.slug.current }));
  // Deduplicate
  const all = [...mockParams, ...sanityParams];
  const seen = new Set<string>();
  return all.filter((p) => { if (seen.has(p.slug)) return false; seen.add(p.slug); return true; });
}

export default async function ModelDetailPage({ params }: { params: { slug: string } }) {
  const [sanityModel, allSanityModels] = await Promise.all([
    getHouseModelBySlug(params.slug).catch(() => null),
    getHouseModels().catch(() => []),
  ]);

  // Fall back to mock data if Sanity is empty
  const mockModel = MOCK_MODELS.find((m) => m.slug.current === params.slug);
  const model = sanityModel ?? mockModel ?? null;

  if (!model) notFound();

  // Resolve image URLs
  const floorplanUrl = (model as any).floorplan_png
    ? urlFor((model as any).floorplan_png)
    : (model as any).image_url ?? null;

  const mainImageUrl = (model as any).main_image
    ? urlFor((model as any).main_image)
    : (model as any).image_url ?? null;

  const galleryImages: string[] = (model as any).images ?? [];

  // Resolve the single render that matches this exact slug version
  // e.g. "61-120-v1" → /renders/120-v1.png  |  "61-120-v2" → /renders/120-v2.png
  const slugMatch = params.slug.match(/(\d+)-v(\d+)$/);
  const renderSrc = slugMatch
    ? `/renders/${parseInt(slugMatch[1], 10)}-v${parseInt(slugMatch[2], 10)}.png`
    : null;


  // Similar models
  const allModels = allSanityModels.length > 0 ? allSanityModels : MOCK_MODELS;
  const similarModels = allModels
    .filter((m: any) => m._id !== model._id && Math.abs(m.size_m2 - model.size_m2) <= 20)
    .slice(0, 3);
  const displaySimilar = similarModels.length > 0
    ? similarModels
    : allModels.filter((m: any) => m._id !== model._id).slice(0, 3);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Sticky breadcrumb */}
      <div className="border-b bg-white/95 backdrop-blur sticky top-20 z-40 shadow-sm">
        <div className="container mx-auto px-4 md:px-8 py-3.5 flex items-center justify-between gap-4">
          <Link
            href="/plantegninger"
            className="inline-flex items-center text-sm font-medium text-muted-foreground hover:text-primary transition-colors"
          >
            <ChevronLeft className="w-4 h-4 mr-1" />
            Alle modeller
          </Link>
          {/* Mobile CTA */}
          <Link
            href={`/kontakt?model=${encodeURIComponent((model as any).name)}`}
            className={cn(buttonVariants({ size: "sm" }), "md:hidden")}
          >
            Book samtale
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 md:px-8 py-12 md:py-16">
        <div className="flex flex-col lg:flex-row gap-12 xl:gap-20">

          {/* ── Left Column: Images ── */}
          <div className="w-full lg:w-[58%] flex flex-col gap-8">
            {/* Main hero image (if from Sanity with photo) */}
            {mainImageUrl && mainImageUrl !== floorplanUrl && (
              <div className="relative aspect-video bg-muted rounded-2xl overflow-hidden border shadow-sm">
                <Image
                  src={mainImageUrl}
                  alt={(model as any).name}
                  fill
                  className="object-cover"
                  sizes="(max-width: 1024px) 100vw, 58vw"
                  priority
                />
              </div>
            )}

            {/* Floor plan with lightbox */}
            <div>
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-xl font-medium">Plantegning</h2>
                <span className="text-xs text-muted-foreground">Klik for at forstørre</span>
              </div>
              <ImageLightbox
                src={floorplanUrl ?? ""}
                alt={`Plantegning for ${(model as any).name}`}
              />
            </div>

            {/* Realistic render — single image matching this slug version */}
            {renderSrc && (
              <div>
                <h2 className="text-xl font-medium mb-4">Realistisk visualisering</h2>
                <div className="relative aspect-video rounded-2xl overflow-hidden border shadow-sm bg-muted">
                  <Image
                    src={renderSrc}
                    alt={`${(model as any).name} render`}
                    fill
                    className="object-cover"
                    sizes="(max-width: 1024px) 100vw, 58vw"
                    loading="lazy"
                  />
                </div>
              </div>
            )}

            {/* Additional gallery images (if any beyond the floorplan) */}
            {galleryImages.length > 1 && (
              <div>
                <h2 className="text-xl font-medium mb-4">Yderligere visninger</h2>
                <div className="grid grid-cols-2 gap-4">
                  {galleryImages.slice(1).map((img: string, idx: number) => (
                    <div key={idx} className="relative aspect-[4/3] bg-white rounded-xl overflow-hidden border shadow-sm">
                      <Image
                        src={img}
                        alt={`${(model as any).name} visning ${idx + 2}`}
                        fill
                        className="object-contain p-3"
                        sizes="(max-width: 768px) 50vw, 25vw"
                        loading="lazy"
                      />
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Description */}
            {(model as any).description && (
              <div className="bg-secondary rounded-2xl p-7 border border-border/40">
                <h2 className="text-xl font-medium mb-3">Om denne model</h2>
                <p className="text-muted-foreground leading-relaxed">
                  {(model as any).description}
                </p>
              </div>
            )}

            {/* Standard construction */}
            <div>
              <h2 className="text-xl font-medium mb-2">Standardopbygning</h2>
              <p className="text-muted-foreground mb-6 text-sm leading-relaxed">
                Alle vores modeller bygges efter samme gennemtænkte standard — opført under
                optimale forhold i vores fabrikshal og leveret nøglefærdigt.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                {STANDARD_CONSTRUCTION.map((group) => (
                  <div key={group.title} className="bg-secondary rounded-2xl p-6 border border-border/40">
                    <h3 className="font-medium text-foreground mb-3">{group.title}</h3>
                    <ul className="flex flex-col gap-2">
                      {group.items.map((item, i) => (
                        <li key={i} className="text-sm text-muted-foreground leading-snug flex gap-2">
                          <span className="text-primary/50 mt-0.5">•</span>
                          <span>{item}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                ))}
              </div>
            </div>

            {/* Optional add-ons (not included) */}
            <div className="bg-secondary rounded-2xl p-7 border border-border/40">
              <h2 className="text-xl font-medium mb-2">Tilvalg</h2>
              <p className="text-muted-foreground mb-5 text-sm leading-relaxed">
                Tilpas dit hus med tilvalg, der ikke indgår i standardprisen. Se priserne i
                prisberegneren.
              </p>
              <ul className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-2.5">
                {NOT_INCLUDED.map((item, i) => (
                  <li key={i} className="flex items-start gap-2.5">
                    <Plus className="w-4 h-4 text-primary/70 shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{item}</span>
                  </li>
                ))}
              </ul>
              <Link
                href={`/prisberegner?model=${(model as any).slug.current}`}
                className="inline-flex items-center text-sm font-medium text-primary hover:underline underline-offset-2 mt-6"
              >
                Beregn pris med tilvalg
                <ArrowRight className="ml-1.5 h-4 w-4" />
              </Link>
            </div>
          </div>

          {/* ── Right Column: Specs + CTA ── */}
          <div className="w-full lg:w-[42%]">
            <div className="bg-secondary rounded-3xl p-8 lg:p-10 sticky top-36 border border-border/40 shadow-sm">
              {/* Header */}
              <div className="mb-8 pb-8 border-b border-border/50">
                <p className="text-xs font-medium text-primary uppercase tracking-[0.12em] mb-2">
                  {(model as any).display_name ? `Model · ${(model as any).name}` : "Model"}
                </p>
                <h1 className="text-3xl md:text-4xl font-medium text-foreground mb-4">{(model as any).display_name || (model as any).name}</h1>
                <div>
                  <p className="text-xs text-muted-foreground uppercase tracking-wide mb-1">Pris fra</p>
                  <p className="text-3xl font-medium text-primary">
                    Fra {(model as any).price_from?.toLocaleString("da-DK")} kr.
                  </p>
                  <p className="text-xs text-muted-foreground mt-1">Inkl. standardopbygning, støbt fundament, levering og opsætning · ekskl. grundkøb og tilladelser</p>
                </div>
              </div>

              {/* Spec table */}
              <div className="mb-7">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">Specifikationer</h3>
                <ul className="flex flex-col divide-y divide-border/40">
                  {[
                    { label: "Boligareal", value: `${(model as any).size_m2} m²`, icon: <Home className="w-4 h-4" /> },
                    { label: "Overdækket areal", value: `${(model as any).covered_area_m2 ?? 0} m²`, icon: null },
                    { label: "Værelser", value: String((model as any).rooms), icon: <BedDouble className="w-4 h-4" /> },
                    { label: "Badeværelser", value: String((model as any).bathrooms), icon: <Bath className="w-4 h-4" /> },
                    { label: "Garage", value: (model as any).has_garage ? "Ja" : "Nej", icon: <Car className="w-4 h-4" /> },
                    { label: "Overdækning/carport", value: (model as any).has_canopy ? "Ja" : "Nej", icon: null },
                  ].map((spec, i) => (
                    <li key={i} className="flex items-center justify-between py-3 gap-3">
                      <div className="flex items-center gap-2 text-muted-foreground text-sm">
                        {spec.icon && <span className="text-primary/60">{spec.icon}</span>}
                        <span>{spec.label}</span>
                      </div>
                      <span className="font-medium text-sm text-foreground">{spec.value}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Included in standard price */}
              <div className="mb-8">
                <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">Inkluderet i standardprisen</h3>
                <ul className="flex flex-col gap-2.5">
                  {INCLUDED_IN_STANDARD.map((feat, i) => (
                    <li key={i} className="flex items-start gap-2.5">
                      <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{feat}</span>
                    </li>
                  ))}
                </ul>
              </div>

              {/* Model-specific extras from CMS, if any */}
              {(model as any).features && (model as any).features.length > 0 && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-4">Særligt for denne model</h3>
                  <ul className="flex flex-col gap-2.5">
                    {(model as any).features.map((feat: string, i: number) => (
                      <li key={i} className="flex items-start gap-2.5">
                        <CheckCircle2 className="w-4 h-4 text-primary shrink-0 mt-0.5" />
                        <span className="text-sm text-foreground">{feat}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              )}

              {/* 3D embed */}
              {(model as any).embed_3d_url && (
                <div className="mb-8">
                  <h3 className="text-sm font-medium text-muted-foreground uppercase tracking-wide mb-3">3D Visualisering</h3>
                  <div className="aspect-video rounded-xl overflow-hidden border shadow-sm">
                    <iframe
                      src={(model as any).embed_3d_url}
                      className="w-full h-full"
                      title={`3D model af ${(model as any).name}`}
                      allowFullScreen
                    />
                  </div>
                </div>
              )}

              {/* CTAs */}
              <div className="flex flex-col gap-3">
                <Link
                  href={`/kontakt?model=${encodeURIComponent((model as any).name)}`}
                  className={cn(buttonVariants({ size: "lg" }), "w-full font-medium shadow-sm hover:scale-[1.01] transition-transform")}
                >
                  Bliv ringet op om denne model
                </Link>
                <Link
                  href="/prisberegner"
                  className={cn(buttonVariants({ variant: "outline", size: "lg" }), "w-full bg-background font-medium")}
                >
                  Beregn din pris
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* ── Similar Models ── */}
      {displaySimilar.length > 0 && (
        <section className="mt-8 py-20 bg-secondary border-t">
          <div className="container mx-auto px-4 md:px-8">
            <h2 className="text-2xl md:text-3xl font-medium mb-10 text-center">Se lignende modeller</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {displaySimilar.map((m: any) => {
                const simImgUrl = m.floorplan_png ? urlFor(m.floorplan_png) : m.image_url;
                return (
                  <Link
                    key={m._id}
                    href={`/plantegninger/${m.slug.current}`}
                    className="group bg-card border border-border/50 overflow-hidden shadow-sm hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 flex flex-col rounded-xl"
                  >
                    <div className="bg-white h-[200px] flex items-center justify-center p-6">
                      {simImgUrl ? (
                        <div className="relative w-full h-full">
                          <Image
                            src={simImgUrl}
                            alt={m.name}
                            fill
                            className="object-contain"
                            sizes="(max-width: 768px) 100vw, 30vw"
                            loading="lazy"
                          />
                        </div>
                      ) : (
                        <div className="text-muted-foreground/30 text-sm">Billede mangler</div>
                      )}
                    </div>
                    <div className="p-5 flex items-center justify-between bg-[#2C5F3E] text-white">
                      <div>
                        <p className="font-medium text-white/90">{m.display_name || m.name}</p>
                        <p className="text-white/60 text-sm">{m.size_m2} m² · Fra {m.price_from?.toLocaleString("da-DK")} kr.</p>
                      </div>
                      <ArrowRight className="w-4 h-4 text-white/50 group-hover:text-white transition-colors shrink-0" />
                    </div>
                  </Link>
                );
              })}
            </div>
          </div>
        </section>
      )}
    </div>
  );
}
