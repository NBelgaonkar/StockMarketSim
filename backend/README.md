# StockMarketSim Backend

This backend is written in Django, and currently uses SQLite for storage.

## Getting Started

### Prerequisites

- uv

### Installation

```bash
# Get dependencies
uv sync
```

### Running locally

```bash
uv run fastapi dev
```

The backend will be available at `http://localhost:8080/`

API documentation is automatically generated, and available at `http://127.0.0.1:8000/docs`


## Making changes to...

### Models

Generate a migration using alembic, and apply it.
```bash
# Generate migration
uv run alembic revision --autogenerate -m "Description of the changes"
# Apply migration / sync to head
uv run alembic upgrade head
```