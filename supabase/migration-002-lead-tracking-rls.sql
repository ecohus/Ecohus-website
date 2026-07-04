-- ============================================================
-- Ecohus — Migration 002: Lead-tracking + Row Level Security
-- Køres i Supabase Dashboard → SQL Editor → New query → Run
-- Scriptet er idempotent: det kan køres flere gange uden fejl.
-- ============================================================

-- Krævet for uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- ------------------------------------------------------------
-- 1) Basis-tabeller (oprettes kun hvis de ikke findes allerede)
-- ------------------------------------------------------------

CREATE TABLE IF NOT EXISTS contact_submissions (
  id             UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name           VARCHAR(255) NOT NULL,
  email          VARCHAR(255) NOT NULL,
  phone          VARCHAR(50)  NOT NULL,
  message        TEXT,
  model_interest VARCHAR(255),
  source         VARCHAR(100) DEFAULT 'contact_form',
  created_at     TIMESTAMPTZ  DEFAULT NOW()
);

CREATE TABLE IF NOT EXISTS price_calculator_leads (
  id                   UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                 VARCHAR(255) NOT NULL,
  email                VARCHAR(255) NOT NULL,
  phone                VARCHAR(50)  NOT NULL,
  model_selected       VARCHAR(255),
  options              JSONB,
  estimated_price_from INTEGER,
  estimated_price_to   INTEGER,
  is_custom_build      BOOLEAN      DEFAULT FALSE,
  custom_m2            INTEGER,
  custom_roof          VARCHAR(100),
  custom_tier          VARCHAR(100),
  call_consent         BOOLEAN      DEFAULT FALSE,
  created_at           TIMESTAMPTZ  DEFAULT NOW()
);

-- Idempotente kolonne-tilføjelser for ældre deployments
ALTER TABLE price_calculator_leads ADD COLUMN IF NOT EXISTS is_custom_build BOOLEAN DEFAULT FALSE;
ALTER TABLE price_calculator_leads ADD COLUMN IF NOT EXISTS custom_m2 INTEGER;
ALTER TABLE price_calculator_leads ADD COLUMN IF NOT EXISTS custom_roof VARCHAR(100);
ALTER TABLE price_calculator_leads ADD COLUMN IF NOT EXISTS custom_tier VARCHAR(100);
ALTER TABLE price_calculator_leads ADD COLUMN IF NOT EXISTS call_consent BOOLEAN DEFAULT FALSE;

-- ------------------------------------------------------------
-- 2) Lead-tracking kolonner (bruges af admin-dashboardet)
--    status: ny → kontaktet → tilbud_sendt → vundet / tabt
-- ------------------------------------------------------------

ALTER TABLE contact_submissions    ADD COLUMN IF NOT EXISTS status VARCHAR(30) NOT NULL DEFAULT 'ny';
ALTER TABLE contact_submissions    ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE contact_submissions    ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

ALTER TABLE price_calculator_leads ADD COLUMN IF NOT EXISTS status VARCHAR(30) NOT NULL DEFAULT 'ny';
ALTER TABLE price_calculator_leads ADD COLUMN IF NOT EXISTS admin_notes TEXT;
ALTER TABLE price_calculator_leads ADD COLUMN IF NOT EXISTS updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW();

-- Gyldige statusværdier (drop + genopret så scriptet kan genkøres)
ALTER TABLE contact_submissions    DROP CONSTRAINT IF EXISTS contact_submissions_status_check;
ALTER TABLE contact_submissions    ADD  CONSTRAINT contact_submissions_status_check
  CHECK (status IN ('ny', 'kontaktet', 'tilbud_sendt', 'vundet', 'tabt'));

ALTER TABLE price_calculator_leads DROP CONSTRAINT IF EXISTS price_calculator_leads_status_check;
ALTER TABLE price_calculator_leads ADD  CONSTRAINT price_calculator_leads_status_check
  CHECK (status IN ('ny', 'kontaktet', 'tilbud_sendt', 'vundet', 'tabt'));

-- updated_at vedligeholdes automatisk ved ændringer
CREATE OR REPLACE FUNCTION set_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trg_contact_submissions_updated_at ON contact_submissions;
CREATE TRIGGER trg_contact_submissions_updated_at
  BEFORE UPDATE ON contact_submissions
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

DROP TRIGGER IF EXISTS trg_price_calculator_leads_updated_at ON price_calculator_leads;
CREATE TRIGGER trg_price_calculator_leads_updated_at
  BEFORE UPDATE ON price_calculator_leads
  FOR EACH ROW EXECUTE FUNCTION set_updated_at();

-- ------------------------------------------------------------
-- 3) Indexes
-- ------------------------------------------------------------

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calculator_leads_created    ON price_calculator_leads(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_contact_submissions_status  ON contact_submissions(status);
CREATE INDEX IF NOT EXISTS idx_calculator_leads_status     ON price_calculator_leads(status);

-- ------------------------------------------------------------
-- 4) Row Level Security (RLS)
--
-- RLS slås TIL, og der oprettes INGEN policies for anon/authenticated.
-- Det betyder: al adgang via den offentlige anon-nøgle er blokeret.
-- Hjemmesidens server (API-routes og admin-dashboard) bruger
-- SUPABASE_SERVICE_ROLE_KEY, som bypasser RLS — det er den eneste vej ind.
--
-- VIGTIGT: SUPABASE_SERVICE_ROLE_KEY skal være sat som miljøvariabel
-- i hosting-miljøet (fx Vercel), ellers fejler formularerne efter
-- denne migration. Se SUPABASE-OPSAETNING.md.
-- ------------------------------------------------------------

ALTER TABLE contact_submissions    ENABLE ROW LEVEL SECURITY;
ALTER TABLE price_calculator_leads ENABLE ROW LEVEL SECURITY;

-- Fjern evt. gamle/for brede policies
DROP POLICY IF EXISTS "Allow anonymous inserts"  ON contact_submissions;
DROP POLICY IF EXISTS "Allow anonymous inserts"  ON price_calculator_leads;
DROP POLICY IF EXISTS "Enable insert for anon"   ON contact_submissions;
DROP POLICY IF EXISTS "Enable insert for anon"   ON price_calculator_leads;
DROP POLICY IF EXISTS "Enable read for anon"     ON contact_submissions;
DROP POLICY IF EXISTS "Enable read for anon"     ON price_calculator_leads;

-- Færdig. Kør evt. dette for at bekræfte:
-- SELECT tablename, rowsecurity FROM pg_tables
-- WHERE tablename IN ('contact_submissions', 'price_calculator_leads');
