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

    const contentType = req.headers.get("content-type") || "";
    let parsedData: any;
    let fileBuffer: Buffer | null = null;
    let fileName = "plantegning.pdf";

    if (contentType.includes("multipart/form-data")) {
      const formData = await req.formData();
      const rawData = Object.fromEntries(formData.entries());
      
      const file = formData.get("file") as File | null;
      if (file && file.size > 0) {
        fileName = file.name;
        fileBuffer = Buffer.from(await file.arrayBuffer());
      }
      
      parsedData = {
        name: rawData.name,
        email: rawData.email,
        phone: rawData.phone,
        model_selected: rawData.model_selected,
        options: rawData.options ? JSON.parse(rawData.options as string) : undefined,
        estimated_price_from: rawData.estimated_price_from ? Number(rawData.estimated_price_from) : undefined,
        estimated_price_to: rawData.estimated_price_to ? Number(rawData.estimated_price_to) : undefined,
        is_custom_build: rawData.is_custom_build === "true",
        custom_m2: rawData.custom_m2 ? Number(rawData.custom_m2) : undefined,
        custom_roof: rawData.custom_roof,
        custom_tier: rawData.custom_tier,
      };
    } else {
      parsedData = await req.json();
    }

    const result = calculatorLeadSchema.safeParse(parsedData);
    
    if (!result.success) {
      return NextResponse.json({ error: "Ugyldigt input data", details: result.error.format() }, { status: 400 });
    }

    const { name, email, phone, model_selected, options, estimated_price_from, estimated_price_to, is_custom_build, custom_m2, custom_roof, custom_tier } = result.data;

    // Bypass DB insert if local placeholder is used
    if (process.env.NEXT_PUBLIC_SUPABASE_URL?.includes("your-project.supabase.co")) {
      console.log("Mocking DB insert locally");
    } else {
      const { error: dbError } = await supabase
        .from("price_calculator_leads")
        .insert([{ 
          name, 
          email, 
          phone, 
          model_selected, 
          options, 
          estimated_price_from, 
          estimated_price_to,
          is_custom_build,
          custom_m2,
          custom_roof,
          custom_tier
        }]);

      if (dbError) {
        console.error("Supabase error:", dbError);
        return NextResponse.json({ error: "Der skete en fejl — prøv igen eller ring til os" }, { status: 500 });
      }
    }

    // Bypass Email if local placeholder is used
    if (process.env.RESEND_API_KEY && !process.env.RESEND_API_KEY.includes("YOUR_RESEND_API_KEY")) {
      let emailText = `Navn: ${name}\nEmail: ${email}\nTelefon: ${phone}\n\n`;
      
      if (is_custom_build) {
        emailText += `Type: BYG SELV\n`;
        emailText += `Kvadratmeter: ${custom_m2 || "Ikke angivet"}\n`;
        emailText += `Tag-type: ${custom_roof || "Ikke angivet"}\n`;
        emailText += `Prisklasse: ${custom_tier || "Ikke angivet"}\n`;
        emailText += `Fundament: ${options?.foundation || "Ikke angivet"}\n`;
      } else {
        emailText += `Type: STANDARD MODEL\n`;
        emailText += `Model: ${model_selected || "Ikke angivet"}\n`;
        emailText += `Muligheder valg:\n${JSON.stringify(options, null, 2)}\n`;
        emailText += `Forsigtig Prisoverslag: ${estimated_price_from} - ${estimated_price_to} kr\n`;
      }

      await resend.emails.send({
        from: process.env.RESEND_FROM_EMAIL || "noreply@ecohus.dk",
        to: process.env.RESEND_NOTIFY_EMAIL || "kontakt@ecohus.dk",
        subject: `Nyt Prisberegner Lead: ${name} ${is_custom_build ? "(Byg Selv)" : ""}`,
        text: emailText,
        attachments: fileBuffer ? [
          {
            filename: fileName,
            content: fileBuffer,
          }
        ] : undefined,
      });
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("API error:", error);
    return NextResponse.json({ error: "Der skete en fejl — prøv igen eller ring til os" }, { status: 500 });
  }
}
