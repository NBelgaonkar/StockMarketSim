import React from 'react'
import Card from './Card'

const StatCard = ({ 
  label, 
  value, 
  change, 
  changeLabel, 
  icon,
  trend, // 'up' | 'down' | 'neutral'
  className = '' 
}) => {
  const getTrendColor = () => {
    if (trend === 'up') return 'text-success-600 bg-success-50'
    if (trend === 'down') return 'text-danger-600 bg-danger-50'
    return 'text-gray-600 bg-gray-50'
  }

  const getTrendIcon = () => {
    if (trend === 'up') return '↑'
    if (trend === 'down') return '↓'
    return '→'
  }

  return (
    <Card className={`relative overflow-hidden ${className}`}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm font-medium text-gray-500">{label}</p>
          <p className="text-2xl font-bold text-gray-900 mt-1">{value}</p>
          {change !== undefined && (
            <div className="flex items-center gap-1.5 mt-2">
              <span className={`inline-flex items-center px-2 py-0.5 rounded-full text-xs font-medium ${getTrendColor()}`}>
                {getTrendIcon()} {change}
              </span>
              {changeLabel && (
                <span className="text-xs text-gray-500">{changeLabel}</span>
              )}
            </div>
          )}
        </div>
        {icon && (
          <div className="text-3xl opacity-80">{icon}</div>
        )}
      </div>
    </Card>
  )
}

export default StatCard

