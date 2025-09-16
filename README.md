# Stock Market Simulator

A web-based stock market simulator game that allows players to buy and sell stocks using virtual money and analyze portfolio performance. Users can practice investing with real market data without financial risk.

## Features

- **Virtual Trading**: Start with $10,000 virtual money to practice trading
- **Real-Time Stock Prices**: Integration with market data APIs for authentic experience
- **Portfolio Management**: Track holdings, gains/losses, and diversification
- **Interactive Dashboard**: Visual portfolio analytics with charts
- **Transaction History**: Complete record of all buy/sell activities
- **Educational Focus**: Perfect for students learning about investing

## Screenshots

### Home Page
The landing page introduces the simulator and its educational benefits.

### Dashboard
Users can view their portfolio performance, including:
- Cash balance and portfolio value
- Individual stock holdings with current prices
- Gain/loss calculations
- Portfolio allocation pie chart

### Trading Interface
- Easy-to-use buy/sell forms
- Real-time stock price lookup
- Order preview before execution
- Popular stock suggestions

## Installation

1. **Clone the repository:**
   ```bash
   git clone https://github.com/NBelgaonkar/StockMarketSim.git
   cd StockMarketSim
   ```

2. **Install Python dependencies:**
   ```bash
   pip install -r requirements.txt
   ```

3. **Set up environment variables (optional):**
   ```bash
   cp .env.example .env
   # Edit .env to add your Alpha Vantage API key for real market data
   ```

4. **Run the application:**
   ```bash
   python app.py
   ```

5. **Access the application:**
   Open your web browser and go to `http://localhost:5000`

## Usage

1. **Register an Account**: Create a new account to start with $10,000 virtual money
2. **Buy Stocks**: Search for stocks by symbol (e.g., AAPL, GOOGL, MSFT) and purchase shares
3. **Monitor Portfolio**: Track your investments on the dashboard with real-time prices
4. **Sell Stocks**: Sell your holdings when you want to take profits or cut losses
5. **Analyze Performance**: View detailed transaction history and portfolio analytics

## Technology Stack

- **Backend**: Flask (Python web framework)
- **Database**: SQLAlchemy with SQLite
- **Frontend**: HTML5, Bootstrap 5, JavaScript
- **Charts**: Chart.js for data visualization
- **Authentication**: Flask-Login for user sessions
- **Forms**: Flask-WTF for secure form handling

## API Integration

The simulator supports integration with Alpha Vantage API for real stock prices. Without an API key, it uses demo data with popular stocks:
- AAPL (Apple Inc.) - $150.00
- GOOGL (Alphabet Inc.) - $2800.00  
- MSFT (Microsoft Corp.) - $300.00
- AMZN (Amazon.com Inc.) - $3200.00
- TSLA (Tesla Inc.) - $800.00

## Testing

Run the test suite to verify functionality:

```bash
python test_app.py
```

The tests cover:
- User registration and authentication
- Stock price API endpoints
- Basic application routes

## Development

### Project Structure
```
StockMarketSim/
├── app.py              # Main Flask application
├── requirements.txt    # Python dependencies
├── test_app.py        # Unit tests
├── .env.example       # Environment variables template
├── .gitignore         # Git ignore rules
├── templates/         # HTML templates
│   ├── base.html      # Base template
│   ├── index.html     # Home page
│   ├── login.html     # Login form
│   ├── register.html  # Registration form
│   ├── dashboard.html # Portfolio dashboard
│   ├── buy.html       # Buy stocks form
│   ├── sell.html      # Sell stocks form
│   └── portfolio.html # Transaction history
└── README.md          # This file
```

### Database Models
- **User**: User accounts with authentication and cash balance
- **Holding**: Current stock holdings per user
- **Transaction**: History of all buy/sell transactions

## Educational Goals

This simulator is designed to help students and beginners learn:
- **Investment Basics**: Understanding stock prices and market movements
- **Portfolio Management**: Diversification and risk management
- **Financial Literacy**: Tracking gains/losses and calculating returns
- **Decision Making**: Practice buy/sell decisions without real money risk

## Contributing

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes (`git commit -am 'Add some feature'`)
4. Push to the branch (`git push origin feature/new-feature`)
5. Create a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.
