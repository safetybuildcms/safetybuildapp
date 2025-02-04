import { randomUUID } from 'crypto'
import { getAuthService } from '../services/auth'
import { deleteUserByEmail, getSupabaseClient, initializeSupabase } from '../services/supabase'

export const createTestUser = async (testEmail: string) => {
  // let password = randomUUID()
  let password = 'F123456^^^'
  let auth = getAuthService()
  await auth.signUp(testEmail, password)
  return await auth.signIn(testEmail, password)
}

export const signup_test = async () => {
  const SUPABASE_URL = process.env.SUPABASE_URL ?? ''
  const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? ''
  const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

  initializeSupabase(SUPABASE_URL, SUPABASE_ANON_KEY)

  let adminClient = getSupabaseClient(SUPABASE_SERVICE_ROLE_KEY)
  let testEmail = 'test@test.com'

  deleteUserByEmail(adminClient, testEmail)
    .then(async () => {
      await createTestUser(testEmail)
      console.log('db_test() done')
    })
    .catch((error) => {
      console.log('Error deleting user', error)
    })
}
