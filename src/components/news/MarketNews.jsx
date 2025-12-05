import React from 'react'
import NewsFeed from './NewsFeed'

const MarketNews = ({ limit = 5, compact = true }) => {
  return <NewsFeed limit={limit} compact={compact} showTitle={true} />
}

export default MarketNews

