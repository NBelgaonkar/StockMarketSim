import React from 'react'
import { Link, useLocation } from 'react-router-dom'
import { useUser } from '../../context/UserContext'

const defaultItems = [
  { icon: '🏠', label: 'Home', to: '/' },
  { icon: '📈', label: 'Trade', to: '/trade', protected: true },
  { icon: '💼', label: 'Portfolio', to: '/portfolio', protected: true },
  { icon: '⭐', label: 'Watchlist', to: '/watchlist', protected: true },
  { icon: '👤', label: 'Profile', to: '/profile', protected: true },
]

const MobileBottomNav = ({ items = defaultItems }) => {
  const location = useLocation()
  const { user } = useUser()

  // Filter items based on auth status
  const visibleItems = items.filter(item => !item.protected || user)

  const isActive = (path) => location.pathname === path

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-gray-200 z-50 safe-area-inset-bottom">
      <div className="flex items-center justify-around h-16">
        {visibleItems.map((item) => (
          <Link
            key={item.to}
            to={item.to}
            className={`flex flex-col items-center justify-center flex-1 h-full py-2 transition-colors ${
              isActive(item.to)
                ? 'text-primary-600'
                : 'text-gray-500 hover:text-gray-700'
            }`}
          >
            <span className={`text-xl mb-0.5 ${isActive(item.to) ? 'scale-110' : ''} transition-transform`}>
              {item.icon}
            </span>
            <span className={`text-xs font-medium ${isActive(item.to) ? 'font-semibold' : ''}`}>
              {item.label}
            </span>
            {isActive(item.to) && (
              <div className="absolute bottom-0 w-12 h-0.5 bg-primary-600 rounded-full"></div>
            )}
          </Link>
        ))}
      </div>
    </nav>
  )
}

export default MobileBottomNav

