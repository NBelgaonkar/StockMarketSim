import React from 'react'
import PageHeader from '../components/layout/PageHeader'
import TransactionsTable from '../components/portfolio/TransactionsTable'

const Activity = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader 
          title="Activity" 
          subtitle="View your complete transaction history"
        />

        <TransactionsTable 
          limit={15} 
          showFilters={true} 
          showPagination={true}
        />
      </div>
    </div>
  )
}

export default Activity

