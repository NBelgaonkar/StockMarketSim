import { BrowserRouter as Router } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import AppRouter from './router'

function App() {
  return (
    <UserProvider>
      <Router>
        <div className="min-h-screen bg-gray-50">
          <AppRouter />
        </div>
      </Router>
    </UserProvider>
  )
}

export default App
