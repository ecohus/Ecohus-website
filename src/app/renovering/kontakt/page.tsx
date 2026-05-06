"use client";

import { useState } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema } from "@/lib/validations";
import { z } from "zod";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  CheckCircle2,
  Loader2,
  AlertCircle,
  Phone,
  Mail,
  MapPin,
  Clock,
  ArrowRight,
} from "lucide-react";
import Link from "next/link";

type ContactFormValues = z.infer<typeof contactFormSchema>;

const renovationTypes = [
  "Køkkenrenovering",
  "Baderenovering",
  "Facade & Tag",
  "Totalrenovering",
  "Andet",
];

const fieldBase =
  "w-full rounded-xl border border-[#BBD1C2] bg-white/70 px-4 py-3 text-[#1E2B22] placeholder-[#B89F86] focus:outline-none focus:ring-2 focus:ring-[#587F66]/30 focus:border-[#587F66] transition-all duration-200";

function RenovationContactForm() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);
  const [selectedType, setSelectedType] = useState<string>("");

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: { model_interest: "" },
  });

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setServerError(null);
    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ ...data, source: "renovering" }),
      });
      const result = await res.json();
      if (!res.ok) {
        setServerError(result.error || "Der skete en fejl");
      } else {
        setIsSuccess(true);
      }
    } catch {
      setServerError("Der opstod en netværksfejl. Prøv igen senere.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center py-20 px-8">
        <div className="w-20 h-20 rounded-full bg-[#587F66]/10 flex items-center justify-center mb-8">
          <CheckCircle2 className="w-10 h-10 text-[#587F66]" />
        </div>
        <h3
          className="mb-4 text-[#1E2B22]"
          style={{
            fontFamily: "var(--font-cormorant)",
            fontSize: "2rem",
            fontStyle: "italic",
            fontWeight: 400,
          }}
        >
          Tak for din henvendelse!
        </h3>
        <p
          className="text-[#65806D] max-w-sm leading-relaxed"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Vi har modtaget din besked og vender tilbage inden for 1–2 hverdage.
        </p>
        <Link
          href="/renovering"
          className="mt-10 inline-flex items-center gap-2 px-6 py-3 rounded-full bg-[#587F66] text-white text-sm font-medium hover:bg-[#456952] transition-colors"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Tilbage til forsiden
        </Link>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="p-4 bg-red-50 text-red-700 rounded-xl flex items-center gap-3 border border-red-200">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium" style={{ fontFamily: "var(--font-dm-sans)" }}>
            {serverError}
          </p>
        </div>
      )}

      {/* Name */}
      <div className="space-y-2">
        <Label
          htmlFor="renov-name"
          className="text-sm font-medium text-[#5C3A1E]"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Navn *
        </Label>
        <input
          id="renov-name"
          placeholder="Jens Jensen"
          {...register("name")}
          disabled={isSubmitting}
          className={`${fieldBase} ${errors.name ? "border-red-400 focus:ring-red-200 focus:border-red-400" : ""}`}
          style={{ fontFamily: "var(--font-dm-sans)" }}
        />
        {errors.name && (
          <p className="text-sm text-red-600" style={{ fontFamily: "var(--font-dm-sans)" }}>
            {errors.name.message}
          </p>
        )}
      </div>

      {/* Email + Phone */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        <div className="space-y-2">
          <Label
            htmlFor="renov-email"
            className="text-sm font-medium text-[#5C3A1E]"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            E-mail *
          </Label>
          <input
            id="renov-email"
            type="email"
            placeholder="jens@example.com"
            {...register("email")}
            disabled={isSubmitting}
            className={`${fieldBase} ${errors.email ? "border-red-400" : ""}`}
            style={{ fontFamily: "var(--font-dm-sans)" }}
          />
          {errors.email && (
            <p className="text-sm text-red-600" style={{ fontFamily: "var(--font-dm-sans)" }}>
              {errors.email.message}
            </p>
          )}
        </div>

        <div className="space-y-2">
          <Label
            htmlFor="renov-phone"
            className="text-sm font-medium text-[#5C3A1E]"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Telefon *
          </Label>
          <input
            id="renov-phone"
            type="tel"
            placeholder="+45 12 34 56 78"
            {...register("phone")}
            disabled={isSubmitting}
            className={`${fieldBase} ${errors.phone ? "border-red-400" : ""}`}
            style={{ fontFamily: "var(--font-dm-sans)" }}
          />
          {errors.phone && (
            <p className="text-sm text-red-600" style={{ fontFamily: "var(--font-dm-sans)" }}>
              {errors.phone.message}
            </p>
          )}
        </div>
      </div>

      {/* Renovation type */}
      <div className="space-y-2">
        <Label
          htmlFor="renov-type"
          className="text-sm font-medium text-[#5C3A1E]"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Hvad ønsker du renoveret?
        </Label>
        <Select
          onValueChange={(val: string | null) => {
            if (!val) return;
            setSelectedType(val);
            setValue("model_interest", val === "Andet" ? "" : val);
          }}
          disabled={isSubmitting}
        >
          <SelectTrigger
            id="renov-type"
            className="border-[#BBD1C2] bg-white/70 text-[#1E2B22] focus:ring-[#587F66]/30 rounded-xl h-12"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            <SelectValue placeholder="Vælg renovationstype (valgfrit)" />
          </SelectTrigger>
          <SelectContent>
            {renovationTypes.map((type) => (
              <SelectItem key={type} value={type} style={{ fontFamily: "var(--font-dm-sans)" }}>
                {type}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      {/* Message */}
      <div className="space-y-2">
        <Label
          htmlFor="renov-message"
          className="text-sm font-medium text-[#5C3A1E]"
          style={{ fontFamily: "var(--font-dm-sans)" }}
        >
          Beskriv dit projekt (valgfrit)
        </Label>
        <textarea
          id="renov-message"
          placeholder="Fortæl os om omfanget af renoveringen, tidsperspektiv, særlige ønsker..."
          rows={5}
          {...register("message")}
          disabled={isSubmitting}
          className={`${fieldBase} resize-none`}
          style={{ fontFamily: "var(--font-dm-sans)" }}
        />
      </div>

      <button
        type="submit"
        disabled={isSubmitting}
        className="w-full flex items-center justify-center gap-2 px-6 py-4 rounded-xl bg-[#587F66] text-white font-medium hover:bg-[#456952] disabled:opacity-60 transition-all duration-300 shadow-lg hover:shadow-[#587F66]/20 hover:-translate-y-0.5"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 animate-spin" />
            Sender...
          </>
        ) : (
          <>
            Send henvendelse
            <ArrowRight className="w-4 h-4" />
          </>
        )}
      </button>

      <p
        className="text-xs text-[#B89F86] text-center"
        style={{ fontFamily: "var(--font-dm-sans)" }}
      >
        Ved at indsende denne formular accepterer du, at vi kontakter dig via telefon og e-mail i
        forbindelse med din forespørgsel.
      </p>
    </form>
  );
}

