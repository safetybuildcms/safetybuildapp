import { useState } from 'react'
import { TextInput, PasswordInput, Button, Paper, Title, Container } from '@mantine/core'
import { useAuth } from '../contexts/AuthContext'
import { useNavigate } from 'react-router-dom'

export default function Login() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const { signIn } = useAuth()
  const navigate = useNavigate()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    try {
      await signIn(email, password)
    } catch (error) {
      console.error('Login error:', error)
      // Add error handling here
    }
  }

  return (
    <Container size={420} my={40}>
      <Title ta='center'>Welcome to SafetyBuild</Title>
      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        <form onSubmit={handleSubmit}>
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
          <Button type='submit' fullWidth mt='xl'>
            Sign in
          </Button>
          <Button onClick={() => navigate('/register')}>Don't have an account? Register</Button>
        </form>
      </Paper>
    </Container>
  )
}
