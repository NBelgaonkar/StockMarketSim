import React, { useState, useEffect } from 'react'
import { getStockNews, getMarketNews } from '../../api'
import NewsCard from './NewsCard'
import Card from '../ui/Card'
import EmptyState from '../ui/EmptyState'

const NewsFeed = ({ symbol, limit = 5, compact = false, showTitle = true }) => {
  const [news, setNews] = useState([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const fetchNews = async () => {
      setIsLoading(true)
      try {
        const response = symbol 
          ? await getStockNews(symbol, limit)
          : await getMarketNews(limit)
        setNews(response.data)
      } catch (error) {
        console.error('Failed to fetch news:', error)
      } finally {
        setIsLoading(false)
      }
    }
    fetchNews()
  }, [symbol, limit])

  if (isLoading) {
    return (
      <Card>
        {showTitle && <h3 className="font-semibold text-gray-900 mb-4">{symbol ? `${symbol} News` : 'Market News'}</h3>}
        <div className="space-y-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="animate-pulse">
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
              <div className="h-3 bg-gray-200 rounded w-1/2"></div>
            </div>
          ))}
        </div>
      </Card>
    )
  }

  if (news.length === 0) {
    return (
      <Card>
        {showTitle && <h3 className="font-semibold text-gray-900 mb-4">{symbol ? `${symbol} News` : 'Market News'}</h3>}
        <EmptyState
          icon="📰"
          title="No news available"
          description={symbol ? `No recent news for ${symbol}` : "Check back later for market updates"}
          size="sm"
        />
      </Card>
    )
  }

  if (compact) {
    return (
      <Card padding="p-0">
        {showTitle && (
          <div className="p-4 border-b border-gray-200">
            <h3 className="font-semibold text-gray-900">{symbol ? `${symbol} News` : 'Market News'}</h3>
          </div>
        )}
        <div className="px-4">
          {news.map(article => (
            <NewsCard key={article.id} article={article} compact />
          ))}
        </div>
      </Card>
    )
  }

  return (
    <div>
      {showTitle && <h3 className="font-semibold text-gray-900 mb-4">{symbol ? `${symbol} News` : 'Market News'}</h3>}
      <div className="space-y-4">
        {news.map(article => (
          <NewsCard key={article.id} article={article} />
        ))}
      </div>
    </div>
  )
}

export default NewsFeed

