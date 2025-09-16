from flask import Flask, render_template, request, redirect, url_for, flash, jsonify
from flask_sqlalchemy import SQLAlchemy
from flask_login import LoginManager, UserMixin, login_user, login_required, logout_user, current_user
from flask_wtf import FlaskForm
from wtforms import StringField, PasswordField, DecimalField, IntegerField, SubmitField
from wtforms.validators import InputRequired, Length, ValidationError, NumberRange
from werkzeug.security import generate_password_hash, check_password_hash
from datetime import datetime
import requests
import os
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

app = Flask(__name__)
app.config['SECRET_KEY'] = os.getenv('SECRET_KEY', 'dev-secret-key')
app.config['SQLALCHEMY_DATABASE_URI'] = os.getenv('DATABASE_URL', 'sqlite:///stocksim.db')
app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

db = SQLAlchemy(app)
login_manager = LoginManager()
login_manager.init_app(app)
login_manager.login_view = 'login'

# Database Models
class User(UserMixin, db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String(20), nullable=False, unique=True)
    password = db.Column(db.String(80), nullable=False)
    cash = db.Column(db.Float, default=10000.0)  # Starting virtual money
    created_date = db.Column(db.DateTime, default=datetime.utcnow)
    holdings = db.relationship('Holding', backref='user', lazy=True)
    transactions = db.relationship('Transaction', backref='user', lazy=True)

class Holding(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    symbol = db.Column(db.String(10), nullable=False)
    shares = db.Column(db.Integer, nullable=False)
    avg_price = db.Column(db.Float, nullable=False)

class Transaction(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)
    symbol = db.Column(db.String(10), nullable=False)
    shares = db.Column(db.Integer, nullable=False)
    price = db.Column(db.Float, nullable=False)
    transaction_type = db.Column(db.String(4), nullable=False)  # 'BUY' or 'SELL'
    timestamp = db.Column(db.DateTime, default=datetime.utcnow)

@login_manager.user_loader
def load_user(user_id):
    return User.query.get(int(user_id))

# Forms
class RegisterForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired(), Length(min=4, max=15)])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=4, max=20)])
    submit = SubmitField('Sign Up')

    def validate_username(self, username):
        existing_user_username = User.query.filter_by(username=username.data).first()
        if existing_user_username:
            raise ValidationError('That username already exists. Choose a different one.')

class LoginForm(FlaskForm):
    username = StringField('Username', validators=[InputRequired(), Length(min=4, max=15)])
    password = PasswordField('Password', validators=[InputRequired(), Length(min=4, max=20)])
    submit = SubmitField('Sign In')

class BuyForm(FlaskForm):
    symbol = StringField('Stock Symbol', validators=[InputRequired()])
    shares = IntegerField('Shares', validators=[InputRequired(), NumberRange(min=1)])
    submit = SubmitField('Buy')

class SellForm(FlaskForm):
    symbol = StringField('Stock Symbol', validators=[InputRequired()])
    shares = IntegerField('Shares', validators=[InputRequired(), NumberRange(min=1)])
    submit = SubmitField('Sell')

# Stock API functions
def get_stock_price(symbol):
    """Get current stock price using Alpha Vantage API"""
    api_key = os.getenv('ALPHA_VANTAGE_API_KEY')
    if not api_key:
        # Return demo data if no API key
        demo_prices = {'AAPL': 150.00, 'GOOGL': 2800.00, 'MSFT': 300.00, 'AMZN': 3200.00, 'TSLA': 800.00}
        return demo_prices.get(symbol.upper(), 100.00)
    
    try:
        url = f'https://www.alphavantage.co/query?function=GLOBAL_QUOTE&symbol={symbol}&apikey={api_key}'
        response = requests.get(url)
        data = response.json()
        
        if 'Global Quote' in data:
            price = float(data['Global Quote']['05. price'])
            return price
        else:
            return None
    except:
        return None

def get_stock_info(symbol):
    """Get stock information"""
    price = get_stock_price(symbol)
    if price:
        return {
            'symbol': symbol.upper(),
            'price': price,
            'valid': True
        }
    return {'valid': False}

# Routes
@app.route('/')
def home():
    return render_template('index.html')

@app.route('/login', methods=['GET', 'POST'])
def login():
    form = LoginForm()
    if form.validate_on_submit():
        user = User.query.filter_by(username=form.username.data).first()
        if user and check_password_hash(user.password, form.password.data):
            login_user(user)
            return redirect(url_for('dashboard'))
        flash('Invalid username or password')
    return render_template('login.html', form=form)

