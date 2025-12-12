import React from 'react'

const Footer = () => {
  return (
    <footer className="bg-gray-800 text-white">
      <div className="max-w-7xl mx-auto py-8 px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div>
            <h3 className="text-lg font-semibold mb-4">StockSim</h3>
            <p className="text-gray-300 text-sm">
              A comprehensive stock market simulator for learning and practicing trading strategies.
            </p>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Features</h4>
            <ul className="space-y-2 text-sm text-gray-300">
              <li>Real-time market data</li>
              <li>Portfolio tracking</li>
              <li>Performance analytics</li>
              <li>Risk management tools</li>
            </ul>
          </div>
          <div>
            <h4 className="text-md font-semibold mb-4">Disclaimer</h4>
            <p className="text-gray-300 text-sm">
              This is a simulation platform. All trading is done with virtual money. 
              Past performance does not guarantee future results.
            </p>
          </div>
        </div>
        <div className="border-t border-gray-700 mt-8 pt-8 text-center text-sm text-gray-400">
          <p>&copy; 2024 StockSim. All rights reserved.</p>
        </div>
      </div>
    </footer>
  )
}

export default Footer
