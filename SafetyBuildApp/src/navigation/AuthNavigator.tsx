import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { LoginScreen } from '../screens/LoginScreen'
import { RegisterScreen } from '../screens/RegisterScreen'
import { AuthStackParamList } from './types'
import { EmailConfirmationScreen } from '../screens/EmailConfirmationScreen'

const Stack = createNativeStackNavigator<AuthStackParamList>()

export function AuthNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Login' component={LoginScreen} options={{ headerShown: false }} />
      <Stack.Screen name='Register' component={RegisterScreen} options={{ title: 'Create Account' }} />
      <Stack.Screen name='EmailConfirmation' component={EmailConfirmationScreen} options={{ headerShown: false }} />
    </Stack.Navigator>
  )
}
