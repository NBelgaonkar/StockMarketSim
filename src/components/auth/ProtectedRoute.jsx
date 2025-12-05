import React from 'react'
import { Navigate, useLocation } from 'react-router-dom'
import { useUser } from '../../context/UserContext'

/**
 * ProtectedRoute component
 * 
 * Wraps routes that require authentication.
 * Redirects unauthenticated users to the login page with a message.
 */
const ProtectedRoute = ({ children }) => {
  const { user, isLoading } = useUser()
  const location = useLocation()

  // Show loading state while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600 mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    )
  }

  // Redirect to login if not authenticated
  if (!user) {
    // Pass the attempted location so we can redirect back after login
    return (
      <Navigate 
        to="/login" 
        state={{ 
          from: location.pathname,
          message: 'Please log in or create an account to access trading and portfolio features.'
        }} 
        replace 
      />
    )
  }

  // User is authenticated, render the protected content
  return children
}

export default ProtectedRoute

