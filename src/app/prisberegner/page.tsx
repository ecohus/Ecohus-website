import { getHouseModels } from "@/lib/sanity";
import { PriceCalculator } from "@/components/PriceCalculator";
import { Suspense } from "react";

export const revalidate = 300;

export default async function PrisberegnerPage() {
  const models = await getHouseModels().catch(() => []);

  return (
    <div className="min-h-screen bg-secondary">
      {/* Page hero */}
      <section className="border-b bg-background py-14 md:py-20">
        <div className="container mx-auto px-4 md:px-8 text-center max-w-2xl">
          <p className="text-sm font-medium text-primary uppercase tracking-[0.12em] mb-3">Prisberegner</p>
          <h1 className="mb-4">Hvad koster dit drømmehus?</h1>
          <p className="text-muted-foreground text-lg">
            Vælg model, tilføjelser og fundamentstype — og se et øjeblikkeligt prisoverslag der passer til dit projekt.
          </p>
        </div>
      </section>

      <div className="container mx-auto px-4 md:px-8 py-12 max-w-5xl">
        <div className="bg-background rounded-3xl shadow-sm border overflow-hidden">
          <Suspense fallback={
            <div className="p-12 flex items-center justify-center min-h-[400px]">
              <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
            </div>
          }>
            <PriceCalculator models={models} />
          </Suspense>
        </div>
      </div>
    </div>
  );
}

