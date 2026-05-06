"use client";

import { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { contactFormSchema } from "@/lib/validations";
import { z } from "zod";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useSearchParams } from "next/navigation";
import { CheckCircle2, Loader2, AlertCircle } from "lucide-react";

type ContactFormValues = z.infer<typeof contactFormSchema>;

export function ContactForm({ models }: { models: { name: string }[] }) {
  const searchParams = useSearchParams();
  const initialModel = searchParams.get("model") || "";

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [serverError, setServerError] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<ContactFormValues>({
    resolver: zodResolver(contactFormSchema),
    defaultValues: {
      model_interest: initialModel,
    },
  });

  const selectedModel = watch("model_interest");

  // Sync state if select changes manually via UI
  // RHF and shadcn Select need manual sync since shadcn select isn't a native input
  const handleModelChange = (value: string | null) => {
    if (!value) return;
    setValue("model_interest", value === "ikke_specifik" ? "" : value);
  };

  const onSubmit = async (data: ContactFormValues) => {
    setIsSubmitting(true);
    setServerError(null);

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      const result = await res.json();

      if (!res.ok) {
        setServerError(result.error || "Der skete en fejl");
      } else {
        setIsSuccess(true);
      }
    } catch (err) {
      setServerError("Der opstod en netværksfejl. Prøv igen senere.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="flex flex-col items-center justify-center text-center p-12 bg-muted rounded-2xl border border-primary/20">
        <CheckCircle2 className="w-16 h-16 text-primary mb-6" />
        <h3 className="text-2xl font-medium text-foreground mb-4">Tak for din henvendelse!</h3>
        <p className="text-muted-foreground text-lg">Vi har modtaget din besked og vender tilbage inden for 1–2 hverdage.</p>
        <Button variant="outline" className="mt-8" onClick={() => window.location.href = "/"}>Tilbage til forsiden</Button>
      </div>
    );
  }

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
      {serverError && (
        <div className="p-4 bg-destructive/10 text-destructive rounded-lg flex items-center gap-3 border border-destructive/20">
          <AlertCircle className="w-5 h-5 shrink-0" />
          <p className="text-sm font-medium">{serverError}</p>
        </div>
      )}

      <div className="space-y-2">
        <Label htmlFor="name">Navn *</Label>
        <Input
          id="name"
          placeholder="Jens Jensen"
          {...register("name")}
          className={errors.name ? "border-destructive" : ""}
          disabled={isSubmitting}
        />
        {errors.name && <p className="text-sm text-destructive">{errors.name.message}</p>}
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="space-y-2">
          <Label htmlFor="email">E-mail *</Label>
          <Input
            id="email"
            type="email"
            placeholder="jens@example.com"
            {...register("email")}
            className={errors.email ? "border-destructive" : ""}
            disabled={isSubmitting}
          />
          {errors.email && <p className="text-sm text-destructive">{errors.email.message}</p>}
        </div>

        <div className="space-y-2">
          <Label htmlFor="phone">Telefon *</Label>
          <Input
            id="phone"
            type="tel"
            placeholder="+45 12 34 56 78"
            {...register("phone")}
            className={errors.phone ? "border-destructive" : ""}
            disabled={isSubmitting}
          />
          {errors.phone && <p className="text-sm text-destructive">{errors.phone.message}</p>}
        </div>
      </div>

      <div className="space-y-2">
        <Label htmlFor="model_interest">Er du interesseret i en bestemt model?</Label>
        <Select 
          onValueChange={handleModelChange} 
          defaultValue={initialModel || undefined}
          disabled={isSubmitting}
        >
          <SelectTrigger id="model_interest">
            <SelectValue placeholder="Vælg en model (valgfrit)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="ikke_specifik">Ikke specifik model</SelectItem>
            {models.map((model) => (
              <SelectItem key={model.name} value={model.name}>
                {model.name}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-2">
        <Label htmlFor="message">Besked (valgfrit)</Label>
        <Textarea
          id="message"
          placeholder="Skriv til os angående dine ønsker til materialer, grund, osv..."
          rows={5}
          {...register("message")}
          disabled={isSubmitting}
        />
      </div>

      <Button type="submit" size="lg" className="w-full text-base h-12" disabled={isSubmitting}>
        {isSubmitting ? (
          <>
            <Loader2 className="w-5 h-5 mr-2 animate-spin" /> 
            Sender...
          </>
        ) : (
          "Bliv ringet op"
        )}
      </Button>
      
      <p className="text-xs text-muted-foreground text-center mt-4">
        Ved at indsende denne formular accepterer du, at vi kontakter dig via telefon og e-mail i forbindelse med din forespørgsel.
      </p>
    </form>
  );
}
