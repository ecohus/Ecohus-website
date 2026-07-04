import { NextResponse } from "next/server";
import { z } from "zod";
import { supabase } from "@/lib/supabase";
import { isAdminAuthenticated } from "@/lib/admin-auth";

const TABLES = {
  contact: "contact_submissions",
  calculator: "price_calculator_leads",
} as const;

const updateLeadSchema = z.object({
  table: z.enum(["contact", "calculator"]),
  id: z.string().uuid(),
  status: z.enum(["ny", "kontaktet", "tilbud_sendt", "vundet", "tabt"]).optional(),
  admin_notes: z.string().max(5000).optional(),
});

export async function PATCH(req: Request) {
  if (!isAdminAuthenticated()) {
    return NextResponse.json({ error: "Ikke logget ind" }, { status: 401 });
  }

  try {
    const body = await req.json();
    const result = updateLeadSchema.safeParse(body);

    if (!result.success) {
      return NextResponse.json({ error: "Ugyldigt input data" }, { status: 400 });
    }

    const { table, id, status, admin_notes } = result.data;
    const update: Record<string, unknown> = {};
    if (status !== undefined) update.status = status;
    if (admin_notes !== undefined) update.admin_notes = admin_notes;

    if (Object.keys(update).length === 0) {
      return NextResponse.json({ error: "Ingen ændringer angivet" }, { status: 400 });
    }

    const { error: dbError } = await supabase
      .from(TABLES[table])
      .update(update)
      .eq("id", id);

    if (dbError) {
      console.error("Supabase error (admin update):", dbError);
      return NextResponse.json({ error: "Kunne ikke gemme ændringen" }, { status: 500 });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Admin leads API error:", error);
    return NextResponse.json({ error: "Der skete en fejl — prøv igen" }, { status: 500 });
  }
}
