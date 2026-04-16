import { z } from "zod";

export const contactFormSchema = z.object({
  name: z.string().min(2, "Navn skal være mindst 2 tegn"),
  email: z.string().email("Ugyldig e-mailadresse"),
  phone: z.string().min(8, "Telefonnummer skal være mindst 8 cifre"),
  message: z.string().optional(),
  model_interest: z.string().optional(),
});

export const calculatorLeadSchema = z.object({
  name: z.string().min(2, "Navn skal være mindst 2 tegn"),
  email: z.string().email("Ugyldig e-mailadresse"),
  phone: z.string().min(8, "Telefonnummer skal være mindst 8 cifre"),
  model_selected: z.string().optional(),
  options: z.any().optional(),
  estimated_price_from: z.number().optional(),
  estimated_price_to: z.number().optional(),
});
