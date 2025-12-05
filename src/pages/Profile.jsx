import React, { useState } from 'react'
import { useUser } from '../context/UserContext'
import { useTheme } from '../context/ThemeContext'
import { showToast } from '../context/ToastContext'
import PageHeader from '../components/layout/PageHeader'
import AlertsList from '../components/alerts/AlertsList'
import Card from '../components/ui/Card'
import Button from '../components/ui/Button'
import Input from '../components/ui/Input'
import DarkModeToggle from '../components/ui/DarkModeToggle'

const Profile = () => {
  const { user, logout } = useUser()
  const { isDarkMode } = useTheme()
  
  const [isEditing, setIsEditing] = useState(false)
  const [formData, setFormData] = useState({
    firstName: user?.firstName || '',
    lastName: user?.lastName || '',
    email: user?.email || '',
  })
  
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    priceAlerts: true,
    tradeConfirmations: true,
    weeklyReport: false,
  })

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
  }

  const handlePreferenceChange = (key) => {
    setPreferences(prev => ({ ...prev, [key]: !prev[key] }))
    showToast({ type: 'success', message: 'Preference updated' })
  }

  const handleSave = () => {
    // Mock save - in real app would call API
    showToast({ type: 'success', message: 'Profile updated successfully' })
    setIsEditing(false)
  }

  const handleLogout = () => {
    logout()
    showToast({ type: 'info', message: 'You have been logged out' })
  }

  return (
    <div className="min-h-screen bg-gray-50 pb-20 md:pb-8">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <PageHeader 
          title="Profile & Settings" 
          subtitle="Manage your account and preferences"
        />

        <div className="space-y-6">
          {/* Profile Info */}
          <Card>
            <div className="flex items-center justify-between mb-6">
              <h2 className="text-lg font-semibold text-gray-900">Profile Information</h2>
              {!isEditing && (
                <Button variant="outline" size="sm" onClick={() => setIsEditing(true)}>
                  Edit
                </Button>
              )}
            </div>

            {isEditing ? (
              <div className="space-y-4">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <Input
                    label="First Name"
                    name="firstName"
                    value={formData.firstName}
                    onChange={handleChange}
                  />
                  <Input
                    label="Last Name"
                    name="lastName"
                    value={formData.lastName}
                    onChange={handleChange}
                  />
                </div>
                <Input
                  label="Email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleChange}
                />
                <div className="flex gap-3 pt-2">
                  <Button variant="primary" onClick={handleSave}>
                    Save Changes
                  </Button>
                  <Button variant="outline" onClick={() => setIsEditing(false)}>
                    Cancel
                  </Button>
                </div>
              </div>
            ) : (
              <div className="flex items-center gap-4">
                <div className="w-16 h-16 bg-primary-100 rounded-full flex items-center justify-center">
                  <span className="text-2xl font-bold text-primary-600">
                    {(user?.firstName || user?.email || '?')[0].toUpperCase()}
                  </span>
                </div>
                <div>
                  <p className="text-lg font-semibold text-gray-900">
                    {user?.firstName} {user?.lastName}
                  </p>
                  <p className="text-gray-600">{user?.email}</p>
                  <p className="text-sm text-gray-500">
                    Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString('en-US', { month: 'long', year: 'numeric' })}
                  </p>
                </div>
              </div>
            )}
          </Card>

          {/* Appearance */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Appearance</h2>
            <div className="flex items-center justify-between">
              <div>
                <p className="font-medium text-gray-900">Dark Mode</p>
                <p className="text-sm text-gray-500">
                  Switch between light and dark themes
                </p>
              </div>
              <DarkModeToggle size="lg" />
            </div>
          </Card>

          {/* Notification Preferences */}
          <Card>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Notifications</h2>
            <div className="space-y-4">
              {[
                { key: 'emailNotifications', label: 'Email Notifications', desc: 'Receive email updates about your account' },
                { key: 'priceAlerts', label: 'Price Alerts', desc: 'Get notified when stocks hit your target prices' },
                { key: 'tradeConfirmations', label: 'Trade Confirmations', desc: 'Receive confirmation after each trade' },
                { key: 'weeklyReport', label: 'Weekly Report', desc: 'Get a weekly summary of your portfolio performance' },
              ].map((pref) => (
                <div key={pref.key} className="flex items-center justify-between py-2">
                  <div>
                    <p className="font-medium text-gray-900">{pref.label}</p>
                    <p className="text-sm text-gray-500">{pref.desc}</p>
                  </div>
                  <button
                    onClick={() => handlePreferenceChange(pref.key)}
                    className={`relative w-11 h-6 rounded-full transition-colors ${
                      preferences[pref.key] ? 'bg-primary-600' : 'bg-gray-300'
                    }`}
                  >
                    <div 
                      className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform ${
                        preferences[pref.key] ? 'translate-x-5' : 'translate-x-0'
                      }`}
                    />
                  </button>
                </div>
              ))}
            </div>
          </Card>

          {/* Price Alerts */}
          <div>
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Your Price Alerts</h2>
            <AlertsList showTitle={false} />
          </div>

          {/* Danger Zone */}
          <Card className="border-danger-200">
            <h2 className="text-lg font-semibold text-danger-600 mb-4">Account Actions</h2>
            <div className="space-y-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="font-medium text-gray-900">Log Out</p>
                  <p className="text-sm text-gray-500">Sign out of your account</p>
                </div>
                <Button variant="outline" onClick={handleLogout}>
                  Log Out
                </Button>
              </div>
              <div className="border-t border-gray-200 pt-4">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="font-medium text-gray-900">Reset Demo Account</p>
                    <p className="text-sm text-gray-500">Clear all data and start fresh with $0</p>
                  </div>
                  <Button 
                    variant="danger"
                    onClick={() => {
                      localStorage.removeItem('userPortfolio')
                      localStorage.removeItem('userWatchlist')
                      localStorage.removeItem('userAlerts')
                      showToast({ type: 'success', message: 'Account reset. Please refresh the page.' })
                    }}
                  >
                    Reset Account
                  </Button>
                </div>
              </div>
            </div>
          </Card>
        </div>
      </div>
    </div>
  )
}

export default Profile

