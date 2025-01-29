import { View, StyleSheet, Linking } from 'react-native'
import { Text, Button } from 'react-native-paper'
import { NativeStackScreenProps } from '@react-navigation/native-stack'
import { AuthStackParamList } from '../navigation/types'

type Props = NativeStackScreenProps<AuthStackParamList, 'EmailConfirmation'>

export function EmailConfirmationScreen({ navigation, route }: Props) {
  const { email } = route.params

  // todo - build custom native client so we can handle custom url scheme
  // this should open our app from the confirmation email
  // already set up in app.json

  return (
    <View style={styles.container}>
      <Text variant='headlineMedium'>Check Your Email</Text>

      <Text style={styles.text}>We've sent a confirmation link to:</Text>
      <Text style={styles.email}>{email}</Text>

      <Text style={styles.instructions}>1. Open your email and click the confirmation link</Text>
      <Text style={styles.instructions}>2. Once confirmed, return to this app</Text>
      <Text style={styles.instructions}>3. Log in with your email and password</Text>

      <Button mode='contained' onPress={() => navigation.navigate('Login')} style={styles.button}>
        Return to Login
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
  text: {
    marginVertical: 10,
    textAlign: 'center'
  },
  email: {
    fontWeight: 'bold',
    marginVertical: 5
  },
  instructions: {
    textAlign: 'center',
    marginVertical: 20
  },
  button: {
    marginTop: 16,
    width: '100%'
  }
})
