import React, { useState, useEffect } from 'react'
import { getAllStocks } from '../../api'
import Card from '../ui/Card'
import Button from '../ui/Button'

const SECTORS = [
  'All Sectors',
  'Technology',
  'Healthcare',
  'Financial Services',
  'Consumer Discretionary',
  'Consumer Defensive',
  'Automotive',
  'Communication Services',
]

const StockScreener = ({ onFilter, className = '' }) => {
  const [filters, setFilters] = useState({
    sector: 'All Sectors',
    priceMin: '',
    priceMax: '',
    changeMin: '',
    changeMax: '',
    sortBy: 'symbol',
    sortDir: 'asc',
  })
  const [isExpanded, setIsExpanded] = useState(false)

  const handleChange = (field, value) => {
    const newFilters = { ...filters, [field]: value }
    setFilters(newFilters)
    
    if (onFilter) {
      onFilter(newFilters)
    }
  }

  const handleReset = () => {
    const defaultFilters = {
      sector: 'All Sectors',
      priceMin: '',
      priceMax: '',
      changeMin: '',
      changeMax: '',
      sortBy: 'symbol',
      sortDir: 'asc',
    }
    setFilters(defaultFilters)
    if (onFilter) {
      onFilter(defaultFilters)
    }
  }

  const activeFilterCount = [
    filters.sector !== 'All Sectors',
    filters.priceMin !== '',
    filters.priceMax !== '',
    filters.changeMin !== '',
    filters.changeMax !== '',
  ].filter(Boolean).length

  return (
    <Card padding="p-4" className={className}>
      <div className="flex items-center justify-between mb-4">
        <div className="flex items-center gap-2">
          <h3 className="font-semibold text-gray-900">Filters</h3>
          {activeFilterCount > 0 && (
            <span className="bg-primary-100 text-primary-700 text-xs font-medium px-2 py-0.5 rounded-full">
              {activeFilterCount} active
            </span>
          )}
        </div>
        <div className="flex items-center gap-2">
          {activeFilterCount > 0 && (
            <button
              onClick={handleReset}
              className="text-sm text-gray-500 hover:text-gray-700"
            >
              Reset
            </button>
          )}
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="text-sm text-primary-600 hover:text-primary-700 font-medium"
          >
            {isExpanded ? 'Show Less' : 'Show More'}
          </button>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {/* Sector Filter */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Sector</label>
          <select
            value={filters.sector}
            onChange={(e) => handleChange('sector', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            {SECTORS.map(sector => (
              <option key={sector} value={sector}>{sector}</option>
            ))}
          </select>
        </div>

        {/* Price Range */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Price Range</label>
          <div className="flex items-center gap-2">
            <input
              type="number"
              placeholder="Min"
              value={filters.priceMin}
              onChange={(e) => handleChange('priceMin', e.target.value)}
              className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
            <span className="text-gray-400">-</span>
            <input
              type="number"
              placeholder="Max"
              value={filters.priceMax}
              onChange={(e) => handleChange('priceMax', e.target.value)}
              className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
            />
          </div>
        </div>

        {/* Sort By */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Sort By</label>
          <select
            value={filters.sortBy}
            onChange={(e) => handleChange('sortBy', e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
          >
            <option value="symbol">Symbol</option>
            <option value="price">Price</option>
            <option value="changePercent">% Change</option>
            <option value="volume">Volume</option>
            <option value="marketCap">Market Cap</option>
          </select>
        </div>

        {/* Sort Direction */}
        <div>
          <label className="block text-xs font-medium text-gray-700 mb-1">Order</label>
          <div className="flex gap-2">
            <button
              onClick={() => handleChange('sortDir', 'asc')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                filters.sortDir === 'asc'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ↑ Asc
            </button>
            <button
              onClick={() => handleChange('sortDir', 'desc')}
              className={`flex-1 py-2 px-3 rounded-lg text-sm font-medium transition-colors ${
                filters.sortDir === 'desc'
                  ? 'bg-primary-100 text-primary-700'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              ↓ Desc
            </button>
          </div>
        </div>
      </div>

      {/* Extended Filters */}
      {isExpanded && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mt-4 pt-4 border-t border-gray-200">
          {/* Change % Range */}
          <div>
            <label className="block text-xs font-medium text-gray-700 mb-1">Change % Range</label>
            <div className="flex items-center gap-2">
              <input
                type="number"
                placeholder="Min %"
                value={filters.changeMin}
                onChange={(e) => handleChange('changeMin', e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
              <span className="text-gray-400">-</span>
              <input
                type="number"
                placeholder="Max %"
                value={filters.changeMax}
                onChange={(e) => handleChange('changeMax', e.target.value)}
                className="w-full px-2 py-2 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-primary-500"
              />
            </div>
          </div>

          {/* Quick Filters */}
          <div className="sm:col-span-3">
            <label className="block text-xs font-medium text-gray-700 mb-1">Quick Filters</label>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={() => handleChange('changeMin', '0')}
                className="px-3 py-1.5 bg-success-50 text-success-700 text-sm rounded-lg hover:bg-success-100 transition-colors"
              >
                Gainers Only
              </button>
              <button
                onClick={() => { handleChange('changeMin', ''); handleChange('changeMax', '0'); }}
                className="px-3 py-1.5 bg-danger-50 text-danger-700 text-sm rounded-lg hover:bg-danger-100 transition-colors"
              >
                Losers Only
              </button>
              <button
                onClick={() => { handleChange('priceMin', ''); handleChange('priceMax', '100'); }}
                className="px-3 py-1.5 bg-gray-100 text-gray-700 text-sm rounded-lg hover:bg-gray-200 transition-colors"
              >
                Under $100
              </button>
              <button
                onClick={() => handleChange('sector', 'Technology')}
                className="px-3 py-1.5 bg-primary-50 text-primary-700 text-sm rounded-lg hover:bg-primary-100 transition-colors"
              >
                Tech Only
              </button>
            </div>
          </div>
        </div>
      )}
    </Card>
  )
}

// Utility function to apply filters to stock list
export const applyStockFilters = (stocks, filters) => {
  let filtered = [...stocks]

  // Sector filter
  if (filters.sector && filters.sector !== 'All Sectors') {
    filtered = filtered.filter(s => s.sector === filters.sector)
  }

  // Price range
  if (filters.priceMin !== '') {
    filtered = filtered.filter(s => s.price >= parseFloat(filters.priceMin))
  }
  if (filters.priceMax !== '') {
    filtered = filtered.filter(s => s.price <= parseFloat(filters.priceMax))
  }

  // Change % range
  if (filters.changeMin !== '') {
    filtered = filtered.filter(s => s.changePercent >= parseFloat(filters.changeMin))
  }
  if (filters.changeMax !== '') {
    filtered = filtered.filter(s => s.changePercent <= parseFloat(filters.changeMax))
  }

  // Sort
  if (filters.sortBy) {
    filtered.sort((a, b) => {
      const aVal = a[filters.sortBy]
      const bVal = b[filters.sortBy]
      
      if (typeof aVal === 'string') {
        return filters.sortDir === 'asc' 
          ? aVal.localeCompare(bVal)
          : bVal.localeCompare(aVal)
      }
      
      return filters.sortDir === 'asc' ? aVal - bVal : bVal - aVal
    })
  }

  return filtered
}

export default StockScreener

