import React, { useState, useEffect, useRef } from 'react'
import { searchStocks } from '../../api'

const StockSearchBar = ({ onSelectStock, placeholder = "Search stocks by symbol or name..." }) => {
  const [query, setQuery] = useState('')
  const [results, setResults] = useState([])
  const [isLoading, setIsLoading] = useState(false)
  const [isOpen, setIsOpen] = useState(false)
  const [selectedIndex, setSelectedIndex] = useState(-1)
  const wrapperRef = useRef(null)
  const inputRef = useRef(null)

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (wrapperRef.current && !wrapperRef.current.contains(event.target)) {
        setIsOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClickOutside)
    return () => document.removeEventListener('mousedown', handleClickOutside)
  }, [])

  useEffect(() => {
    const searchTimeout = setTimeout(async () => {
      if (query.length >= 1) {
        setIsLoading(true)
        try {
          const response = await searchStocks(query)
          setResults(response.data)
          setIsOpen(true)
          setSelectedIndex(-1)
        } catch (error) {
          console.error('Search failed:', error)
          setResults([])
        } finally {
          setIsLoading(false)
        }
      } else {
        setResults([])
        setIsOpen(false)
      }
    }, 200)

    return () => clearTimeout(searchTimeout)
  }, [query])

  const handleSelect = (stock) => {
    onSelectStock(stock)
    setQuery('')
    setIsOpen(false)
    inputRef.current?.blur()
  }

  const handleKeyDown = (e) => {
    if (!isOpen || results.length === 0) return

    switch (e.key) {
      case 'ArrowDown':
        e.preventDefault()
        setSelectedIndex(prev => (prev < results.length - 1 ? prev + 1 : prev))
        break
      case 'ArrowUp':
        e.preventDefault()
        setSelectedIndex(prev => (prev > 0 ? prev - 1 : prev))
        break
      case 'Enter':
        e.preventDefault()
        if (selectedIndex >= 0) {
          handleSelect(results[selectedIndex])
        }
        break
      case 'Escape':
        setIsOpen(false)
        break
      default:
        break
    }
  }

  return (
    <div ref={wrapperRef} className="relative w-full">
      <div className="relative">
        <span className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
        </span>
        <input
          ref={inputRef}
          type="text"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          onFocus={() => query.length >= 1 && setIsOpen(true)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-xl focus:outline-none focus:ring-2 focus:ring-primary-500 focus:border-transparent text-gray-900 bg-white shadow-sm"
        />
        {isLoading && (
          <span className="absolute right-3 top-1/2 -translate-y-1/2">
            <svg className="w-5 h-5 text-gray-400 animate-spin" fill="none" viewBox="0 0 24 24">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
            </svg>
          </span>
        )}
      </div>

      {/* Search Results Dropdown */}
      {isOpen && results.length > 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 max-h-96 overflow-y-auto">
          {results.map((stock, index) => {
            const isPositive = stock.change >= 0
            return (
              <button
                key={stock.symbol}
                onClick={() => handleSelect(stock)}
                className={`w-full px-4 py-3 flex items-center justify-between hover:bg-gray-50 transition-colors ${
                  index === selectedIndex ? 'bg-primary-50' : ''
                } ${index !== results.length - 1 ? 'border-b border-gray-100' : ''}`}
              >
                <div className="flex items-center gap-3">
                  <div className="w-10 h-10 bg-gray-100 rounded-lg flex items-center justify-center text-sm font-bold text-gray-700">
                    {stock.symbol.slice(0, 2)}
                  </div>
                  <div className="text-left">
                    <p className="font-semibold text-gray-900">{stock.symbol}</p>
                    <p className="text-sm text-gray-500 truncate max-w-[200px]">{stock.name}</p>
                  </div>
                </div>
                <div className="text-right">
                  <p className="font-semibold text-gray-900">${stock.price.toFixed(2)}</p>
                  <p className={`text-sm font-medium ${isPositive ? 'text-success-600' : 'text-danger-600'}`}>
                    {isPositive ? '+' : ''}{stock.changePercent.toFixed(2)}%
                  </p>
                </div>
              </button>
            )
          })}
        </div>
      )}

      {/* No Results */}
      {isOpen && query.length >= 1 && !isLoading && results.length === 0 && (
        <div className="absolute z-50 w-full mt-2 bg-white rounded-xl shadow-lg border border-gray-200 p-4 text-center text-gray-500">
          No stocks found for "{query}"
        </div>
      )}
    </div>
  )
}

export default StockSearchBar

