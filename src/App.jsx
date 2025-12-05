import { BrowserRouter as Router } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { ToastProvider } from './context/ToastContext'
import { ThemeProvider } from './context/ThemeContext'
import AppRouter from './router'

function App() {
  return (
    <ThemeProvider>
      <UserProvider>
        <ToastProvider>
          <Router>
            <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
              <AppRouter />
            </div>
          </Router>
        </ToastProvider>
      </UserProvider>
    </ThemeProvider>
  )
}

export default App
