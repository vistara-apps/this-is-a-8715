import React from 'react'
import ReactDOM from 'react-dom/client'
import { BrowserRouter } from 'react-router-dom'
import App from './App.jsx'
import './index.css'

// Import context providers
import { AuthProvider } from './context/AuthContext'
import { PaymentProvider } from './context/PaymentContext'
import { PayoutProvider } from './context/PayoutContext'
import { AIProvider } from './context/AIContext'

ReactDOM.createRoot(document.getElementById('root')).render(
  <React.StrictMode>
    <BrowserRouter>
      <AuthProvider>
        <PaymentProvider>
          <PayoutProvider>
            <AIProvider>
              <App />
            </AIProvider>
          </PayoutProvider>
        </PaymentProvider>
      </AuthProvider>
    </BrowserRouter>
  </React.StrictMode>,
)

