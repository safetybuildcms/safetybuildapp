import { Navigate } from 'react-router-dom'
import { useAuth } from '../contexts/AuthContext'

export default function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div> // Consider adding a proper loading spinner
  }

  if (!user) {
    return <Navigate to='/login' />
  }

  return <>{children}</>
}
