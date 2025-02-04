import { createClient, SupabaseClient, SupabaseClientOptions } from '@supabase/supabase-js'

let supabase: SupabaseClient | null = null
let _supabaseUrl: string | null = null

export const getSupabaseEnv = () => {
  const SUPABASE_URL = process.env.SUPABASE_URL ?? ''
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? ''
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

  if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
    throw new Error('SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY must be set')
  }
  return { SUPABASE_URL, SUPABASE_ANON_KEY, SUPABASE_SERVICE_ROLE_KEY }
}

export const initializeSupabase = (supabaseUrl: string, supabaseAnonKey: string): SupabaseClient => {
  if (!supabaseUrl || !supabaseAnonKey) {
    throw new Error('Supabase URL and Anon Key must be provided to initialize Supabase.')
  }
  _supabaseUrl = supabaseUrl
  supabase = createClient(supabaseUrl, supabaseAnonKey)
  return supabase
}

export const getSupabaseClient = (supabaseKey?: string): SupabaseClient => {
  if (supabaseKey) {
    if (!_supabaseUrl) {
      throw new Error('initializeSupabase must be called before getSupabaseClient.')
    }
    return createClient(_supabaseUrl, supabaseKey)
  }

  if (!supabase) {
    throw new Error('Supabase client is not initialized. Call initializeSupabase first.')
  }

  return supabase
}
/**
 * Enables running options in the context of a user
 * access_token can be obtained from Session returned by getAuthService().signIn
 * @param supabaseUrl
 * @param supabaseAnonKey
 * @param access_token
 * @returns
 */
export const getUserClient = async (supabaseUrl: string, supabaseAnonKey: string, access_token: string) => {
  const options: SupabaseClientOptions<any> = {
    global: {
      headers: {
        Authorization: `Bearer ${access_token}`
      }
    },
    auth: {
      persistSession: false
    }
  }

  return createClient(supabaseUrl, supabaseAnonKey, options)
}
export const getUserByEmail = async (supabase: SupabaseClient, email: string) => {
  // Fetch all users (this supports pagination)
  const { data, error } = await supabase.auth.admin.listUsers()

  if (error) {
    throw error
  }

  // Filter the user by email
  const user = data.users.find((user) => user.email === email)
  return user
}
export const deleteUserByEmail = async (supabase: SupabaseClient, email: string) => {
  let user = await getUserByEmail(supabase, email)
  if (!user) {
    console.log('User not found')
    return
  }
  await supabase.auth.admin.deleteUser(user.id)
}
