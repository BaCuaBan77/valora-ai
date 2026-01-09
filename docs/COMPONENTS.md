# System Components

## Overview

This document describes the key components of the B2B Pricing Estimator System, their responsibilities, and how they interact with each other.

## Component Architecture

### 1. Data Ingestion Service

**Location**: `backend/node-api/src/services/data-ingestion/`

**Purpose**: Handles data ingestion from CRM systems and other data sources.

**Responsibilities**:
- Mock CRM data generation for development and testing
- CRM adapter interface for future integrations with real CRM systems
- Data validation and normalization
- Scheduled sync jobs for periodic data updates
- Error handling and retry logic for data synchronization

**Key Files**:
- `index.ts`: Main service entry point
- `mock-crm.ts`: Mock CRM data generator
- `crm-adapter.ts`: Interface for CRM integrations
- `data-validator.ts`: Data validation logic

**Interfaces**:
- `syncCustomerData()`: Synchronize customer data from CRM
- `syncCompetitorData()`: Update competitor intelligence
- `validateData()`: Validate incoming data
- `normalizeData()`: Normalize data formats

### 2. Feature Engineering Pipeline

**Location**: `backend/python-ml/src/features/`

**Purpose**: Transforms raw data into features suitable for ML model training and inference.

**Responsibilities**:
- Extract features from CRM data
- Calculate derived metrics (customer lifetime value, relationship score)
- Normalize competitor pricing data
- Encode categorical variables
- Generate time-based features (seasonality, trends)
- Handle missing data and outliers

**Key Files**:
- `feature_engineering.py`: Main feature engineering module
- `customer_features.py`: Customer-specific feature extraction
- `market_features.py`: Market condition feature extraction
- `competitor_features.py`: Competitor data feature extraction
- `transformers.py`: Custom feature transformers

**Key Features Generated**:
- Customer relationship score
- Competitor price differentials
- Market condition indices
- Historical win/loss rates
- Customer value alignment scores (from vector similarity)
- Time-based features (day of week, month, quarter)

### 3. ML Model Service

**Location**: `backend/python-ml/src/models/`

**Purpose**: Manages ML model lifecycle including training, versioning, and inference.

**Responsibilities**:
- Model training pipeline execution
- Model versioning and storage
- Inference endpoint for price predictions
- Model evaluation metrics calculation
- A/B testing framework for model comparison
- Model performance monitoring

**Key Files**:
- `pricing_model.py`: Main model definition (ensemble)
- `random_forest_model.py`: Random Forest implementation
- `xgboost_model.py`: XGBoost implementation
- `linear_model.py`: Linear regression baseline
- `model_trainer.py`: Training pipeline
- `model_evaluator.py`: Evaluation and metrics
- `model_storage.py`: Model versioning and storage

**Model Architecture**:
- **Ensemble Approach**: Combines Random Forest, XGBoost, and Linear Regression
- **Weighted Averaging**: Final prediction is a weighted average of ensemble models
- **Confidence Intervals**: Provides prediction intervals based on model uncertainty

### 4. Pricing Estimation API

**Location**: `backend/node-api/src/routes/pricing/`

**Purpose**: REST API endpoints for price estimation requests.

**Responsibilities**:
- Handle quotation request endpoints
- Request validation and sanitization
- Coordinate data retrieval from databases
- Call ML service for price estimation
- Format and return responses
- Error handling and logging
- Store quotation records

**Key Files**:
- `pricing.ts`: Main pricing routes
- `quotation.controller.ts`: Request handling logic
- `quotation.validator.ts`: Input validation
- `quotation.service.ts`: Business logic

**Endpoints**:
- `POST /api/pricing/estimate`: Create new price estimation request
- `GET /api/pricing/estimate/:id`: Retrieve estimation result
- `GET /api/pricing/history`: Get quotation history
- `GET /api/pricing/history/:customerId`: Get customer-specific history

### 5. Web Application

**Location**: `frontend/`

**Purpose**: User interface for quotation requests and results visualization.

**Responsibilities**:
- Quotation request form interface
- Price estimation dashboard
- Historical quote viewer
- Admin panel for model management
- User authentication and authorization
- Data visualization and reporting

**Key Files**:
- `src/pages/QuotationForm.tsx`: Main quotation form
- `src/components/PriceEstimate.tsx`: Price display component
- `src/components/QuotationHistory.tsx`: History viewer
- `src/pages/AdminPanel.tsx`: Admin interface
- `src/services/api.ts`: API client
- `src/hooks/useQuotation.ts`: Custom hooks for quotations

**Features**:
- Interactive quotation form with product selection
- Real-time price estimation display
- Confidence interval visualization
- Historical data charts and graphs
- Model performance metrics dashboard

### 6. Inference Service

**Location**: `backend/python-ml/src/api/`

**Purpose**: FastAPI service for ML model inference.

**Responsibilities**:
- Expose REST endpoints for model inference
- Accept feature data from API layer
- Execute feature engineering pipeline
- Run model inference
- Return predictions with confidence intervals
- Handle model versioning and routing

**Key Files**:
- `inference.py`: FastAPI inference endpoints
- `inference_service.py`: Inference logic
- `model_loader.py`: Model loading and caching

**Endpoints**:
- `POST /ml/estimate`: Generate price estimate
- `GET /ml/health`: Health check
- `GET /ml/models`: List available model versions
- `POST /ml/models/:version/activate`: Activate model version

### 7. Database Services

**Location**: Database layer (PostgreSQL, Vector DB, Redis)

**Purpose**: Data persistence and retrieval.

**PostgreSQL**:
- Stores structured business data
- Handles relational queries
- Supports transactions and ACID compliance
- pgvector extension for vector operations

**Vector Database**:
- Stores semantic embeddings
- Enables similarity search
- Supports customer value matching
- Product feature matching

**Redis**:
- Caches frequently accessed data
- Manages job queues for async processing
- Session storage
- Rate limiting counters

## Component Interactions

### Quotation Request Flow

1. **Frontend** → **API Layer**: User submits quotation request
2. **API Layer** → **PostgreSQL**: Fetch customer, product, competitor data
3. **API Layer** → **ML Service**: Send request with context data
4. **ML Service** → **PostgreSQL**: Query additional features
5. **ML Service** → **Vector DB**: Semantic search for value alignment
6. **ML Service** → **Feature Engine**: Generate features
7. **ML Service** → **Model**: Execute inference
8. **ML Service** → **API Layer**: Return prediction
9. **API Layer** → **PostgreSQL**: Store quotation record
10. **API Layer** → **Frontend**: Return result

### Data Synchronization Flow

1. **Scheduler** → **Data Ingestion Service**: Trigger sync job
2. **Data Ingestion Service** → **CRM Adapter**: Fetch data
3. **Data Ingestion Service** → **Validator**: Validate data
4. **Data Ingestion Service** → **PostgreSQL**: Store normalized data
5. **Feature Engine** → **PostgreSQL**: Update derived features
6. **Embedding Service** → **Vector DB**: Generate and store embeddings

## Configuration and Environment

All components use environment-based configuration:
- Database connection strings
- API endpoints and ports
- Model paths and versions
- Feature flags and toggles
- Logging levels and destinations

Configuration is managed through:
- Environment variables
- Configuration files
- Docker Compose environment files
- Secrets management (for production)


