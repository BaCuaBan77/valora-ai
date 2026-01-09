-- Initial Database Schema for Valora AI B2B Pricing Estimator
-- Focus: Electronics Wholesale Industry
-- This migration creates all core tables with pgvector support for electronics wholesale pricing estimation

-- Enable pgvector extension for vector similarity search
CREATE EXTENSION IF NOT EXISTS vector;

-- ============================================================================
-- CUSTOMERS TABLE
-- ============================================================================
-- Stores electronics wholesale customer information, relationship data, and value preferences
-- Primary focus: Electronics wholesale, distribution, and component supply companies
CREATE TABLE customers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    external_id VARCHAR(255) UNIQUE, -- External CRM ID
    name VARCHAR(255) NOT NULL,
    industry VARCHAR(100), -- Primary: 'Electronics Wholesale', also supports related industries
    company_size VARCHAR(50), -- e.g., 'small', 'medium', 'large', 'enterprise'
    annual_revenue DECIMAL(15, 2),
    employee_count INTEGER,
    location_country VARCHAR(100),
    location_region VARCHAR(100),
    location_city VARCHAR(100),
    
    -- Relationship metrics
    relationship_score DECIMAL(5, 2) DEFAULT 0.0, -- 0.0 to 100.0
    relationship_strength VARCHAR(50), -- 'weak', 'moderate', 'strong', 'strategic'
    years_as_customer INTEGER,
    total_contract_value DECIMAL(15, 2) DEFAULT 0.0,
    last_purchase_date TIMESTAMP,
    
    -- Customer value preferences (stored as vector embeddings)
    value_preferences_embedding vector(1536), -- OpenAI ada-002 dimension, adjust as needed
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Indexes for customers
CREATE INDEX idx_customers_industry ON customers(industry);
CREATE INDEX idx_customers_company_size ON customers(company_size);
CREATE INDEX idx_customers_relationship_score ON customers(relationship_score);
CREATE INDEX idx_customers_external_id ON customers(external_id);
CREATE INDEX idx_customers_location_country ON customers(location_country);

-- Vector similarity index for customer value preferences
CREATE INDEX idx_customers_value_preferences_vector ON customers 
    USING ivfflat (value_preferences_embedding vector_cosine_ops)
    WITH (lists = 100);

