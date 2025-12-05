import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { getTransactions } from '../../api'
import Card from '../ui/Card'

const RecentActivity = ({ limit = 5 }) => {
  const [transactions, setTransactions] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchTransactions = async () => {
      setIsLoading(true)
      try {
        const response = await getTransactions({ limit })
        setTransactions(response.data.transactions)
      } catch (error) {
        console.error('Failed to fetch transactions:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchTransactions()
  }, [limit])

  const formatDate = (dateString) => {
    const date = new Date(dateString)
    const now = new Date()
    const diffMs = now - date
    const diffMins = Math.floor(diffMs / 60000)
    const diffHours = Math.floor(diffMs / 3600000)
    const diffDays = Math.floor(diffMs / 86400000)

    if (diffMins < 60) return `${diffMins} min${diffMins !== 1 ? 's' : ''} ago`
    if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`
    if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`
    return date.toLocaleDateString('en-US', { month: 'short', day: 'numeric' })
  }

  const getActivityIcon = (type) => {
    switch (type) {
      case 'BUY': return { icon: '↑', color: 'bg-success-500' }
      case 'SELL': return { icon: '↓', color: 'bg-danger-500' }
      case 'DEPOSIT': return { icon: '+', color: 'bg-primary-500' }
      default: return { icon: '•', color: 'bg-gray-500' }
    }
  }

  const getActivityText = (transaction) => {
    switch (transaction.type) {
      case 'BUY':
        return `Bought ${transaction.quantity} shares of ${transaction.symbol}`
      case 'SELL':
        return `Sold ${transaction.quantity} shares of ${transaction.symbol}`
      case 'DEPOSIT':
        return 'Initial deposit'
      default:
        return 'Transaction'
    }
  }

  if (isLoading) {
    return (
      <Card title="Recent Activity">
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-primary-600"></div>
        </div>
      </Card>
    )
  }

  return (
    <Card title="Recent Activity" padding="p-0">
      <div className="p-4 pb-2">
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>
      
      <div className="divide-y divide-gray-100">
        {transactions.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No recent activity
          </div>
        ) : (
          transactions.map((transaction) => {
            const { icon, color } = getActivityIcon(transaction.type)
            return (
              <div key={transaction.id} className="flex items-center justify-between px-4 py-3">
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 ${color} rounded-full flex items-center justify-center text-white text-sm font-bold`}>
                    {icon}
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">
                      {getActivityText(transaction)}
                    </p>
                    <p className="text-xs text-gray-500">{formatDate(transaction.date)}</p>
                  </div>
                </div>
                <span className={`text-sm font-semibold ${
                  transaction.type === 'BUY' ? 'text-danger-600' :
                  transaction.type === 'SELL' ? 'text-success-600' :
                  'text-primary-600'
                }`}>
                  {transaction.type === 'BUY' ? '-' : '+'}${transaction.total.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
                </span>
              </div>
            )
          })
        )}
      </div>

      {transactions.length > 0 && (
        <div className="p-3 border-t border-gray-200">
          <Link 
            to="/activity"
            className="block text-center text-sm font-medium text-primary-600 hover:text-primary-700"
          >
            View All Activity →
          </Link>
        </div>
      )}
    </Card>
  )
}

export default RecentActivity

