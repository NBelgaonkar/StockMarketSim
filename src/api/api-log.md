 # StockSim API Documentation

This document logs all front-end API calls expected from the Django REST backend. Each entry describes the endpoint, its purpose, request/response shapes, and which React components use it.

> **Note:** All APIs are currently mocked in the front-end. This log serves as a contract for backend implementation.

---

## Authentication APIs

### 1. Register User
| Field | Value |
|-------|-------|
| **Name** | `registerUser` |
| **HTTP Method & Path** | `POST /api/auth/register/` |
| **Used In** | `src/pages/Register.jsx` |
| **Description** | Creates a new user account with **$0 initial balance**, empty holdings, and no transactions. Returns authentication token. |

**Request Shape:**
```json
{
  "email": "string",
  "username": "string",
  "password": "string",
  "firstName": "string",
  "lastName": "string"
}
```

**Response Shape:**
```json
{
  "user": {
    "id": "number",
    "email": "string",
    "username": "string",
    "firstName": "string",
    "lastName": "string",
    "createdAt": "ISO8601 datetime"
  },
  "token": "string (JWT)"
}
```

**Important:** New users start with:
- Cash balance: $0.00
- Holdings: empty
- Transactions: empty

Users must use the deposit endpoint to add funds before trading.

---

### 2. Login User
| Field | Value |
|-------|-------|
| **Name** | `loginUser` |
| **HTTP Method & Path** | `POST /api/auth/login/` |
| **Used In** | `src/pages/Login.jsx`, `src/context/UserContext.jsx` |
| **Description** | Authenticates a user and returns a session token |

**Request Shape:**
```json
{
  "email": "string",
  "password": "string"
}
```

**Response Shape:**
```json
{
  "user": {
    "id": "number",
    "email": "string",
    "username": "string",
    "firstName": "string",
    "lastName": "string",
    "createdAt": "ISO8601 datetime"
  },
  "token": "string (JWT)"
}
```

---

### 3. Logout User
| Field | Value |
|-------|-------|
| **Name** | `logoutUser` |
| **HTTP Method & Path** | `POST /api/auth/logout/` |
| **Used In** | `src/context/UserContext.jsx`, `src/components/Navbar.jsx` |
| **Description** | Invalidates the current user session |

**Request Shape:**
```
Headers: Authorization: Bearer <token>
Body: (empty)
```

**Response Shape:**
```json
{
  "success": true
}
```

---

### 4. Get Current User
| Field | Value |
|-------|-------|
| **Name** | `getCurrentUser` |
| **HTTP Method & Path** | `GET /api/auth/me/` |
| **Used In** | `src/context/UserContext.jsx` |
| **Description** | Returns the currently authenticated user's profile |

**Request Shape:**
```
Headers: Authorization: Bearer <token>
```

**Response Shape:**
```json
{
  "user": {
    "id": "number",
    "email": "string",
    "username": "string",
    "firstName": "string",
    "lastName": "string",
    "createdAt": "ISO8601 datetime"
  }
}
```

---

## Stock APIs

### 5. Search Stocks
| Field | Value |
|-------|-------|
| **Name** | `searchStocks` |
| **HTTP Method & Path** | `GET /api/stocks/search/?q=<query>` |
| **Used In** | `src/pages/Trade.jsx`, `src/components/trade/StockSearchBar.jsx` |
| **Description** | Searches stocks by symbol or company name |

**Query Parameters:**
- `q` (string, required): Search query

**Response Shape:**
```json
[
  {
    "symbol": "string",
    "name": "string",
    "price": "number",
    "change": "number",
    "changePercent": "number",
    "sector": "string"
  }
]
```

---

### 6. Get Stock Quote
| Field | Value |
|-------|-------|
| **Name** | `getStockQuote` |
| **HTTP Method & Path** | `GET /api/stocks/quote/<symbol>/` |
| **Used In** | `src/pages/Trade.jsx`, `src/components/trade/StockDetailCard.jsx` |
| **Description** | Returns detailed quote data for a specific stock |

**URL Parameters:**
- `symbol` (string): Stock ticker symbol (e.g., "AAPL")

