import { initializeSupabase } from 'safetybuild-shared'
console.log(`import.meta.env.VITE_SUPABASE_URL: ${import.meta.env.VITE_SUPABASE_URL}`)
initializeSupabase(import.meta.env.VITE_SUPABASE_URL, import.meta.env.VITE_SUPABASE_ANON_KEY)

import { createContext, useContext, useEffect, useState } from 'react'
import { User, getAuthService } from 'safetybuild-shared'
import { useNavigate } from 'react-router-dom'

interface AuthContextType {
  user: User | null
  signIn: (email: string, password: string) => Promise<void>
  signUp: (email: string, password: string) => Promise<{ error: Error | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: Error | null }>
  loading: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()
  const authService = getAuthService()

  useEffect(() => {
    // Check active sessions
    authService.getSession().then((session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    // Subscribe to auth changes
    const {
      data: { subscription }
    } = authService.onAuthStateChange((session) => {
      setUser(session?.user ?? null)
      setLoading(false)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string) => {
    await authService.signIn(email, password)
    navigate('/')
  }

  const signUp = async (email: string, password: string): Promise<{ error: Error | null }> => {
    try {
      await authService.signUp(email, password)
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  const signOut = async () => {
    await authService.signOut()
    navigate('/login')
  }

  const resetPassword = async (email: string): Promise<{ error: Error | null }> => {
    try {
      await authService.resetPassword(email)
      return { error: null }
    } catch (error) {
      return { error: error as Error }
    }
  }

  return (
    <AuthContext.Provider value={{ user, signIn, signUp, signOut, resetPassword, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
}
