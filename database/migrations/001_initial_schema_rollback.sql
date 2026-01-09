-- Rollback script for initial schema migration
-- Focus: Electronics Wholesale Industry
-- This will drop all tables, views, functions, and extensions created in 001_initial_schema.sql

-- Drop views first (they depend on tables)
DROP VIEW IF EXISTS competitor_market_position;
DROP VIEW IF EXISTS customer_summary;

-- Drop triggers
DROP TRIGGER IF EXISTS update_competitor_value_propositions_updated_at ON competitor_value_propositions;
DROP TRIGGER IF EXISTS update_quotations_updated_at ON quotations;
DROP TRIGGER IF EXISTS update_market_conditions_updated_at ON market_conditions;
DROP TRIGGER IF EXISTS update_cost_breakdowns_updated_at ON cost_breakdowns;
DROP TRIGGER IF EXISTS update_service_tiers_updated_at ON service_tiers;
DROP TRIGGER IF EXISTS update_products_updated_at ON products;
DROP TRIGGER IF EXISTS update_competitor_pricing_updated_at ON competitor_pricing;
DROP TRIGGER IF EXISTS update_competitors_updated_at ON competitors;
DROP TRIGGER IF EXISTS update_customers_updated_at ON customers;

-- Drop function
DROP FUNCTION IF EXISTS update_updated_at_column();

-- Drop tables (in reverse order of dependencies)
DROP TABLE IF EXISTS competitor_value_propositions;
DROP TABLE IF EXISTS customer_purchase_history;
DROP TABLE IF EXISTS quotations;
DROP TABLE IF EXISTS market_conditions;
DROP TABLE IF EXISTS cost_breakdowns;
DROP TABLE IF EXISTS service_tiers;
DROP TABLE IF EXISTS competitor_pricing;
DROP TABLE IF EXISTS products;
DROP TABLE IF EXISTS competitors;
DROP TABLE IF EXISTS customers;

-- Note: We do NOT drop the vector extension as it may be used by other databases
-- If you need to drop it, run: DROP EXTENSION IF EXISTS vector;