**Response Shape:**
```json
{
  "id": "number",
  "symbol": "string",
  "name": "string",
  "price": "number",
  "previousClose": "number",
  "change": "number",
  "changePercent": "number",
  "open": "number",
  "high": "number",
  "low": "number",
  "volume": "number",
  "avgVolume": "number",
  "marketCap": "number",
  "pe": "number",
  "eps": "number",
  "week52High": "number",
  "week52Low": "number",
  "sector": "string",
  "industry": "string",
  "description": "string"
}
```

---

### 7. Get Stock History
| Field | Value |
|-------|-------|
| **Name** | `getStockHistory` |
| **HTTP Method & Path** | `GET /api/stocks/<symbol>/history/?period=<period>` |
| **Used In** | `src/components/charts/StockChart.jsx` |
| **Description** | Returns historical price data for charting |

**URL Parameters:**
- `symbol` (string): Stock ticker symbol

**Query Parameters:**
- `period` (string): Time period - "1D", "1W", "1M", "3M", "1Y"

**Response Shape:**
```json
[
  {
    "date": "YYYY-MM-DD",
    "open": "number",
    "high": "number",
    "low": "number",
    "close": "number",
    "volume": "number"
  }
]
```

---

### 8. Get All Stocks
| Field | Value |
|-------|-------|
| **Name** | `getAllStocks` |
| **HTTP Method & Path** | `GET /api/stocks/` |
| **Used In** | `src/pages/Trade.jsx` |
| **Description** | Returns list of all available stocks for browsing |

**Response Shape:**
```json
[
  {
    "symbol": "string",
    "name": "string",
    "price": "number",
    "change": "number",
    "changePercent": "number",
    "volume": "number",
    "marketCap": "number",
    "sector": "string"
  }
]
```

---

### 9. Get Top Movers
| Field | Value |
|-------|-------|
| **Name** | `getTopMovers` |
| **HTTP Method & Path** | `GET /api/stocks/movers/` |
| **Used In** | `src/pages/Dashboard.jsx`, `src/components/dashboard/TopMovers.jsx` |
| **Description** | Returns top gainers and losers of the day |

**Response Shape:**
```json
{
  "gainers": [
    {
      "symbol": "string",
      "name": "string",
      "price": "number",
      "change": "number",
      "changePercent": "number"
    }
  ],
  "losers": [
    {
      "symbol": "string",
      "name": "string",
      "price": "number",
      "change": "number",
      "changePercent": "number"
    }
  ]
}
```

---

## Trading APIs

### 10. Execute Buy Order
| Field | Value |
|-------|-------|
| **Name** | `executeBuyOrder` |
| **HTTP Method & Path** | `POST /api/trades/buy/` |
| **Used In** | `src/pages/Trade.jsx`, `src/components/trade/TradeForm.jsx` |
| **Description** | Executes a buy order for a stock |

**Request Shape:**
```json
{
  "symbol": "string",
  "quantity": "number",
  "orderType": "MARKET | LIMIT",
  "limitPrice": "number (optional, required for LIMIT orders)"
}
```

**Response Shape:**
```json
{
  "success": true,
  "order": {
    "id": "number",
    "symbol": "string",
    "side": "BUY",
    "quantity": "number",
    "price": "number",
    "total": "number",
    "status": "FILLED",
    "filledAt": "ISO8601 datetime"
  },
  "newBalance": "number"
}
```

---

### 11. Execute Sell Order
| Field | Value |
|-------|-------|
| **Name** | `executeSellOrder` |
| **HTTP Method & Path** | `POST /api/trades/sell/` |
| **Used In** | `src/pages/Trade.jsx`, `src/components/trade/TradeForm.jsx` |
| **Description** | Executes a sell order for a stock |

**Request Shape:**
```json
{
  "symbol": "string",
  "quantity": "number",
  "orderType": "MARKET | LIMIT",
  "limitPrice": "number (optional, required for LIMIT orders)"
}
```

**Response Shape:**
```json
{
  "success": true,
  "order": {
    "id": "number",
    "symbol": "string",
    "side": "SELL",
    "quantity": "number",
    "price": "number",
    "total": "number",
    "status": "FILLED",
    "filledAt": "ISO8601 datetime",
    "realizedGainLoss": "number"
  },
  "newBalance": "number"
}
```

---

### 12. Get Order Preview
| Field | Value |
|-------|-------|
| **Name** | `getOrderPreview` |
| **HTTP Method & Path** | `POST /api/trades/preview/` |
| **Used In** | `src/components/trade/TradeForm.jsx` |
| **Description** | Returns estimated order details before execution |

