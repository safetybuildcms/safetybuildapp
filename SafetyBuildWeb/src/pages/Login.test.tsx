import { render, screen } from '@testing-library/react'
import Login from './Login'

describe('Login', () => {
  it('renders without crashing', () => {
    render(<Login />)
    // Check for some element or text on the screen (adjust as needed)
    expect(screen.getByText(/login/i)).toBeInTheDocument()
  })
})
