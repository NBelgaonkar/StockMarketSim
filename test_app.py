import unittest
import tempfile
import os
import sys

# Add the current directory to Python path
sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from app import app, db, User, Holding, Transaction

class StockMarketSimTestCase(unittest.TestCase):
    
    def setUp(self):
        # Create a temporary database
        self.db_fd, app.config['DATABASE'] = tempfile.mkstemp()
        app.config['TESTING'] = True
        app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///:memory:'
        app.config['WTF_CSRF_ENABLED'] = False
        
        self.app = app.test_client()
        with app.app_context():
            db.create_all()
    
    def tearDown(self):
        os.close(self.db_fd)
        os.unlink(app.config['DATABASE'])
    
    def test_home_page(self):
        """Test that home page loads correctly"""
        rv = self.app.get('/')
        self.assertEqual(rv.status_code, 200)
        self.assertIn(b'Stock Market Simulator', rv.data)
    
    def test_user_registration(self):
        """Test user registration"""
        rv = self.app.post('/register', data={
            'username': 'testuser',
            'password': 'testpass',
            'submit': 'Sign Up'
        }, follow_redirects=True)
        
        self.assertEqual(rv.status_code, 200)
        
        # Check that user was created in database
        with app.app_context():
            user = User.query.filter_by(username='testuser').first()
            self.assertIsNotNone(user)
            self.assertEqual(user.cash, 10000.0)
    
    def test_user_login(self):
        """Test user login"""
        # First create a user
        with app.app_context():
            from werkzeug.security import generate_password_hash
            user = User(username='testuser', password=generate_password_hash('testpass'))
            db.session.add(user)
            db.session.commit()
        
        # Try to login
        rv = self.app.post('/login', data={
            'username': 'testuser',
            'password': 'testpass',
            'submit': 'Sign In'
        }, follow_redirects=True)
        
        self.assertEqual(rv.status_code, 200)
        self.assertIn(b'Dashboard', rv.data)
    
    def test_stock_api(self):
        """Test stock price API endpoint"""
        rv = self.app.get('/api/stock/AAPL')
        self.assertEqual(rv.status_code, 200)
        
        import json
        data = json.loads(rv.data)
        self.assertIn('symbol', data)
        self.assertIn('valid', data)

if __name__ == '__main__':
    unittest.main()