**Request Shape:**
```json
{
  "symbol": "string",
  "quantity": "number",
  "side": "BUY | SELL",
  "orderType": "MARKET | LIMIT"
}
```

**Response Shape:**
```json
{
  "symbol": "string",
  "stockName": "string",
  "side": "BUY | SELL",
  "quantity": "number",
  "price": "number",
  "estimatedTotal": "number",
  "commission": "number",
  "orderType": "string",
  "availableCash": "number (for BUY)",
  "canExecute": "boolean",
  "remainingCash": "number (for BUY)",
  "sharesOwned": "number (for SELL)",
  "avgCost": "number (for SELL)",
  "estimatedGainLoss": "number (for SELL)"
}
```

---

## Portfolio APIs

### 13. Get Portfolio Summary
| Field | Value |
|-------|-------|
| **Name** | `getPortfolioSummary` |
| **HTTP Method & Path** | `GET /api/portfolio/summary/` |
| **Used In** | `src/pages/Dashboard.jsx`, `src/pages/Portfolio.jsx`, `src/components/layout/Sidebar.jsx` |
| **Description** | Returns high-level portfolio metrics |

**Response Shape:**
```json
{
  "totalValue": "number",
  "cash": "number",
  "investedValue": "number",
  "costBasis": "number",
  "totalGainLoss": "number",
  "totalGainLossPercent": "number",
  "overallReturn": "number",
  "overallReturnPercent": "number",
  "positionCount": "number",
  "todayChange": "number"
}
```

---

### 14. Get Positions
| Field | Value |
|-------|-------|
| **Name** | `getPositions` |
| **HTTP Method & Path** | `GET /api/portfolio/positions/` |
| **Used In** | `src/pages/Portfolio.jsx`, `src/components/portfolio/HoldingsTable.jsx` |
| **Description** | Returns all current stock positions |

**Response Shape:**
```json
[
  {
    "id": "number",
    "symbol": "string",
    "name": "string",
    "quantity": "number",
    "avgCost": "number",
    "currentPrice": "number",
    "marketValue": "number",
    "costBasis": "number",
    "gainLoss": "number",
    "gainLossPercent": "number",
    "sector": "string",
    "purchaseDate": "YYYY-MM-DD"
  }
]
```

---

### 15. Get Transactions
| Field | Value |
|-------|-------|
| **Name** | `getTransactions` |
| **HTTP Method & Path** | `GET /api/portfolio/transactions/?type=<type>&page=<page>&limit=<limit>` |
| **Used In** | `src/pages/Activity.jsx`, `src/components/portfolio/TransactionHistory.jsx` |
| **Description** | Returns paginated transaction history |

**Query Parameters:**
- `type` (string): Filter by type - "ALL", "BUY", "SELL", "DEPOSIT"
- `page` (number): Page number for pagination
- `limit` (number): Items per page

**Response Shape:**
```json
{
  "transactions": [
    {
      "id": "number",
      "type": "BUY | SELL | DEPOSIT",
      "symbol": "string | null",
      "quantity": "number | null",
      "price": "number | null",
      "total": "number",
      "date": "ISO8601 datetime",
      "status": "COMPLETED | PENDING | CANCELLED"
    }
  ],
  "total": "number",
  "page": "number",
  "totalPages": "number"
}
```

---

### 16. Get Performance History
| Field | Value |
|-------|-------|
| **Name** | `getPerformanceHistory` |
| **HTTP Method & Path** | `GET /api/portfolio/performance/?period=<period>` |
| **Used In** | `src/pages/Dashboard.jsx`, `src/pages/Portfolio.jsx`, `src/components/charts/PerformanceChart.jsx` |
| **Description** | Returns historical portfolio value for charting |

**Query Parameters:**
- `period` (string): Time period - "1D", "1W", "1M", "3M", "1Y"

**Response Shape:**
```json
[
  {
    "date": "YYYY-MM-DD",
    "label": "string (display label)",
    "value": "number"
  }
]
```

---

### 17. Get Portfolio Allocation
| Field | Value |
|-------|-------|
| **Name** | `getAllocation` |
| **HTTP Method & Path** | `GET /api/portfolio/allocation/` |
| **Used In** | `src/pages/Portfolio.jsx`, `src/components/charts/AllocationChart.jsx` |
| **Description** | Returns portfolio allocation breakdown by sector |

