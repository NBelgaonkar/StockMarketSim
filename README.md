# StockSim - Stock Market Simulator

A front-end demo application for practicing stock trading with virtual money. Built with React and Tailwind CSS, featuring a modern brokerage-style UI with complete mock API integration.

> **Note:** This is a front-end–only implementation. All data is simulated using mock APIs. The architecture is designed for future Django REST backend integration.

![React](https://img.shields.io/badge/React-18.2-blue)
![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.4-38bdf8)
![Vite](https://img.shields.io/badge/Vite-5.0-646cff)
![License](https://img.shields.io/badge/License-MIT-green)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Architecture](#architecture)
- [Mock API Layer](#mock-api-layer)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Development Guide](#development-guide)
- [Contributing](#contributing)
- [Screenshots](#screenshots)

---

## Overview

StockSim is a **front-end–only** stock market simulator designed for students and beginners to practice trading without financial risk. The application provides:

- **React 18** with functional components and hooks
- **Tailwind CSS** for utility-first styling
- **Recharts** for interactive data visualization
- **React Router v6** for client-side routing with protected routes
- **Mock API layer** designed to mirror future Django REST endpoints
- **LocalStorage persistence** for user data, portfolio, and preferences

All trading, portfolio management, and user authentication are simulated entirely in the browser with no real network calls.

---

## Features

### 🔐 Authentication

| Feature | Description |
|---------|-------------|
| Login Page | Email/password form with validation |
| Register Page | Full registration with name, email, username |
| Auth State | Client-side authentication via React Context |
| Protected Routes | Trade, Portfolio, Activity, Watchlist, Profile require login |
| Session Persistence | User session stored in localStorage |

**Route Protection:**
- Unauthenticated users attempting to access protected routes are redirected to `/login`
- A message explains: *"Please log in or create an account to access trading and portfolio features."*

### 💰 Initial User Setup

New users start with:
- **$0.00 cash balance**
- **Empty portfolio** (no holdings)
- **Empty transaction history**

Users must use the **Add Funds** feature to deposit virtual money before trading.

### 📈 Trading (Mocked)

| Feature | Description |
|---------|-------------|
| Stock Search | Search by symbol or company name with autocomplete |
| Stock Detail Card | Price, daily change, mini-chart, key statistics |
| Buy/Sell Forms | Quantity input, order preview, estimated total |
| Order Execution | Updates client-side portfolio state |
| Validation | Insufficient funds/shares checks |
| Toast Notifications | Success/error feedback on trades |

### 💼 Portfolio Management

| Feature | Description |
|---------|-------------|
| Holdings Table | Sortable by symbol, value, gain/loss |
| Cash Balance Card | Current available cash |
| Add Funds Modal | Deposit virtual money (quick amounts + custom) |
| Performance Chart | Historical portfolio value with timeframe selector |
| Allocation Chart | Pie chart by ticker or sector |
| Transaction History | Paginated list with filters |

### 📊 Charts & Visualization

| Component | Description |
|-----------|-------------|
| PerformanceChart | Line/area chart of portfolio value over time |
| AllocationChart | Pie chart showing portfolio distribution |
| StockComparisonChart | Compare normalized % performance of multiple stocks |
| ChartAnnotations | Buy/sell markers overlay on charts |

### ⭐ Watchlist

| Feature | Description |
|---------|-------------|
| Add/Remove Stocks | Star button on stock cards |
| WatchlistSidebar | Quick view widget |
| WatchlistPage | Full watchlist management |
| Price Alerts | Set target price alerts (above/below) |
| Persistence | Stored via mock API + localStorage |

### 📰 News Feed

| Feature | Description |
|---------|-------------|
| MarketNews | General market news feed |
| Symbol News | Stock-specific news filtering |
| NewsCard | Headline, summary, source, sentiment |
| Mock Data | Pre-populated news articles |

### ⚙️ Profile & Settings

| Feature | Description |
|---------|-------------|
| User Profile | View/edit name and email |
| Notification Preferences | Toggle switches for alerts |
| Dark Mode | Theme toggle with persistence |
| Reset Account | Clear all data and start fresh |

### 📱 Mobile Support

| Feature | Description |
|---------|-------------|
| Responsive Design | Adapts to tablet and mobile |
| MobileBottomNav | Bottom navigation bar on small screens |
| Touch-Friendly | Appropriately sized tap targets |

### 🛠️ Utility Components

| Component | Purpose |
|-----------|---------|
| ToastProvider | Global notification system (success/error/warning/info) |
| ConfirmDialog | Reusable confirmation modal for destructive actions |
| EmptyState | Consistent empty state UI with icons and CTAs |
| ExportButton | Export data to CSV |
| MarketStatusBadge | Shows market open/closed based on NYSE hours |
| StockScreener | Filter stocks by sector, price, % change |

---

## Architecture

### Application Structure

```
src/
├── api/                    # Mock API layer
│   ├── client.js           # Base API client utilities
│   ├── auth.js             # Authentication endpoints
│   ├── stocks.js           # Stock data endpoints
│   ├── portfolio.js        # Portfolio management
│   ├── trades.js           # Buy/sell execution
│   ├── wallet.js           # Deposit funds
│   ├── watchlist.js        # Watchlist management
│   ├── alerts.js           # Price alerts
│   ├── news.js             # Market news
│   ├── market.js           # Market status
│   ├── index.js            # Unified exports
│   └── api-log.md          # API documentation
├── components/
│   ├── layout/             # Layout components
│   │   ├── MainLayout.jsx
│   │   ├── Sidebar.jsx
│   │   ├── PageHeader.jsx
│   │   └── MobileBottomNav.jsx
│   ├── ui/                 # Reusable UI components
│   │   ├── Button.jsx
│   │   ├── Card.jsx
│   │   ├── Input.jsx
│   │   ├── Modal.jsx
│   │   ├── ConfirmDialog.jsx
│   │   ├── EmptyState.jsx
│   │   ├── StatCard.jsx
│   │   ├── Skeleton.jsx
│   │   ├── ExportButton.jsx
│   │   └── DarkModeToggle.jsx
│   ├── charts/             # Data visualization
│   │   ├── PerformanceChart.jsx
│   │   ├── AllocationChart.jsx
│   │   ├── StockComparisonChart.jsx
│   │   └── ChartAnnotations.jsx
│   ├── trade/              # Trading components
│   │   ├── StockSearchBar.jsx
│   │   ├── StockDetailCard.jsx
│   │   ├── TradeForm.jsx
│   │   └── StockScreener.jsx
│   ├── portfolio/          # Portfolio components
│   │   ├── HoldingsTable.jsx
│   │   └── TransactionsTable.jsx
│   ├── watchlist/          # Watchlist components
│   │   ├── WatchlistButton.jsx
│   │   └── WatchlistSidebar.jsx
│   ├── alerts/             # Alert components
│   │   ├── PriceAlertModal.jsx
│   │   └── AlertsList.jsx
│   ├── news/               # News components
│   │   ├── NewsCard.jsx
│   │   ├── NewsFeed.jsx
│   │   └── MarketNews.jsx
│   ├── market/             # Market components
│   │   └── MarketStatusBadge.jsx
│   ├── wallet/             # Wallet components
│   │   └── AddFundsModal.jsx
│   ├── dashboard/          # Dashboard widgets
│   │   ├── TopMovers.jsx
│   │   └── RecentActivity.jsx
│   └── auth/               # Auth components
│       └── ProtectedRoute.jsx
├── context/                # React Context providers
│   ├── UserContext.jsx     # Authentication state
│   ├── ToastContext.jsx    # Toast notifications
│   └── ThemeContext.jsx    # Dark mode state
├── pages/                  # Page components
│   ├── Dashboard.jsx       # Home/landing page
│   ├── Trade.jsx           # Stock search & trading
│   ├── Portfolio.jsx       # Portfolio overview
│   ├── Activity.jsx        # Transaction history
│   ├── Watchlist.jsx       # Watchlist management
│   ├── Profile.jsx         # User settings
│   ├── Login.jsx           # Login form
│   ├── Register.jsx        # Registration form
│   └── NotFound.jsx        # 404 page
├── data/                   # Static mock data
│   └── mockStocks.js
├── hooks/                  # Custom React hooks
│   └── usePortfolio.js
├── App.jsx                 # Root component
├── router.jsx              # Route definitions
├── main.jsx                # Entry point
└── index.css               # Global styles
```

### Global State Management

| Context | Purpose | Persistence |
|---------|---------|-------------|
| UserContext | Current user, login/logout functions | localStorage |
| ToastContext | Toast notifications queue | Memory only |
| ThemeContext | Dark mode preference | localStorage |

Portfolio, watchlist, and alerts state is managed through the mock API layer with localStorage persistence.

### Routing

| Route | Component | Protected |
|-------|-----------|-----------|
| `/` | Dashboard | No |
| `/login` | Login | No |
| `/register` | Register | No |
| `/trade` | Trade | **Yes** |
| `/portfolio` | Portfolio | **Yes** |
| `/activity` | Activity | **Yes** |
| `/watchlist` | Watchlist | **Yes** |
| `/profile` | Profile | **Yes** |

The `ProtectedRoute` component wraps protected pages and redirects unauthenticated users to `/login`.

### Design System

- **Colors:** Primary blue, success green, danger red, neutral grays
- **Typography:** Inter font family
- **Spacing:** Consistent 4px base unit
- **Components:** Card-based layout with rounded corners and subtle shadows
- **Responsive:** Mobile-first with breakpoints at sm, md, lg, xl

---

## Mock API Layer

All API calls are mocked and return simulated data. The mock layer is designed to match future Django REST endpoints.

> ⚠️ **Important:** No real network calls are made. All data is simulated in-browser.

### Authentication APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/auth/register/` | POST | Create new user (starts with $0) |
| `/api/auth/login/` | POST | Authenticate user |
| `/api/auth/logout/` | POST | End session |
| `/api/auth/me/` | GET | Get current user |

### Stock APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/stocks/search/` | GET | Search stocks by query |
| `/api/stocks/quote/<symbol>/` | GET | Get detailed stock quote |
| `/api/stocks/<symbol>/history/` | GET | Get price history |
| `/api/stocks/` | GET | List all stocks |
| `/api/stocks/movers/` | GET | Top gainers/losers |

### Trading APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/trades/buy/` | POST | Execute buy order |
| `/api/trades/sell/` | POST | Execute sell order |
| `/api/trades/preview/` | POST | Get order preview |

### Portfolio APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/portfolio/summary/` | GET | Portfolio totals |
| `/api/portfolio/positions/` | GET | Current holdings |
| `/api/portfolio/transactions/` | GET | Transaction history |
| `/api/portfolio/performance/` | GET | Historical values |
| `/api/portfolio/allocation/` | GET | Allocation breakdown |

### Wallet APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/wallet/deposit/` | POST | Add virtual funds |
| `/api/wallet/balance/` | GET | Get cash balance |

### Watchlist APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/watchlist/` | GET | Get watchlist |
| `/api/watchlist/add/` | POST | Add stock |
| `/api/watchlist/remove/` | DELETE | Remove stock |

### Alert APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/alerts/` | GET | Get all alerts |
| `/api/alerts/` | POST | Create alert |
| `/api/alerts/<id>/` | DELETE | Delete alert |

### Other APIs

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/news/` | GET | Get market news |
| `/api/market/status/` | GET | Market open/closed |

For detailed request/response shapes, see `src/api/api-log.md`.

---

## Getting Started

### Prerequisites

- Node.js 18+ 
- npm or yarn

### Installation

```bash
# Clone the repository
git clone <repository-url>
cd StockMarketSim

# Install dependencies
npm install

# Start development server
npm run dev
```

The app will be available at `http://localhost:5173/`

### Build for Production

```bash
# Create production build
npm run build

# Preview production build
npm run preview
```

Production files are output to the `dist/` directory.

---

## Project Structure

### Key Files

| File | Purpose |
|------|---------|
| `src/App.jsx` | Root component with providers |
| `src/router.jsx` | Route definitions |
| `src/api/index.js` | Unified API exports |
| `src/api/api-log.md` | Complete API documentation |
| `src/context/UserContext.jsx` | Authentication state |
| `src/context/ToastContext.jsx` | Toast notifications |
| `tailwind.config.js` | Tailwind configuration |

### LocalStorage Keys

| Key | Purpose |
|-----|---------|
| `user` | Current user session |
| `userPortfolio` | Portfolio state (cash, positions, transactions) |
| `userWatchlist` | Watchlist items |
| `userAlerts` | Price alerts |
| `darkMode` | Theme preference |
| `mockUsers` | Registered users database |

---

## Development Guide

### Adding a New Page

1. Create component in `src/pages/`
2. Add route in `src/router.jsx`
3. Wrap with `ProtectedRoute` if authentication required
4. Add navigation link in `src/components/Navbar.jsx`

### Adding a New API Endpoint

1. Create function in appropriate `src/api/*.js` file
2. Export from `src/api/index.js`
3. Document in `src/api/api-log.md`
4. Use `mockRequest()` for simulated delay

```javascript
// Example: src/api/example.js
import { mockRequest } from './client';

export const getExample = async (params) => {
  // Your mock logic here
  return mockRequest({ data: 'example' });
};
```

### Adding a New Component

1. Create in appropriate `src/components/` subdirectory
2. Follow existing patterns (props, styling)
3. Use existing UI components (Button, Card, Input)
4. Include loading and error states

### Using Toast Notifications

```javascript
import { showToast } from '../context/ToastContext';

// Success
showToast({ type: 'success', message: 'Trade executed!' });

// Error
showToast({ type: 'error', message: 'Insufficient funds' });

// Warning
showToast({ type: 'warning', message: 'Market is closed' });

// Info
showToast({ type: 'info', message: 'Price alert set' });
```

### Using Confirm Dialog

```javascript
import ConfirmDialog from '../components/ui/ConfirmDialog';

<ConfirmDialog
  isOpen={showConfirm}
  onClose={() => setShowConfirm(false)}
  onConfirm={handleDelete}
  title="Delete Alert"
  message="Are you sure you want to delete this alert?"
  confirmLabel="Delete"
  variant="danger"
/>
```

---

## Contributing

### Guidelines

1. **Follow component structure** - Place components in appropriate directories
2. **Document APIs** - Add new endpoints to `api-log.md`
3. **Maintain route protection** - Protected routes must stay protected
4. **Use established patterns** - Toast notifications, ConfirmDialog, EmptyState
5. **Keep front-end only** - No backend code or real API calls
6. **Test responsively** - Verify mobile and desktop layouts

### Code Style

- Functional components with hooks
- Tailwind CSS for styling
- Descriptive variable and function names
- Comments for complex logic
- Consistent file naming (PascalCase for components)

---

## Screenshots

### Landing Page
*Hero section with call-to-action for new users*

### Dashboard
*Portfolio overview with performance chart and quick stats*

### Trade Page
*Stock search, detail card, and buy/sell forms*

### Portfolio
*Holdings table, allocation chart, and cash balance*

### Watchlist
*Tracked stocks with price alerts*

### Mobile View
*Responsive layout with bottom navigation*

---

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

---

## Acknowledgments

- [React](https://reactjs.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [Recharts](https://recharts.org/)
- [Vite](https://vitejs.dev/)
- [React Router](https://reactrouter.com/)

---

<p align="center">
  Built with ❤️ for learning stock trading without the risk
</p>
