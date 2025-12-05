import React, { useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUser } from '../../context/UserContext'
import { getPortfolioSummary } from '../../api'

const Sidebar = () => {
  const { user } = useUser()
  const location = useLocation()
  const [summary, setSummary] = useState(null)

  useEffect(() => {
    const fetchSummary = async () => {
      if (user) {
        try {
          const response = await getPortfolioSummary()
          setSummary(response.data)
        } catch (error) {
          console.error('Failed to fetch portfolio summary:', error)
        }
      }
    }
    fetchSummary()
  }, [user])

  const isActive = (path) => location.pathname === path

  const navItems = [
    { path: '/', label: 'Dashboard', icon: '📊' },
    { path: '/trade', label: 'Trade', icon: '💹' },
    { path: '/portfolio', label: 'Portfolio', icon: '💼' },
    { path: '/activity', label: 'Activity', icon: '📋' },
  ]

  if (!user) return null

  return (
    <aside className="hidden lg:flex lg:flex-col lg:w-64 lg:fixed lg:inset-y-0 lg:pt-20 lg:bg-white lg:border-r lg:border-gray-200">
      {/* Account Summary */}
      <div className="p-4 border-b border-gray-200">
        <div className="bg-gradient-to-br from-slate-800 to-slate-900 rounded-xl p-4 text-white">
          <p className="text-xs text-slate-400 uppercase tracking-wider mb-1">Total Portfolio Value</p>
          <p className="text-2xl font-bold mb-3">
            ${summary ? summary.totalValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '---'}
          </p>
          
          <div className="grid grid-cols-2 gap-3 text-sm">
            <div>
              <p className="text-slate-400 text-xs">Cash</p>
              <p className="font-medium">
                ${summary ? summary.cash.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '---'}
              </p>
            </div>
            <div>
              <p className="text-slate-400 text-xs">Invested</p>
              <p className="font-medium">
                ${summary ? summary.investedValue.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 }) : '---'}
              </p>
            </div>
          </div>

          {summary && (
            <div className="mt-3 pt-3 border-t border-slate-700">
              <div className="flex justify-between items-center">
                <span className="text-slate-400 text-xs">Overall Return</span>
                <span className={`text-sm font-semibold ${summary.overallReturn >= 0 ? 'text-emerald-400' : 'text-red-400'}`}>
                  {summary.overallReturn >= 0 ? '+' : ''}{summary.overallReturnPercent.toFixed(2)}%
                </span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-1">
        {navItems.map((item) => (
          <Link
            key={item.path}
            to={item.path}
            className={`flex items-center gap-3 px-4 py-3 rounded-lg text-sm font-medium transition-all duration-200 ${
              isActive(item.path)
                ? 'bg-primary-50 text-primary-700 border-l-4 border-primary-600'
                : 'text-gray-600 hover:bg-gray-50 hover:text-gray-900'
            }`}
          >
            <span className="text-lg">{item.icon}</span>
            <span>{item.label}</span>
          </Link>
        ))}
      </nav>

      {/* Quick Stats */}
      {summary && (
        <div className="p-4 border-t border-gray-200">
          <p className="text-xs text-gray-500 uppercase tracking-wider mb-3">Quick Stats</p>
          <div className="space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Positions</span>
              <span className="font-medium text-gray-900">{summary.positionCount}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-gray-500">Today's Change</span>
              <span className={`font-medium ${summary.todayChange >= 0 ? 'text-success-600' : 'text-danger-600'}`}>
                {summary.todayChange >= 0 ? '+' : ''}${Math.abs(summary.todayChange).toFixed(2)}
              </span>
            </div>
          </div>
        </div>
      )}
    </aside>
  )
}

export default Sidebar

