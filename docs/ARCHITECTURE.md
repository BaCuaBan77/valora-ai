# System Architecture

## Overview

The B2B Pricing Estimator System uses a hybrid microservices architecture that separates concerns between API services, ML processing, and data storage. This design enables scalability, maintainability, and independent deployment of services.

## Architecture Diagram

```mermaid
graph TB
    subgraph frontend [Frontend Layer]
        WebApp[React Web Application]
    end
    
    subgraph api [API Layer]
        NodeAPI[Node.js/TypeScript API Server<br/>Express/NestJS]
    end
    
    subgraph ml [ML Service Layer]
        PythonML[Python ML Service<br/>FastAPI]
        ModelTraining[Model Training Pipeline]
        FeatureEngine[Feature Engineering]
    end
    
    subgraph data [Data Layer]
        PostgreSQL[(PostgreSQL<br/>Structured Data)]
        VectorDB[(Vector Database<br/>pgvector/Qdrant)]
        Redis[(Redis<br/>Cache & Queue)]
    end
    
    subgraph integration [Integration Layer]
        CRMMock[Mock CRM Data Service]
        CRMAdapter[CRM Adapter Interface]
    end
    
    WebApp -->|HTTP/REST| NodeAPI
    NodeAPI -->|REST| PythonML
    NodeAPI -->|Query| PostgreSQL
    NodeAPI -->|Cache| Redis
    PythonML -->|Query| PostgreSQL
    PythonML -->|Semantic Search| VectorDB
    PythonML -->|Model Inference| ModelTraining
    ModelTraining -->|Store Models| PostgreSQL
    CRMMock -->|Data Sync| NodeAPI
    CRMAdapter -->|Future Integration| CRMMock
    
    style WebApp fill:#e1f5ff,color:#000000
    style NodeAPI fill:#fff4e1,color:#000000
    style PythonML fill:#e8f5e9,color:#000000
    style PostgreSQL fill:#f3e5f5,color:#000000
    style VectorDB fill:#f3e5f5,color:#000000
```

## Technology Stack

### Backend Services

- **API Server**: Node.js with TypeScript, Express or NestJS framework
- **ML Service**: Python 3.11+ with FastAPI, scikit-learn, XGBoost, pandas
- **Database**: PostgreSQL 15+ with pgvector extension
- **Cache/Queue**: Redis
- **Containerization**: Docker & Docker Compose

### Frontend

- **Framework**: React 18+ with TypeScript
- **UI Library**: Material-UI
- **State Management**: React Query / Zustand
- **Build Tool**: Vite

### ML/Data Science

- **Libraries**: scikit-learn, XGBoost, pandas, numpy, scipy
- **Feature Engineering**: Custom transformers
- **Model Types**: Ensemble (Random Forest + XGBoost + Linear Regression)

## Data Flow

```mermaid
sequenceDiagram
    participant User
    participant WebApp
    participant NodeAPI
    participant PythonML
    participant PostgreSQL
    participant VectorDB
    participant MLModel
    
    User->>WebApp: Submit Quotation Request
    WebApp->>NodeAPI: POST /api/pricing/estimate
    NodeAPI->>PostgreSQL: Fetch Customer Data
    NodeAPI->>PostgreSQL: Fetch Competitor Data
    NodeAPI->>PostgreSQL: Fetch Market Conditions
    NodeAPI->>PythonML: POST /ml/estimate (with context)
    PythonML->>PostgreSQL: Query Additional Features
    PythonML->>VectorDB: Semantic Search Customer Values
    PythonML->>FeatureEngine: Generate Features
    FeatureEngine->>MLModel: Predict Price
    MLModel-->>PythonML: Price Estimate + Confidence
    PythonML-->>NodeAPI: Estimation Result
    NodeAPI->>PostgreSQL: Store Quotation Record
    NodeAPI-->>WebApp: Return Estimate
    WebApp-->>User: Display Price Estimate
```

## Service Communication

### API Layer (Node.js)
- Handles HTTP requests from the frontend
- Manages authentication and authorization
- Validates input data
- Coordinates with ML service for price estimation
- Manages database transactions for business data

### ML Service Layer (Python)
- Receives estimation requests from API layer
- Performs feature engineering on input data
- Executes model inference
- Returns price estimates with confidence intervals
- Handles model versioning and A/B testing

### Data Layer
- **PostgreSQL**: Stores structured business data (customers, products, quotations, etc.)
- **Vector Database**: Stores embeddings for semantic search (customer values, product features)
- **Redis**: Caches frequently accessed data and manages job queues

### Integration Layer
- **Mock CRM Service**: Generates synthetic data for development and testing
- **CRM Adapter**: Interface for future integration with real CRM systems

## Security Considerations

- API authentication using JWT tokens
- Rate limiting on API endpoints
- Input validation and sanitization
- Environment-based configuration management
- Database connection pooling
- Secure communication between services (HTTPS in production)

## Scalability

- Stateless API design for horizontal scaling
- ML service can be scaled independently based on inference load
- Database read replicas for query distribution
- Redis clustering for high availability
- Container orchestration ready (Kubernetes compatible)

