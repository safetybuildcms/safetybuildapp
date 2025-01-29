export interface User {
  id: string
  email: string
  role: 'admin' | 'contractor' | 'worker'
  // ... other user properties
}

export interface AuthState {
  user: User | null
  session: any // Replace with proper Supabase session type
  loading: boolean
  coolField1111: string
}
