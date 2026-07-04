"use client";

import { useMemo, useState } from "react";
import { useRouter } from "next/navigation";
import { ADDONS, FOUNDATIONS } from "@/lib/spec";
import {
  LEAD_STATUSES,
  LEAD_STATUS_LABELS,
  type CalculatorLead,
  type ContactLead,
  type LeadStatus,
} from "@/lib/admin-types";
import { cn } from "@/lib/utils";

type TableKey = "contact" | "calculator";

const STATUS_STYLES: Record<LeadStatus, string> = {
  ny: "bg-primary text-primary-foreground",
  kontaktet: "bg-amber-100 text-amber-900",
  tilbud_sendt: "bg-blue-100 text-blue-900",
  vundet: "bg-green-100 text-green-900",
  tabt: "bg-neutral-200 text-neutral-600",
};

function formatDate(iso: string) {
  return new Date(iso).toLocaleString("da-DK", {
    day: "numeric",
    month: "short",
    year: "numeric",
    hour: "2-digit",
    minute: "2-digit",
  });
}

function formatPrice(value: number | null) {
  if (!value) return null;
  return `${Number(value).toLocaleString("da-DK")} kr.`;
}

function StatusBadge({ status }: { status: LeadStatus }) {
  return (
    <span className={cn("inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium", STATUS_STYLES[status] ?? STATUS_STYLES.ny)}>
      {LEAD_STATUS_LABELS[status] ?? status}
    </span>
  );
}

function StatCard({ label, value }: { label: string; value: number }) {
  return (
    <div className="rounded-lg border bg-card p-4">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="text-3xl font-medium text-foreground">{value}</p>
    </div>
  );
}

function DetailRow({ label, value }: { label: string; value: React.ReactNode }) {
  if (value === null || value === undefined || value === "") return null;
  return (
    <div className="flex gap-2 text-sm">
      <span className="text-muted-foreground shrink-0 w-36">{label}</span>
      <span className="text-foreground">{value}</span>
    </div>
  );
}

function LeadCard({
  table,
  lead,
  details,
  onUpdated,
}: {
  table: TableKey;
  lead: ContactLead | CalculatorLead;
  details: React.ReactNode;
  onUpdated: (id: string, patch: { status?: LeadStatus; admin_notes?: string }) => void;
}) {
  const [expanded, setExpanded] = useState(false);
  const [notes, setNotes] = useState(lead.admin_notes ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const notesDirty = notes !== (lead.admin_notes ?? "");

  async function patchLead(patch: { status?: LeadStatus; admin_notes?: string }) {
    setSaving(true);
    setError(null);
    try {
      const res = await fetch("/api/admin/leads", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ table, id: lead.id, ...patch }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || "Kunne ikke gemme");
      }
      onUpdated(lead.id, patch);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Kunne ikke gemme");
    } finally {
      setSaving(false);
    }
  }

  return (
    <div className="rounded-lg border bg-card">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        className="w-full flex flex-wrap items-center gap-x-4 gap-y-2 p-4 text-left"
      >
        <div className="flex-1 min-w-[180px]">
          <p className="font-medium text-foreground leading-snug">{lead.name}</p>
          <p className="text-sm text-muted-foreground">{formatDate(lead.created_at)}</p>
        </div>
        <StatusBadge status={lead.status ?? "ny"} />
        <span className="text-sm text-muted-foreground">{expanded ? "Skjul" : "Vis"}</span>
      </button>

      {expanded && (
        <div className="border-t p-4 space-y-4">
          <div className="space-y-1.5">
            <DetailRow
              label="E-mail"
              value={<a href={`mailto:${lead.email}`} className="text-primary underline-offset-2 hover:underline">{lead.email}</a>}
            />
            <DetailRow
              label="Telefon"
              value={<a href={`tel:${lead.phone}`} className="text-primary underline-offset-2 hover:underline">{lead.phone}</a>}
            />
            {details}
          </div>

          <div className="flex flex-wrap items-center gap-3">
            <label className="text-sm text-muted-foreground" htmlFor={`status-${lead.id}`}>Status</label>
            <select
              id={`status-${lead.id}`}
              value={lead.status ?? "ny"}
              disabled={saving}
              onChange={(e) => patchLead({ status: e.target.value as LeadStatus })}
              className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            >
              {LEAD_STATUSES.map((s) => (
                <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>
              ))}
            </select>
          </div>

          <div className="space-y-2">
            <label className="text-sm text-muted-foreground" htmlFor={`notes-${lead.id}`}>Interne noter</label>
            <textarea
              id={`notes-${lead.id}`}
              value={notes}
              onChange={(e) => setNotes(e.target.value)}
              rows={3}
              placeholder="Fx: Ringet 3/7 — vil have tilbud på Fjord 70 med sedumtag…"
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
            />
            {notesDirty && (
              <button
                type="button"
                disabled={saving}
                onClick={() => patchLead({ admin_notes: notes })}
                className="rounded-md bg-primary px-3 py-1.5 text-sm text-primary-foreground font-medium hover:opacity-90 disabled:opacity-50"
              >
                {saving ? "Gemmer…" : "Gem noter"}
              </button>
            )}
          </div>

          {error && <p className="text-sm text-destructive">{error}</p>}
        </div>
      )}
    </div>
  );
}

