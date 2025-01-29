import { initializeSupabase } from 'safetybuild-shared'
import { SUPABASE_URL, SUPABASE_ANON_KEY } from '@env'
initializeSupabase(SUPABASE_URL, SUPABASE_ANON_KEY)

import { AuthProvider } from './src/lib/AuthContext'
import { RootNavigator } from './src/navigation/RootNavigator'
import { PaperProvider } from 'react-native-paper'
import * as Linking from 'expo-linking'
import { useEffect } from 'react'
import { getAuthService } from 'safetybuild-shared'

export default function App() {
  const authService = getAuthService()
  useEffect(() => {
    const handleDeepLink = async (url: string) => {
      if (url.includes('confirm-email')) {
        // Handle email confirmation
        try {
          await authService.getSession()
        } catch (error) {
          console.error('Error refreshing session:', error)
        }
      }
    }

    // Handle deep links when app is already open
    const subscription = Linking.addEventListener('url', ({ url }) => {
      handleDeepLink(url)
    })

    // Handle deep links when app is opened from closed state
    Linking.getInitialURL().then((url) => {
      if (url) {
        handleDeepLink(url)
      }
    })

    return () => {
      subscription.remove()
    }
  }, [])

  return (
    <PaperProvider>
      <AuthProvider>
        <RootNavigator />
      </AuthProvider>
    </PaperProvider>
  )
}