**Response Shape:**
```json
[
  {
    "name": "string (sector name)",
    "value": "number (dollar amount)",
    "percent": "number"
  }
]
```

---

### 18. Get Allocation by Ticker
| Field | Value |
|-------|-------|
| **Name** | `getAllocationByTicker` |
| **HTTP Method & Path** | `GET /api/portfolio/allocation/?by=ticker` |
| **Used In** | `src/pages/Portfolio.jsx` |
| **Description** | Returns portfolio allocation breakdown by stock ticker |

**Query Parameters:**
- `by` (string): "ticker" to group by symbol

**Response Shape:**
```json
[
  {
    "name": "string (ticker symbol)",
    "value": "number (dollar amount)",
    "percent": "number"
  }
]
```

---

## Wallet APIs

### 19. Deposit Funds
| Field | Value |
|-------|-------|
| **Name** | `depositFunds` |
| **HTTP Method & Path** | `POST /api/wallet/deposit/` |
| **Used In** | `src/components/wallet/AddFundsModal.jsx`, `src/pages/Dashboard.jsx`, `src/pages/Portfolio.jsx` |
| **Description** | Deposits virtual funds into the user's account. Creates a DEPOSIT transaction record. |

**Request Shape:**
```json
{
  "amount": "number (positive, max 1000000)"
}
```

**Response Shape:**
```json
{
  "success": true,
  "transaction": {
    "id": "number",
    "type": "DEPOSIT",
    "symbol": null,
    "quantity": null,
    "price": null,
    "total": "number",
    "date": "ISO8601 datetime",
    "status": "COMPLETED"
  },
  "newBalance": "number"
}
```

**Validation:**
- Amount must be positive
- Maximum single deposit: $1,000,000

---

### 20. Get Wallet Balance
| Field | Value |
|-------|-------|
| **Name** | `getWalletBalance` |
| **HTTP Method & Path** | `GET /api/wallet/balance/` |
| **Used In** | `src/components/layout/Sidebar.jsx` |
| **Description** | Returns the user's current cash balance |

**Response Shape:**
```json
{
  "cash": "number",
  "currency": "USD"
}
```

---

## Watchlist APIs

### 21. Get Watchlist
| Field | Value |
|-------|-------|
| **Name** | `getWatchlist` |
| **HTTP Method & Path** | `GET /api/watchlist/` |
| **Used In** | `src/pages/Watchlist.jsx`, `src/components/watchlist/WatchlistSidebar.jsx` |
| **Description** | Returns the user's watchlist with current stock prices |

**Response Shape:**
```json
[
  {
    "id": "number",
    "symbol": "string",
    "name": "string",
    "price": "number",
    "change": "number",
    "changePercent": "number",
    "addedAt": "ISO8601 datetime",
    "hasAlert": "boolean",
    "alertPrice": "number | null",
    "alertDirection": "string | null"
  }
]
```

---

### 22. Add to Watchlist
| Field | Value |
|-------|-------|
| **Name** | `addToWatchlist` |
| **HTTP Method & Path** | `POST /api/watchlist/add/` |
| **Used In** | `src/components/watchlist/WatchlistButton.jsx`, `src/components/StockCard.jsx` |
| **Description** | Adds a stock to the user's watchlist |

**Request Shape:**
```json
{
  "symbol": "string"
}
```

**Response Shape:**
```json
{
  "success": true,
  "item": {
    "id": "number",
    "symbol": "string",
    "name": "string",
    "price": "number",
    "change": "number",
    "changePercent": "number",
    "addedAt": "ISO8601 datetime"
  }
}
```

---

### 23. Remove from Watchlist
| Field | Value |
|-------|-------|
| **Name** | `removeFromWatchlist` |
| **HTTP Method & Path** | `DELETE /api/watchlist/remove/` |
| **Used In** | `src/components/watchlist/WatchlistButton.jsx`, `src/pages/Watchlist.jsx` |
| **Description** | Removes a stock from the user's watchlist |

**Request Shape:**
```json
{
  "symbol": "string"
}
```

**Response Shape:**
```json
{
  "success": true,
  "symbol": "string"
}
```

