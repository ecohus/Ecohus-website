-- Required for uuid_generate_v4()
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Lead capture from contact form
CREATE TABLE IF NOT EXISTS contact_submissions (
  id          UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name        VARCHAR(255) NOT NULL,
  email       VARCHAR(255) NOT NULL,
  phone       VARCHAR(50)  NOT NULL,
  message     TEXT,
  model_interest VARCHAR(255),
  source      VARCHAR(100) DEFAULT 'contact_form',
  created_at  TIMESTAMPTZ  DEFAULT NOW()
);

-- Lead capture from price calculator
CREATE TABLE IF NOT EXISTS price_calculator_leads (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                VARCHAR(255) NOT NULL,
  email               VARCHAR(255) NOT NULL,
  phone               VARCHAR(50)  NOT NULL,
  model_selected      VARCHAR(255),
  options             JSONB,
  estimated_price_from INTEGER,
  estimated_price_to   INTEGER,
  -- "Byg selv" / egen plantegning fields
  is_custom_build     BOOLEAN      DEFAULT FALSE,
  custom_m2           INTEGER,
  custom_roof         VARCHAR(100),
  custom_tier         VARCHAR(100),
  created_at          TIMESTAMPTZ  DEFAULT NOW()
);

-- Idempotent column adds for existing deployments that predate the custom-build fields
ALTER TABLE price_calculator_leads ADD COLUMN IF NOT EXISTS is_custom_build BOOLEAN DEFAULT FALSE;
ALTER TABLE price_calculator_leads ADD COLUMN IF NOT EXISTS custom_m2 INTEGER;
ALTER TABLE price_calculator_leads ADD COLUMN IF NOT EXISTS custom_roof VARCHAR(100);
ALTER TABLE price_calculator_leads ADD COLUMN IF NOT EXISTS custom_tier VARCHAR(100);

CREATE INDEX IF NOT EXISTS idx_contact_submissions_created ON contact_submissions(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_calculator_leads_created ON price_calculator_leads(created_at DESC);
