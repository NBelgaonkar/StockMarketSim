import React, { useState, useEffect } from 'react'
import { isInWatchlist, addToWatchlist, removeFromWatchlist } from '../../api'
import { showToast } from '../../context/ToastContext'

const WatchlistButton = ({ symbol, size = 'md', showLabel = true, onToggle }) => {
  const [isWatched, setIsWatched] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const checkWatchlist = async () => {
      try {
        const response = await isInWatchlist(symbol)
        setIsWatched(response.data)
      } catch (error) {
        console.error('Failed to check watchlist:', error)
      } finally {
        setIsLoading(false)
      }
    }
    checkWatchlist()
  }, [symbol])

  const handleToggle = async (e) => {
    e.preventDefault()
    e.stopPropagation()
    
    setIsLoading(true)
    try {
      if (isWatched) {
        await removeFromWatchlist({ symbol })
        setIsWatched(false)
        showToast({ type: 'success', message: `${symbol} removed from watchlist` })
      } else {
        await addToWatchlist({ symbol })
        setIsWatched(true)
        showToast({ type: 'success', message: `${symbol} added to watchlist` })
      }
      if (onToggle) onToggle(!isWatched)
    } catch (error) {
      showToast({ type: 'error', message: error.message })
    } finally {
      setIsLoading(false)
    }
  }

  const sizeClasses = {
    sm: 'p-1.5',
    md: 'p-2',
    lg: 'p-2.5',
  }

  const iconSizes = {
    sm: 'w-4 h-4',
    md: 'w-5 h-5',
    lg: 'w-6 h-6',
  }

  if (isLoading && !isWatched) {
    return (
      <button 
        disabled 
        className={`${sizeClasses[size]} rounded-lg bg-gray-100 text-gray-400`}
      >
        <svg className={`${iconSizes[size]} animate-pulse`} fill="none" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} stroke="currentColor" d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
        </svg>
      </button>
    )
  }

  return (
    <button
      onClick={handleToggle}
      disabled={isLoading}
      className={`${sizeClasses[size]} rounded-lg transition-all duration-200 flex items-center gap-1.5 ${
        isWatched
          ? 'bg-amber-100 text-amber-600 hover:bg-amber-200'
          : 'bg-gray-100 text-gray-500 hover:bg-gray-200 hover:text-gray-700'
      }`}
      title={isWatched ? 'Remove from watchlist' : 'Add to watchlist'}
    >
      <svg 
        className={iconSizes[size]} 
        fill={isWatched ? 'currentColor' : 'none'} 
        viewBox="0 0 24 24" 
        stroke="currentColor"
      >
        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
      </svg>
      {showLabel && (
        <span className="text-sm font-medium">
          {isWatched ? 'Watching' : 'Watch'}
        </span>
      )}
    </button>
  )
}

export default WatchlistButton

