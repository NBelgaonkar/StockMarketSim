import React, { useState } from 'react'
import { Link } from 'react-router-dom'
import Card from '../ui/Card'
import Button from '../ui/Button'

const HoldingsTable = ({ positions, onTrade }) => {
  const [sortField, setSortField] = useState('marketValue')
  const [sortDirection, setSortDirection] = useState('desc')
  const [filter, setFilter] = useState('ALL')

  const formatCurrency = (value) => `$${value.toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}`
  const formatPercent = (value) => `${value >= 0 ? '+' : ''}${value.toFixed(2)}%`

  const handleSort = (field) => {
    if (sortField === field) {
      setSortDirection(sortDirection === 'asc' ? 'desc' : 'asc')
    } else {
      setSortField(field)
      setSortDirection('desc')
    }
  }

  const filteredPositions = positions.filter(position => {
    if (filter === 'ALL') return true
    if (filter === 'WINNERS') return position.gainLoss > 0
    if (filter === 'LOSERS') return position.gainLoss < 0
    return true
  })

  const sortedPositions = [...filteredPositions].sort((a, b) => {
    let aVal = a[sortField]
    let bVal = b[sortField]
    
    if (typeof aVal === 'string') {
      aVal = aVal.toLowerCase()
      bVal = bVal.toLowerCase()
    }
    
    if (sortDirection === 'asc') {
      return aVal < bVal ? -1 : aVal > bVal ? 1 : 0
    } else {
      return aVal > bVal ? -1 : aVal < bVal ? 1 : 0
    }
  })

  const SortIcon = ({ field }) => {
    if (sortField !== field) {
      return <span className="text-gray-400 ml-1">↕</span>
    }
    return <span className="text-primary-600 ml-1">{sortDirection === 'asc' ? '↑' : '↓'}</span>
  }

  return (
    <Card padding="p-0">
      {/* Filters */}
      <div className="flex items-center justify-between p-4 border-b border-gray-200">
        <div className="flex gap-2">
          {['ALL', 'WINNERS', 'LOSERS'].map((f) => (
            <button
              key={f}
              onClick={() => setFilter(f)}
              className={`px-3 py-1.5 text-sm rounded-lg font-medium transition-colors ${
                filter === f
                  ? f === 'WINNERS' ? 'bg-success-100 text-success-700'
                    : f === 'LOSERS' ? 'bg-danger-100 text-danger-700'
                    : 'bg-gray-200 text-gray-900'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              {f === 'ALL' ? 'All' : f === 'WINNERS' ? 'Winners' : 'Losers'}
            </button>
          ))}
        </div>
        <span className="text-sm text-gray-500">
          {filteredPositions.length} position{filteredPositions.length !== 1 ? 's' : ''}
        </span>
      </div>

      {/* Table */}
      <div className="overflow-x-auto">
        <table className="min-w-full divide-y divide-gray-200">
          <thead className="bg-gray-50">
            <tr>
              <th 
                className="px-6 py-3 text-left text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('symbol')}
              >
                Symbol <SortIcon field="symbol" />
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('quantity')}
              >
                Shares <SortIcon field="quantity" />
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('avgCost')}
              >
                Avg Cost <SortIcon field="avgCost" />
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('currentPrice')}
              >
                Price <SortIcon field="currentPrice" />
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('marketValue')}
              >
                Market Value <SortIcon field="marketValue" />
              </th>
              <th 
                className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider cursor-pointer hover:bg-gray-100"
                onClick={() => handleSort('gainLoss')}
              >
                Gain/Loss <SortIcon field="gainLoss" />
              </th>
              <th className="px-6 py-3 text-right text-xs font-semibold text-gray-500 uppercase tracking-wider">
                Actions
              </th>
            </tr>
          </thead>
          <tbody className="bg-white divide-y divide-gray-200">
            {sortedPositions.map((position) => {
              const isPositive = position.gainLoss >= 0
              const gainLossColor = isPositive ? 'text-success-600' : 'text-danger-600'
              
              return (
                <tr key={position.id} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center gap-3">
                      <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-700">
                        {position.symbol.slice(0, 2)}
                      </div>
                      <div>
                        <Link 
                          to={`/trade?symbol=${position.symbol}`}
                          className="text-sm font-semibold text-gray-900 hover:text-primary-600"
                        >
                          {position.symbol}
                        </Link>
                        <p className="text-xs text-gray-500">{position.name}</p>
                      </div>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {position.quantity}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {formatCurrency(position.avgCost)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm text-gray-900">
                    {formatCurrency(position.currentPrice)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium text-gray-900">
                    {formatCurrency(position.marketValue)}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className={`text-sm font-medium ${gainLossColor}`}>
                      {formatCurrency(position.gainLoss)}
                    </div>
                    <div className={`text-xs ${gainLossColor}`}>
                      {formatPercent(position.gainLossPercent)}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right">
                    <div className="flex justify-end gap-2">
                      <button
                        onClick={() => onTrade(position, 'BUY')}
                        className="text-xs px-2.5 py-1 rounded bg-success-50 text-success-700 hover:bg-success-100 font-medium transition-colors"
                      >
                        Buy
                      </button>
                      <button
                        onClick={() => onTrade(position, 'SELL')}
                        className="text-xs px-2.5 py-1 rounded bg-danger-50 text-danger-700 hover:bg-danger-100 font-medium transition-colors"
                      >
                        Sell
                      </button>
                    </div>
                  </td>
                </tr>
              )
            })}
          </tbody>
        </table>
      </div>

      {sortedPositions.length === 0 && (
        <div className="text-center py-12">
          <p className="text-gray-500">No positions match the selected filter</p>
        </div>
      )}
    </Card>
  )
}

export default HoldingsTable

