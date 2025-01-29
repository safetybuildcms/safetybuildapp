import { Routes, Route } from 'react-router-dom'
import Layout from '../components/Layout'
import Dashboard from '../pages/Dashboard'
import Login from '../pages/Login'
import ProtectedRoute from '../components/ProtectedRoute'
import Register from '../pages/Register'
import EmailConfirmation from '../pages/EmailConfirmation'

export default function AppRoutes() {
  return (
    <Routes>
      <Route path='/login' element={<Login />} />
      <Route path='/register' element={<Register />} />
      <Route path='/email-confirmation' element={<EmailConfirmation />} />
      <Route
        path='/'
        element={
          <ProtectedRoute>
            <Layout />
          </ProtectedRoute>
        }
      >
        <Route index element={<Dashboard />} />
        {/* Add more protected routes here */}
      </Route>
    </Routes>
  )
}
