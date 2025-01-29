export type RootStackParamList = {
  Auth: undefined
  Main: undefined
}

export type AuthStackParamList = {
  Login: undefined
  Register: undefined
  EmailConfirmation: { email: string }
}

export type MainStackParamList = {
  Home: undefined
  Profile: undefined
  Documents: undefined
}
