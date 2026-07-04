import type { Metadata } from "next";
import { isAdminAuthenticated } from "@/lib/admin-auth";
import { supabase } from "@/lib/supabase";
import type { CalculatorLead, ContactLead } from "@/lib/admin-types";
import { AdminLogin } from "@/components/admin/AdminLogin";
import { AdminDashboard } from "@/components/admin/AdminDashboard";

export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "Admin — Ecohus",
  robots: { index: false, follow: false },
};

export default async function AdminPage() {
  if (!process.env.SUPABASE_SERVICE_ROLE_KEY || !process.env.NEXT_PUBLIC_SUPABASE_URL) {
    return (
      <div className="container mx-auto px-4 py-24 max-w-xl text-center">
        <h1 className="text-3xl font-medium mb-4">Admin er ikke konfigureret</h1>
        <p className="text-muted-foreground">
          Sæt miljøvariablerne <code className="font-mono text-sm">NEXT_PUBLIC_SUPABASE_URL</code> og{" "}
          <code className="font-mono text-sm">SUPABASE_SERVICE_ROLE_KEY</code> for at aktivere admin-dashboardet.
        </p>
      </div>
    );
  }

  if (!isAdminAuthenticated()) {
    return <AdminLogin />;
  }

  let contactLeads: ContactLead[] = [];
  let calculatorLeads: CalculatorLead[] = [];
  let loadError: string | null = null;

  try {
    const [contactRes, calculatorRes] = await Promise.all([
      supabase.from("contact_submissions").select("*").order("created_at", { ascending: false }),
      supabase.from("price_calculator_leads").select("*").order("created_at", { ascending: false }),
    ]);

    if (contactRes.error) throw contactRes.error;
    if (calculatorRes.error) throw calculatorRes.error;

    contactLeads = (contactRes.data ?? []) as ContactLead[];
    calculatorLeads = (calculatorRes.data ?? []) as CalculatorLead[];
  } catch (error) {
    console.error("Admin dashboard load error:", error);
    loadError =
      "Kunne ikke hente leads fra Supabase. Tjek at migrationen er kørt (se SUPABASE-OPSAETNING.md), og at SUPABASE_SERVICE_ROLE_KEY er sat.";
  }

  return (
    <AdminDashboard
      contactLeads={contactLeads}
      calculatorLeads={calculatorLeads}
      loadError={loadError}
    />
  );
}