function calculatorDetails(lead: CalculatorLead) {
  const foundation =
    FOUNDATIONS.find((f) => f.id === lead.options?.foundation)?.title || lead.options?.foundation;
  const addons = (lead.options?.addons || []).map(
    (id) => ADDONS.find((a) => a.id === id)?.title || id
  );

  return (
    <>
      <DetailRow label="Må ringes op" value={lead.call_consent ? "Ja" : "Nej"} />
      {lead.is_custom_build ? (
        <>
          <DetailRow label="Type" value="Byg selv / egen plantegning" />
          <DetailRow label="Kvadratmeter" value={lead.custom_m2 ? `${lead.custom_m2} m²` : null} />
          <DetailRow label="Tag-type" value={lead.custom_roof} />
          <DetailRow label="Prisklasse" value={lead.custom_tier} />
          <DetailRow label="Fundament" value={foundation} />
        </>
      ) : (
        <>
          <DetailRow label="Type" value="Standardmodel" />
          <DetailRow label="Model" value={lead.model_selected} />
          <DetailRow label="Tilvalg" value={addons.length ? addons.join(", ") : "Ingen"} />
          <DetailRow label="Fundament" value={foundation} />
          <DetailRow label="Estimeret pris" value={formatPrice(lead.estimated_price_from)} />
        </>
      )}
    </>
  );
}

function contactDetails(lead: ContactLead) {
  return (
    <>
      <DetailRow label="Model-interesse" value={lead.model_interest} />
      <DetailRow label="Besked" value={lead.message ? <span className="whitespace-pre-wrap">{lead.message}</span> : null} />
    </>
  );
}

export function AdminDashboard({
  contactLeads: initialContacts,
  calculatorLeads: initialCalculators,
  loadError,
}: {
  contactLeads: ContactLead[];
  calculatorLeads: CalculatorLead[];
  loadError: string | null;
}) {
  const router = useRouter();
  const [contacts, setContacts] = useState(initialContacts);
  const [calculators, setCalculators] = useState(initialCalculators);
  const [activeTab, setActiveTab] = useState<TableKey>("calculator");
  const [statusFilter, setStatusFilter] = useState<LeadStatus | "alle">("alle");

  const allLeads = useMemo(() => [...contacts, ...calculators], [contacts, calculators]);
  const stats = useMemo(
    () => ({
      total: allLeads.length,
      new: allLeads.filter((l) => (l.status ?? "ny") === "ny").length,
      inProgress: allLeads.filter((l) => l.status === "kontaktet" || l.status === "tilbud_sendt").length,
      won: allLeads.filter((l) => l.status === "vundet").length,
    }),
    [allLeads]
  );

  function applyPatch<T extends ContactLead | CalculatorLead>(
    setList: React.Dispatch<React.SetStateAction<T[]>>
  ) {
    return (id: string, patch: { status?: LeadStatus; admin_notes?: string }) =>
      setList((list) => list.map((l) => (l.id === id ? { ...l, ...patch } : l)));
  }

  async function handleLogout() {
    await fetch("/api/admin/login", { method: "DELETE" });
    router.refresh();
  }

  const visible = (activeTab === "calculator" ? calculators : contacts).filter(
    (l) => statusFilter === "alle" || (l.status ?? "ny") === statusFilter
  );

  return (
    <div className="container mx-auto px-4 md:px-8 py-12 md:py-16 max-w-5xl">
      <div className="flex flex-wrap items-center justify-between gap-4 mb-8">
        <div>
          <h1 className="text-3xl md:text-4xl font-medium text-foreground">Lead-oversigt</h1>
          <p className="text-muted-foreground mt-1">Alle henvendelser fra kontaktformularen og prisberegneren.</p>
        </div>
        <button
          type="button"
          onClick={handleLogout}
          className="rounded-md border border-input bg-background px-4 py-2 text-sm font-medium hover:bg-muted"
        >
          Log ud
        </button>
      </div>

      {loadError && (
        <div className="mb-8 rounded-lg border border-destructive/40 bg-destructive/10 p-4 text-sm text-destructive">
          {loadError}
        </div>
      )}

      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
        <StatCard label="Leads i alt" value={stats.total} />
        <StatCard label="Nye" value={stats.new} />
        <StatCard label="I dialog" value={stats.inProgress} />
        <StatCard label="Vundet" value={stats.won} />
      </div>

      <div className="flex flex-wrap items-center justify-between gap-4 mb-6">
        <div className="inline-flex rounded-lg border bg-card p-1">
          {(
            [
              ["calculator", `Prisberegner (${calculators.length})`],
              ["contact", `Kontaktformular (${contacts.length})`],
            ] as [TableKey, string][]
          ).map(([key, label]) => (
            <button
              key={key}
              type="button"
              onClick={() => setActiveTab(key)}
              className={cn(
                "rounded-md px-4 py-1.5 text-sm font-medium transition-colors",
                activeTab === key ? "bg-primary text-primary-foreground" : "text-muted-foreground hover:text-foreground"
              )}
            >
              {label}
            </button>
          ))}
        </div>

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as LeadStatus | "alle")}
          className="rounded-md border border-input bg-background px-3 py-1.5 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
          aria-label="Filtrér efter status"
        >
          <option value="alle">Alle statusser</option>
          {LEAD_STATUSES.map((s) => (
            <option key={s} value={s}>{LEAD_STATUS_LABELS[s]}</option>
          ))}
        </select>
      </div>

      <div className="space-y-3">
        {visible.length === 0 && (
          <p className="text-muted-foreground text-sm py-8 text-center">Ingen leads matcher filteret.</p>
        )}
        {activeTab === "calculator"
          ? (visible as CalculatorLead[]).map((lead) => (
              <LeadCard
                key={lead.id}
                table="calculator"
                lead={lead}
                details={calculatorDetails(lead)}
                onUpdated={applyPatch(setCalculators)}
              />
            ))
          : (visible as ContactLead[]).map((lead) => (
              <LeadCard
                key={lead.id}
                table="contact"
                lead={lead}
                details={contactDetails(lead)}
                onUpdated={applyPatch(setContacts)}
              />
            ))}
      </div>
    </div>
  );
}