-- ============================================================================
-- COMPETITORS TABLE
-- ============================================================================
-- Stores electronics wholesale competitor information and market position data
-- Tracks competitors in electronics distribution and component wholesale markets
CREATE TABLE competitors (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL UNIQUE,
    industry_focus VARCHAR(100), -- Primary: Electronics Wholesale and related distribution segments
    market_segment VARCHAR(100), -- e.g., 'Component Distribution', 'Semiconductor Distribution', etc.
    
    -- Market position
    market_share_percentage DECIMAL(5, 2), -- 0.00 to 100.00
    brand_strength_score DECIMAL(5, 2), -- 0.0 to 100.0
    
    -- Win/loss data
    total_deals INTEGER DEFAULT 0,
    wins INTEGER DEFAULT 0,
    losses INTEGER DEFAULT 0,
    win_rate DECIMAL(5, 2), -- Calculated: (wins / total_deals) * 100
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Indexes for competitors
CREATE INDEX idx_competitors_industry_focus ON competitors(industry_focus);
CREATE INDEX idx_competitors_market_segment ON competitors(market_segment);

-- ============================================================================
-- COMPETITOR_PRICING TABLE
-- ============================================================================
-- Stores competitor pricing/rate information for electronics wholesale products
-- Tracks pricing models common in electronics distribution (bulk, volume discounts, etc.)
CREATE TABLE competitor_pricing (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competitor_id UUID NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
    product_id UUID, -- References products table (nullable for general pricing)
    service_tier VARCHAR(100),
    
    -- Pricing data
    base_price DECIMAL(15, 2),
    price_per_unit DECIMAL(15, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    pricing_model VARCHAR(50), -- 'fixed', 'per_unit', 'volume_tiered', 'bulk', 'per_usage', etc.
    
    -- Context
    effective_date DATE NOT NULL,
    expiration_date DATE,
    region VARCHAR(100),
    industry VARCHAR(100), -- Primary: 'Electronics Wholesale' and related industries
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Indexes for competitor_pricing
CREATE INDEX idx_competitor_pricing_competitor_id ON competitor_pricing(competitor_id);
CREATE INDEX idx_competitor_pricing_product_id ON competitor_pricing(product_id);
CREATE INDEX idx_competitor_pricing_effective_date ON competitor_pricing(effective_date);
CREATE INDEX idx_competitor_pricing_region ON competitor_pricing(region);

-- ============================================================================
-- PRODUCTS TABLE
-- ============================================================================
-- Stores electronics wholesale product catalog (components, semiconductors, etc.)
-- Categories: Semiconductors, Electronic Components, Circuit Boards, Connectors, Power Supplies, etc.
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    name VARCHAR(255) NOT NULL,
    code VARCHAR(100) UNIQUE,
    category VARCHAR(100), -- e.g., 'Semiconductors', 'Electronic Components', 'Circuit Boards', 'Connectors & Cables', etc.
    subcategory VARCHAR(100), -- More specific classification within category
    description TEXT,
    
    -- Cost structure
    base_cost DECIMAL(15, 2) NOT NULL,
    cost_per_unit DECIMAL(15, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Product attributes
    is_service BOOLEAN DEFAULT FALSE,
    is_active BOOLEAN DEFAULT TRUE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for products
CREATE INDEX idx_products_category ON products(category);
CREATE INDEX idx_products_code ON products(code);
CREATE INDEX idx_products_is_active ON products(is_active);

-- ============================================================================
-- SERVICE_TIERS TABLE
-- ============================================================================
-- Stores service tier definitions and pricing
CREATE TABLE service_tiers (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    tier_name VARCHAR(100) NOT NULL,
    tier_level INTEGER NOT NULL, -- 1, 2, 3, etc. (higher = more premium)
    description TEXT,
    
    -- Pricing
    base_price DECIMAL(15, 2) NOT NULL,
    price_per_user DECIMAL(15, 2),
    price_per_usage DECIMAL(15, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Features (stored as JSONB for flexibility)
    features JSONB DEFAULT '{}'::jsonb,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE,
    
    UNIQUE(product_id, tier_name)
);

-- Indexes for service_tiers
CREATE INDEX idx_service_tiers_product_id ON service_tiers(product_id);
CREATE INDEX idx_service_tiers_tier_level ON service_tiers(tier_level);
CREATE INDEX idx_service_tiers_features ON service_tiers USING GIN(features);

-- ============================================================================
-- COST_BREAKDOWNS TABLE
-- ============================================================================
-- Stores detailed cost breakdowns for products/services
CREATE TABLE cost_breakdowns (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
    service_tier_id UUID REFERENCES service_tiers(id) ON DELETE CASCADE,
    
    -- Cost components
    component_name VARCHAR(255) NOT NULL,
    component_type VARCHAR(100), -- 'labor', 'infrastructure', 'licensing', 'support', 'packaging', 'shipping', 'inventory', etc.
    cost_amount DECIMAL(15, 2) NOT NULL,
    cost_percentage DECIMAL(5, 2), -- Percentage of total cost
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for cost_breakdowns
CREATE INDEX idx_cost_breakdowns_product_id ON cost_breakdowns(product_id);
CREATE INDEX idx_cost_breakdowns_service_tier_id ON cost_breakdowns(service_tier_id);
CREATE INDEX idx_cost_breakdowns_component_type ON cost_breakdowns(component_type);

-- ============================================================================
-- MARKET_CONDITIONS TABLE
-- ============================================================================
-- Stores electronics wholesale market condition data (industry trends, economic indicators, etc.)
-- Tracks factors affecting electronics distribution pricing (supply chain, component shortages, etc.)
CREATE TABLE market_conditions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Time and location context
    effective_date DATE NOT NULL,
    region VARCHAR(100),
    country VARCHAR(100),
    industry VARCHAR(100), -- Primary: 'Electronics Wholesale', tracks market conditions for electronics distribution
    
    -- Economic indicators
    economic_index DECIMAL(10, 4), -- General economic health index
    inflation_rate DECIMAL(5, 2),
    gdp_growth_rate DECIMAL(5, 2),
    
    -- Industry-specific metrics
    industry_growth_rate DECIMAL(5, 2),
    industry_demand_index DECIMAL(10, 4),
    competitive_intensity DECIMAL(5, 2), -- 0.0 to 100.0
    
    -- Seasonal factors
    seasonal_factor DECIMAL(5, 2) DEFAULT 1.0, -- Multiplier for seasonal adjustments
    quarter INTEGER, -- 1-4
    month INTEGER, -- 1-12
    
    -- Regional pricing variations
    regional_price_multiplier DECIMAL(5, 2) DEFAULT 1.0,
    
    -- Additional context (stored as JSONB)
    -- Common keys: supply_chain_status, component_shortages, regulatory_changes, trade_policies, etc.
    additional_metrics JSONB DEFAULT '{}'::jsonb,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for market_conditions
CREATE INDEX idx_market_conditions_effective_date ON market_conditions(effective_date);
CREATE INDEX idx_market_conditions_region ON market_conditions(region);
CREATE INDEX idx_market_conditions_country ON market_conditions(country);
CREATE INDEX idx_market_conditions_industry ON market_conditions(industry);
CREATE INDEX idx_market_conditions_date_region_industry ON market_conditions(effective_date, region, industry);

-- ============================================================================
-- QUOTATIONS TABLE
-- ============================================================================
-- Stores quotation requests and AI-generated price estimates for electronics wholesale products
-- Handles bulk orders, volume pricing, and component-specific quotations
CREATE TABLE quotations (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    
    -- Customer and product context
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE RESTRICT,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    service_tier_id UUID REFERENCES service_tiers(id) ON DELETE SET NULL,
    
    -- Request details
    requested_features JSONB DEFAULT '[]'::jsonb,
    quantity INTEGER DEFAULT 1,
    contract_duration_months INTEGER,
    requested_price DECIMAL(15, 2), -- If customer provided a target price
    
    -- Estimation results
    estimated_price DECIMAL(15, 2),
    confidence_score DECIMAL(5, 2), -- 0.0 to 100.0
    price_lower_bound DECIMAL(15, 2),
    price_upper_bound DECIMAL(15, 2),
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- ML model information
    model_version VARCHAR(50),
    model_confidence DECIMAL(5, 2),
    
    -- Context data (snapshot at time of request)
    market_condition_id UUID REFERENCES market_conditions(id) ON DELETE SET NULL,
    competitor_pricing_snapshot JSONB DEFAULT '{}'::jsonb, -- Snapshot of relevant competitor prices
    
    -- Status and outcome
    status VARCHAR(50) DEFAULT 'pending', -- 'pending', 'estimated', 'accepted', 'rejected', 'expired'
    outcome VARCHAR(50), -- 'won', 'lost', 'pending', 'cancelled'
    actual_price DECIMAL(15, 2), -- Final price if deal closed
    closed_date TIMESTAMP,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    expires_at TIMESTAMP
);

-- Indexes for quotations
CREATE INDEX idx_quotations_customer_id ON quotations(customer_id);
CREATE INDEX idx_quotations_product_id ON quotations(product_id);
CREATE INDEX idx_quotations_service_tier_id ON quotations(service_tier_id);
CREATE INDEX idx_quotations_status ON quotations(status);
CREATE INDEX idx_quotations_outcome ON quotations(outcome);
CREATE INDEX idx_quotations_created_at ON quotations(created_at);
CREATE INDEX idx_quotations_market_condition_id ON quotations(market_condition_id);

-- ============================================================================
-- CUSTOMER_PURCHASE_HISTORY TABLE
-- ============================================================================
-- Stores historical purchase behavior for electronics wholesale customers
-- Tracks frequent orders typical in electronics distribution (monthly/quarterly patterns)
CREATE TABLE customer_purchase_history (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    customer_id UUID NOT NULL REFERENCES customers(id) ON DELETE CASCADE,
    product_id UUID NOT NULL REFERENCES products(id) ON DELETE RESTRICT,
    service_tier_id UUID REFERENCES service_tiers(id) ON DELETE SET NULL,
    
    -- Purchase details
    purchase_date TIMESTAMP NOT NULL,
    quantity INTEGER DEFAULT 1,
    unit_price DECIMAL(15, 2) NOT NULL,
    total_value DECIMAL(15, 2) NOT NULL,
    currency VARCHAR(3) DEFAULT 'USD',
    
    -- Contract details
    contract_duration_months INTEGER,
    renewal_date DATE,
    is_renewed BOOLEAN DEFAULT FALSE,
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Indexes for customer_purchase_history
CREATE INDEX idx_customer_purchase_history_customer_id ON customer_purchase_history(customer_id);
CREATE INDEX idx_customer_purchase_history_product_id ON customer_purchase_history(product_id);
CREATE INDEX idx_customer_purchase_history_purchase_date ON customer_purchase_history(purchase_date);

-- ============================================================================
-- COMPETITOR_VALUE_PROPOSITIONS TABLE
-- ============================================================================
-- Stores competitor value propositions for electronics wholesale (can be used for vector similarity)
-- Common value props: Volume discounts, fast delivery, quality assurance, bulk pricing, etc.
CREATE TABLE competitor_value_propositions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    competitor_id UUID NOT NULL REFERENCES competitors(id) ON DELETE CASCADE,
    
    -- Value proposition content
    title VARCHAR(255),
    description TEXT,
    key_features TEXT[],
    
    -- Vector embedding for semantic search
    value_proposition_embedding vector(1536), -- Same dimension as customer preferences
    
    -- Target market
    target_industry VARCHAR(100), -- Primary: 'Electronics Wholesale' and related distribution industries
    target_segment VARCHAR(100),
    
    -- Metadata
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    is_active BOOLEAN DEFAULT TRUE
);

-- Indexes for competitor_value_propositions
CREATE INDEX idx_competitor_value_propositions_competitor_id ON competitor_value_propositions(competitor_id);
CREATE INDEX idx_competitor_value_propositions_target_industry ON competitor_value_propositions(target_industry);

-- Vector similarity index
CREATE INDEX idx_competitor_value_propositions_vector ON competitor_value_propositions 
    USING ivfflat (value_proposition_embedding vector_cosine_ops)
    WITH (lists = 100);

-- ============================================================================
-- TRIGGERS FOR UPDATED_AT TIMESTAMPS
-- ============================================================================
-- Function to update updated_at timestamp
CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
    NEW.updated_at = CURRENT_TIMESTAMP;
    RETURN NEW;
END;
$$ language 'plpgsql';

-- Apply trigger to all tables with updated_at column
CREATE TRIGGER update_customers_updated_at BEFORE UPDATE ON customers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitors_updated_at BEFORE UPDATE ON competitors
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitor_pricing_updated_at BEFORE UPDATE ON competitor_pricing
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_products_updated_at BEFORE UPDATE ON products
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_service_tiers_updated_at BEFORE UPDATE ON service_tiers
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_cost_breakdowns_updated_at BEFORE UPDATE ON cost_breakdowns
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_market_conditions_updated_at BEFORE UPDATE ON market_conditions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_quotations_updated_at BEFORE UPDATE ON quotations
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER update_competitor_value_propositions_updated_at BEFORE UPDATE ON competitor_value_propositions
    FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- ============================================================================
-- VIEWS FOR COMMON QUERIES
-- ============================================================================

-- View for customer summary with aggregated purchase data
CREATE OR REPLACE VIEW customer_summary AS
SELECT 
    c.id,
    c.name,
    c.industry,
    c.company_size,
    c.relationship_score,
    c.relationship_strength,
    c.years_as_customer,
    c.total_contract_value,
    COUNT(DISTINCT cph.id) as total_purchases,
    COUNT(DISTINCT q.id) as total_quotations,
    SUM(CASE WHEN q.outcome = 'won' THEN 1 ELSE 0 END) as won_quotations,
    MAX(cph.purchase_date) as last_purchase_date
FROM customers c
LEFT JOIN customer_purchase_history cph ON c.id = cph.customer_id
LEFT JOIN quotations q ON c.id = q.customer_id
WHERE c.is_active = TRUE
GROUP BY c.id, c.name, c.industry, c.company_size, c.relationship_score, 
         c.relationship_strength, c.years_as_customer, c.total_contract_value;

-- View for competitor market position
CREATE OR REPLACE VIEW competitor_market_position AS
SELECT 
    comp.id,
    comp.name,
    comp.industry_focus,
    comp.market_share_percentage,
    comp.win_rate,
    COUNT(DISTINCT cp.id) as pricing_records_count,
    AVG(cp.base_price) as avg_base_price,
    MIN(cp.effective_date) as first_pricing_date,
    MAX(cp.effective_date) as latest_pricing_date
FROM competitors comp
LEFT JOIN competitor_pricing cp ON comp.id = cp.competitor_id
WHERE comp.is_active = TRUE
GROUP BY comp.id, comp.name, comp.industry_focus, comp.market_share_percentage, comp.win_rate;

-- ============================================================================
-- COMMENTS FOR DOCUMENTATION
-- ============================================================================

COMMENT ON TABLE customers IS 'Stores electronics wholesale customer information, relationship metrics, and value preference embeddings';
COMMENT ON TABLE competitors IS 'Stores electronics wholesale competitor information and market position data';
COMMENT ON TABLE competitor_pricing IS 'Stores historical and current competitor pricing information for electronics wholesale products';
COMMENT ON TABLE products IS 'Electronics wholesale product catalog (components, semiconductors, etc.) with base costs';
COMMENT ON TABLE service_tiers IS 'Service tier definitions with pricing and features for electronics wholesale offerings';
COMMENT ON TABLE cost_breakdowns IS 'Detailed cost breakdowns for electronics wholesale products and service tiers';
COMMENT ON TABLE market_conditions IS 'Electronics wholesale market condition data including economic indicators, supply chain factors, and seasonal trends';
COMMENT ON TABLE quotations IS 'Quotation requests and AI-generated price estimates for electronics wholesale products';
COMMENT ON TABLE customer_purchase_history IS 'Historical purchase records for electronics wholesale customers';
COMMENT ON TABLE competitor_value_propositions IS 'Competitor value propositions for electronics wholesale with vector embeddings for semantic search';

COMMENT ON COLUMN customers.value_preferences_embedding IS 'Vector embedding (1536 dimensions) representing customer value preferences for semantic similarity search';
COMMENT ON COLUMN competitor_value_propositions.value_proposition_embedding IS 'Vector embedding (1536 dimensions) representing competitor value propositions for semantic similarity search';

