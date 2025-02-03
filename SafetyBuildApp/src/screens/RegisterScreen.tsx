import React, { useState } from 'react'
import { View, StyleSheet } from 'react-native'
import { Text, TextInput, Button, ActivityIndicator } from 'react-native-paper'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../navigation/types'
import { useAuth } from '../lib/AuthContext'

type Props = NativeStackScreenProps<AuthStackParamList, 'Register'>

export function RegisterScreen({ navigation }: Props) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState(null)
  const { signUp } = useAuth()

  const handleRegister = async () => {
    setLoading(true)
    setError(null)

    const { error } = await signUp(email, password)

    if (error) {
      setError(error.message)
    } else {
      navigation.navigate('EmailConfirmation', { email })
    }

    setLoading(false)
  }

  return (
    <View style={styles.container}>
      <Text variant='headlineMedium' className='hidden'>
        Register
      </Text>

      <TextInput label='Email' value={email} onChangeText={setEmail} style={styles.input} />

      <TextInput label='Password' value={password} onChangeText={setPassword} secureTextEntry style={styles.input} />

      {error && <Text style={styles.error}>{error}</Text>}

      {loading ? (
        <ActivityIndicator style={styles.spinner} />
      ) : (
        <Button mode='contained' onPress={handleRegister} style={styles.button}>
          Register
        </Button>
      )}

      <Button mode='text' onPress={() => navigation.navigate('Login')} style={styles.button}>
        Already have an account? Login
      </Button>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
    alignItems: 'center'
  },
  input: {
    width: '100%',
    marginVertical: 10
  },
  error: {
    color: 'red',
    marginVertical: 10
  },
  spinner: {
    marginVertical: 20
  },
  button: {
    marginTop: 16,
    width: '100%'
  }
})
