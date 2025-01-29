import { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { TextInput, Button, Text } from 'react-native-paper'
import { getAuthService } from 'safetybuild-shared'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../navigation/types'

type Props = NativeStackScreenProps<AuthStackParamList, 'Login'>

export function LoginScreen({ navigation }: Props) {
  const authService = getAuthService()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const handleLogin = async () => {
    setLoading(true)
    setError(null)

    try {
      await authService.signIn(email, password)
    } catch (e) {
      setError((e as Error).message)
      console.error('Login error:', e)
    } finally {
      setLoading(false)
    }
  }

  return (
    <View style={styles.container}>
      <Text variant='headlineMedium'>Welcome Back</Text>

      <TextInput label='Email' value={email} onChangeText={setEmail} autoCapitalize='none' style={styles.input} />

      <TextInput label='Password' value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

      {error && <Text style={styles.error}>{error}</Text>}

      <Button mode='contained' onPress={handleLogin} loading={loading} style={styles.button}>
        Login
      </Button>

      <Button mode='text' onPress={() => navigation.navigate('Register')} style={styles.button}>
        Don't have an account? Register
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center'
  },
  input: {
    marginVertical: 8
  },
  button: {
    marginTop: 16
  },
  error: {
    color: 'red',
    marginTop: 8
  }
})