@app.route('/register', methods=['GET', 'POST'])
def register():
    form = RegisterForm()
    if form.validate_on_submit():
        hashed_password = generate_password_hash(form.password.data)
        new_user = User(username=form.username.data, password=hashed_password)
        db.session.add(new_user)
        db.session.commit()
        login_user(new_user)
        flash('Registration successful!')
        return redirect(url_for('dashboard'))
    return render_template('register.html', form=form)

@app.route('/logout')
@login_required
def logout():
    logout_user()
    return redirect(url_for('home'))

@app.route('/dashboard')
@login_required
def dashboard():
    # Get user's holdings and calculate portfolio value
    holdings = Holding.query.filter_by(user_id=current_user.id).all()
    portfolio_value = 0
    portfolio_data = []
    
    for holding in holdings:
        current_price = get_stock_price(holding.symbol)
        if current_price:
            total_value = current_price * holding.shares
            gain_loss = (current_price - holding.avg_price) * holding.shares
            gain_loss_percent = ((current_price - holding.avg_price) / holding.avg_price) * 100
            
            portfolio_value += total_value
            portfolio_data.append({
                'symbol': holding.symbol,
                'shares': holding.shares,
                'avg_price': holding.avg_price,
                'current_price': current_price,
                'total_value': total_value,
                'gain_loss': gain_loss,
                'gain_loss_percent': gain_loss_percent
            })
    
    total_account_value = current_user.cash + portfolio_value
    
    return render_template('dashboard.html', 
                         portfolio_data=portfolio_data,
                         portfolio_value=portfolio_value,
                         total_account_value=total_account_value)

@app.route('/buy', methods=['GET', 'POST'])
@login_required
def buy():
    form = BuyForm()
    if form.validate_on_submit():
        symbol = form.symbol.data.upper()
        shares = form.shares.data
        
        stock_info = get_stock_info(symbol)
        if not stock_info['valid']:
            flash('Invalid stock symbol')
            return render_template('buy.html', form=form)
        
        price = stock_info['price']
        total_cost = price * shares
        
        if current_user.cash < total_cost:
            flash('Insufficient funds')
            return render_template('buy.html', form=form)
        
        # Update user's cash
        current_user.cash -= total_cost
        
        # Update or create holding
        holding = Holding.query.filter_by(user_id=current_user.id, symbol=symbol).first()
        if holding:
            # Calculate new average price
            total_shares = holding.shares + shares
            total_cost_basis = (holding.avg_price * holding.shares) + (price * shares)
            holding.avg_price = total_cost_basis / total_shares
            holding.shares = total_shares
        else:
            holding = Holding(user_id=current_user.id, symbol=symbol, shares=shares, avg_price=price)
            db.session.add(holding)
        
        # Record transaction
        transaction = Transaction(user_id=current_user.id, symbol=symbol, shares=shares, 
                                price=price, transaction_type='BUY')
        db.session.add(transaction)
        
        db.session.commit()
        flash(f'Successfully bought {shares} shares of {symbol} at ${price:.2f}')
        return redirect(url_for('dashboard'))
    
    return render_template('buy.html', form=form)

@app.route('/sell', methods=['GET', 'POST'])
@login_required
def sell():
    form = SellForm()
    if form.validate_on_submit():
        symbol = form.symbol.data.upper()
        shares = form.shares.data
        
        holding = Holding.query.filter_by(user_id=current_user.id, symbol=symbol).first()
        if not holding or holding.shares < shares:
            flash('You don\'t own enough shares')
            return render_template('sell.html', form=form)
        
        stock_info = get_stock_info(symbol)
        if not stock_info['valid']:
            flash('Invalid stock symbol')
            return render_template('sell.html', form=form)
        
        price = stock_info['price']
        total_proceeds = price * shares
        
        # Update user's cash
        current_user.cash += total_proceeds
        
        # Update holding
        holding.shares -= shares
        if holding.shares == 0:
            db.session.delete(holding)
        
        # Record transaction
        transaction = Transaction(user_id=current_user.id, symbol=symbol, shares=shares, 
                                price=price, transaction_type='SELL')
        db.session.add(transaction)
        
        db.session.commit()
        flash(f'Successfully sold {shares} shares of {symbol} at ${price:.2f}')
        return redirect(url_for('dashboard'))
    
    return render_template('sell.html', form=form)

@app.route('/portfolio')
@login_required
def portfolio():
    transactions = Transaction.query.filter_by(user_id=current_user.id).order_by(Transaction.timestamp.desc()).all()
    return render_template('portfolio.html', transactions=transactions)

@app.route('/api/stock/<symbol>')
def api_stock_price(symbol):
    """API endpoint for getting stock prices"""
    stock_info = get_stock_info(symbol)
    return jsonify(stock_info)

if __name__ == '__main__':
    with app.app_context():
        db.create_all()
    app.run(debug=True)