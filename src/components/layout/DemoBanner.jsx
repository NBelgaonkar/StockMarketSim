import React from 'react'

const DemoBanner = () => {
  return (
    <div className="bg-amber-50 border-b border-amber-200 px-4 py-2">
      <div className="max-w-7xl mx-auto flex items-center justify-center gap-2 text-sm">
        <span className="inline-flex items-center justify-center w-5 h-5 bg-amber-400 text-amber-900 rounded-full text-xs font-bold">
          !
        </span>
        <span className="text-amber-800">
          <strong>Demo mode:</strong> Data is simulated. Backend integration pending.
        </span>
      </div>
    </div>
  )
}

export default DemoBanner

