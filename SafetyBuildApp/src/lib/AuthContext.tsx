import { createContext, useContext, useEffect, useState } from 'react'
import { Session, AuthError } from '@supabase/supabase-js'
import { getAuthService } from 'safetybuild-shared'

type AuthContextType = {
  session: Session | null
  loading: boolean
  signIn: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signUp: (email: string, password: string) => Promise<{ error: AuthError | null }>
  signOut: () => Promise<void>
  resetPassword: (email: string) => Promise<{ error: AuthError | null }>
}

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const authService = getAuthService()
  const [session, setSession] = useState<Session | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    // Get initial session
    authService
      .getSession()
      .then((session) => {
        setSession(session)
        setLoading(false)
      })
      .catch((error) => {
        console.error('Error getting session:', error)
        setLoading(false)
      })

    // Listen for auth changes
    const {
      data: { subscription }
    } = authService.onAuthStateChange((session) => {
      setSession(session)
    })

    return () => subscription.unsubscribe()
  }, [])

  const signIn = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    try {
      await authService.signIn(email, password)
      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const signUp = async (email: string, password: string): Promise<{ error: AuthError | null }> => {
    try {
      await authService.signUp(email, password)
      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  const signOut = async () => {
    try {
      await authService.signOut()
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  const resetPassword = async (email: string): Promise<{ error: AuthError | null }> => {
    try {
      await authService.resetPassword(email)
      return { error: null }
    } catch (error) {
      return { error: error as AuthError }
    }
  }

  return (
    <AuthContext.Provider
      value={{
        session,
        loading,
        signIn,
        signUp,
        signOut,
        resetPassword
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => useContext(AuthContext)
