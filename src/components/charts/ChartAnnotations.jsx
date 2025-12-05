import React from 'react'

/**
 * ChartAnnotations - Utility component and functions for adding buy/sell markers to charts
 * 
 * This module provides:
 * 1. A custom dot renderer for Recharts that shows buy/sell markers
 * 2. Utility functions to prepare transaction data for chart overlay
 */

// Custom dot component for showing buy/sell markers on charts
export const TransactionDot = ({ cx, cy, payload, transactions = [] }) => {
  if (!cx || !cy) return null

  // Find transactions for this date
  const dateTransactions = transactions.filter(t => {
    const transDate = new Date(t.date).toISOString().split('T')[0]
    return transDate === payload.date
  })

  if (dateTransactions.length === 0) return null

  // Determine if buy, sell, or both
  const hasBuy = dateTransactions.some(t => t.type === 'BUY')
  const hasSell = dateTransactions.some(t => t.type === 'SELL')

  if (hasBuy && hasSell) {
    // Both buy and sell on same day - show split marker
    return (
      <g>
        <circle cx={cx - 4} cy={cy} r={6} fill="#16a34a" stroke="#fff" strokeWidth={2} />
        <circle cx={cx + 4} cy={cy} r={6} fill="#dc2626" stroke="#fff" strokeWidth={2} />
      </g>
    )
  }

  if (hasBuy) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={8} fill="#16a34a" stroke="#fff" strokeWidth={2} />
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="10" fontWeight="bold">
          B
        </text>
      </g>
    )
  }

  if (hasSell) {
    return (
      <g>
        <circle cx={cx} cy={cy} r={8} fill="#dc2626" stroke="#fff" strokeWidth={2} />
        <text x={cx} y={cy + 1} textAnchor="middle" dominantBaseline="middle" fill="#fff" fontSize="10" fontWeight="bold">
          S
        </text>
      </g>
    )
  }

  return null
}

// Utility to prepare transactions for chart overlay
export const prepareTransactionsForChart = (transactions, symbol = null) => {
  let filtered = transactions.filter(t => t.type === 'BUY' || t.type === 'SELL')
  
  if (symbol) {
    filtered = filtered.filter(t => t.symbol === symbol)
  }

  return filtered.map(t => ({
    date: new Date(t.date).toISOString().split('T')[0],
    type: t.type,
    price: t.price,
    quantity: t.quantity,
    symbol: t.symbol,
  }))
}

// Legend component for chart annotations
export const AnnotationsLegend = ({ className = '' }) => {
  return (
    <div className={`flex items-center gap-4 text-sm ${className}`}>
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded-full bg-success-600 flex items-center justify-center">
          <span className="text-white text-[8px] font-bold">B</span>
        </div>
        <span className="text-gray-600">Buy</span>
      </div>
      <div className="flex items-center gap-1.5">
        <div className="w-4 h-4 rounded-full bg-danger-600 flex items-center justify-center">
          <span className="text-white text-[8px] font-bold">S</span>
        </div>
        <span className="text-gray-600">Sell</span>
      </div>
    </div>
  )
}

// Wrapper component that adds transaction markers to any chart
const ChartAnnotations = ({ 
  children, 
  transactions = [],
  symbol = null,
  showLegend = true,
}) => {
  const preparedTransactions = prepareTransactionsForChart(transactions, symbol)

  return (
    <div>
      {children}
      {showLegend && preparedTransactions.length > 0 && (
        <div className="mt-2 flex justify-end">
          <AnnotationsLegend />
        </div>
      )}
    </div>
  )
}

export default ChartAnnotations

