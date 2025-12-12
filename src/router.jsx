import { Routes, Route, useLocation } from 'react-router-dom'
import Dashboard from './pages/Dashboard'
import Trade from './pages/Trade'
import Portfolio from './pages/Portfolio'
import Activity from './pages/Activity'
import Watchlist from './pages/Watchlist'
import Profile from './pages/Profile'
import Login from './pages/Login'
import Register from './pages/Register'
import NotFound from './pages/NotFound'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import MainLayout from './components/layout/MainLayout'
import MobileBottomNav from './components/layout/MobileBottomNav'
import ProtectedRoute from './components/auth/ProtectedRoute'
import { useUser } from './context/UserContext'

function AppRouter() {
  const location = useLocation()
  const { user } = useUser()
  const isAuthPage = location.pathname === '/login' || location.pathname === '/register'

  return (
    <>
      <Navbar />
      <MainLayout>
        <main className="min-h-screen pb-16 md:pb-0">
          <Routes>
            {/* Public routes */}
            <Route path="/" element={<Dashboard />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            
            {/* Protected routes - require authentication */}
            <Route 
              path="/trade" 
              element={
                <ProtectedRoute>
                  <Trade />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/portfolio" 
              element={
                <ProtectedRoute>
                  <Portfolio />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/activity" 
              element={
                <ProtectedRoute>
                  <Activity />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/watchlist" 
              element={
                <ProtectedRoute>
                  <Watchlist />
                </ProtectedRoute>
              } 
            />
            <Route 
              path="/profile" 
              element={
                <ProtectedRoute>
                  <Profile />
                </ProtectedRoute>
              } 
            />
            
            {/* 404 */}
            <Route path="*" element={<NotFound />} />
          </Routes>
        </main>
      </MainLayout>
      {!isAuthPage && <Footer />}
      {user && !isAuthPage && <MobileBottomNav />}
    </>
  )
}

export default AppRouter
