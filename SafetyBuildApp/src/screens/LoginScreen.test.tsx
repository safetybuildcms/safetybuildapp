import React from 'react'
import { render } from '@testing-library/react-native'
import { LoginScreen, TestScreen } from './LoginScreen'

describe('LoginScreen', () => {
  it('renders without crashing', () => {
    const { getByText } = render(<LoginScreen />)
    // // Check for an element or text that should always be present
    expect(getByText(/login/i)).toBeTruthy()
  })
})
