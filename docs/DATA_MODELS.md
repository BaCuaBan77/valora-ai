# Data Models

## Overview

This document describes the core data models used in the B2B Pricing Estimator System. These models represent the entities and relationships that drive the pricing estimation process.

## Core Entities

### Customer Data

Represents B2B customers and their characteristics.

**Fields:**
- `customer_id` (UUID, Primary Key): Unique identifier
- `name` (String): Customer company name
- `industry` (String): Industry sector
- `size` (Enum): Company size (Small, Medium, Large, Enterprise)
- `relationship_strength_score` (Float): Calculated relationship strength (0-1)
- `created_at` (Timestamp): Record creation time
- `updated_at` (Timestamp): Last update time

**Related Data:**
- Historical purchase behavior
- Customer value preferences (stored as embeddings in vector DB)
- Interaction history
- Win/loss records

### Competitor Data

Stores competitor pricing and market intelligence.

**Fields:**
- `competitor_id` (UUID, Primary Key): Unique identifier
- `name` (String): Competitor company name
- `product_category` (String): Product/service category
- `base_price` (Decimal): Base price point
- `price_range_min` (Decimal): Minimum observed price
- `price_range_max` (Decimal): Maximum observed price
- `market_share` (Float): Market share percentage
- `win_rate` (Float): Win rate against this competitor
- `last_updated` (Timestamp): Last data update

**Related Data:**
- Competitor value propositions
- Historical pricing trends
- Win/loss analysis

### Product/Service Data

Catalog of products and services with pricing information.

**Fields:**
- `product_id` (UUID, Primary Key): Unique identifier
- `name` (String): Product/service name
- `category` (String): Product category
- `base_cost` (Decimal): Base manufacturing/service cost
- `tier` (Enum): Service tier (Basic, Standard, Premium, Enterprise)
- `features` (JSON): Available features and specifications
- `cost_breakdown` (JSON): Detailed cost components
- `is_active` (Boolean): Active status

**Related Data:**
- Feature descriptions (for semantic search)
- Historical pricing
- Customer usage patterns

### Market Conditions

Represents market trends and economic indicators.

**Fields:**
- `condition_id` (UUID, Primary Key): Unique identifier
- `date` (Date): Condition date
- `industry` (String): Industry sector
- `region` (String): Geographic region
- `economic_indicator` (Float): Economic indicator value
- `trend_direction` (Enum): Up, Down, Stable
- `seasonal_factor` (Float): Seasonal adjustment factor
- `regional_pricing_variation` (Float): Regional pricing multiplier

**Related Data:**
- Historical trends
- Forecast data
- Industry-specific metrics

### Quotation Requests

Represents price estimation requests and their results.

**Fields:**
- `quotation_id` (UUID, Primary Key): Unique identifier
- `customer_id` (UUID, Foreign Key): Reference to customer
- `product_id` (UUID, Foreign Key): Reference to product/service
- `requested_features` (JSON): Requested product features
- `specifications` (JSON): Additional specifications
- `estimated_price` (Decimal): ML-generated price estimate
- `confidence_interval_lower` (Decimal): Lower bound of confidence interval
- `confidence_interval_upper` (Decimal): Upper bound of confidence interval
- `confidence_score` (Float): Model confidence (0-1)
- `status` (Enum): Pending, Accepted, Rejected, Expired
- `actual_price` (Decimal, Nullable): Final agreed price (if accepted)
- `created_at` (Timestamp): Request creation time
- `updated_at` (Timestamp): Last update time

**Related Data:**
- Historical context from previous quotations
- Feature vectors used for prediction
- Model version used for estimation

### Model Versions

Tracks ML model versions and their performance.

**Fields:**
- `model_version_id` (UUID, Primary Key): Unique identifier
- `version` (String): Version identifier
- `model_type` (String): Model type (ensemble, random_forest, xgboost, etc.)
- `training_date` (Timestamp): Training completion date
- `performance_metrics` (JSON): Evaluation metrics (MAE, RMSE, R², etc.)
- `is_active` (Boolean): Currently active version
- `feature_list` (JSON): List of features used
- `model_artifact_path` (String): Storage path for model file

**Related Data:**
- Training dataset information
- Validation results
- A/B test assignments

## Relationships

### Customer ↔ Quotation
- One-to-Many: A customer can have multiple quotation requests
- Used to track customer history and relationship patterns

### Product ↔ Quotation
- One-to-Many: A product can be quoted multiple times
- Used to analyze product pricing trends

### Quotation ↔ Model Version
- Many-to-One: Multiple quotations can use the same model version
- Used for model performance tracking and A/B testing

### Customer ↔ Market Conditions
- Many-to-Many (via industry/region): Customers are affected by market conditions
- Used to adjust pricing based on market context

## Vector Database Schema

### Customer Value Embeddings

Stores semantic embeddings of customer value preferences.

**Fields:**
- `customer_id` (UUID): Reference to customer
- `embedding` (Vector): High-dimensional embedding vector
- `value_description` (Text): Original value description
- `embedding_model` (String): Model used for embedding generation
- `created_at` (Timestamp): Embedding creation time

**Use Case:** Semantic search to find customers with similar value preferences

### Product Feature Embeddings

Stores semantic embeddings of product features.

**Fields:**
- `product_id` (UUID): Reference to product
- `feature_name` (String): Feature identifier
- `embedding` (Vector): Feature embedding vector
- `description` (Text): Feature description
- `embedding_model` (String): Model used for embedding generation

**Use Case:** Match customer value preferences with product features

## Data Flow

1. **Data Ingestion**: CRM data and competitor intelligence are ingested and normalized
2. **Feature Extraction**: Raw data is transformed into features for ML models
3. **Embedding Generation**: Text descriptions are converted to vector embeddings
4. **Model Training**: Features and embeddings are used to train pricing models
5. **Inference**: New quotation requests trigger feature generation and model inference
6. **Storage**: Results are stored for future analysis and model improvement

## Data Quality Considerations

- **Validation**: All input data is validated before storage
- **Normalization**: Data is normalized to ensure consistency
- **Completeness**: Missing data is handled with appropriate defaults or imputation
- **Freshness**: Data is regularly updated to maintain accuracy
- **Privacy**: Customer data is handled according to privacy regulations


