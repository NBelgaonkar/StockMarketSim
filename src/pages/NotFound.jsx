import React from 'react'
import { Link } from 'react-router-dom'
import Button from '../components/ui/Button'

const NotFound = () => {
  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center px-4">
      <div className="max-w-md w-full text-center">
        <div className="mb-8">
          <div className="text-9xl font-bold text-gray-200">404</div>
          <h1 className="text-2xl font-bold text-gray-900 -mt-4">Page Not Found</h1>
          <p className="mt-4 text-gray-600">
            Sorry, we couldn't find the page you're looking for. It might have been moved or doesn't exist.
          </p>
        </div>
        
        <div className="space-y-4">
          <Link to="/">
            <Button variant="primary" size="lg" className="w-full">
              Go to Dashboard
            </Button>
          </Link>
          <Link to="/trade">
            <Button variant="outline" size="lg" className="w-full">
              Browse Stocks
            </Button>
          </Link>
        </div>

        <div className="mt-8 text-sm text-gray-500">
          <p>Need help? Check out these pages:</p>
          <div className="mt-2 flex justify-center gap-4">
            <Link to="/portfolio" className="text-primary-600 hover:text-primary-700">Portfolio</Link>
            <Link to="/activity" className="text-primary-600 hover:text-primary-700">Activity</Link>
            <Link to="/login" className="text-primary-600 hover:text-primary-700">Login</Link>
          </div>
        </div>
      </div>
    </div>
  )
}

export default NotFound

