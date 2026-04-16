import { NextResponse } from "next/server";
import { calculatorLeadSchema } from "@/lib/validations";
import { supabase } from "@/lib/supabase";
import { ratelimit } from "@/lib/ratelimit";
import { Resend } from "resend";

const resend = new Resend(process.env.RESEND_API_KEY || "missing");

export async function POST(req: Request) {
  try {
    const ip = req.headers.get("x-forwarded-for") ?? "127.0.0.1";
    const { success: rateLimitSuccess } = await ratelimit.limit(ip);
    
    if (!rateLimitSuccess) {
      return NextResponse.json({ error: "For mange forsøg — prøv igen om lidt" }, { status: 429 });
    }

    const body = await req.json();
    const result = calculatorLeadSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: "Ugyldigt input data", details: result.error.format() }, { status: 400 });
    }

    const { name, email, phone, model_selected, options, estimated_price_from, estimated_price_to } = result.data;

    const { error: dbError } = await supabase
      .from("price_calculator_leads")
      .insert([{ name, email, phone, model_selected, options, estimated_price_from, estimated_price_to }]);

    if (dbError) {
      console.error("Supabase error:", dbError);
      return NextResponse.json({ error: "Der skete en fejl — prøv igen eller ring til os" }, { status: 500 });
    }

    if (process.env.RESEND_API_KEY) {
      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@ecohus.dk",
        to: process.env.RESEND_NOTIFY_EMAIL || "kontakt@ecohus.dk",
        subject: `Nyt Prisberegner Lead: ${name}`,
        text: `Navn: ${name}\nEmail: ${email}\nTelefon: ${phone}\nModel: ${model_selected || "Ikke angivet"}\nForsigtig Prisoverslag: ${estimated_price_from} - ${estimated_price_to} kr\n\nMuligheder valg:\n${JSON.stringify(options, null, 2)}`,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Der skete en fejl — prøv igen eller ring til os" }, { status: 500 });
  }
}
