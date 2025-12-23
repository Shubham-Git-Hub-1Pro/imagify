import React, { useContext, useEffect } from 'react'
import { Routes, Route, Navigate, useLocation } from 'react-router-dom'
import { ToastContainer } from 'react-toastify'

import Home from './pages/Home'
import Result from './pages/Result'
import GenerationResult from './pages/GenerationResult'
import BuyCredit from './pages/BuyCredit'
import Gallery from './pages/Gallery'
import Dashboard from './pages/Dashboard'
import Features from './pages/Features'

import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Login from './components/Login'

import { AppContext } from './context/AppContext'

const App = () => {
  const { showLogin, isAuthenticated } = useContext(AppContext)
  const { pathname } = useLocation()

  useEffect(() => {
    window.scrollTo(0, 0)
  }, [pathname])

  return (
    <>
      {showLogin && <Login />}

      <div className="px-4 sm:px-10 md:px-14 lg:px-28 min-h-screen bg-gradient-to-b from-teal-50 to-orange-50">
        <ToastContainer position="bottom-right" />
        <Navbar />

        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<Home />} />
          <Route path="/features" element={<Features />} />

          {/* Protected Routes */}
          <Route
            path="/dashboard"
            element={isAuthenticated ? <Dashboard /> : <Navigate to="/" replace />}
          />

          <Route
            path="/result"
            element={isAuthenticated ? <Result /> : <Navigate to="/" replace />}
          />

          <Route
            path="/result/:id"
            element={isAuthenticated ? <GenerationResult /> : <Navigate to="/" replace />}
          />

          <Route
            path="/buy"
            element={isAuthenticated ? <BuyCredit /> : <Navigate to="/" replace />}
          />

          <Route
            path="/gallery"
            element={isAuthenticated ? <Gallery /> : <Navigate to="/" replace />}
          />

          {/* Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>

        <Footer />
      </div>
    </>
  )
}

export default App
