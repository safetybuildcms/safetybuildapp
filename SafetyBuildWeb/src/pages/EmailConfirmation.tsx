import { Button, Title, Container, Text, Paper } from '@mantine/core'
import { useNavigate, useLocation } from 'react-router-dom'

export default function EmailConfirmation() {
  const route = useLocation()
  const { email } = route.state ?? { email: '' }
  const navigate = useNavigate()

  return (
    <Container size={420} my={40}>
      <Title ta='center'>Check Your Email</Title>
      <Paper withBorder shadow='md' p={30} mt={30} radius='md'>
        <Text>We've sent a confirmation link to:</Text>
        <Text>{email}</Text>

        <Text>1. Open your email and click the confirmation link</Text>
        <Text>2. Once confirmed, return to this app</Text>
        <Text>3. Log in with your email and password</Text>

        <Button onClick={() => navigate('/login')} variant='subtle' fullWidth mt='md'>
          Return to Login
        </Button>
      </Paper>
    </Container>
  )
}
