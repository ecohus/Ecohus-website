# Worklog — Ecohus

## 2026-07-04 — Lead-tracking, admin-dashboard, e-mails & sikkerhed

### Nyt: Admin-dashboard (`/admin`)
- Password-beskyttet dashboard der viser **alle leads** fra både kontaktformularen
  (`contact_submissions`) og prisberegneren (`price_calculator_leads`).
- Statistik-overblik: leads i alt, nye, i dialog, vundet.
- Pr. lead: udvidelig visning med alle detaljer (e-mail/telefon som klikbare links,
  model, tilvalg, fundament, estimeret pris, byg selv-felter, opkalds-samtykke).
- Lead-tracking: status **Ny → Kontaktet → Tilbud sendt → Vundet / Tabt** + interne
  noter. Gemmes direkte i Supabase via `PATCH /api/admin/leads`.
- Filtrering på status og faneblade pr. lead-type.
- Siden er `noindex` og server-renderet dynamisk.

**Filer:** `src/app/admin/page.tsx`, `src/components/admin/AdminDashboard.tsx`,
`src/components/admin/AdminLogin.tsx`, `src/app/api/admin/leads/route.ts`,
`src/lib/admin-types.ts`

### Nyt: Login via Supabase Auth
- Login på `/admin` sker med **e-mail + adgangskode fra en Supabase Auth-bruger**
  (oprettes i Supabase → Authentication → Users). Første version brugte en
  `ADMIN_PASSWORD`-miljøvariabel; den blev samme dag erstattet af Supabase Auth.
- Serveren verificerer login via `signInWithPassword` og udsteder sin egen
  HMAC-signerede, httpOnly session-cookie (7 dage), signeret med service role-nøglen.
- Valgfri allowlist: `ADMIN_ALLOWED_EMAILS` (kommasepareret) begrænser hvilke
  konti der kan logge ind — tjekkes både ved login og på hver request.
- Rate limiting på login-endpointet (samme Upstash-limiter som formularerne).

**Filer:** `src/lib/admin-auth.ts`, `src/app/api/admin/login/route.ts`

### Nyt: Supabase-migration + RLS (til klienten)
- `supabase/migration-002-lead-tracking-rls.sql` — idempotent script til
  Supabase SQL Editor:
  - Basis-tabeller (hvis de mangler) + `status`/`admin_notes`/`updated_at`-kolonner.
  - `updated_at`-trigger, status-constraints og indexes.
  - **RLS slået til uden offentlige policies** — kun serverens service role-nøgle
    har adgang til lead-data (persondata).
- `SUPABASE-OPSAETNING.md` — trin-for-trin guide til klienten: kør migrationen,
  opret admin-bruger, slå offentlig signup fra, sæt miljøvariabler, verificér.

### Ændret: Resend sender nu to mails pr. lead
- **Til Ecohus** (`RESEND_NOTIFY_EMAIL`): intern notifikation med alle detaljer,
  reply-to sat til kundens e-mail (uændret adfærd).
- **Til kunden (nyt)**: brandet dansk bekræftelsesmail (HTML + ren tekst) med
  kvittering for henvendelsen hhv. prisoverslag fra beregneren.
- E-mail-fejl vælter aldrig requesten — lead'et er allerede gemt i databasen.

**Filer:** `src/lib/lead-emails.ts`, `src/app/api/contact/route.ts`,
`src/app/api/calculator-lead/route.ts`

### Sikkerhed: `.env` fjernet fra git
- `.env` med rigtige nøgler lå committet i repoet (før dette arbejde).
- Fjernet fra tracking, tilføjet til `.gitignore`, og **renset ud af hele
  git-historikken** (`git filter-branch` + force push af `main`).
- De tre gamle `claude/*`-branches, der stadig havde `.env` i historikken, blev
  verificeret indholds-merged til `main` (ingen unik kode gik tabt) og derefter
  slettet fra GitHub. `main` er nu eneste branch.
- **Udestående (manuelt):** rotér alle nøgler, der lå i den gamle `.env` —
  Supabase (anon + service role), Resend, Sanity og Upstash — og opdatér dem i
  hosting-miljøets miljøvariabler.

### Verificeret
- `npm run build` uden fejl; alle routes bygger (26 sider).
- Smoke-test af produktion-build: `/`, `/prisberegner`, `/kontakt`, `/admin`
  svarer 200.
- Auth-flow testet: forkert adgangskode afvist, forfalskede og udløbne cookies
  afvist, gyldig session viser dashboardet, allowlist blokerer både login og
  eksisterende sessions for ikke-tilladte e-mails, uautoriseret `PATCH` afvist.
- Bekræftet at `.env` ikke findes i historikken på nogen branch på GitHub.

### Udestående opgaver
| Hvem | Opgave |
|---|---|
| Klient | Kør `supabase/migration-002-lead-tracking-rls.sql` i SQL Editor |
| Klient | Opret admin-bruger + slå "Allow new users to sign up" fra |
| Klient | Kopiér `service_role`-nøglen til hostingens miljøvariabler (`SUPABASE_SERVICE_ROLE_KEY`) — aldrig pr. mail/chat |
| Klient | Verificér `ecohus.dk` i Resend (DNS: SPF/DKIM) |
| Udvikler | Rotér Supabase-, Resend-, Sanity- og Upstash-nøgler og opdatér Vercel |
| Udvikler | Sæt `ADMIN_ALLOWED_EMAILS` i Vercel (anbefalet) |