---

## Alerts APIs

### 24. Get Alerts
| Field | Value |
|-------|-------|
| **Name** | `getAlerts` |
| **HTTP Method & Path** | `GET /api/alerts/` |
| **Used In** | `src/components/alerts/AlertsList.jsx`, `src/pages/Watchlist.jsx`, `src/pages/Profile.jsx` |
| **Description** | Returns all price alerts for the user |

**Response Shape:**
```json
[
  {
    "id": "number",
    "symbol": "string",
    "stockName": "string",
    "targetPrice": "number",
    "currentPrice": "number",
    "direction": "above | below",
    "note": "string",
    "createdAt": "ISO8601 datetime",
    "isActive": "boolean",
    "isTriggered": "boolean",
    "difference": "number",
    "differencePercent": "number"
  }
]
```

---

### 25. Create Alert
| Field | Value |
|-------|-------|
| **Name** | `createAlert` |
| **HTTP Method & Path** | `POST /api/alerts/` |
| **Used In** | `src/components/alerts/PriceAlertModal.jsx` |
| **Description** | Creates a new price alert |

**Request Shape:**
```json
{
  "symbol": "string",
  "targetPrice": "number",
  "direction": "above | below",
  "note": "string (optional)"
}
```

**Response Shape:**
```json
{
  "success": true,
  "alert": {
    "id": "number",
    "symbol": "string",
    "stockName": "string",
    "targetPrice": "number",
    "currentPrice": "number",
    "direction": "string",
    "note": "string",
    "createdAt": "ISO8601 datetime"
  }
}
```

---

### 26. Delete Alert
| Field | Value |
|-------|-------|
| **Name** | `deleteAlert` |
| **HTTP Method & Path** | `DELETE /api/alerts/<id>/` |
| **Used In** | `src/components/alerts/AlertsList.jsx` |
| **Description** | Deletes a price alert |

**URL Parameters:**
- `id` (number): Alert ID

**Response Shape:**
```json
{
  "success": true,
  "alertId": "number"
}
```

---

## News APIs

### 27. Get News
| Field | Value |
|-------|-------|
| **Name** | `getNews` |
| **HTTP Method & Path** | `GET /api/news/` |
| **Used In** | `src/components/news/NewsFeed.jsx`, `src/components/news/MarketNews.jsx` |
| **Description** | Returns market news, optionally filtered by symbol or category |

**Query Parameters:**
- `symbol` (string, optional): Filter by stock symbol
- `category` (string, optional): Filter by category
- `limit` (number, optional): Max items to return (default: 10)

**Response Shape:**
```json
[
  {
    "id": "number",
    "headline": "string",
    "summary": "string",
    "source": "string",
    "publishedAt": "ISO8601 datetime",
    "relativeTime": "string",
    "symbols": ["string"],
    "category": "string",
    "sentiment": "bullish | bearish | neutral",
    "imageUrl": "string | null"
  }
]
```

---

## Market APIs

### 28. Get Market Status
| Field | Value |
|-------|-------|
| **Name** | `getMarketStatus` |
| **HTTP Method & Path** | `GET /api/market/status/` |
| **Used In** | `src/components/market/MarketStatusBadge.jsx` |
| **Description** | Returns current market status (open/closed) based on NYSE hours |

**Response Shape:**
```json
{
  "isOpen": "boolean",
  "status": "OPEN | CLOSED",
  "exchange": "NYSE",
  "timezone": "America/New_York",
  "currentTime": "ISO8601 datetime",
  "nextEvent": "open | close",
  "timeUntilNextEvent": "string (e.g., '2h 30m')",
  "tradingHours": {
    "open": "9:30 AM ET",
    "close": "4:00 PM ET"
  },
  "isWeekend": "boolean",
  "message": "string"
}
```

---

## Error Responses

All endpoints may return error responses in this format:

```json
{
  "error": {
    "code": "string",
    "message": "string",
    "details": {} // optional additional context
  }
}
```

