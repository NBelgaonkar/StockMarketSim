import React from 'react'
import { Link } from 'react-router-dom'

const NewsCard = ({ article, compact = false }) => {
  const sentimentColors = {
    bullish: 'bg-success-100 text-success-700',
    bearish: 'bg-danger-100 text-danger-700',
    neutral: 'bg-gray-100 text-gray-700',
  }

  if (compact) {
    return (
      <div className="py-3 border-b border-gray-100 last:border-0">
        <p className="text-sm font-medium text-gray-900 line-clamp-2 mb-1">
          {article.headline}
        </p>
        <div className="flex items-center gap-2 text-xs text-gray-500">
          <span>{article.source}</span>
          <span>•</span>
          <span>{article.relativeTime}</span>
          {article.symbols.length > 0 && (
            <>
              <span>•</span>
              <div className="flex gap-1">
                {article.symbols.slice(0, 2).map(symbol => (
                  <Link
                    key={symbol}
                    to={`/trade?symbol=${symbol}`}
                    className="text-primary-600 hover:underline"
                  >
                    ${symbol}
                  </Link>
                ))}
                {article.symbols.length > 2 && (
                  <span>+{article.symbols.length - 2}</span>
                )}
              </div>
            </>
          )}
        </div>
      </div>
    )
  }

  return (
    <div className="bg-white rounded-lg border border-gray-200 p-4 hover:border-gray-300 hover:shadow-sm transition-all">
      <div className="flex items-start justify-between gap-4 mb-2">
        <span className={`text-xs font-medium px-2 py-0.5 rounded-full ${sentimentColors[article.sentiment] || sentimentColors.neutral}`}>
          {article.category}
        </span>
        <span className="text-xs text-gray-500">{article.relativeTime}</span>
      </div>
      
      <h3 className="font-semibold text-gray-900 mb-2 line-clamp-2">
        {article.headline}
      </h3>
      
      <p className="text-sm text-gray-600 mb-3 line-clamp-2">
        {article.summary}
      </p>
      
      <div className="flex items-center justify-between">
        <span className="text-xs text-gray-500">{article.source}</span>
        
        {article.symbols.length > 0 && (
          <div className="flex gap-1">
            {article.symbols.map(symbol => (
              <Link
                key={symbol}
                to={`/trade?symbol=${symbol}`}
                className="text-xs bg-gray-100 hover:bg-gray-200 text-gray-700 px-2 py-0.5 rounded transition-colors"
              >
                ${symbol}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

export default NewsCard

