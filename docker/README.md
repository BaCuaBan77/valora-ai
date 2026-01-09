# Docker Setup for Valora AI

This directory contains the Docker configuration for the B2B Pricing Estimator System.

## Services

The Docker Compose setup includes:

- **PostgreSQL** (with pgvector extension) - Database service
- **Redis** - Cache and queue service
- **Node.js API** - Main API server
- **Python ML Service** - Machine learning inference service

## Prerequisites

- Docker 20.10+
- Docker Compose 2.0+

## Quick Start

1. **Copy environment variables** (optional, defaults are provided):
   ```bash
   cp env.example .env
   # Edit .env with your configuration
   ```

2. **Start all services**:
   ```bash
   docker-compose up -d
   ```

3. **View logs**:
   ```bash
   docker-compose logs -f
   ```

4. **Stop all services**:
   ```bash
   docker-compose down
   ```

5. **Stop and remove volumes** (clean slate):
   ```bash
   docker-compose down -v
   ```

## Service Ports

- **PostgreSQL**: `5432`
- **Redis**: `6379`
- **Node.js API**: `3000`
- **Python ML Service**: `8000`

## Environment Variables

See `env.example` for all available environment variables. You can override defaults by:

1. Creating a `.env` file in the `docker/` directory
2. Setting environment variables in your shell before running `docker-compose`

## Development Mode

The services are configured with volume mounts for hot-reloading:

- Node.js API: Source code is mounted, changes trigger rebuilds
- Python ML Service: Source code is mounted with `--reload` flag

## Health Checks

All services include health checks:

- PostgreSQL: Checks database readiness
- Redis: Checks Redis connectivity
- Node.js API: Checks `/health` endpoint
- Python ML Service: Checks `/health` endpoint

Services wait for dependencies to be healthy before starting.

## Building Images

To rebuild images:

```bash
# Rebuild all services
docker-compose build

# Rebuild a specific service
docker-compose build node-api
docker-compose build python-ml
```

## Database Migrations

Database migrations and seeds are automatically loaded from:
- `../database/migrations/` → `/docker-entrypoint-initdb.d/migrations/`
- `../database/seeds/` → `/docker-entrypoint-initdb.d/seeds/`

## Volumes

Persistent data is stored in Docker volumes:

- `postgres_data` - PostgreSQL data
- `redis_data` - Redis data
- `ml_models` - ML model files

## Networking

All services are connected via the `valora-network` bridge network, allowing them to communicate using service names as hostnames.

## Troubleshooting

### Services won't start
- Check logs: `docker-compose logs [service-name]`
- Verify ports aren't already in use
- Ensure Docker has enough resources allocated

### Database connection issues
- Wait for PostgreSQL health check to pass
- Verify `DATABASE_URL` environment variable
- Check PostgreSQL logs: `docker-compose logs postgres`

### Build failures
- Clear Docker cache: `docker-compose build --no-cache`
- Verify all required files exist in service directories


