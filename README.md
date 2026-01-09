# Valora AI - B2B Pricing Estimator System

## Project Description

A B2B pricing quotation system that analyzes customer values, competitor rates, market conditions, and relationship data to provide AI-powered fair price estimates.

## Architecture

The system uses a hybrid architecture with:
- **Node.js/TypeScript** for API services
- **Python** for ML processing
- **PostgreSQL** with pgvector for data storage
- **Redis** for caching and queuing
- **React** for the frontend

## Project Structure

```
valora-ai/
├── backend/
│   ├── node-api/              # Node.js API server
│   └── python-ml/             # Python ML service
├── frontend/                  # React web application
├── database/                  # Database migrations and seeds
├── docker/                    # Docker configuration
├── docs/                      # Documentation
└── scripts/                   # Utility scripts
```

## Getting Started

### Prerequisites

- Docker and Docker Compose
- Node.js 20+ (for local development)
- Python 3.11+ (for local development)

### Development Setup

1. Clone the repository
2. Copy `.env.example` to `.env` and configure environment variables
3. Run `docker-compose up` from the `docker/` directory
4. Access the services:
   - Frontend: http://localhost:3000
   - Node API: http://localhost:3000
   - Python ML Service: http://localhost:8000

## Documentation

See the `docs/` directory for detailed documentation.

## License

ISC

