
import React, { useState } from 'react'
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom'
import { AuthProvider } from './contexts/AuthContext'
import { ThemeProvider } from './contexts/ThemeContext'
import Header from './components/layout/Header'
import Sidebar from './components/layout/Sidebar'
import Login from './components/pages/Login'
import Dashboard from './components/pages/Dashboard'
// import Branches from './components/pages/Branches'
// import Customers from './components/pages/Customers'
import Services from './components/pages/Services'
// import Employees from './components/pages/Employees'
// import Bookings from './components/pages/Bookings'
// import Awards from './components/pages/Awards'
import GiftCards from './components/pages/GiftCards'
import { useAuth } from './hooks/useAuth'
import './App.css';
const ProtectedRoute = ({ children, requiredRoles = [] }) => {
  const { isAuthenticated, user, loading } = useAuth()

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-blue-600"></div>
      </div>
    )
  }

  if (!isAuthenticated) {
    return <Navigate to="/login" replace />
  }

  if (requiredRoles.length > 0 && user && !requiredRoles.includes(user.role)) {
    return <Navigate to="/unauthorized" replace />
  }

  return children
}

const AppContent = () => {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const { isAuthenticated } = useAuth()

  return (
    <div className="h-screen flex overflow-hidden bg-gray-100">
      {isAuthenticated && <Sidebar isOpen={sidebarOpen} onClose={() => setSidebarOpen(false)} />}
      <div className="flex flex-col w-0 flex-1 overflow-hidden">
        {isAuthenticated && <Header onMenuClick={() => setSidebarOpen(true)} />}
        <main className="flex-1 relative overflow-y-auto focus:outline-none">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route 
              path="/dashboard" 
              element={
                <ProtectedRoute>
                  <Dashboard />
                </ProtectedRoute>
              } 
            />
            {/* <Route 
              path="/branches" 
              element={
                <ProtectedRoute>
                  <Branches />
                </ProtectedRoute>
              } 
            /> */}
            {/* <Route 
              path="/customers" 
              element={
                <ProtectedRoute>
                  <Customers />
                </ProtectedRoute>
              } 
            /> */}
            <Route 
              path="/services" 
              element={
                <ProtectedRoute>
                  <Services />
                </ProtectedRoute>
              } 
            />
            {/* <Route 
              path="/employees" 
              element={
                <ProtectedRoute>
                  <Employees />
                </ProtectedRoute>
              } 
            /> */}
            {/* <Route 
              path="/bookings" 
              element={
                <ProtectedRoute>
                  <Bookings />
                </ProtectedRoute>
              } 
            /> */}
            {/* <Route 
              path="/awards" 
              element={
                <ProtectedRoute>
                  <Awards />
                </ProtectedRoute>
              } 
            /> */}
            <Route 
              path="/gift-cards" 
              element={
                <ProtectedRoute>
                  <GiftCards />
                </ProtectedRoute>
              } 
            />
            <Route path="/" element={<Navigate to="/dashboard" replace />} />
          </Routes>
        </main>
      </div>
    </div>
  )
}

function App() {
  return (
    <Router>
      <AuthProvider>
        <ThemeProvider>
          <AppContent />
        </ThemeProvider>
      </AuthProvider>
    </Router>
  )
}

export default App