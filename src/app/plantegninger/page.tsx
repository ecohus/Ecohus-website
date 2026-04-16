import { getHouseModels } from "@/lib/sanity";
import { ModelsGrid } from "@/components/ModelsGrid";
import { Suspense } from "react";

export const revalidate = 120;

export default async function PlantegningerPage() {
  const models = await getHouseModels().catch(() => []);

  return (
    <div className="flex flex-col min-h-screen bg-background">
      {/* Page hero */}
      <section className="border-b bg-secondary py-14 md:py-20">
        <div className="container mx-auto px-4 md:px-8">
          <p className="text-sm font-medium text-primary uppercase tracking-[0.12em] mb-3">Alle modeller</p>
          <h1 className="mb-4 max-w-xl">Find dit perfekte sommerhus</h1>
          <p className="text-muted-foreground text-lg max-w-2xl">
            Udforsk vores udvalg af færdigbyggede sommerhuse. Brug filtrene til at indsnævre dit valg efter størrelse, antal værelser og ønsket faciliteter.
          </p>
        </div>
      </section>

      {/* Models grid with sticky filters */}
      <div className="container mx-auto px-4 md:px-8 pb-24">
        <Suspense
          fallback={
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-12">
              {[...Array(6)].map((_, i) => (
                <div key={i} className="h-96 bg-muted/30 animate-pulse rounded-xl" />
              ))}
            </div>
          }
        >
          <ModelsGrid initialModels={models} />
        </Suspense>
      </div>
    </div>
  );
}

