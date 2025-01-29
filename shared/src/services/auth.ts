import { getSupabaseClient } from './supabase'

export class AuthService {
  private supabase = getSupabaseClient()

  async getSession() {
    const {
      data: { session },
      error
    } = await this.supabase.auth.getSession()
    if (error) throw error
    return session
  }

  async signIn(email: string, password: string) {
    const { data, error } = await this.supabase.auth.signInWithPassword({
      email,
      password
    })
    if (error) throw error
    return data
  }

  async signOut() {
    const { error } = await this.supabase.auth.signOut()
    if (error) throw error
  }

  onAuthStateChange(callback: (session: any) => void) {
    return this.supabase.auth.onAuthStateChange((_event, session) => {
      callback(session)
    })
  }

  async signUp(email: string, password: string) {
    const { error } = await this.supabase.auth.signUp({
      email,
      password,
      options: {
        emailRedirectTo: 'safetybuildapp://confirm-email'
      }
    })
    if (error) throw error
  }

  async resetPassword(email: string) {
    const { error } = await this.supabase.auth.resetPasswordForEmail(email, {
      redirectTo: 'myapp://reset-password'
    })
    if (error) throw error
  }
}

// export const authService = new AuthService();
let authService: AuthService

export const getAuthService = () => {
  if (!authService) {
    authService = new AuthService()
  }
  return authService
}
