import { Routes, Route } from 'react-router-dom'
import { UserProvider } from './context/UserContext'
import { MessagingProvider } from './context/MessagingContext'
import Landing from './pages/Landing'
import SupplierIntro from './pages/SupplierIntro'
import Register from './pages/Register'
import Dashboard from './pages/Dashboard'
import Verification from './pages/Verification'
import Payment from './pages/Payment'
import PaymentSuccess from './pages/PaymentSuccess'
import Cabinet from './pages/Cabinet'
import BuyerCabinet from './pages/BuyerCabinet'

export default function App() {
  return (
    <UserProvider>
      <MessagingProvider>
        <Routes>
          <Route path="/" element={<Landing />} />
          <Route path="/supplier" element={<SupplierIntro />} />
          <Route path="/register" element={<Register />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/verification" element={<Verification />} />
          <Route path="/payment" element={<Payment />} />
          <Route path="/payment/success" element={<PaymentSuccess />} />
          <Route path="/cabinet" element={<Cabinet />} />
          <Route path="/buyer" element={<BuyerCabinet />} />
        </Routes>
      </MessagingProvider>
    </UserProvider>
  )
}
