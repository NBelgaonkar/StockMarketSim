# StockMarketSim
: Our project is a simulator game of a stock market that will allow players to buy and sell using virtual money and analyze portfolio performance. The user will be able to buy and sell stocks in real time using market data and analyze gains, losses, diversification, etc., in terms of easy visualization.
Remaining To do:

### Phase 1 — Backend Foundations

#### P1.1 Project Scaffolding (Done)
- [x] FastAPI skeleton with settings via pydantic-settings
- [x] Health endpoint `GET /health`
- [x] Requirements, Ruff config, .gitignore

#### P1.2 Database & Infrastructure
- [ ] Add Docker Compose: PostgreSQL + backend service
- [ ] Configure `DATABASE_URL` via `.env`
- [ ] SQLAlchemy 2.x models and async engine/session
- [ ] Alembic migrations integrated

#### P1.3 Data Model & Migrations
- [ ] `users` (id, email unique, password_hash, created_at)
- [ ] `accounts` (id, user_id, cash_balance_usd, created_at)
- [ ] `securities` (id, symbol, name, is_etf, lot_size=1, is_active)
- [ ] `positions` (id, account_id, security_id, quantity, avg_cost)
- [ ] `orders` (id, account_id, side, type, symbol, limit_price, quantity, status, created_at)
- [ ] `executions` (id, order_id, price, quantity, executed_at)
- [ ] `transactions` (id, account_id, type: BUY|SELL|DIVIDEND|CASH_ADJ, amount, meta, created_at)
- [ ] `dividends` (security_id, ex_date, pay_date, amount_per_share)
- [ ] Enforce non-penny constraint at order validation

#### P1.4 Authentication
- [ ] Register: `POST /auth/register` (email, password)
- [ ] Login: `POST /auth/login` returns JWT
- [ ] Password hashing (argon2 or bcrypt)
- [ ] JWT config (issuer, audience, expiry) + dependency

#### P1.5 Market Data Abstraction
- [ ] Provider interface: `get_quote`, `get_candles`, `get_dividends`
- [ ] Finnhub adapter (recommended)
- [ ] Basic caching (≤60s) and backoff for rate limits
- [ ] Symbol search over active US equities/ETFs

#### P1.6 Core Endpoints
- [ ] `GET /symbols/search?q=`
- [ ] `GET /quotes/{symbol}` (≤5 min delay acceptable)
- [ ] `GET /portfolio` (cash, positions, market value, total P&L)
- [ ] `GET /orders` and `GET /orders/{id}`
- [ ] `POST /orders` (market/limit buy/sell; no fractional)

#### P1.7 Order Execution & Accounting
- [ ] Validate cash sufficiency, lot size, non-penny
- [ ] Price: market uses quote; limit checks against quote
- [ ] Atomic transaction: order → execution → cash/positions → transactions
- [ ] Weighted average cost updates
- [ ] Immutable history (orders, executions, transactions)

#### P1.8 Valuation & Performance
- [ ] Revalue on request (no scheduler initially)
- [ ] Metrics: market value, unrealized/realized P&L, daily P&L
- [ ] Snapshots endpoint for charts (e.g., daily close series)
- [ ] Dividends credited to cash on pay_date; reflected in performance

#### P1.9 Quality & Ops
- [ ] Global exception handlers; error response schema
- [ ] Structured logging; request IDs
- [ ] CORS (dev `*`; tighten later)
- [ ] Unit tests (pytest) for services/endpoints
- [ ] Integration tests with test DB and mocked market data
- [ ] GitHub Actions CI (lint + tests)

### Phase 2 — Frontend (Outline)
- [ ] React scaffold (Vite + TypeScript)
- [ ] Auth pages (signup/login)
- [ ] Symbol search + quote display
- [ ] Trade ticket (market/limit)
- [ ] Portfolio dashboard: positions, cash, orders, transactions
- [ ] Charts: pie (allocation), line (portfolio value over time)

### Phase 3 — Enhancements (Later)
- [ ] Splits processing
- [ ] Limit order book simulation (queued fills)
- [ ] WebSocket live quotes/updates
- [ ] Admin/reporting tools
- [ ] Multi-tenant cohorts

### API Keys — Finnhub (recommended)
1. Create account at `https://finnhub.io` and get API key  
2. Add to backend `.env`: `FINNHUB_API_KEY=your_key_here`  
3. We’ll wire the adapter and run a smoke test

Alpha Vantage alternative: `https://www.alphavantage.co` (tighter limits; intraday delays may vary).

### Running Backend (current state)
```bash
cd backend
python -m venv .venv
. .venv/Scripts/activate
pip install -r requirements.txt
uvicorn app.main:app --reload --port 8000
# Health: http://localhost:8000/health
```

### Next Up (Backend)
- [ ] P1.2: Docker Compose + Postgres + SQLAlchemy + Alembic
- [ ] P1.3: Implement models and initial migrations

- I captured the full backend plan plus frontend outline in a markdown checklist. If you want, I can also save this as `PROJECT_TASKS.md` in the repo. 