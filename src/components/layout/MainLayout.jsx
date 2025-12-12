import React from 'react'
import { useUser } from '../../context/UserContext'
import Sidebar from './Sidebar'

const MainLayout = ({ children }) => {
  const { user } = useUser()

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Sidebar for logged-in users */}
      {user && <Sidebar />}
      
      {/* Main content area */}
      <main className={`${user ? 'lg:pl-64' : ''} pt-0`}>
        {children}
      </main>
    </div>
  )
}

export default MainLayout

