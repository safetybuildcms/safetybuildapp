import { useState } from 'react'
import { TextInput, PasswordInput, Button, Paper, Title, Container, Text, Loader } from '@mantine/core'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Register() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const { signUp } = useAuth()
  const navigate = useNavigate()

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)
    setError(null)

    try {
      await signUp(email, password)
      navigate('/email-confirmation', { state: { email } })
    } catch (error: any) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Container size={420} my={40}>
      <Title ta='center'>Register</Title>
      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        <form onSubmit={handleRegister}>
          <TextInput
            label='Email'
            placeholder='you@example.com'
            required
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <PasswordInput
            label='Password'
            placeholder='Your password'
            required
            mt='md'
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          {error && (
            <Text color='red' mt='md'>
              {error}
            </Text>
          )}
          {loading ? (
            <Loader mt='xl' />
          ) : (
            <Button type='submit' fullWidth mt='xl'>
              Register
            </Button>
          )}
          <Button onClick={() => navigate('/login')} variant='subtle' fullWidth mt='md'>
            Already have an account? Login
          </Button>
        </form>
      </Paper>
    </Container>
  )
}
