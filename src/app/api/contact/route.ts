import { NextResponse } from "next/server";
import { contactFormSchema } from "@/lib/validations";
import { supabase } from "@/lib/supabase";
import { ratelimit } from "@/lib/ratelimit";
import { leadConfirmationHtml, leadConfirmationText } from "@/lib/lead-emails";
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
    const result = contactFormSchema.safeParse(body);
    
    if (!result.success) {
      return NextResponse.json({ error: "Ugyldigt input data", details: result.error.format() }, { status: 400 });
    }

    const { name, email, phone, message, model_interest } = result.data;

    // Bypass DB insert if local placeholder is used
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("your-project.supabase.co")) {
      console.log("Mocking DB insert locally");
    } else {
      const { error: dbError } = await supabase
        .from("contact_submissions")
        .insert([{ name, email, phone, message, model_interest, source: "contact_form" }]);

      if (dbError) {
        console.error("Supabase error:", dbError);
        return NextResponse.json({ error: "Der skete en fejl — prøv igen eller ring til os" }, { status: 500 });
      }
    }

    // Send emails. The lead is already saved at this point, so an email
    // failure must not fail the request — just log it.
    if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("YOUR_RESEND_API_KEY")) {
      const fromEmail = process.env.RESEND_FROM_EMAIL || "noreply@ecohus.dk";

      // 1) Intern notifikation til Ecohus
      try {
        await resend.emails.send({
          from: fromEmail,
          to: process.env.RESEND_NOTIFY_EMAIL || "kontakt@ecohus.dk",
          replyTo: email,
          subject: `Ny Kontaktforespørgsel fra ${name}`,
          text: `Navn: ${name}\nEmail: ${email}\nTelefon: ${phone}\nModel: ${model_interest || "Ikke angivet"}\n\nBesked:\n${message || "Ingen besked"}`,
        });
      } catch (emailError) {
        console.error("Resend error (contact, notify):", emailError);
      }

      // 2) Bekræftelse til lead'et
      try {
        const confirmation = {
          name,
          intro: "Tak for din henvendelse til Ecohus. Vi har modtaget din besked og har noteret følgende:",
          details: [
            ...(model_interest ? [{ label: "Model", value: model_interest }] : []),
            { label: "Telefon", value: phone },
            ...(message ? [{ label: "Besked", value: message }] : []),
          ],
        };
        await resend.emails.send({
          from: fromEmail,
          to: email,
          subject: "Vi har modtaget din henvendelse — Ecohus",
          html: leadConfirmationHtml(confirmation),
          text: leadConfirmationText(confirmation),
        });
      } catch (emailError) {
        console.error("Resend error (contact, confirmation):", emailError);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Der skete en fejl — prøv igen eller ring til os" }, { status: 500 });
  }
}
