# Supabase-opsætning — Ecohus leads & admin-dashboard

Dette dokument beskriver, hvad der skal køres i Supabase, så alle leads gemmes,
trackes og kan ses i admin-dashboardet på `/admin`.

## 1. Kør migrationen i SQL Editor

1. Log ind på [supabase.com](https://supabase.com) og åbn Ecohus-projektet.
2. Gå til **SQL Editor** i venstremenuen → klik **New query**.
3. Kopiér hele indholdet af filen [`supabase/migration-002-lead-tracking-rls.sql`](supabase/migration-002-lead-tracking-rls.sql) ind.
4. Klik **Run**.

Scriptet er idempotent — det kan køres flere gange uden at ødelægge noget.

Migrationen gør følgende:

- Opretter tabellerne `contact_submissions` og `price_calculator_leads`, hvis de ikke findes.
- Tilføjer lead-tracking kolonner: `status` (`ny` / `kontaktet` / `tilbud_sendt` / `vundet` / `tabt`), `admin_notes` og `updated_at`.
- Opretter indexes på `created_at` og `status`.
- **Slår Row Level Security (RLS) til** på begge tabeller uden offentlige policies.
  Det betyder, at den offentlige anon-nøgle ikke kan læse eller skrive leads —
  al adgang går gennem serverens service role-nøgle. Det er den sikre opsætning,
  da leads indeholder persondata (navn, e-mail, telefon).

## 2. Opret admin-bruger (login til dashboardet)

Admin-dashboardet bruger Supabase Auth. Sådan oprettes en bruger, der kan logge ind:

1. Gå til **Authentication → Users** i Supabase → klik **Add user** → **Create new user**.
2. Indtast e-mail og en stærk adgangskode, og sæt flueben i **Auto Confirm User**.
3. **Vigtigt:** Slå offentlig tilmelding fra, så fremmede ikke kan oprette sig selv:
   **Authentication → Sign In / Providers → Email** → slå **"Allow new users to sign up"** FRA.
4. (Anbefalet ekstra lås) Sæt miljøvariablen `ADMIN_ALLOWED_EMAILS` til de e-mails,
   der må logge ind, fx `kontakt@ecohus.dk` — så har kun de konti adgang, uanset
   hvad der ellers findes af brugere.

Flere personer kan få adgang ved blot at oprette flere brugere (og tilføje dem
til `ADMIN_ALLOWED_EMAILS`, hvis den er sat).

## 3. Miljøvariabler (Vercel / hosting)

Efter migrationen SKAL disse være sat i hosting-miljøet, ellers fejler formularerne:

| Variabel | Hvor findes den | Bruges til |
|---|---|---|
| `NEXT_PUBLIC_SUPABASE_URL` | Supabase → Settings → API → Project URL | Forbindelse til databasen |
| `NEXT_PUBLIC_SUPABASE_ANON_KEY` | Supabase → Settings → API → `anon` / publishable key | Login-tjek mod Supabase Auth |
| `SUPABASE_SERVICE_ROLE_KEY` | Supabase → Settings → API → `service_role` (klik "Reveal") | Server-adgang der bypasser RLS. **Må aldrig deles, sendes på mail eller ligge i klient-kode.** Indsættes KUN som miljøvariabel i hostingen (fx Vercel → Project → Settings → Environment Variables) |
| `RESEND_API_KEY` | [resend.com](https://resend.com) → API Keys | Afsendelse af e-mails |
| `RESEND_FROM_EMAIL` | Verificeret afsender, fx `Ecohus <noreply@ecohus.dk>` | Afsenderadresse på alle mails |
| `RESEND_NOTIFY_EMAIL` | Fx `kontakt@ecohus.dk` | Modtager af interne lead-notifikationer |
| `ADMIN_ALLOWED_EMAILS` | Vælges selv (kommasepareret liste) | Hvilke Supabase-brugere der må logge ind på `/admin` |

## 4. Resend (e-mails)

Når en formular udfyldes, sendes der nu **to** e-mails:

1. **Til Ecohus** (`RESEND_NOTIFY_EMAIL`): alle lead-detaljer, med reply-to sat til kundens e-mail.
2. **Til kunden (lead'et)**: en pæn bekræftelsesmail på dansk med kvittering for henvendelsen
   (og prisoverslag, hvis den kom fra prisberegneren).

For at mails ikke lander i spam, skal domænet `ecohus.dk` være verificeret i
Resend: **Resend → Domains → Add Domain** og tilføj de viste DNS-poster
(SPF/DKIM) hos domæneudbyderen.

## 5. Admin-dashboard

- URL: `https://<dit-domæne>/admin`
- Login med e-mail + adgangskode fra Supabase-brugeren oprettet i trin 2
  (sessionen holder i 7 dage).
- Dashboardet viser alle leads fra både kontaktformularen og prisberegneren:
  - Statistik-overblik (antal leads, nye, vundne).
  - Status pr. lead: **Ny → Kontaktet → Tilbud sendt → Vundet / Tabt**.
  - Interne noter pr. lead.
- Alle ændringer gemmes direkte i Supabase.

## 6. Verificér at det virker

1. Kør migrationen (trin 1).
2. Udfyld kontaktformularen på hjemmesiden med en test-e-mail.
3. Tjek at: lead'et dukker op i `/admin`, Ecohus modtager en notifikationsmail,
   og test-e-mailen modtager en bekræftelsesmail.
4. I Supabase → **Table Editor** kan rådataene ses i de to tabeller.
