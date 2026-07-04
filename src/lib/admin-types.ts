export const LEAD_STATUSES = ["ny", "kontaktet", "tilbud_sendt", "vundet", "tabt"] as const;
export type LeadStatus = (typeof LEAD_STATUSES)[number];

export const LEAD_STATUS_LABELS: Record<LeadStatus, string> = {
  ny: "Ny",
  kontaktet: "Kontaktet",
  tilbud_sendt: "Tilbud sendt",
  vundet: "Vundet",
  tabt: "Tabt",
};

interface LeadBase {
  id: string;
  name: string;
  email: string;
  phone: string;
  status: LeadStatus;
  admin_notes: string | null;
  created_at: string;
}

export interface ContactLead extends LeadBase {
  message: string | null;
  model_interest: string | null;
  source: string | null;
}

export interface CalculatorLead extends LeadBase {
  model_selected: string | null;
  options: { addons?: string[]; foundation?: string } | null;
  estimated_price_from: number | null;
  estimated_price_to: number | null;
  is_custom_build: boolean | null;
  custom_m2: number | null;
  custom_roof: string | null;
  custom_tier: string | null;
  call_consent: boolean | null;
}
