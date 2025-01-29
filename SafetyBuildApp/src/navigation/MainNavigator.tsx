import { createNativeStackNavigator } from '@react-navigation/native-stack'
import { HomeScreen } from '../screens/HomeScreen'
import { ProfileScreen } from '../screens/ProfileScreen'
import { DocumentsScreen } from '../screens/DocumentsScreen'
import { MainStackParamList } from './types'

const Stack = createNativeStackNavigator<MainStackParamList>()

export function MainNavigator() {
  return (
    <Stack.Navigator>
      <Stack.Screen name='Home' component={HomeScreen} options={{ title: 'Dashboard' }} />
      <Stack.Screen name='Profile' component={ProfileScreen} />
      <Stack.Screen name='Documents' component={DocumentsScreen} />
    </Stack.Navigator>
  )
}