export default function RenoveringKontaktPage() {
  return (
    <div className="min-h-screen bg-[#F3F5F4]">
      {/* Hero header */}
      <div className="relative bg-[#1E2B22] py-28 overflow-hidden">
        <div
          className="absolute inset-0 opacity-10"
          style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E")`,
          }}
        />
        <div className="relative container mx-auto px-4 md:px-8 text-center">
          <p
            className="text-[#A2BDAA] text-sm tracking-[0.3em] uppercase mb-6"
            style={{ fontFamily: "var(--font-dm-sans)" }}
          >
            Ecohus Renovering
          </p>
          <h1
            className="text-white mb-6"
            style={{
              fontFamily: "var(--font-cormorant)",
              fontSize: "clamp(2.5rem, 6vw, 5rem)",
              fontWeight: 300,
              fontStyle: "italic",
              lineHeight: 1.1,
            }}
          >
            Lad os tage en snak
          </h1>
          <p
            className="text-white/60 max-w-xl mx-auto leading-relaxed"
            style={{ fontFamily: "var(--font-dm-sans)", fontSize: "1.05rem" }}
          >
            Overvejer du en renovering? Udfyld formularen — vi vender tilbage inden for 24 timer med et uforpligtende tilbud.
          </p>
        </div>
      </div>

      {/* Main content */}
      <div className="container mx-auto px-4 md:px-8 py-20">
        <div className="flex flex-col lg:flex-row gap-16 max-w-6xl mx-auto">

          {/* Form */}
          <div className="flex-1">
            <h2
              className="mb-8 text-[#1E2B22]"
              style={{
                fontFamily: "var(--font-cormorant)",
                fontSize: "2rem",
                fontWeight: 500,
                fontStyle: "italic",
              }}
            >
              Send en besked
            </h2>
            <RenovationContactForm />
          </div>

          {/* Info sidebar */}
          <div className="w-full lg:w-[380px] shrink-0">
            <div className="rounded-3xl p-8 sticky top-32 border border-[#BBD1C2] bg-[#E4EBE6]">
              <h2
                className="mb-8 text-[#1E2B22]"
                style={{
                  fontFamily: "var(--font-cormorant)",
                  fontSize: "1.8rem",
                  fontWeight: 500,
                  fontStyle: "italic",
                }}
              >
                Kontakt os direkte
              </h2>

              <div className="flex flex-col gap-7">
                {[
                  {
                    icon: Phone,
                    label: "Telefon",
                    value: "+45 55 25 55 10",
                    href: "tel:+4555255510",
                    sub: "Hverdage kl. 09.00 – 15.00",
                  },
                  {
                    icon: Mail,
                    label: "E-mail",
                    value: "kontakt@ecohus.dk",
                    href: "mailto:kontakt@ecohus.dk",
                    sub: "Vi svarer typisk inden for 24 timer",
                  },
                  {
                    icon: MapPin,
                    label: "Adresse",
                    value: "Thrigesvej 37A",
                    sub: "7430 Ikast",
                  },
                ].map(({ icon: Icon, label, value, href, sub }) => (
                  <div key={label} className="flex items-start gap-4">
                    <div className="w-11 h-11 rounded-xl bg-[#587F66]/10 flex items-center justify-center shrink-0">
                      <Icon className="w-5 h-5 text-[#587F66]" />
                    </div>
                    <div>
                      <p
                        className="text-xs font-medium text-[#65806D] uppercase tracking-wider mb-1"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {label}
                      </p>
                      {href ? (
                        <a
                          href={href}
                          className="text-[#1E2B22] font-medium hover:text-[#587F66] transition-colors"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                          {value}
                        </a>
                      ) : (
                        <p
                          className="text-[#1E2B22] font-medium"
                          style={{ fontFamily: "var(--font-dm-sans)" }}
                        >
                          {value}
                        </p>
                      )}
                      <p
                        className="text-sm text-[#65806D] mt-0.5"
                        style={{ fontFamily: "var(--font-dm-sans)" }}
                      >
                        {sub}
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              {/* Trust note */}
              <div className="mt-10 pt-8 border-t border-[#BBD1C2]">
                <div className="flex items-center gap-2 mb-2">
                  <Clock className="w-4 h-4 text-[#587F66]" />
                  <p
                    className="text-sm font-medium text-[#1E2B22]"
                    style={{ fontFamily: "var(--font-dm-sans)" }}
                  >
                    Svar inden for 24 timer
                  </p>
                </div>
                <p
                  className="text-sm text-[#65806D] leading-relaxed"
                  style={{ fontFamily: "var(--font-dm-sans)" }}
                >
                  Vi tilbyder altid en gratis og uforpligtende konsultation, inden vi giver et konkret tilbud.
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
