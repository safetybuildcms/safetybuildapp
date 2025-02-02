import { getAuthService, initializeSupabase } from 'safetybuild-shared'
import { deleteUserByEmail, getSupabaseClient } from 'safetybuild-shared'

const SUPABASE_URL = process.env.SUPABASE_URL ?? ''
const SUPABASE_ANON_KEY = process.env.SUPABASE_ANON_KEY ?? ''
const SUPABASE_SERVICE_ROLE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY ?? ''

if (!SUPABASE_URL || !SUPABASE_ANON_KEY || !SUPABASE_SERVICE_ROLE_KEY) {
  throw new Error('SUPABASE_URL, SUPABASE_ANON_KEY, and SUPABASE_SERVICE_ROLE_KEY must be set')
}

initializeSupabase(SUPABASE_URL, SUPABASE_ANON_KEY)

let adminClient = getSupabaseClient(SUPABASE_SERVICE_ROLE_KEY)
let auth = getAuthService()
let testEmail = 'test@test.com'

let password = performance.now().toString()

describe('Login Flow @integration', () => {
  beforeAll(async () => {
    await deleteUserByEmail(adminClient, testEmail)
  })

  afterAll(() => {
    // Clean up test data or invalidate sessions
  })

  it('logs in a user successfully', async () => {
    let error = null
    let user = null
    try {
      // it would be cleaner to use the same error hanbdling style as supabase client:
      // const { user, error } = await supabase.auth.signInWithPassword...
      await auth.signUp(testEmail, password)
      user = await auth.signIn(testEmail, password)
    } catch (e) {
      console.log('Error signing up or signing in')
      error = e
    }

    expect(error).toBeNull()
    expect(user).toBeTruthy()
    // expect(user.email).toBe(testEmail);
  })

  it('fails to log in with invalid credentials', async () => {
    const email = 'wronguser@example.com'
    const password = 'wrongpassword'
    let error
    let user
    try {
      user = await auth.signIn(email, password)
    } catch (e) {
      console.log('Error signing in')
      error = e
    }

    // expect(user).toBeNull();
    expect(error).toBeTruthy()
  })
})