Common HTTP status codes:
- `400` - Bad Request (validation errors)
- `401` - Unauthorized (missing or invalid token)
- `403` - Forbidden (insufficient permissions)
- `404` - Not Found (resource doesn't exist)
- `422` - Unprocessable Entity (business logic errors)
- `500` - Internal Server Error

---

## Authentication Notes

All authenticated endpoints require the `Authorization` header:
```
Authorization: Bearer <jwt_token>
```

The token is obtained from the login or register endpoints and should be stored securely in the client (localStorage recommended for this demo, consider httpOnly cookies for production).

---

## Implementation Status

| API | Mock Implemented | Backend Status |
|-----|------------------|----------------|
| registerUser | ✅ | ⏳ Pending |
| loginUser | ✅ | ⏳ Pending |
| logoutUser | ✅ | ⏳ Pending |
| getCurrentUser | ✅ | ⏳ Pending |
| searchStocks | ✅ | ⏳ Pending |
| getStockQuote | ✅ | ⏳ Pending |
| getStockHistory | ✅ | ⏳ Pending |
| getAllStocks | ✅ | ⏳ Pending |
| getTopMovers | ✅ | ⏳ Pending |
| executeBuyOrder | ✅ | ⏳ Pending |
| executeSellOrder | ✅ | ⏳ Pending |
| getOrderPreview | ✅ | ⏳ Pending |
| getPortfolioSummary | ✅ | ⏳ Pending |
| getPositions | ✅ | ⏳ Pending |
| getTransactions | ✅ | ⏳ Pending |
| getPerformanceHistory | ✅ | ⏳ Pending |
| getAllocation | ✅ | ⏳ Pending |
| getAllocationByTicker | ✅ | ⏳ Pending |
| depositFunds | ✅ | ⏳ Pending |
| getWalletBalance | ✅ | ⏳ Pending |
| getWatchlist | ✅ | ⏳ Pending |
| addToWatchlist | ✅ | ⏳ Pending |
| removeFromWatchlist | ✅ | ⏳ Pending |
| getAlerts | ✅ | ⏳ Pending |
| createAlert | ✅ | ⏳ Pending |
| deleteAlert | ✅ | ⏳ Pending |
| getNews | ✅ | ⏳ Pending |
| getMarketStatus | ✅ | ⏳ Pending |

---

## Route Protection (Front-End)

The following routes require authentication:

| Route | Component | Auth Required |
|-------|-----------|---------------|
| `/` | Dashboard | No (shows landing if not logged in) |
| `/login` | Login | No |
| `/register` | Register | No |
| `/trade` | Trade | **Yes** |
| `/portfolio` | Portfolio | **Yes** |
| `/activity` | Activity | **Yes** |
| `/watchlist` | Watchlist | **Yes** |
| `/profile` | Profile | **Yes** |

Unauthenticated users attempting to access protected routes are redirected to `/login` with a message explaining they need to log in or create an account.

---

## New Components Summary

| Component | Location | Purpose |
|-----------|----------|---------|
| ToastProvider | `src/context/ToastContext.jsx` | Global notification system |
| ConfirmDialog | `src/components/ui/ConfirmDialog.jsx` | Reusable confirmation modal |
| EmptyState | `src/components/ui/EmptyState.jsx` | Reusable empty states |
| WatchlistButton | `src/components/watchlist/WatchlistButton.jsx` | Add/remove from watchlist |
| WatchlistSidebar | `src/components/watchlist/WatchlistSidebar.jsx` | Watchlist widget |
| MarketStatusBadge | `src/components/market/MarketStatusBadge.jsx` | Market open/closed indicator |
| PriceAlertModal | `src/components/alerts/PriceAlertModal.jsx` | Create price alerts |
| AlertsList | `src/components/alerts/AlertsList.jsx` | Display all alerts |
| NewsCard | `src/components/news/NewsCard.jsx` | Individual news item |
| NewsFeed | `src/components/news/NewsFeed.jsx` | News list component |
| MarketNews | `src/components/news/MarketNews.jsx` | Market-wide news |
| StockComparisonChart | `src/components/charts/StockComparisonChart.jsx` | Compare multiple stocks |
| StockScreener | `src/components/trade/StockScreener.jsx` | Filter stocks |
| ExportButton | `src/components/ui/ExportButton.jsx` | CSV export |
| DarkModeToggle | `src/components/ui/DarkModeToggle.jsx` | Theme switcher |
| MobileBottomNav | `src/components/layout/MobileBottomNav.jsx` | Mobile navigation |
| ChartAnnotations | `src/components/charts/ChartAnnotations.jsx` | Buy/sell markers on charts |

