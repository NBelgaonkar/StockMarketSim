import React, { useState, useEffect } from 'react'
import { getMarketStatus } from '../../api'

const MarketStatusBadge = ({ showDetails = false, className = '' }) => {
  const [status, setStatus] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const response = await getMarketStatus()
        setStatus(response.data)
      } catch (error) {
        console.error('Failed to fetch market status:', error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchStatus()
    
    // Refresh every minute
    const interval = setInterval(fetchStatus, 60000)
    return () => clearInterval(interval)
  }, [])

  if (isLoading) {
    return (
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 bg-gray-100 rounded-full ${className}`}>
        <div className="w-2 h-2 bg-gray-300 rounded-full animate-pulse"></div>
        <span className="text-sm text-gray-500">Loading...</span>
      </div>
    )
  }

  if (!status) return null

  const isOpen = status.isOpen

  return (
    <div className={`inline-flex items-center gap-2 ${className}`}>
      <div className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-full ${
        isOpen 
          ? 'bg-success-50 border border-success-200' 
          : 'bg-gray-100 border border-gray-200'
      }`}>
        <div className={`w-2 h-2 rounded-full ${
          isOpen ? 'bg-success-500 animate-pulse' : 'bg-gray-400'
        }`}></div>
        <span className={`text-sm font-medium ${
          isOpen ? 'text-success-700' : 'text-gray-600'
        }`}>
          Market {isOpen ? 'Open' : 'Closed'}
        </span>
      </div>
      
      {showDetails && (
        <span className="text-xs text-gray-500">
          {status.message}
        </span>
      )}
    </div>
  )
}

export default MarketStatusBadge

