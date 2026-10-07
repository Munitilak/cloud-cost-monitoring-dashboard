/*
# Cloud Cost Monitoring Dashboard Schema

1. New Tables
- `cloud_services`: Tracks individual cloud services/resources across AWS, GCP, and Azure.
  - id (uuid PK), provider (text: AWS/GCP/Azure), service_name (text), category (text: compute/storage/network/database/ai), region (text), status (text: active/idle/underutilized), monthly_budget (numeric), created_at.
- `cost_entries`: Daily cost records per service, used for trend charts and totals.
  - id (uuid PK), service_id (FK -> cloud_services), date (date), cost (numeric), usage_hours (numeric).
- `alerts`: Budget and anomaly alerts for each service.
  - id (uuid PK), service_id (FK -> cloud_services), type (text: budget_warning/budget_exceeded/anomaly/unused_resource), severity (text: warning/critical), message (text), created_at (timestamptz), resolved (boolean).
- `recommendations`: Cost optimization recommendations per service.
  - id (uuid PK), service_id (FK -> cloud_services), type (text: rightsizing/reservation/terminate/schedule), description (text), potential_savings (numeric), status (text: open/applied/dismissed), created_at.

2. Security
- RLS enabled on all tables.
- Single-tenant (no auth) — policies allow anon + authenticated full CRUD on all tables.
*/

CREATE TABLE IF NOT EXISTS cloud_services (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  provider text NOT NULL CHECK (provider IN ('AWS','GCP','Azure')),
  service_name text NOT NULL,
  category text NOT NULL CHECK (category IN ('compute','storage','network','database','ai')),
  region text NOT NULL,
  status text NOT NULL DEFAULT 'active' CHECK (status IN ('active','idle','underutilized')),
  monthly_budget numeric(12,2) NOT NULL DEFAULT 0,
  icon text,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS cost_entries (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES cloud_services(id) ON DELETE CASCADE,
  date date NOT NULL,
  cost numeric(12,2) NOT NULL DEFAULT 0,
  usage_hours numeric(10,2) DEFAULT 0
);

CREATE TABLE IF NOT EXISTS alerts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES cloud_services(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('budget_warning','budget_exceeded','anomaly','unused_resource')),
  severity text NOT NULL CHECK (severity IN ('warning','critical')),
  message text NOT NULL,
  resolved boolean NOT NULL DEFAULT false,
  created_at timestamptz DEFAULT now()
);

CREATE TABLE IF NOT EXISTS recommendations (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  service_id uuid NOT NULL REFERENCES cloud_services(id) ON DELETE CASCADE,
  type text NOT NULL CHECK (type IN ('rightsizing','reservation','terminate','schedule')),
  description text NOT NULL,
  potential_savings numeric(12,2) NOT NULL DEFAULT 0,
  status text NOT NULL DEFAULT 'open' CHECK (status IN ('open','applied','dismissed')),
  created_at timestamptz DEFAULT now()
);

-- Indexes for common query patterns
CREATE INDEX IF NOT EXISTS idx_cost_entries_service_id ON cost_entries(service_id);
CREATE INDEX IF NOT EXISTS idx_cost_entries_date ON cost_entries(date);
CREATE INDEX IF NOT EXISTS idx_alerts_service_id ON alerts(service_id);
CREATE INDEX IF NOT EXISTS idx_alerts_resolved ON alerts(resolved);
CREATE INDEX IF NOT EXISTS idx_recs_service_id ON recommendations(service_id);
CREATE INDEX IF NOT EXISTS idx_recs_status ON recommendations(status);

-- Enable RLS on all tables
ALTER TABLE cloud_services ENABLE ROW LEVEL SECURITY;
ALTER TABLE cost_entries ENABLE ROW LEVEL SECURITY;
ALTER TABLE alerts ENABLE ROW LEVEL SECURITY;
ALTER TABLE recommendations ENABLE ROW LEVEL SECURITY;

-- Policies for cloud_services (single-tenant, anon + authenticated)
DROP POLICY IF EXISTS "anon_select_services" ON cloud_services;
CREATE POLICY "anon_select_services" ON cloud_services FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_services" ON cloud_services;
CREATE POLICY "anon_insert_services" ON cloud_services FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_services" ON cloud_services;
CREATE POLICY "anon_update_services" ON cloud_services FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_services" ON cloud_services;
CREATE POLICY "anon_delete_services" ON cloud_services FOR DELETE TO anon, authenticated USING (true);

-- Policies for cost_entries
DROP POLICY IF EXISTS "anon_select_costs" ON cost_entries;
CREATE POLICY "anon_select_costs" ON cost_entries FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_costs" ON cost_entries;
CREATE POLICY "anon_insert_costs" ON cost_entries FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_costs" ON cost_entries;
CREATE POLICY "anon_update_costs" ON cost_entries FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_costs" ON cost_entries;
CREATE POLICY "anon_delete_costs" ON cost_entries FOR DELETE TO anon, authenticated USING (true);

-- Policies for alerts
DROP POLICY IF EXISTS "anon_select_alerts" ON alerts;
CREATE POLICY "anon_select_alerts" ON alerts FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_alerts" ON alerts;
CREATE POLICY "anon_insert_alerts" ON alerts FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_alerts" ON alerts;
CREATE POLICY "anon_update_alerts" ON alerts FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_alerts" ON alerts;
CREATE POLICY "anon_delete_alerts" ON alerts FOR DELETE TO anon, authenticated USING (true);

-- Policies for recommendations
DROP POLICY IF EXISTS "anon_select_recs" ON recommendations;
CREATE POLICY "anon_select_recs" ON recommendations FOR SELECT TO anon, authenticated USING (true);
DROP POLICY IF EXISTS "anon_insert_recs" ON recommendations;
CREATE POLICY "anon_insert_recs" ON recommendations FOR INSERT TO anon, authenticated WITH CHECK (true);
DROP POLICY IF EXISTS "anon_update_recs" ON recommendations;
CREATE POLICY "anon_update_recs" ON recommendations FOR UPDATE TO anon, authenticated USING (true) WITH CHECK (true);
DROP POLICY IF EXISTS "anon_delete_recs" ON recommendations;
CREATE POLICY "anon_delete_recs" ON recommendations FOR DELETE TO anon, authenticated USING (true);
