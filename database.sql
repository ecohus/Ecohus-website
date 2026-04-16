-- Lead capture from contact form
CREATE TABLE contact_submissions (
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
CREATE TABLE price_calculator_leads (
  id                  UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name                VARCHAR(255) NOT NULL,
  email               VARCHAR(255) NOT NULL,
  phone               VARCHAR(50)  NOT NULL,
  model_selected      VARCHAR(255),
  options             JSONB,
  estimated_price_from INTEGER,
  estimated_price_to   INTEGER,
  created_at          TIMESTAMPTZ  DEFAULT NOW()
);

CREATE INDEX idx_contact_submissions_created ON contact_submissions(created_at DESC);
CREATE INDEX idx_calculator_leads_created ON price_calculator_leads(created_at DESC);
